import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);
    const path = url.pathname.replace("/daily-analytics", "").replace("/", "");

    // GET /daily-analytics — fetch last N days of analytics
    if (req.method === "GET") {
      const days = parseInt(url.searchParams.get("days") || "30", 10);
      const { data, error } = await supabase
        .from("daily_analytics")
        .select("*")
        .order("date", { ascending: false })
        .limit(days);

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /daily-analytics — record a view/submission event
    if (req.method === "POST") {
      const body = await req.json();
      const { event_type, score } = body as { event_type: string; score?: number };

      const today = new Date().toISOString().split("T")[0];

      // Try to upsert the daily record
      const { data: existing } = await supabase
        .from("daily_analytics")
        .select("*")
        .eq("date", today)
        .maybeSingle();

      if (existing) {
        const updates: Record<string, number> = {};
        if (event_type === "page_view") {
          updates.page_views = (existing.page_views || 0) + 1;
        } else if (event_type === "submission") {
          updates.scenario_submissions = (existing.scenario_submissions || 0) + 1;
          if (score !== undefined) {
            const totalSubs = updates.scenario_submissions;
            updates.avg_score = Math.round(
              ((existing.avg_score || 0) * (totalSubs - 1) + score) / totalSubs * 100
            ) / 100;
          }
        } else if (event_type === "instructor_view") {
          updates.instructor_views = (existing.instructor_views || 0) + 1;
        } else if (event_type === "unique_visitor") {
          updates.unique_visitors = (existing.unique_visitors || 0) + 1;
        }

        const { error: updateErr } = await supabase
          .from("daily_analytics")
          .update(updates)
          .eq("date", today);
        if (updateErr) throw updateErr;
      } else {
        const insert: Record<string, unknown> = {
          date: today,
          page_views: event_type === "page_view" ? 1 : 0,
          scenario_submissions: event_type === "submission" ? 1 : 0,
          unique_visitors: event_type === "unique_visitor" ? 1 : 0,
          avg_score: event_type === "submission" && score ? score : 0,
          instructor_views: event_type === "instructor_view" ? 1 : 0,
        };
        const { error: insertErr } = await supabase
          .from("daily_analytics")
          .insert(insert);
        if (insertErr) throw insertErr;
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
