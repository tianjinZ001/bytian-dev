import fs from "node:fs/promises";

const endpoint = process.env.BYTIAN_ADMIN_ENDPOINT;
const token = process.env.ADMIN_API_TOKEN;
const sourceFile = process.argv[2] || "./data/projects.json";

if (!endpoint || !token) {
  console.error("Missing BYTIAN_ADMIN_ENDPOINT or ADMIN_API_TOKEN");
  process.exit(1);
}

const raw = await fs.readFile(sourceFile, "utf8");
const list = JSON.parse(raw);
if (!Array.isArray(list)) {
  console.error("Source JSON must be an array");
  process.exit(1);
}

let ok = 0;
for (const item of list) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": token
    },
    body: JSON.stringify(item)
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Failed: ${item.id || "<no-id>"} => ${res.status} ${text}`);
    process.exit(1);
  }
  ok += 1;
  console.log(`Upserted: ${item.id}`);
}

console.log(`Done. Total upserted: ${ok}`);
