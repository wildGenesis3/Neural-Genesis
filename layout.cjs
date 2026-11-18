'use strict';

// Copies the shared header and footer (partials/) into every page and marks the
// current page's links. Edit the partials, then run `npm run layout`.
// `npm run build` runs this first, so a deploy never ships a stale header.
const fs = require('node:fs');
const path = require('node:path');

const pages = ['index.html', 'products/index.html', 'whats-next/index.html', 'our-story/index.html', 'contact/index.html'];
const partial = name => fs.readFileSync(path.join(__dirname, 'partials', `${name}.html`), 'utf8').trim();
const header = partial('header');
const footer = partial('footer');

function markCurrent(html, page) {
  return html.replace(/<a ([^>]*?)data-nav="([^"]+)"([^>]*)>/g, (tag, before, nav, after) => {
    const attrs = `${before}data-nav="${nav}"${after}`.replace(/\s*aria-current="page"/, '').replace(/\s*class="active"/, '');
    return nav === page ? `<a ${attrs} aria-current="page">` : `<a ${attrs}>`;
  });
}

let changed = 0;
for (const file of pages) {
  const full = path.join(__dirname, file);
  const html = fs.readFileSync(full, 'utf8');
  const page = (html.match(/<body data-page="([^"]+)"/) || [])[1];
  if (!page) throw new Error(`${file}: missing <body data-page="...">`);
  let next = html;
  for (const [name, content] of [['header', header], ['footer', footer]]) {
    const block = new RegExp(`(<!-- @${name}[^>]*-->)[\\s\\S]*?(<!-- /@${name} -->)`);
    if (!block.test(next)) throw new Error(`${file}: missing @${name} markers`);
    next = next.replace(block, (_, open, close) => `${open}\n  ${markCurrent(content, page)}\n  ${close}`);
  }
  if (next !== html) { fs.writeFileSync(full, next); changed++; }
}
console.log(`Layout: ${pages.length} pages checked, ${changed} updated.`);
