(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
  };

  // Theme (light by default, matching the design reference)
  const root = document.documentElement;
  const icon = $('#theme-icon');
  const applyTheme = (dark) => {
    root.classList.toggle('dark', dark);
    icon.textContent = dark ? '☀️' : '🌙';
  };
  applyTheme(store.get('theme') === 'dark');
  $('#theme-toggle').addEventListener('click', () => {
    const dark = !root.classList.contains('dark');
    applyTheme(dark);
    store.set('theme', dark ? 'dark' : 'light');
  });

  // Mobile menu
  const menu = $('#mobile-menu');
  $('#menu-btn').addEventListener('click', () => {
    menu.classList.toggle('hidden');
    menu.classList.toggle('flex');
  });
  $$('a', menu).forEach((a) => a.addEventListener('click', () => {
    menu.classList.add('hidden');
    menu.classList.remove('flex');
  }));

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  $$('.reveal').forEach((el) => io.observe(el));

  // Active nav link
  const links = $$('.nav-link');
  const sections = ['about', 'skills', 'projects', 'contact'].map((id) => document.getElementById(id));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((s) => s && spy.observe(s));

  // Project filter
  $$('.filter-btn').forEach((btn) => btn.addEventListener('click', () => {
    $$('.filter-btn').forEach((b) => b.classList.toggle('active', b === btn));
    const f = btn.dataset.filter;
    $$('.project-card').forEach((c) => c.classList.toggle('hidden-card', f !== 'all' && c.dataset.cat !== f));
  }));

  // Copy email
  const copyBtn = $('#copy-email');
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('yjkim96@tjb.co.kr');
      copyBtn.textContent = '복사됨!';
    } catch {
      copyBtn.textContent = '실패';
    }
    setTimeout(() => (copyBtn.textContent = '복사'), 1500);
  });

  $('#year').textContent = new Date().getFullYear();
})();
