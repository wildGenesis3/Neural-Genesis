'use strict';

const fs = require('node:fs');
const path = require('node:path');

// Publish an explicit set of frontend assets, never the working directory.
const output = path.join(__dirname, 'dist');
const files = ['index.html', 'styles.css', 'mobile.css', 'product-scenes.css', 'scripts.js', 'ecosystem.js', 'product-scenes.js'];
fs.mkdirSync(output, { recursive: true });
for (const file of files) fs.copyFileSync(path.join(__dirname, file), path.join(output, file));
for (const directory of ['assets', 'Neural_Genesis_Logo']) {
  fs.cpSync(path.join(__dirname, directory), path.join(output, directory), {
    recursive: true,
    filter: source => !path.basename(source).startsWith('.') && !/\.(log|md|txt)$/i.test(source)
  });
}
console.log('Static website prepared in dist/.');
