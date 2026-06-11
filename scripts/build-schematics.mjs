// Compiles the ng-add schematics to the library dist folder and copies the
// non-TS assets (collection.json, schema.json, template files) alongside them.
// Run AFTER `ng build @open-rlb/ng-bootstrap` (ng-packagr cleans the dist dir).
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const libDir = join(root, 'projects', 'rlb', 'ng-bootstrap');
const distSchematics = join(root, 'dist', 'rlb', 'ng-bootstrap', 'schematics');

if (!existsSync(join(root, 'dist', 'rlb', 'ng-bootstrap', 'package.json'))) {
  console.error('✗ dist/rlb/ng-bootstrap not found. Run `ng build @open-rlb/ng-bootstrap` first.');
  process.exit(1);
}

console.log('• Compiling ng-add schematics...');
// Invoke the locally-installed tsc directly (deterministic in CI; no npx resolution).
const tscBin = join(root, 'node_modules', 'typescript', 'bin', 'tsc');
execSync(`node "${tscBin}" -p projects/rlb/ng-bootstrap/tsconfig.schematics.json`, {
  cwd: root,
  stdio: 'inherit',
});

const assets = [
  // Marks the compiled schematics as CommonJS even though the published package
  // is `"type": "module"` — otherwise Node would load these .js files as ESM.
  ['schematics/package.json', 'package.json'],
  ['schematics/collection.json', 'collection.json'],
  ['schematics/ng-add/schema.json', 'ng-add/schema.json'],
  ['schematics/ng-add/files', 'ng-add/files'],
];

for (const [src, dest] of assets) {
  const from = join(libDir, src);
  const to = join(distSchematics, dest);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
}

// Bundle the repo-root Claude skills so `ng add` can copy them into consumers.
const skillsSrc = join(root, '.claude', 'skills');
if (existsSync(skillsSrc)) {
  const skillsDest = join(distSchematics, 'ng-add', 'claude-skills');
  mkdirSync(skillsDest, { recursive: true });
  cpSync(skillsSrc, skillsDest, { recursive: true });
  console.log('• Bundled Claude skills from', skillsSrc);
} else {
  console.warn('⚠ No .claude/skills found at repo root — ng-add will ship without skills.');
}

console.log('✓ Schematics built →', distSchematics);
