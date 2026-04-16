const { json, handleOptions } = require("./_lib/http");
const { getSupabaseClient } = require("./_lib/supabase");
const { getClientIP, hashIP, normalizeText } = require("./_lib/security");

const MAX_LEN = 100;
const RATE_LIMIT_PER_MINUTE = 6;
const anonNames = [
  "友好的访客",
  "好奇的探索者",
  "路过的朋友",
  "匿名旅行者",
  "深夜的读者",
  "早起的人",
  "HCI 爱好者",
  "AI 爱好者",
  "Vibe Coder"
];

function randomName() {
  return anonNames[Math.floor(Math.random() * anonNames.length)];
}

exports.handler = async (event) => {
  const preflight = handleOptions(event);
  if (preflight) return preflight;

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return json(500, { error: "Supabase env vars are not configured" });
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (_err) {
    return json(400, { error: "Invalid JSON body" });
  }

  const text = normalizeText(payload.text, MAX_LEN);
  if (!text) {
    return json(400, { error: "Message text is required" });
  }

  const name = normalizeText(payload.name, 40) || randomName();
  const ipHash = hashIP(getClientIP(event));

  const oneMinuteAgoISO = new Date(Date.now() - 60 * 1000).toISOString();
  const { count: recentCount, error: countError } = await supabase
    .from("guestbook_messages")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", oneMinuteAgoISO);

  if (countError) {
    return json(500, { error: "Failed to check rate limit" });
  }
  if ((recentCount || 0) >= RATE_LIMIT_PER_MINUTE) {
    return json(429, { error: "Too many messages, please try again later" });
  }

  const { data, error } = await supabase
    .from("guestbook_messages")
    .insert({ text, name, ip_hash: ipHash })
    .select("id, text, name, created_at")
    .single();

  if (error) {
    return json(500, { error: "Failed to save message" });
  }

  return json(201, {
    message: {
      id: data.id,
      text: data.text,
      name: data.name,
      timeZh: "刚刚",
      timeEn: "just now",
      createdAt: data.created_at
    }
  });
};
