/**
 * The single interop point for Bootstrap's JavaScript plugins. Import Bootstrap through this
 * module, never straight from `'bootstrap'`.
 *
 * Bootstrap 5 ships no `exports` map. Its `main` is a CJS/UMD bundle and its `module` is an ESM
 * bundle that has named exports but *no default export*, so the two resolvers are mirror images:
 *
 *   - A bundler (esbuild, Vite) picks `module`. Named imports work; a default import is `undefined`.
 *   - Node's ESM loader picks `main`. Its lexer cannot see names through the UMD wrapper, so a
 *     named import is a link-time `SyntaxError`; only the default export is reachable.
 *
 * A namespace import is the one form both accept — under Node it yields `{ default, 'module.exports' }`,
 * under a bundler the real ESM namespace — so unwrapping `.default` when present covers both.
 *
 * Deep paths such as `bootstrap/js/dist/collapse.js` would also work under both, but they are a
 * *different copy* of the code: `dist/js/bootstrap.js` inlines its own instance registry and shares
 * nothing with `js/dist/*`. A consumer doing `import { Modal } from 'bootstrap'` would then hold a
 * different class with a different registry, and `getInstance()` would not see our instances.
 * Keeping the bare specifier is what guarantees one shared copy.
 */
import * as bootstrapNamespace from 'bootstrap';

const bootstrap =
  (bootstrapNamespace as { default?: typeof bootstrapNamespace }).default ?? bootstrapNamespace;

export default bootstrap;
