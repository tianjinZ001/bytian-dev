/* ===== BYTIAN.DEV v5 — project.js ===== */
const LANG_KEY = 'bytian-lang';
let lang = localStorage.getItem(LANG_KEY) || 'zh';
let projectsCache = null;
let currentProjectId = '';
let hasTrackedView = false;
const PROJECTS_API = '/.netlify/functions/projects-list';

const statusMap = {
  live: { zh: '已上线', en: 'Live', className: 'live' },
  building: { zh: '开发中', en: 'Building', className: 'building' },
  soon: { zh: '即将发布', en: 'Coming Soon', className: '' }
};

const fallbackProjects = [
  {
    id: 'ai-efficiency-cycle',
    titleZh: '产品经理效率闭环图谱',
    titleEn: 'PM Efficiency Cycle',
    descZh: '用 7 个工作环节展示 AI 如何把多天工作压缩到小时级，支持可编辑内容和 PPT 导出。',
    descEn: 'A 7-step workflow showing how AI compresses multi-day work into hours, with editable content and PPT export.',
    longDescZh: '这个项目围绕产品经理高频工作流构建，通过可编辑的可视化结构呈现 AI 如何在每个环节提升效率。',
    longDescEn: 'This project maps high-frequency PM workflows and visualizes how AI improves each stage.',
    status: 'live',
    year: '2026',
    roleZh: '产品设计 / 前端实现',
    roleEn: 'Product Design / Frontend',
    stack: ['HTML', 'CSS', 'JavaScript', 'PptxGenJS'],
    tags: [
      { zh: 'AI 工具', en: 'AI Tools', accent: true },
      { zh: '产品设计', en: 'Product Design' }
    ],
    link: '../framework.html'
  }
];

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function applyLang() {
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.body.setAttribute('data-lang', lang);
  localStorage.setItem(LANG_KEY, lang);
  document.querySelectorAll('[data-zh][data-en]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val !== null) el.innerHTML = val;
  });
}

function trackEvent(name, props = {}) {
  if (typeof window.plausible === 'function') {
    window.plausible(name, { props });
  }
}

async function loadProjects() {
  try {
    const remoteRes = await fetch(PROJECTS_API, { cache: 'no-store' });
    if (remoteRes.ok) {
      const remoteData = await remoteRes.json();
      if (Array.isArray(remoteData.projects)) {
        return remoteData.projects;
      }
    }
  } catch (_err) {
    // Fallback to local JSON.
  }

  try {
    const res = await fetch('data/projects.json', { cache: 'no-store' });
    if (!res.ok) return fallbackProjects;
    const data = await res.json();
    return Array.isArray(data) ? data : fallbackProjects;
  } catch (_err) {
    return fallbackProjects;
  }
}

function getProjectId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || '';
}

function applySeo(project) {
  const title = lang === 'zh' ? `${project.titleZh} - Tian` : `${project.titleEn} - Tian`;
  const description = lang === 'zh'
    ? (project.descZh || '查看项目背景、设计思路和技术实现。')
    : (project.descEn || 'View project context, design decisions and implementation details.');
  document.title = title;
  const setMeta = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) node.setAttribute('content', value);
  };
  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
}

function renderNotFound() {
  const title = lang === 'zh' ? '项目不存在或已下线' : 'Project not found';
  const desc = lang === 'zh'
    ? '你可以返回作品集查看其他项目。'
    : 'You can go back to the projects list.';
  document.getElementById('pd-status').textContent = lang === 'zh' ? '未找到' : 'Not found';
  document.getElementById('pd-title').textContent = title;
  document.getElementById('pd-desc').textContent = desc;
  document.getElementById('pd-long-desc').textContent = desc;
  document.getElementById('pd-role').textContent = '-';
  document.getElementById('pd-meta').textContent = '-';
  document.getElementById('pd-stack').innerHTML = '';
  document.getElementById('pd-tags').innerHTML = '';
  const liveLink = document.getElementById('pd-live-link');
  liveLink.classList.add('is-disabled');
  liveLink.setAttribute('href', '#');
  liveLink.setAttribute('aria-disabled', 'true');
}

function renderProject(project) {
  const title = lang === 'zh' ? project.titleZh : project.titleEn;
  const desc = lang === 'zh' ? project.descZh : project.descEn;
  const longDesc = lang === 'zh' ? (project.longDescZh || project.descZh) : (project.longDescEn || project.descEn);
  const role = lang === 'zh' ? (project.roleZh || '-') : (project.roleEn || '-');
  const status = statusMap[project.status] || statusMap.soon;
  const statusText = lang === 'zh' ? status.zh : status.en;
  const statusNode = document.getElementById('pd-status');
  statusNode.textContent = statusText;
  statusNode.className = `coming-badge ${status.className || ''}`;

  document.getElementById('pd-title').textContent = title;
  document.getElementById('pd-desc').textContent = desc;
  document.getElementById('pd-long-desc').textContent = longDesc;
  document.getElementById('pd-role').textContent = role;
  document.getElementById('pd-meta').textContent = `${project.year || '-'} · ${statusText}`;

  const tagsHTML = (Array.isArray(project.tags) ? project.tags : []).map(tag => {
    const text = lang === 'zh' ? tag.zh : tag.en;
    return `<span class="pc-tag ${tag.accent ? 'accent' : ''}">${escapeHTML(text)}</span>`;
  }).join('');
  document.getElementById('pd-tags').innerHTML = tagsHTML;

  const stackHTML = (Array.isArray(project.stack) ? project.stack : []).map(name => `<span class="pc-tag">${escapeHTML(name)}</span>`).join('');
  document.getElementById('pd-stack').innerHTML = stackHTML;

  const liveLink = document.getElementById('pd-live-link');
  if (!project.link || project.link === '#') {
    liveLink.classList.add('is-disabled');
    liveLink.setAttribute('href', '#');
    liveLink.setAttribute('aria-disabled', 'true');
  } else {
    liveLink.classList.remove('is-disabled');
    liveLink.setAttribute('href', project.link);
    liveLink.removeAttribute('aria-disabled');
  }
  applySeo(project);
}

async function initProjectPage() {
  applyLang();
  const id = getProjectId();
  currentProjectId = id;
  projectsCache = await loadProjects();
  const project = projectsCache.find(item => item.id === id);
  if (!project) {
    renderNotFound();
    return;
  }
  renderProject(project);
  if (!hasTrackedView) {
    trackEvent('page_view', { page: 'project', projectId: id });
    hasTrackedView = true;
  }
}

document.getElementById('langToggle').addEventListener('click', () => {
  lang = lang === 'zh' ? 'en' : 'zh';
  applyLang();
  const project = (projectsCache || []).find(item => item.id === currentProjectId);
  if (!project) {
    renderNotFound();
    return;
  }
  renderProject(project);
});

document.addEventListener('click', e => {
  const target = e.target.closest('#pd-live-link');
  if (!target) return;
  if (target.classList.contains('is-disabled')) {
    e.preventDefault();
    return;
  }
  trackEvent('project_live', { from: 'detail' });
});

initProjectPage();
