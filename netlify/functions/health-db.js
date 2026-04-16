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
    return json(500, { ok: false, error: "Supabase env vars are not configured" });
  }

  const { error } = await supabase
    .from("projects")
    .select("id", { head: true, count: "estimated" })
    .limit(1);

  if (error) {
    return json(500, { ok: false, error: "Database check failed" });
  }

  return json(200, { ok: true, service: "database" });
};
