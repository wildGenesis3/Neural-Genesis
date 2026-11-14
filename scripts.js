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
window.matchMedia('(min-width: 651px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
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

// Product inquiries carry their context through to the hosted contact form.
document.querySelectorAll('[data-interest]').forEach(link => {
  link.addEventListener('click', () => { document.getElementById('cproduct').value = link.dataset.interest; });
});
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', event => {
  const form = event.currentTarget;
  const button = document.getElementById('submit-contact');
  const status = document.getElementById('form-status');
  if (form.dataset.submitting === 'true') {
    event.preventDefault();
    return;
  }
  ['cname', 'cemail', 'cmessage'].forEach(id => {
    const input = document.getElementById(id);
    input.value = input.value.trim();
  });
  if (!form.checkValidity()) {
    event.preventDefault();
    status.textContent = 'Please enter your name and email address.';
    status.className = 'form-status error';
    form.reportValidity();
    return;
  }
  // Use a normal POST so FormSubmit can show its CAPTCHA and delivery result.
  // Do not show success here: the provider must first accept the submission.
  form.dataset.submitting = 'true';
  button.disabled = true;
  button.querySelector('span').textContent = 'Opening verification…';
  status.textContent = 'Continue with the security check to send your inquiry.';
  status.className = 'form-status';
});

// Restore the form if a visitor returns from verification using browser Back.
window.addEventListener('pageshow', () => {
  delete contactForm.dataset.submitting;
  const button = document.getElementById('submit-contact');
  button.disabled = false;
  button.querySelector('span').textContent = 'Start a conversation';
  const status = document.getElementById('form-status');
  status.textContent = '';
  status.className = 'form-status';
});
