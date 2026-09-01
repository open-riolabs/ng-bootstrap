#!/usr/bin/env node
/**
 * Import-hygiene guard for the library source.
 *
 * Enforces three invariants that were established by hand and are easy to lose again:
 *
 *   1. No import cycles (including a file importing itself). `public-api.ts` used to import
 *      from './public-api', which only "worked" because provideRlbBootstrap() is a function and
 *      its bindings are not dereferenced until call time.
 *   2. Nothing imports `rlb-bootstrap.module` except `public-api.ts`. It imports and exports the
 *      whole library, so a component importing it creates a cycle and drags everything in.
 *   3. No deep imports past a package root (e.g. `@open-rlb/date-tz/date-tz`). Those resolve under
 *      a bundler but not under Node ESM, so they break consumers' unit tests while their builds pass.
 *
 * Run: npm run check:imports
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'projects/rlb/ng-bootstrap/src';
const MODULE_FILE = 'rlb-bootstrap.module.ts';
const MODULE_ALLOWED_IMPORTER = 'public-api.ts';

/** Packages we must not reach past the root of. */
const NO_DEEP_IMPORT = ['@open-rlb/date-tz'];

const norm = (p) => p.split(path.sep).join('/');

if (!fs.existsSync(ROOT)) {
  console.error(`✗ ${ROOT} not found — run this from the workspace root.`);
  process.exit(1);
}

const files = [];
(function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) files.push(norm(p));
  }
})(ROOT);

const resolveRelative = (from, spec) => {
  const base = path.resolve(path.dirname(from), spec);
  for (const candidate of [base + '.ts', path.join(base, 'index.ts')]) {
    if (fs.existsSync(candidate)) return norm(path.relative('.', candidate));
  }
  return null;
};

const IMPORT_RE = /(?:from|import)\s*['"]([^'"]+)['"]/g;
const graph = new Map();
const deepImports = [];
const moduleImporters = [];

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const deps = new Set();

  for (const m of src.matchAll(IMPORT_RE)) {
    const spec = m[1];

    if (spec.startsWith('.')) {
      const target = resolveRelative(file, spec);
      if (target) {
        deps.add(target);
        if (target.endsWith('/' + MODULE_FILE) && !file.endsWith('/' + MODULE_ALLOWED_IMPORTER)) {
          moduleImporters.push({ file, spec });
        }
      }
      continue;
    }

    for (const pkg of NO_DEEP_IMPORT) {
      if (spec.startsWith(pkg + '/')) deepImports.push({ file, spec, pkg });
    }
  }

  graph.set(file, deps);
}

/* ---- 1. cycles ---------------------------------------------------------- */
const selfImports = [...graph].filter(([f, deps]) => deps.has(f)).map(([f]) => f);

const cycles = [];
const done = new Set();
(function findCycles() {
  const walkNode = (node, stack) => {
    if (done.has(node)) return;
    const at = stack.indexOf(node);
    if (at !== -1) {
      cycles.push(stack.slice(at).concat(node));
      return;
    }
    stack.push(node);
    for (const dep of graph.get(node) ?? []) walkNode(dep, stack);
    stack.pop();
    done.add(node);
  };
  for (const node of graph.keys()) walkNode(node, []);
})();

const distinctCycles = [];
const seen = new Set();
for (const cycle of cycles) {
  if (cycle.length <= 2) continue; // self-imports reported separately
  const key = [...new Set(cycle)].sort().join('|');
  if (seen.has(key)) continue;
  seen.add(key);
  distinctCycles.push(cycle);
}

/* ---- report ------------------------------------------------------------- */
const short = (p) => p.replace(ROOT + '/', '');
let failed = false;

if (selfImports.length) {
  failed = true;
  console.error(`\n✗ ${selfImports.length} file(s) import themselves:`);
  for (const f of selfImports) console.error(`    ${short(f)}`);
}

if (distinctCycles.length) {
  failed = true;
  console.error(`\n✗ ${distinctCycles.length} import cycle(s):`);
  for (const cycle of distinctCycles) {
    console.error('    ' + cycle.map(short).join('\n      -> '));
  }
  console.error('\n  Inside the library, import the concrete file — never a barrel or the module.');
}

if (moduleImporters.length) {
  failed = true;
  console.error(`\n✗ ${moduleImporters.length} file(s) import ${MODULE_FILE} (only ${MODULE_ALLOWED_IMPORTER} may):`);
  for (const { file, spec } of moduleImporters) console.error(`    ${short(file)}  ->  '${spec}'`);
  console.error('\n  It imports and exports the whole library. Import the specific components instead.');
}

if (deepImports.length) {
  failed = true;
  console.error(`\n✗ ${deepImports.length} deep import(s) past a package root:`);
  for (const { file, spec } of deepImports) console.error(`    ${short(file)}  ->  '${spec}'`);
  console.error('\n  These resolve under a bundler but not under Node ESM, so they break consumers’ unit tests.');
}

if (failed) {
  console.error(`\nChecked ${files.length} files — import hygiene FAILED.\n`);
  process.exit(1);
}

console.log(`✓ Import hygiene OK — ${files.length} files, no cycles, no god-module imports, no deep package imports.`);
