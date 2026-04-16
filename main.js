/* ===== BYTIAN.DEV v5 — main.js ===== */

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
  document.getElementById('gb-input').placeholder = l === 'zh' ? '说点什么吧...' : 'Leave a message...';
  document.getElementById('gb-send').textContent   = l === 'zh' ? '发送' : 'Send';
}

document.getElementById('langToggle').addEventListener('click', () => {
  applyLang(lang === 'zh' ? 'en' : 'zh');
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
applyLang(lang);

/* === Guestbook === */
const MSGS_KEY = 'bytian-guestbook';
const anonNames = ['友好的访客','好奇的探索者','路过的朋友','匿名旅行者','深夜的读者','早起的人','HCI 爱好者','AI 爱好者','Vibe Coder'];

function getAnon() { return anonNames[Math.floor(Math.random() * anonNames.length)]; }

function loadMsgs() {
  try { return JSON.parse(localStorage.getItem(MSGS_KEY)) || []; } catch(e) { return []; }
}
function saveMsgs(msgs) {
  try { localStorage.setItem(MSGS_KEY, JSON.stringify(msgs.slice(-30))); } catch(e) {}
}

const defaultMsgs = [
  { text: '这个网站好酷！期待你的第一个项目 🚀', name: 'HCI 爱好者', time: '刚刚' },
  { text: '发现了一个宝藏博主，继续加油！',       name: '路过的朋友', time: '今天' },
];

function renderMsgs() {
  const stored = loadMsgs();
  const all    = [...defaultMsgs, ...stored];
  const el     = document.getElementById('gb-messages');
  el.innerHTML = all.map(m => `
    <div class="gb-msg">
      <div class="gb-msg-text">${m.text.replace(/</g,'&lt;')}</div>
      <div class="gb-msg-meta">${m.name} · ${m.time}</div>
    </div>
  `).join('');
  el.scrollTop = el.scrollHeight;
}

function sendMsg() {
  const input = document.getElementById('gb-input');
  const btn   = document.getElementById('gb-send');
  const text  = input.value.trim();
  if (!text) return;
  btn.disabled    = true;
  btn.textContent = '✓';
  const msgs = loadMsgs();
  msgs.push({ text, name: getAnon(), time: '刚刚' });
  saveMsgs(msgs);
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
renderMsgs();

/* === Fade-in on scroll === */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade').forEach(el => observer.observe(el));

/* === Magnetic buttons === */
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width  / 2);
    const dy = e.clientY - (r.top  + r.height / 2);
    btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* === Smooth scroll === */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
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
