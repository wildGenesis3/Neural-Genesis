'use strict';

// ── NAV scroll + hamburger ───────────────────────────────────
(function () {
  const nav  = document.getElementById('nav');
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  if (ham && menu) {
    const closeMenu = () => {
      menu.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    ham.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      ham.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !menu.contains(e.target)) {
        closeMenu();
      }
    });
  }
})();

// ── Scroll reveal ─────────────────────────────────────────────
(function () {
  const targets = document.querySelectorAll(
    '.prod-card, .cn-card, .tv-card, ' +
    '.hero-panel, .hstat'
  );
  targets.forEach((el, i) => {
    el.classList.add('reveal');
    const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.transitionDelay = `${Math.min(idx * 0.07, 0.35)}s`;
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  targets.forEach(el => obs.observe(el));
})();

// ── Smooth anchors ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 68, behavior: 'smooth' });
    }
  });
});

// ── Scroll spy nav ───────────────────────────────────────────
(function () {
  const sections = ['hero','products','coming-next','vision','contact'];
  const links = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 100) cur = id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${cur}`);
    });
  }, { passive: true });
})();

// ── Live log stream in hero panel ────────────────────────────
(function () {
  const log = document.getElementById('hp-log');
  if (!log) return;

  const entries = [
    { ts: null, cls: 'hlog-tag--blue',    mod: 'HRDeeds',    msg: 'Candidate scored 94.2%' },
    { ts: null, cls: 'hlog-tag--teal',    mod: 'RoutePulse', msg: 'Route optimized: BOM→DEL' },
    { ts: null, cls: 'hlog-tag--emerald', mod: 'LinaKart',   msg: '+14.3% CVR uplift detected' },
    { ts: null, cls: 'hlog-tag--blue',    mod: 'HRDeeds',    msg: 'Compliance check passed' },
    { ts: null, cls: 'hlog-tag--teal',    mod: 'RoutePulse', msg: 'Fleet anomaly: vehicle F-492' },
    { ts: null, cls: 'hlog-tag--emerald', mod: 'LinaKart',   msg: 'Batch recommendations: 12k' },
  ];

  let idx = 2;
  const getTs = () => {
    const n = new Date();
    return `${n.getHours().toString().padStart(2,'0')}:${n.getMinutes().toString().padStart(2,'0')}:${n.getSeconds().toString().padStart(2,'0')}`;
  };

  const MAX = 3;
  setInterval(() => {
    idx = (idx + 1) % entries.length;
    const e = entries[idx];
    const line = document.createElement('div');
    line.className = 'hlog-line';
    line.style.opacity = '0';
    line.style.transform = 'translateX(-4px)';
    line.style.transition = 'opacity 250ms, transform 250ms';
    line.innerHTML = `<span class="hlog-ts">${getTs()}</span><span class="hlog-tag ${e.cls}">${e.mod}</span><span class="hlog-msg">${e.msg}</span>`;
    log.appendChild(line);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { line.style.opacity = '1'; line.style.transform = 'none'; });
    });
    while (log.children.length > MAX) log.removeChild(log.firstChild);
  }, 2200);
})();

// ── Sparkline draw animation ─────────────────────────────────
(function () {
  const paths = document.querySelectorAll('.hp-sparkline, .sparkline-path');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const p = e.target;
        const len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
        p.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)';
        setTimeout(() => { p.style.strokeDashoffset = '0'; }, 80);
        obs.unobserve(p);
      }
    });
  }, { threshold: 0.3 });
  paths.forEach(p => obs.observe(p));
})();

// ── CTA form ─────────────────────────────────────────────────
(function () {
  const form     = document.getElementById('cta-form');
  const btn      = document.getElementById('dcf-submit');
  const statusEl = document.getElementById('dcf-status');
  if (!form || !btn) return;

  function showStatus(text, type) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.className = 'dcf-status ' + (type || '');
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const nameInput = document.getElementById('cname');
    const emailInput = document.getElementById('cemail');
    const productInput = document.getElementById('cproduct');

    const name    = nameInput ? nameInput.value.trim() : '';
    const email   = emailInput ? emailInput.value.trim() : '';
    const product = productInput ? productInput.value : '';

    if (!name || !email) {
      showStatus('Please provide both your name and email address.', 'error');
      return;
    }

    const origBtnContent = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.disabled = true;
    showStatus('', '');

    try {
      const endpoint = window.location.protocol === 'file:' 
        ? 'http://localhost:3000/api/contact' 
        : '/api/contact';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, product })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        btn.innerHTML = '✓ Request Received!';
        btn.style.background = '#059669';
        btn.style.borderColor = '#059669';
        showStatus('Thank you! Your request has been sent to our team.', 'success');
        form.reset();

        setTimeout(() => {
          btn.innerHTML = origBtnContent;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.borderColor = '';
        }, 4000);
      } else {
        throw new Error(data.error || 'Server error occurred. Please try again.');
      }
    } catch (err) {
      btn.innerHTML = origBtnContent;
      btn.disabled = false;

      if (window.location.protocol === 'file:' && err.message.includes('Failed to fetch')) {
        showStatus('Backend server is not running. Run "npm start" in the terminal to activate SMTP delivery.', 'warning');
      } else {
        showStatus(err.message || 'Could not send message. Please verify your settings.', 'error');
      }
    }
  });
})();

// ── Animate hp tile progress bars ───────────────────────────
(function () {
  const bars = document.querySelectorAll('.hpt-bar-fill');
  bars.forEach(b => {
    const target = b.style.width;
    b.style.width = '0%';
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => { b.style.width = target; }, 200);
          obs.unobserve(b);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(b);
  });
})();
