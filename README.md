# Neural Genesis

A responsive, motion-led website for Neural Genesis Technologies, showcasing HRDeeds, RoutePulse, Vyaasartha Stories, LinaKart, Home Automation Applications, and the upcoming product roadmap.

## Run locally

```sh
npm install
```

Run:

```sh
npm start
```

Open **http://localhost:3000**. Use `npm run dev` for server watch mode. No frontend build is required.

## Experience

- A 3D product ecosystem centered on the Neural Genesis brand, with HRDeeds, RoutePulse, Stories, and LinaKart on separate floating planes. The diagram represents the product family, rather than claiming software integrations.
- Mouse-driven perspective, animated connections, and four scroll-directed product chapters in a sticky desktop scene. Native scrolling is preserved; mobile uses a compact scene with tap controls.
- Dark navy surfaces, cobalt accents, Geist typography, and editorial serif details.
- Four featured products. HRDeeds and LinaKart have user-directed 3D explanations: choose check-in/people/payroll or local products/services/work to bring the relevant object forward and update the explanation. These are illustrative workflows, not live product sessions.
- Home Automation Applications is the fourth item in the upcoming product roadmap. Its expandable row includes an illustrative room with Evening, Away, and Good night scene controls and a contextual contact link. Scene controls only change the illustration.
- Header and footer use the unmodified full-color Neural Genesis logo from `Neural_Genesis_Logo/`, displayed on a light surface so its navy wordmark stays readable.
- Scroll reveals, mobile navigation, expandable roadmap, and contextual product inquiries.
- Keyboard focus indicators, a skip link, pause controls, and reduced-motion support. Reduced-motion layouts do not pin the hero or respond to pointer movement.
- Perspective rendering runs only while values change and stops offscreen or when the browser tab is hidden. The scene uses CSS 3D transforms, with no WebGL dependency.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Content, product showcases, roadmap, contact form |
| `styles.css` | Design tokens, responsive layouts, visual effects |
| `scripts.js` | Navigation, reveals, form handling |
| `ecosystem.js` | Pointer perspective, scroll chapters, product selection, motion controls |
| `product-scenes.css` | Official brand presentation, 3D product objects, responsive home illustration |
| `product-scenes.js` | Product workflow steps and illustrative home scene controls |
| `mobile.css` | Phone/tablet layout, readable forms, touch targets, and roadmap wrapping |
| `server.js` | Existing Express server and Nodemailer contact endpoint |
| `Neural_Genesis_Logo/` | Existing branding and favicons |

Google Fonts is the only external visual dependency; local system fonts provide fallbacks. The product ecosystem uses the existing brand mark and local HTML/CSS/SVG visuals, without third-party model or image requests.

## Contact delivery and hosting

The public contact form sends a standard HTTPS POST directly to `https://formsubmit.co/wildgenesis3@gmail.com`. It works on static Firebase Hosting without a deployed Node backend, SMTP credentials, or a paid email API. Fields include the visitor's name, email, selected product, and message. A hidden subject and table template format the notification; FormSubmit uses the visitor's email for replies.

FormSubmit's CAPTCHA remains enabled, with an additional honeypot field. A valid submission navigates to FormSubmit for verification and its result page. The website does not claim delivery before FormSubmit accepts it, and the form still works without JavaScript. Returning with the browser's Back button restores the submit control.

**One-time activation:** submit an inquiry from the served website and confirm the activation message in `wildgenesis3@gmail.com` (check spam too). Complete activation before relying on production delivery. FormSubmit can provide an opaque endpoint after activation, which can replace the address in the form action. No real email or activation submission was sent during implementation.

The existing `server.js` SMTP endpoint remains available for legacy use but is no longer called by the website form. Static-only Firebase hosting does not run that server. Its SMTP settings are optional for local/legacy use and must stay private in `.env`.

Provider references: [setup and activation](https://formsubmit.co/) and [form options, CAPTCHA, and honeypot](https://formsubmit.co/documentation). Form submissions pass through this third-party provider.

## Verification

The original redesign was verified for mobile navigation, roadmap interaction, product inquiry selection, and simulated contact success/failure. Browser verification covers widths of 320, 390, 650, 768, 900, 1024, and 1440 pixels: mouse perspective, all four hero scroll chapters, product selection controls, pause, reduced motion, responsive overflow, mobile product links, internal anchors, and absence of browser runtime errors. The featured-product revision additionally verifies all six HRDeeds/LinaKart workflow selections, three home scenes, the home inquiry selection, four current product cards and four upcoming roadmap items, and official logo asset loading. Contact checks do not send real email.

Mobile verification additionally covers 14 portrait/landscape viewport combinations from 320px phones to 1024px tablets. Checks assert no horizontal page expansion, unclipped headings/controls, at least 44px-high primary touch controls, 16px input text, and no pinned hero on touch devices. Chrome touch emulation verifies menu navigation, all six product workflow states, home scenes, inquiry selection, form typing, and reduced motion. Desktop hero behavior and typography are checked separately. These are browser-emulation checks; no physical-device or native Safari testing was performed. Test form submissions remain blocked.

## Design references

The motion direction was informed by [MotionSites](https://motionsites.org/motion): interactive 3D heroes, subtle motion, and layered compositions. The implementation, product ecosystem, and product previews are original to this project.

Product references: [HRDeeds](https://hrdeeds.com/) for workforce administration, GPS/photo attendance, payroll, and reimbursements; [LinaKart](https://linakart.com/) for local buying/selling, services, and nearby work. The existing local logos are used in their product cards and hero nodes. Vyaasartha could not be retrieved during this revision; its established reading theme and RoutePulse's repository-supplied field operations scope were retained without adding new claims. The previous approach/vision section has been removed, including its navigation links.
