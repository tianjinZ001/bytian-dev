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

  const requestedLimit = Number.parseInt(event.queryStringParameters?.limit || "30", 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.max(1, Math.min(requestedLimit, 100))
    : 30;

  const { data, error } = await supabase
    .from("guestbook_messages")
    .select("id, text, name, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return json(500, { error: "Failed to load guestbook messages" });
  }

  const messages = (data || []).reverse().map((row) => ({
    id: row.id,
    text: row.text,
    name: row.name,
    timeZh: "刚刚",
    timeEn: "just now",
    createdAt: row.created_at
  }));

  return json(200, { messages });
};
