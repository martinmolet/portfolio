// Shared behaviour for case study pages: scroll reveal, count-up, nav border.
(function () {
  try { localStorage.setItem('lang', document.documentElement.lang); } catch (e) {}

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const countUp = (el) => {
    const target = Number(el.dataset.count);
    if (reduce) { el.textContent = target; return; }
    let t0;
    const tick = (t) => {
      t0 = t0 || t;
      const p = Math.min(1, (t - t0) / 1100);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = '0';
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      e.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  const nav = document.querySelector('.nav');
  const title = document.querySelector('.hero-title');
  if (nav && title) {
    new IntersectionObserver(([e]) => nav.classList.toggle('is-scrolled', !e.isIntersecting)).observe(title);
  }
})();

// Mode switches inside figures (e.g. Client / Conseiller)
document.querySelectorAll('[data-switch]').forEach((seg) => {
  const box = seg.closest('.fig-box');
  const buttons = seg.querySelectorAll('button');
  buttons.forEach((b) => b.addEventListener('click', () => {
    box.dataset.mode = b.dataset.val;
    buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  }));
});
