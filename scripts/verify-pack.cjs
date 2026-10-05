// Asserts what the packed tarball must contain, none of which the build itself would notice:
// schematics/package.json — the `{"type":"commonjs"}` marker that lets `ng add` load the CommonJS
// schematics under the package's `"type": "module"` (`npm pack` silently strips nested
// package.json files); the bundled Claude skills; and every file a shipped stylesheet's url()
// points at. Run after `npm pack`.
const { execSync } = require('node:child_process');
const { existsSync, mkdirSync, readFileSync, rmSync } = require('node:fs');
const path = require('node:path');

const pkg = require(path.join(__dirname, '..', 'dist', 'rlb', 'ng-bootstrap', 'package.json'));
const tarball = `${pkg.name.replace('@', '').replace('/', '-')}-${pkg.version}.tgz`;

if (!existsSync(tarball)) {
  console.error(`✗ Tarball not found: ${tarball}. Run \`npm pack ./dist/rlb/ng-bootstrap\` first.`);
  process.exit(1);
}

const entries = execSync(`tar -tzf "${tarball}"`, { encoding: 'utf8' });
if (!entries.includes('package/schematics/package.json')) {
  console.error(`✗ ${tarball} is missing schematics/package.json (the CommonJS marker).`);
  console.error('  ng add would fail: the CJS schematics load as ESM under "type":"module".');
  process.exit(1);
}

// The bundled skills are the whole point of the sync-skills schematic: consumers re-run it from
// their postinstall to pick up skill updates. If they silently stop shipping, sync-skills becomes
// a no-op and nobody finds out until the guidance is stale.
const skillFiles = entries
  .split('\n')
  .filter(entry => entry.startsWith('package/schematics/sync-skills/claude-skills/'));
if (skillFiles.length === 0) {
  console.error(`✗ ${tarball} is missing schematics/sync-skills/claude-skills/.`);
  console.error(
    '  sync-skills would copy nothing. Build with `npm run lib:build`, not `ng build`.',
  );
  process.exit(1);
}

// Every relative url() in a shipped stylesheet must point at a file that ships too. Angular's
// CSS resource plugin resolves them when the *consumer* builds, so a dangling one is a hard
// `Could not resolve` error in their app — while the docs site, which compiles the Sass from the
// source tree, still finds the file and builds fine. 5.0.1 shipped exactly that: Sass pointing at
// images and fonts the package no longer contained.
const stylesheets = entries
  .split('\n')
  .filter(entry => entry.startsWith('package/') && /\.(s?css)$/.test(entry));
const shipped = new Set(entries.split('\n').map(entry => entry.trim()));
// Relative, like the archive below: on Windows, Git's GNU tar mangles an absolute `C:\…` path for
// -C as well as for -f. dist/ is the build output and already ignored.
const extractDir = path.join('dist', '.verify-pack');
const dangling = [];
let urlCount = 0;
try {
  rmSync(extractDir, { recursive: true, force: true });
  mkdirSync(extractDir, { recursive: true });
  // The archive by relative name, as above: GNU tar reads a `D:\…` archive path as a remote host.
  execSync(`tar -xzf "${tarball}" -C "${extractDir}"`);
  for (const entry of stylesheets) {
    const source = readFileSync(path.join(extractDir, entry), 'utf8')
      // Comments first, so a url() someone commented out is not checked. A `//` only opens a
      // comment at the start of a line or after whitespace — not inside `https://` or `url("//…")`.
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|\s)\/\/.*$/gm, '$1');
    for (const match of source.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/g)) {
      const target = match[2].trim();
      // Not a file in the package: inline data, another origin, a fragment, or something only the
      // consumer's build can resolve (Sass interpolation, a variable, a root-relative path).
      if (/^(data:|https?:|\/|#)/i.test(target) || /#\{|\$|var\(/.test(target) || !target) continue;
      urlCount++;
      const file = target.replace(/[?#].*$/, '');
      const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(entry), file));
      if (!shipped.has(resolved)) dangling.push(`${entry.replace(/^package\//, '')}: url(${target})`);
    }
  }
} finally {
  rmSync(extractDir, { recursive: true, force: true });
}
if (dangling.length > 0) {
  console.error(`✗ ${tarball} ships stylesheets whose url() points at files it does not ship:`);
  for (const line of dangling) console.error(`  ${line}`);
  console.error('  A consumer importing them fails to build with `Could not resolve`.');
  process.exit(1);
}

console.log(`✓ ${tarball} retains schematics/package.json — ng add will load correctly.`);
console.log(`✓ ${tarball} ships ${skillFiles.length} Claude skill file(s) for sync-skills.`);
console.log(
  `✓ ${tarball}: ${stylesheets.length} stylesheet(s), ${urlCount} relative url() — none points outside the package.`,
);
