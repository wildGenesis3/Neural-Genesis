'use strict';

// Small, user-directed explanations rather than simulated live product screens.
(() => {
  const narratives = {
    hr: [
      ['Start the day with a check-in.', 'Photo and GPS attendance, without the paperwork.'],
      ['Bring your people into one place.', 'Employees, branches, leave, and reimbursements. Connected.'],
      ['Turn a workday into a payslip.', 'Salary calculations, deductions, and PDF payslips in one workflow.']
    ],
    lina: [
      ['Find it closer to home.', 'Discover local products, or give your own listings a home.'],
      ['Find the right help, nearby.', 'Explore local professionals and connect over the service you need.'],
      ['Make room for a new opportunity.', 'Discover nearby work, or share a local work opportunity.']
    ]
  };
  document.querySelectorAll('[data-demo]').forEach(demo => {
    const buttons = [...demo.querySelectorAll('[data-demo-step]')];
    buttons.forEach(button => button.addEventListener('click', () => {
      const step = Number(button.dataset.demoStep);
      demo.dataset.step = String(step);
      buttons.forEach((item, index) => item.setAttribute('aria-pressed', String(index === step)));
      const [title, copy] = narratives[demo.dataset.demo][step];
      demo.querySelector('.demo-narrative strong').textContent = title;
      demo.querySelector('.demo-narrative p').textContent = copy;
    }));
  });

  const home = document.querySelector('[data-home-scene]');
  const homeLabels = { evening: 'Evening lights', away: 'Away · lights off', night: 'Good night · soft lighting' };
  home.querySelectorAll('[data-home-mode]').forEach(button => button.addEventListener('click', () => {
    home.dataset.homeScene = button.dataset.homeMode;
    home.querySelectorAll('[data-home-mode]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.getElementById('home-scene-label').textContent = homeLabels[button.dataset.homeMode];
  }));
})();
