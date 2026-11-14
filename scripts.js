'use strict';

// Navigation remains usable without animation or WebGL support.
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
function closeMenu() {
  mobileMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}
menuToggle.addEventListener('click', () => {
  const opening = mobileMenu.hidden;
  mobileMenu.hidden = !opening;
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileMenu.hidden) { closeMenu(); menuToggle.focus(); }
});
document.addEventListener('click', event => { if (!document.getElementById('nav').contains(event.target)) closeMenu(); });
window.matchMedia('(min-width: 1025px), (min-width: 651px) and (pointer: fine)').addEventListener('change', event => { if (event.matches) closeMenu(); });
document.getElementById('year').textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  document.documentElement.classList.add('js-motion');
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = document.querySelector(`.desktop-nav a[href="#${entry.target.id}"]`);
      if (link) link.classList.toggle('active', entry.isIntersecting);
    });
  }, { rootMargin: '-15% 0px -50% 0px' });
  document.querySelectorAll('#products, #coming-next').forEach(section => navObserver.observe(section));
}

// Keep the inquiry context when a visitor opens their email app.
document.querySelectorAll('[data-interest]').forEach(link => {
  link.addEventListener('click', () => {
    const subject = 'Neural Genesis inquiry — ' + link.dataset.interest;
    document.querySelector('.email-action').href = 'mailto:wildgenesis3@gmail.com?subject=' + encodeURIComponent(subject);
  });
});

// The phone layout begins with a concise roadmap; each project can be expanded.
if (window.matchMedia('(max-width: 650px), (max-width: 1024px) and (pointer: coarse)').matches) {
  document.querySelectorAll('.roadmap-item').forEach(item => { item.open = false; });
}
