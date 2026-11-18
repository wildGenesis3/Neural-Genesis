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
- Header and footer show a dark-surface logo lockup built from two unmodified files in `Neural_Genesis_Logo/`: the colour mark (`brand-mark-transparent.png`) beside the white wordmark (`logo-white.png`, clipped to the wordmark). Both share the same 325px height, so they line up exactly; no white box behind the logo.
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
| `refinements.css` | Loaded last: dark-surface logo lockup and larger, brighter labels (no interface text under 9px; most labels 10–13px) |
| `robots.txt`, `sitemap.xml` | Search engine files, published with the site |
| `assets/og-image.jpg` | 1200×630 link preview image (WhatsApp, LinkedIn, X), made from the official logo files |
| `server.js` | Existing Express server and Nodemailer contact endpoint |
| `Neural_Genesis_Logo/` | Existing branding and favicons |

Google Fonts is the only external visual dependency; local system fonts provide fallbacks. The product ecosystem uses the existing brand mark and local HTML/CSS/SVG visuals, without third-party model or image requests.

## Contact

Firebase deploys only the generated `dist/` frontend folder. Its predeploy hook runs `npm run build`, which copies an explicit list of website assets. Local browser profiles, Git metadata, `.env`, logs, Node dependencies, and server files are outside that publish folder.

FormSubmit and the public submission form have been removed. The site displays `wildgenesis3@gmail.com` and a direct `mailto:` link. Product inquiry links populate the email subject. The visitor sends their message through their own email app; the website does not submit, store, or claim to deliver messages. No third-party form service or SMTP configuration is required for this contact flow.

The legacy SMTP endpoint in `server.js` is unused by the frontend. Do not use it as evidence that the public site sends email.

## Phone layout

On screens up to 650px, and touch devices up to 1024px, the desktop 3D ecosystem becomes a simple two-column product directory. Product cards show readable descriptions, feature labels, and direct links instead of reduced miniature scenes. The roadmap starts collapsed, and the contact area uses a direct email action. Desktop 3D scenes remain available on larger screens and mouse-driven desktop layouts.

The alignment pass verifies equal tile rows, aligned name baselines, consistent card and menu gutters, and navigation in both orientations across 16 phone/tablet viewport combinations. Its release excludes the paused SMTP implementation.

## Verification

The original redesign was verified for mobile navigation, roadmap interaction, product inquiry selection, and simulated contact success/failure. Browser verification covers widths of 320, 390, 650, 768, 900, 1024, and 1440 pixels: mouse perspective, all four hero scroll chapters, product selection controls, pause, reduced motion, responsive overflow, mobile product links, internal anchors, and absence of browser runtime errors. The featured-product revision additionally verifies all six HRDeeds/LinaKart workflow selections, three home scenes, the home inquiry selection, four current product cards and four upcoming roadmap items, and official logo asset loading. Contact checks do not send real email.

Mobile verification additionally covers 14 portrait/landscape viewport combinations from 320px phones to 1024px tablets. Checks assert no horizontal page expansion, unclipped headings/controls, at least 44px-high primary touch controls, 16px input text, and no pinned hero on touch devices. Chrome touch emulation verifies menu navigation, all six product workflow states, home scenes, inquiry selection, form typing, and reduced motion. Desktop hero behavior and typography are checked separately. These are browser-emulation checks; no physical-device or native Safari testing was performed. Test form submissions remain blocked.

## Design references

The motion direction was informed by [MotionSites](https://motionsites.org/motion): interactive 3D heroes, subtle motion, and layered compositions. The implementation, product ecosystem, and product previews are original to this project.

Product references: [HRDeeds](https://hrdeeds.com/) for workforce administration, GPS/photo attendance, payroll, and reimbursements; [LinaKart](https://linakart.com/) for local buying/selling, services, and nearby work. The existing local logos are used in their product cards and hero nodes. Vyaasartha could not be retrieved during this revision; its established reading theme and RoutePulse's repository-supplied field operations scope were retained without adding new claims. The previous approach/vision section has been removed, including its navigation links.

## Sharing and search

`index.html` carries a canonical URL, Open Graph and Twitter card tags, and Organization structured data (JSON-LD), all pointing at `https://neuralgenesis.web.app/`. If the site moves to a custom domain, update those URLs, `robots.txt` and `sitemap.xml` together.
