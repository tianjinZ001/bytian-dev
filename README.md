# bytian.dev — 个人作品集网站

Tian 的个人作品集网站，暗黑霓虹风格，专注 HCI + Vibe Coding。

## 文件结构

```
bytian-dev/
├── index.html   ← 网站主页（所有内容）
├── style.css    ← 样式文件
├── main.js      ← 交互动效
└── README.md    ← 说明文档
```

## 本地预览

双击 `index.html` 直接在浏览器打开即可预览。

## 部署到 Vercel（上线步骤）

1. 把这个文件夹上传到 GitHub（仓库名建议：`bytian-dev`）
2. 登录 [vercel.com](https://vercel.com)，用 GitHub 账号登录
3. 点击 "New Project" → 选择你的仓库 → 点击 Deploy
4. 几秒后自动上线，得到一个 `.vercel.app` 临时域名
5. 在 Vercel 设置里绑定 `bytian.dev` 域名

## 日后更新内容

- **添加项目**：修改 `index.html` 中 `id="projects"` 部分
- **添加博客**：修改 `index.html` 中 `id="blog"` 部分
- **修改联系方式**：修改 `id="contact"` 部分的邮箱和链接
- **改颜色**：修改 `style.css` 顶部 `:root` 里的 CSS 变量
