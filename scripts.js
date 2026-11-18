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
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  document.documentElement.classList.add('js-motion');
}

// Contact page: product links arrive as /contact/?interest=RoutePulse. Carry that
// into the email subject so the visitor's message keeps its context.
const emailAction = document.querySelector('.email-action');
const interest = new URLSearchParams(location.search).get('interest');
if (emailAction && interest) {
  const topic = interest.slice(0, 60);
  emailAction.href = 'mailto:info@neuralgenesis.in?subject=' + encodeURIComponent('Neural Genesis inquiry — ' + topic);
  const note = document.getElementById('contact-interest');
  if (note) { note.textContent = 'Your email will be about: ' + topic; note.hidden = false; }
}

// The phone layout begins with a concise roadmap; each project can be expanded.
if (window.matchMedia('(max-width: 650px), (max-width: 1024px) and (pointer: coarse)').matches) {
  document.querySelectorAll('.roadmap-item').forEach(item => { item.open = false; });
}
