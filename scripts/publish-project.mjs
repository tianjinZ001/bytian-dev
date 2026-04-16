import fs from "node:fs/promises";

const endpoint = process.env.BYTIAN_ADMIN_ENDPOINT;
const token = process.env.ADMIN_API_TOKEN;
const filePath = process.argv[2];

if (!endpoint || !token) {
  console.error("Missing BYTIAN_ADMIN_ENDPOINT or ADMIN_API_TOKEN");
  process.exit(1);
}

if (!filePath) {
  console.error("Usage: node scripts/publish-project.mjs <project-json-file>");
  process.exit(1);
}

const raw = await fs.readFile(filePath, "utf8");
const payload = JSON.parse(raw);

const res = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-admin-token": token
  },
  body: JSON.stringify(payload)
});

const text = await res.text();
if (!res.ok) {
  console.error(`Publish failed: ${res.status} ${text}`);
  process.exit(1);
}

console.log(`Publish success: ${text}`);
