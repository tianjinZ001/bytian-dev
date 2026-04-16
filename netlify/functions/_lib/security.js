const crypto = require("node:crypto");

function getClientIP(event) {
  const forwarded = event.headers["x-forwarded-for"] || event.headers["X-Forwarded-For"] || "";
  const ip = forwarded.split(",")[0].trim();
  return ip || "unknown";
}

function hashIP(ip) {
  const salt = process.env.MESSAGE_IP_SALT || "bytian-default-salt";
  return crypto.createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

function normalizeText(input, maxLen = 100) {
  const raw = String(input || "");
  const clean = raw.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  return clean.slice(0, maxLen);
}

module.exports = {
  getClientIP,
  hashIP,
  normalizeText
};
