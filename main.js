/* ===== BYTIAN.DEV — MAIN JAVASCRIPT ===== */

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
const sections  = ['about', 'projects', 'blog', 'contact'];
const navLinks  = document.querySelectorAll('.nav-links a');

const onScroll = () => {
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 140) current = id;
  });
  navLinks.forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === '#' + current);
  });
};
window.addEventListener('scroll', onScroll, { passive: true });

/* === Fade-in on scroll === */
const fadeEls = document.querySelectorAll(
  'section, .pcard, .bitem, .stat-card, .cbox'
);
fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

/* === Project card 3D tilt on hover === */
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

/* === Typewriter effect on hero tag === */
const heroTag = document.querySelector('.hero-tag');
if (heroTag) {
  const text = heroTag.textContent;
  heroTag.textContent = '';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      heroTag.textContent += text[i++];
      setTimeout(type, 28);
    }
  };
  setTimeout(type, 400);
}

/* === Mobile menu toggle (placeholder) === */
const menuBtn = document.getElementById('menuBtn');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    // simple toggle — can extend with a slide-out drawer later
    const links = document.querySelector('.nav-links');
    if (links) {
      const open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '60px';
      links.style.right = '28px';
      links.style.background = '#0d1220';
      links.style.border = '1px solid rgba(0,245,255,0.15)';
      links.style.padding = '16px 24px';
      links.style.gap = '16px';
      links.style.zIndex = '200';
    }
  });
}
