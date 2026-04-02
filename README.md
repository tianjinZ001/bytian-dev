# bytian.dev v2 — 中英双语版本

## 文件结构
```
bytian-dev/
├── index.html   ← 主页（含中英双语所有内容）
├── style.css    ← 样式
├── main.js      ← 交互 + 语言切换逻辑
└── README.md
```

## 语言切换说明
- 右上角按钮手动切换中文 / English
- 语言偏好自动保存到浏览器，下次访问记住选择
- 所有文字通过 `data-zh` / `data-en` 属性管理，日后新增内容只需在 HTML 里加这两个属性即可

## 更新内容方法
在 HTML 中找到对应元素，修改 `data-zh` 和 `data-en` 的值：
```html
<span data-zh="中文内容" data-en="English content">中文内容</span>
```

## 部署更新到 Netlify
1. 在 GitHub 仓库页面，直接点文件编辑或上传新文件
2. Netlify 检测到 GitHub 变化后自动重新部署（约 30 秒）
