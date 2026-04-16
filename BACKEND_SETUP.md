# BYTIAN v5 生产可用后端接入

## 1) 安装依赖

```bash
npm install
```

## 2) 在 Supabase 建表

在 Supabase SQL Editor 运行 `supabase-schema.sql`。

会创建两张表：

- `guestbook_messages`：留言板
- `projects`：项目数据

## 3) 配置 Netlify 环境变量

按 `.env.example` 配置以下变量（本地可放 `.env`，线上在 Netlify Site settings 设置）：

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_API_TOKEN`
- `MESSAGE_IP_SALT`（用于留言限流时对 IP 做哈希）

## 4) 本地启动（含 Functions）

```bash
npx netlify dev
```

## 5) 线上接口

- `GET /.netlify/functions/guestbook-list`
- `POST /.netlify/functions/guestbook-create`
- `GET /.netlify/functions/projects-list`
- `POST /.netlify/functions/admin-project-upsert`（需要 `x-admin-token`）
- `GET /.netlify/functions/health-db`（数据库健康检查）

## 6) 发布项目（管理员）

准备一个 JSON 文件（字段参考 `data/projects.json` 的单个对象），然后执行：

```bash
BYTIAN_ADMIN_ENDPOINT="https://你的域名/.netlify/functions/admin-project-upsert" \
ADMIN_API_TOKEN="你的token" \
node scripts/publish-project.mjs ./your-project.json
```

如需把本地 `data/projects.json` 一次性导入数据库：

```bash
BYTIAN_ADMIN_ENDPOINT="https://你的域名/.netlify/functions/admin-project-upsert" \
ADMIN_API_TOKEN="你的token" \
npm run seed:projects
```

## 7) 联调验收命令（建议按顺序执行）

```bash
# 1. 健康检查
curl -i "https://你的域名/.netlify/functions/health-db"

# 2. 读取留言
curl -i "https://你的域名/.netlify/functions/guestbook-list?limit=20"

# 3. 提交留言
curl -i -X POST "https://你的域名/.netlify/functions/guestbook-create" \
  -H "Content-Type: application/json" \
  -d '{"text":"后端联调成功！"}'

# 4. 读取项目
curl -i "https://你的域名/.netlify/functions/projects-list"
```

## 8) 并发与扩展说明

- 留言接口带每 IP 每分钟限流，避免刷屏与突发写入。
- 关键查询字段已建索引（`created_at`、`sort_order`、`ip_hash`）。
- 前端已实现后端优先 + 本地数据回退，线上偶发故障不会直接白屏。
- 所有真实数据库访问都在服务端函数中使用 service role，前端不暴露密钥。
