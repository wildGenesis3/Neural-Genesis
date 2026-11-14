'use strict';

// A scroll-directed product ecosystem, built from the company's actual brands.
// Native scrolling is preserved; touch devices use the same scenes without pinning.
(() => {
  const hero = document.getElementById('hero');
  const art = document.getElementById('hero-art');
  const scene = document.getElementById('ecosystem-scene');
  const toggle = document.getElementById('motion-toggle');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 901px) and (min-height: 650px) and (hover: hover) and (pointer: fine)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const nodes = [...document.querySelectorAll('.ecosystem-node')];
  const steps = [...document.querySelectorAll('.ecosystem-step')];
  const connections = [...document.querySelectorAll('.connection')];
  const stories = [
    ['PEOPLE, AT THE CENTER', 'Better workdays start with HRDeeds.', 'Employees, location-based attendance, payroll, and reimbursements.'],
    ['OPERATIONS, IN MOTION', 'A clearer route with RoutePulse.', 'Field teams, customer visits, and day plans. Moving together.'],
    ['ROOM FOR IMAGINATION', 'New perspectives with Vyaasartha Stories.', 'A place for stories, reading, and everyday discovery.'],
    ['YOUR LOCAL MARKETPLACE', 'Buy, sell, and hire with LinaKart.', 'Shop locally, book services, and discover nearby work opportunities.']
  ];
  let paused = preference.matches;
  let active = -1;
  let frame = 0;
  let targetX = 0, targetY = 0, pointerX = 0, pointerY = 0;
  let progress = 0, currentProgress = 0;
  let inView = true;
  let lastScrollPhase = -1;

  function select(index) {
    if (active === index) return;
    active = index;
    scene.dataset.active = String(index);
    art.style.setProperty('--active-color', ['112,153,255', '108,218,180', '228,184,135', '239,195,65'][index]);
    nodes.forEach((node, i) => node.classList.toggle('is-active', i === index));
    connections.forEach((connection, i) => connection.classList.toggle('is-active', i === index));
    steps.forEach((step, i) => {
      step.classList.toggle('is-active', i === index);
      step.setAttribute('aria-pressed', String(i === index));
    });
    document.getElementById('ecosystem-category').textContent = stories[index][0];
    document.getElementById('ecosystem-title').textContent = stories[index][1];
    document.getElementById('ecosystem-description').textContent = stories[index][2];
    document.getElementById('ecosystem-count').innerHTML = `0${index + 1}<span>/ 04</span>`;
  }

  function draw() {
    frame = 0;
    if (document.hidden || !inView) return;
    pointerX += (targetX - pointerX) * .1;
    pointerY += (targetY - pointerY) * .1;
    currentProgress += (progress - currentProgress) * .1;
    scene.style.setProperty('--scene-ry', `${pointerX * 13 + (currentProgress - .5) * 14}deg`);
    scene.style.setProperty('--scene-rx', `${9 - pointerY * 10}deg`);
    scene.style.setProperty('--scene-rz', `${-3 + currentProgress * 6}deg`);
    hero.style.setProperty('--hero-shift', `${currentProgress * -24}px`);
    art.style.setProperty('--orbit-rotation', `${currentProgress * 120}deg`);
    if (Math.abs(targetX - pointerX) + Math.abs(targetY - pointerY) + Math.abs(progress - currentProgress) > .001) schedule();
  }

  function schedule() {
    if (!frame && !paused && inView && !document.hidden) frame = requestAnimationFrame(draw);
  }

  function onScroll() {
    if (paused) return;
    const bounds = hero.getBoundingClientRect();
    if (desktop.matches) {
      const distance = Math.max(hero.offsetHeight - window.innerHeight, 1);
      progress = Math.max(0, Math.min(1, -bounds.top / distance));
      const phase = Math.min(3, Math.floor(progress * 4));
      if (phase !== lastScrollPhase) { select(phase); lastScrollPhase = phase; }
    } else {
      // A small scroll parallax rather than a long pinned scene on mobile.
      progress = Math.max(0, Math.min(1, -bounds.top / hero.offsetHeight));
    }
    schedule();
  }

  function updateMotion() {
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Enable interactive motion' : 'Pause interactive motion');
    document.getElementById('motion-icon').textContent = paused ? '▷' : 'Ⅱ';
    document.getElementById('motion-label').textContent = paused ? 'Enable motion' : 'Pause motion';
    hero.classList.toggle('motion-paused', paused);
    hero.classList.toggle('scroll-story', desktop.matches && !paused);
    if (paused) {
      cancelAnimationFrame(frame); frame = 0;
      scene.style.setProperty('--scene-rx', '5deg');
      scene.style.setProperty('--scene-ry', '-5deg');
      scene.style.setProperty('--scene-rz', '0deg');
      hero.style.setProperty('--hero-shift', '0px');
      document.querySelectorAll('.product-card').forEach(card => {
        card.style.removeProperty('--card-rx'); card.style.removeProperty('--card-ry');
      });
    } else onScroll();
  }

  hero.addEventListener('pointermove', event => {
    if (paused || !finePointer.matches) return;
    const bounds = art.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2));
    targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2));
    schedule();
  });
  hero.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; schedule(); });
  nodes.forEach((node, index) => {
    node.addEventListener('pointerenter', () => { if (finePointer.matches) select(index); });
    node.addEventListener('focus', () => select(index));
  });
  steps.forEach((step, index) => step.addEventListener('click', () => select(index)));
  toggle.addEventListener('click', () => { paused = !paused; updateMotion(); });
  preference.addEventListener('change', event => { paused = event.matches; updateMotion(); });
  desktop.addEventListener('change', updateMotion);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else schedule();
  });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    if (inView) { onScroll(); schedule(); } else { cancelAnimationFrame(frame); frame = 0; }
  }).observe(hero);

  // Product interfaces lean toward the pointer; text remains on its own plane.
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (paused || !finePointer.matches) return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--card-rx', `${((event.clientY - bounds.top) / bounds.height - .5) * -5}deg`);
      card.style.setProperty('--card-ry', `${((event.clientX - bounds.left) / bounds.width - .5) * 7}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--card-rx', '0deg'); card.style.setProperty('--card-ry', '0deg');
    });
  });
  select(0); updateMotion();
})();
