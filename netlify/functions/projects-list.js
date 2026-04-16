const { json, handleOptions } = require("./_lib/http");
const { getSupabaseClient } = require("./_lib/supabase");

exports.handler = async (event) => {
  const preflight = handleOptions(event);
  if (preflight) return preflight;

  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method not allowed" });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return json(500, { error: "Supabase env vars are not configured" });
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return json(500, { error: "Failed to load projects" });
  }

  return json(200, { projects: data || [] });
};
