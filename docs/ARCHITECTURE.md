# Architecture Notes

## 1. Runtime Flow

- Browser renders `index.html` / `project.html`.
- Frontend requests Functions endpoints under `/.netlify/functions/*`.
- Functions use Supabase service-role key to read/write PostgreSQL.
- Frontend falls back to local JSON when backend is unavailable.

## 2. Data Domains

- **Projects**
  - Read API: `projects-list`
  - Write API: `admin-project-upsert` (token protected)
  - Local fallback: `data/projects.json`
- **Guestbook**
  - Read API: `guestbook-list`
  - Write API: `guestbook-create`
  - Includes simple per-IP rate limit via hashed IP + timestamp window.

## 3. Security Controls

- `ADMIN_API_TOKEN` required for project write endpoint.
- Supabase accessed only in server functions (no service key exposure to client).
- RLS policies in SQL deny direct anonymous table access.
- Message write endpoint applies normalization + rate limiting.

## 4. Scalability Considerations

- Indexes on `projects.sort_order`, `projects.created_at`,
  `guestbook_messages.created_at`, and `(ip_hash, created_at)`.
- Read-heavy pages can add edge caching in Netlify later without schema changes.
- API contract supports incremental frontend improvements without breaking storage.

## 5. Suggested Next Evolution

- Add admin web panel (instead of CLI scripts).
- Add Supabase Storage for project cover images.
- Add structured audit log for admin writes.
- Add monitoring dashboard for function error rates and latency.
