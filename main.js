/* ===== BYTIAN.DEV v5 — main.js ===== */

let projectsData = [
  {
    id: 'ai-efficiency-cycle',
    titleZh: '产品经理效率闭环图谱',
    titleEn: 'PM Efficiency Cycle',
    descZh: '用 7 个工作环节展示 AI 如何把多天工作压缩到小时级，支持可编辑内容和 PPT 导出。',
    descEn: 'A 7-step workflow showing how AI compresses multi-day work into hours, with editable content and PPT export.',
    status: 'live',
    tracks: ['ai', 'product'],
    tags: [
      { zh: 'AI 工具', en: 'AI Tools', accent: true },
      { zh: '产品设计', en: 'Product Design' },
      { zh: '可视化', en: 'Visualization' }
    ],
    link: '../framework.html',
    detailLink: 'project.html?id=ai-efficiency-cycle'
  },
  {
    id: 'hci-lab-notes',
    titleZh: 'HCI 研究观察手册',
    titleEn: 'HCI Observation Notes',
    descZh: '沉淀你在用户访谈、可用性测试与交互设计中的实践记录，形成长期研究资产。',
    descEn: 'A long-term knowledge base for user interviews, usability testing, and interaction design practices.',
    status: 'building',
    tracks: ['hci', 'research'],
    tags: [
      { zh: 'HCI', en: 'HCI', accent: true },
      { zh: '研究', en: 'Research' }
    ],
    link: '#',
    detailLink: 'project.html?id=hci-lab-notes'
  },
  {
    id: 'vibe-prototype-kit',
    titleZh: 'Vibe Coding 原型工具箱',
    titleEn: 'Vibe Coding Prototype Kit',
    descZh: '把产品想法快速拆成页面、交互和测试清单，帮助非工程背景也能快速试错。',
    descEn: 'Turn product ideas into pages, interactions, and test checklists for fast iteration, even without engineering background.',
    status: 'soon',
    tracks: ['ai', 'tooling'],
    tags: [
      { zh: 'Vibe Coding', en: 'Vibe Coding', accent: true },
      { zh: '原型', en: 'Prototyping' }
    ],
    link: '#',
    detailLink: 'project.html?id=vibe-prototype-kit'
  }
];

let blogData = [
  {
    dateZh: '2026-04 · 即将发布',
    dateEn: 'Apr 2026 · Coming soon',
    titleZh: '科技无限延伸，但落地服务人类才是终点',
    titleEn: 'Technology can expand infinitely — but serving people is the destination',
    link: '#'
  },
  {
    dateZh: '2026-04 · 即将发布',
    dateEn: 'Apr 2026 · Coming soon',
    titleZh: 'Vibe Coding 是什么：一个非程序员的造物日记',
    titleEn: 'What is Vibe Coding: a non-programmer creator diary',
    link: '#'
  },
  {
    dateZh: '2026-05 · 计划中',
    dateEn: 'May 2026 · Planned',
    titleZh: 'HCI 视角下的 AI 产品设计思考',
    titleEn: 'Thoughts on AI product design from an HCI perspective',
    link: '#'
  }
];

const projectTracks = [
  { key: 'all', zh: '全部', en: 'All' },
  { key: 'ai', zh: 'AI 产品', en: 'AI Products' },
  { key: 'hci', zh: 'HCI', en: 'HCI' },
  { key: 'research', zh: '研究实验', en: 'Research' },
  { key: 'tooling', zh: '效率工具', en: 'Tooling' },
  { key: 'product', zh: '产品实践', en: 'Product Ops' }
];

const statusMap = {
  live: { zh: '已上线', en: 'Live', className: 'live' },
  building: { zh: '开发中', en: 'Building', className: 'building' },
  soon: { zh: '即将发布', en: 'Coming Soon', className: '' }
};

let activeTrack = 'all';
const DATA_PATHS = {
  projects: 'data/projects.json',
  blog: 'data/blog.json'
};
const API_ENDPOINTS = {
  projects: '/.netlify/functions/projects-list',
  guestbookList: '/.netlify/functions/guestbook-list',
  guestbookCreate: '/.netlify/functions/guestbook-create'
};
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function trackEvent(name, props = {}) {
  if (typeof window.plausible === 'function') {
    window.plausible(name, { props });
  }
}

async function fetchJSON(path, fallback) {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) return fallback;
    const data = await res.json();
    return Array.isArray(data) ? data : fallback;
  } catch (_err) {
    return fallback;
  }
}

async function fetchProjectsFromAPI() {
  try {
    const res = await fetch(API_ENDPOINTS.projects, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data.projects)) return null;
    return data.projects;
  } catch (_err) {
    return null;
  }
}

async function loadContentData() {
  const [projectApiList, projectLocalList, blogList] = await Promise.all([
    fetchProjectsFromAPI(),
    fetchJSON(DATA_PATHS.projects, projectsData),
    fetchJSON(DATA_PATHS.blog, blogData)
  ]);
  projectsData = projectApiList !== null ? projectApiList : projectLocalList;
  blogData = blogList;
}

function renderProjectFilters() {
  const el = document.getElementById('project-filters');
  if (!el) return;
  el.innerHTML = projectTracks.map(track => {
    const label = lang === 'zh' ? track.zh : track.en;
    const activeClass = track.key === activeTrack ? 'active' : '';
    return `<button class="project-filter ${activeClass}" data-track="${track.key}">${escapeHTML(label)}</button>`;
  }).join('');
}

function isValidTrack(track) {
  return projectTracks.some(item => item.key === track);
}

function getTrackFromURL() {
  const params = new URLSearchParams(window.location.search);
  const track = params.get('track');
  if (!track || !isValidTrack(track)) return 'all';
  return track;
}

function syncTrackToURL(track) {
  const url = new URL(window.location.href);
  if (track === 'all') {
    url.searchParams.delete('track');
  } else {
    url.searchParams.set('track', track);
  }
  window.history.replaceState({}, '', url);
}

function renderProjects() {
  const grid = document.getElementById('projects-grid');
  const empty = document.getElementById('projects-empty');
  if (!grid || !empty) return;

  const list = projectsData.filter(p => {
    const tracks = Array.isArray(p.tracks) ? p.tracks : [];
    return activeTrack === 'all' || tracks.includes(activeTrack);
  });
  empty.hidden = list.length > 0;

  grid.innerHTML = list.map((p, idx) => {
    const title = lang === 'zh' ? p.titleZh : p.titleEn;
    const desc = lang === 'zh' ? p.descZh : p.descEn;
    const statusText = lang === 'zh' ? statusMap[p.status].zh : statusMap[p.status].en;
    const statusClass = statusMap[p.status].className;
    const tags = (Array.isArray(p.tags) ? p.tags : []).map(tag => {
      const txt = lang === 'zh' ? tag.zh : tag.en;
      return `<span class="pc-tag ${tag.accent ? 'accent' : ''}">${escapeHTML(txt)}</span>`;
    }).join('');
    const linkText = p.status === 'live'
      ? (lang === 'zh' ? '在线体验 →' : 'Live demo →')
      : (lang === 'zh' ? '了解更多 →' : 'Learn more →');
    const href = p.link || '#';
    const detailHref = p.detailLink || '#';
    const featuredClass = idx === 0 ? 'featured' : '';
    const target = href.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : '';
    const disabledClass = href === '#' ? 'is-disabled' : '';
    const detailLabel = lang === 'zh' ? '项目详情' : 'Project details';
    const liveAria = href === '#' ? 'aria-disabled="true"' : '';
    const placeholder = p.status === 'live'
      ? `<div class="pc-visual"><svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="32" stroke="rgba(110,107,255,0.5)" stroke-width="1"/>
          <circle cx="40" cy="40" r="18" stroke="rgba(110,107,255,0.7)" stroke-width="1"/>
          <circle cx="40" cy="40" r="6" fill="rgba(110,107,255,0.9)"/>
          <line x1="40" y1="8" x2="40" y2="22" stroke="rgba(191,90,242,0.6)" stroke-width="1"/>
          <line x1="72" y1="40" x2="58" y2="40" stroke="rgba(191,90,242,0.6)" stroke-width="1"/>
          <line x1="40" y1="72" x2="40" y2="58" stroke="rgba(191,90,242,0.6)" stroke-width="1"/>
          <line x1="8" y1="40" x2="22" y2="40" stroke="rgba(191,90,242,0.6)" stroke-width="1"/>
        </svg></div>`
      : '';

    return `
      <article class="project-card ${featuredClass}">
        <div class="pc-body">
          <div class="coming-badge ${statusClass}">${escapeHTML(statusText)}</div>
          <h3 class="pc-title">${escapeHTML(title)}</h3>
          <p class="pc-desc">${escapeHTML(desc)}</p>
          <div class="pc-tags">${tags}</div>
          <div class="pc-actions">
            <a href="${escapeHTML(detailHref)}" class="pc-link pc-link-detail" data-track-event="project_detail" data-project-id="${escapeHTML(p.id || '')}">
              ${escapeHTML(detailLabel)} →
            </a>
            <a href="${escapeHTML(href)}" class="pc-link ${disabledClass}" ${target} ${liveAria} data-track-event="project_live" data-project-id="${escapeHTML(p.id || '')}">
              ${escapeHTML(linkText)}
            </a>
          </div>
        </div>
        ${placeholder}
      </article>
    `;
  }).join('');
}

function renderBlog() {
  const el = document.getElementById('blog-list');
  if (!el) return;
  el.innerHTML = blogData.map(item => {
    const date = lang === 'zh' ? item.dateZh : item.dateEn;
    const title = lang === 'zh' ? item.titleZh : item.titleEn;
    const href = item.link || '#';
    const target = href.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : '';
    const disabledClass = href === '#' ? 'is-disabled' : '';
    return `
      <a class="blog-item-link ${disabledClass}" href="${escapeHTML(href)}" ${target} data-track-event="blog_click">
        <div class="blog-item">
          <div class="bi-left">
            <div class="bi-date">${escapeHTML(date)}</div>
            <div class="bi-title">${escapeHTML(title)}</div>
          </div>
          <div class="bi-arrow">→</div>
        </div>
      </a>
    `;
  }).join('');
}

/* === Language system === */
const LANG_KEY = 'bytian-lang';
let lang = localStorage.getItem(LANG_KEY) || 'zh';

function applyLang(l) {
  lang = l;
  document.documentElement.lang = l === 'zh' ? 'zh-CN' : 'en';
  document.body.setAttribute('data-lang', l);
  localStorage.setItem(LANG_KEY, l);
  document.title = l === 'zh' ? 'Tian — HCI 创造者' : 'Tian — HCI Builder';
  document.querySelectorAll('[data-zh][data-en]').forEach(el => {
    const val = el.getAttribute('data-' + l);
    if (val !== null) el.innerHTML = val;
  });
  document.getElementById('gb-input').placeholder = l === 'zh' ? '说点什么吧…' : 'Leave a message…';
  document.getElementById('gb-send').textContent   = l === 'zh' ? '发送' : 'Send';
  renderProjectFilters();
  renderProjects();
  renderBlog();
}

document.getElementById('langToggle').addEventListener('click', () => {
  applyLang(lang === 'zh' ? 'en' : 'zh');
});

document.addEventListener('click', e => {
  const btn = e.target.closest('.project-filter');
  if (btn) {
    activeTrack = btn.getAttribute('data-track') || 'all';
    syncTrackToURL(activeTrack);
    renderProjectFilters();
    renderProjects();
    trackEvent('project_filter', { track: activeTrack });
    return;
  }

  const link = e.target.closest('[data-track-event]');
  if (!link) return;

  const href = link.getAttribute('href') || '#';
  const eventName = link.getAttribute('data-track-event') || 'click';
  const projectId = link.getAttribute('data-project-id') || '';
  if (href === '#') {
    e.preventDefault();
    return;
  }
  trackEvent(eventName, { projectId, href });
});

/* === Time-aware greeting === */
const hour = new Date().getHours();
const greetings = [
  { icon:'🌙', title:'深夜好，欢迎！',  titleEn:'Good late night!',  desc:'感谢你在这个安静的时刻造访。',     descEn:'Thanks for visiting at this quiet hour.', hero:'在这个深夜，欢迎来到我的空间', heroEn:'Welcome, night owl.' },
  { icon:'🌅', title:'早上好，欢迎！',  titleEn:'Good morning!',     desc:'新的一天开始了，感谢你的到访。',   descEn:'A new day begins. Thanks for stopping by.', hero:'早安，欢迎来到我的空间', heroEn:'Good morning, welcome.' },
  { icon:'☀️', title:'上午好，欢迎！',  titleEn:'Good morning!',     desc:'感谢你在这个时间造访这里。',       descEn:'Thanks for visiting this morning.', hero:'欢迎来到我的空间', heroEn:'Welcome to my space.' },
  { icon:'🌞', title:'下午好，欢迎！',  titleEn:'Good afternoon!',   desc:'感谢你在下午抽出时间造访。',       descEn:'Thanks for taking time out of your afternoon.', hero:'下午好，欢迎来到我的空间', heroEn:'Good afternoon, welcome.' },
  { icon:'🌆', title:'傍晚好，欢迎！',  titleEn:'Good evening!',     desc:'感谢你在这个黄昏时分造访。',       descEn:'Thanks for visiting at dusk.', hero:'傍晚好，欢迎来到我的空间', heroEn:'Good evening, welcome.' },
  { icon:'🌙', title:'晚上好，欢迎！',  titleEn:'Good evening!',     desc:'感谢你在夜晚造访这里。',           descEn:'Thanks for visiting tonight.', hero:'夜色中，欢迎来到我的空间', heroEn:'Welcome, into the night.' },
];
const g = hour < 3 ? greetings[0] : hour < 9 ? greetings[1] : hour < 11 ? greetings[2] : hour < 14 ? greetings[3] : hour < 18 ? greetings[4] : greetings[5];

document.getElementById('greeting-icon').textContent  = g.icon;
document.getElementById('greeting-title').textContent = g.title;
document.getElementById('greeting-desc').textContent  = g.desc;
document.getElementById('greeting-line').textContent  = g.hero;

/* Store EN versions for lang switch */
document.getElementById('greeting-title').setAttribute('data-zh', g.title);
document.getElementById('greeting-title').setAttribute('data-en', g.titleEn);
document.getElementById('greeting-desc').setAttribute('data-zh', g.desc);
document.getElementById('greeting-desc').setAttribute('data-en', g.descEn);
document.getElementById('greeting-line').setAttribute('data-zh', g.hero);
document.getElementById('greeting-line').setAttribute('data-en', g.heroEn);

/* Apply saved language */
async function initPage() {
  activeTrack = getTrackFromURL();
  await loadContentData();
  await loadGuestbook();
  applyLang(lang);
  renderMsgs();
  trackEvent('page_view', { page: 'home' });
}

initPage();

/* === Guestbook === */
const MSGS_KEY = 'bytian-guestbook';
const anonNames = ['友好的访客','好奇的探索者','路过的朋友','匿名旅行者','深夜的读者','早起的人','HCI 爱好者','AI 爱好者','Vibe Coder'];
let guestbookData = [];

function getAnon() { return anonNames[Math.floor(Math.random() * anonNames.length)]; }

function loadMsgs() {
  try { return JSON.parse(localStorage.getItem(MSGS_KEY)) || []; } catch(e) { return []; }
}
function saveMsgs(msgs) {
  try { localStorage.setItem(MSGS_KEY, JSON.stringify(msgs.slice(-30))); } catch(e) {}
}

const defaultMsgs = [
  { text: '这个网站好酷！期待你的下一个项目 🚀', name: 'HCI 爱好者', timeZh: '刚刚', timeEn: 'just now' },
  { text: '发现了一个宝藏博主，继续加油！',       name: '路过的朋友', timeZh: '今天', timeEn: 'today' },
];

async function fetchGuestbookRemote() {
  try {
    const res = await fetch(`${API_ENDPOINTS.guestbookList}?limit=50`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data.messages) ? data.messages : null;
  } catch (_err) {
    return null;
  }
}

async function postGuestbookRemote(text) {
  try {
    const res = await fetch(API_ENDPOINTS.guestbookCreate, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return { error: errBody.error || 'Request failed' };
    }
    const data = await res.json();
    return { message: data.message || null };
  } catch (_err) {
    return { error: 'Network error' };
  }
}

async function loadGuestbook() {
  const remote = await fetchGuestbookRemote();
  if (remote) {
    guestbookData = remote;
    return;
  }
  guestbookData = loadMsgs();
}

function renderMsgs() {
  const all = [...defaultMsgs, ...guestbookData];
  const el     = document.getElementById('gb-messages');
  el.innerHTML = all.map(m => `
    <div class="gb-msg">
      <div class="gb-msg-text">${escapeHTML(m.text)}</div>
      <div class="gb-msg-meta">${escapeHTML(m.name)} · ${escapeHTML(lang === 'zh' ? (m.timeZh || m.time || '') : (m.timeEn || m.time || ''))}</div>
    </div>
  `).join('');
  el.scrollTop = el.scrollHeight;
}

async function sendMsg() {
  const input = document.getElementById('gb-input');
  const btn   = document.getElementById('gb-send');
  const text  = input.value.trim();
  if (!text) return;
  btn.disabled    = true;
  btn.textContent = '✓';
  const remoteResult = await postGuestbookRemote(text);
  if (remoteResult && remoteResult.message) {
    guestbookData.push(remoteResult.message);
  } else {
    guestbookData.push({ text, name: getAnon(), timeZh: '刚刚', timeEn: 'just now' });
    saveMsgs(guestbookData);
    if (remoteResult && remoteResult.error) {
      console.warn('[guestbook] fallback to localStorage:', remoteResult.error);
    }
  }
  renderMsgs();
  input.value = '';
  setTimeout(() => {
    btn.disabled    = false;
    btn.textContent = lang === 'zh' ? '发送' : 'Send';
  }, 1500);
}

document.getElementById('gb-send').addEventListener('click', sendMsg);
document.getElementById('gb-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendMsg();
});

/* === Fade-in on scroll === */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); }
  });
}, { threshold: 0.08 });

if (prefersReducedMotion) {
  document.querySelectorAll('.fade').forEach(el => el.classList.add('in'));
} else {
  document.querySelectorAll('.fade').forEach(el => observer.observe(el));
}

/* === Magnetic buttons === */
if (!prefersReducedMotion) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* === Smooth scroll === */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const t = document.querySelector(href);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  });
});

/* === Nav active highlight === */
const secs  = ['about', 'projects', 'blog', 'guestbook', 'contact'];
const links = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  secs.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 80) cur = id;
  });
  links.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
}, { passive: true });
