# BYTIAN Portfolio v5

一个可持续迭代的个人作品集网站，包含：

- 前端静态展示（中英双语、项目筛选、项目详情）
- Netlify Functions 后端 API
- Supabase 数据库存储（留言与项目）
- 管理员项目发布脚本（命令行一键更新项目数据）

## 技术栈

- Frontend: `HTML + CSS + Vanilla JavaScript`
- Backend: `Netlify Functions (Node.js)`
- Database: `Supabase (PostgreSQL)`
- Deploy: `Netlify + GitHub`

## 项目结构

```text
bytian-v5/
├── index.html                  # 首页
├── project.html                # 项目详情页
├── style.css                   # 全局样式
├── main.js                     # 首页逻辑（项目、留言、语言）
├── project.js                  # 项目详情逻辑
├── data/
│   ├── projects.json           # 本地项目兜底数据
│   └── blog.json               # 博客数据
├── netlify/
│   └── functions/
│       ├── _lib/               # 公共工具
│       ├── health-db.js
│       ├── projects-list.js
│       ├── guestbook-list.js
│       ├── guestbook-create.js
│       └── admin-project-upsert.js
├── scripts/
│   ├── publish-project.mjs     # 发布单个项目
│   └── seed-projects.mjs       # 批量导入项目
├── supabase-schema.sql         # 数据库建表/索引/策略
├── BACKEND_SETUP.md            # 部署与联调步骤
├── netlify.toml
├── package.json
└── .env.example
```

更详细的结构说明见：`docs/ARCHITECTURE.md`

## 快速开始（本地）

```bash
npm install
npx netlify dev
```

本地访问后会同时启动静态页面与 Functions。

## 环境变量

在 Netlify（或本地 `.env`）中配置：

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_API_TOKEN`
- `MESSAGE_IP_SALT`

## API 列表

- `GET /.netlify/functions/health-db`
- `GET /.netlify/functions/projects-list`
- `GET /.netlify/functions/guestbook-list?limit=20`
- `POST /.netlify/functions/guestbook-create`
- `POST /.netlify/functions/admin-project-upsert` (需 `x-admin-token`)

## 项目数据发布

### 发布单个项目

```bash
BYTIAN_ADMIN_ENDPOINT="https://your-domain/.netlify/functions/admin-project-upsert" \
ADMIN_API_TOKEN="your-token" \
npm run publish:project -- ./your-project.json
```

### 批量导入本地项目

```bash
BYTIAN_ADMIN_ENDPOINT="https://your-domain/.netlify/functions/admin-project-upsert" \
ADMIN_API_TOKEN="your-token" \
npm run seed:projects
```

## 生产部署建议

- GitHub 主分支保持可部署状态
- Netlify 配置自动部署 `main`
- Supabase SQL 变更统一走 migration SQL
- 定期轮换 `ADMIN_API_TOKEN`

## 常见问题

- `403 push denied`: PAT 无 `repo` 权限或 token 过期
- `guestbook 500`: 数据库表结构未同步（重新执行 `supabase-schema.sql`）
- `projects-list 500`: `projects` 表字段缺失或 RLS 策略未配置完整
