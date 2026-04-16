const { json, handleOptions } = require("./_lib/http");
const { getSupabaseClient } = require("./_lib/supabase");

function isNonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

exports.handler = async (event) => {
  const preflight = handleOptions(event);
  if (preflight) return preflight;

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const adminToken = process.env.ADMIN_API_TOKEN;
  const requestToken = event.headers["x-admin-token"] || event.headers["X-Admin-Token"];
  if (!adminToken || requestToken !== adminToken) {
    return json(401, { error: "Unauthorized" });
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

  if (!isNonEmpty(payload.id) || !isNonEmpty(payload.titleZh) || !isNonEmpty(payload.titleEn)) {
    return json(400, { error: "id, titleZh and titleEn are required" });
  }

  const record = {
    id: String(payload.id).trim(),
    titleZh: String(payload.titleZh || "").trim(),
    titleEn: String(payload.titleEn || "").trim(),
    descZh: String(payload.descZh || "").trim(),
    descEn: String(payload.descEn || "").trim(),
    longDescZh: String(payload.longDescZh || "").trim(),
    longDescEn: String(payload.longDescEn || "").trim(),
    status: String(payload.status || "soon").trim(),
    tracks: Array.isArray(payload.tracks) ? payload.tracks : [],
    year: String(payload.year || "").trim(),
    roleZh: String(payload.roleZh || "").trim(),
    roleEn: String(payload.roleEn || "").trim(),
    stack: Array.isArray(payload.stack) ? payload.stack : [],
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    link: String(payload.link || "#").trim(),
    detailLink: String(payload.detailLink || "").trim(),
    sort_order: Number.isFinite(Number(payload.sort_order)) ? Number(payload.sort_order) : 999
  };

  const { data, error } = await supabase
    .from("projects")
    .upsert(record, { onConflict: "id" })
    .select("*")
    .single();

  if (error) {
    return json(500, { error: "Failed to upsert project" });
  }

  return json(200, { project: data });
};
