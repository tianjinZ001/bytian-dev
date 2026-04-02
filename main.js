/* ===== BYTIAN.DEV — MAIN JS (bilingual) ===== */

/* === Language system === */
const STORAGE_KEY = 'bytian-lang';
let currentLang = localStorage.getItem(STORAGE_KEY) || 'zh';

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  document.body.setAttribute('data-lang', lang);
  localStorage.setItem(STORAGE_KEY, lang);

  // Update all elements with data-zh / data-en
  document.querySelectorAll('[data-zh][data-en]').forEach(el => {
    const content = el.getAttribute('data-' + lang);
    if (content !== null) el.innerHTML = content;
  });

  // Update page title
  document.title = lang === 'zh'
    ? 'Tian — HCI 创造者'
    : 'Tian — HCI Builder';
}

document.getElementById('langToggle').addEventListener('click', () => {
  const next = currentLang === 'zh' ? 'en' : 'zh';
  // Brief flash effect
  document.body.classList.add('lang-switching');
  setTimeout(() => document.body.classList.remove('lang-switching'), 300);
  applyLang(next);
});

// Apply on load
applyLang(currentLang);

/* === Custom cursor glow === */
const glow = document.getElementById('glow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

/* === Smooth scroll for nav links === */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* === Active nav highlight on scroll === */
const sections = ['about', 'projects', 'blog', 'contact'];
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 140) current = id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

/* === Fade-in on scroll === */
document.querySelectorAll('section, .pcard, .bitem, .stat-card, .cbox')
  .forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* === Project card 3D tilt === */
document.querySelectorAll('.pcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left)  / r.width  - 0.5;
    const y = (e.clientY - r.top)   / r.height - 0.5;
    card.style.transform =
      `perspective(700px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-3px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* === Typewriter on hero tag === */
const heroTag = document.querySelector('.hero-tag');
if (heroTag) {
  const text = heroTag.textContent.trim();
  heroTag.textContent = '';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      heroTag.textContent += text[i++];
      setTimeout(type, 30);
    }
  };
  setTimeout(type, 500);
}
