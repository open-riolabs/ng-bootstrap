// Post-processes the docs build for GitHub Pages:
//  - copies index.html to 404.html so client-side (deep-link) routing works,
//  - drops a .nojekyll file so GitHub Pages serves files/folders starting with `_`.
import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const browserDir = join(root, 'dist', 'ng-bootstrap', 'browser');
const indexHtml = join(browserDir, 'index.html');

if (!existsSync(indexHtml)) {
  console.error('✗ Docs build not found at', indexHtml, '— run `ng build ng-bootstrap` first.');
  process.exit(1);
}

copyFileSync(indexHtml, join(browserDir, '404.html'));
writeFileSync(join(browserDir, '.nojekyll'), '');

console.log('✓ GitHub Pages assets ready (404.html + .nojekyll) in', browserDir);
