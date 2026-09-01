# Angular 21 → 22 upgrade — progress log

Working branch: `chore/angular-22-upgrade`
Plan: [`plan.md`](./plan.md)

Status key: ✅ done · 🚧 in progress · ⏸️ blocked / awaiting review · ⬜ not started

| Phase | Scope | Status |
|---|---|---|
| 0 | Baseline + toolchain consolidation (still on Angular 21) | ✅ |
| 1 | Node + TypeScript 6.0 | ✅ |
| 2 | Angular 22 | ⏸️ next |
| 3 | Library packaging & published metadata | ⬜ |
| 4 | CI | ⬜ |

---

## ▶ Resume here

**Last session ended:** 2026-09-01. Phase 1 complete, **not yet committed** — working tree carries
the Phase 1 diff (9 files) plus a new untracked `.nvmrc` and the untracked `CLAUDE.md` that
predates this work.

Running on **TypeScript 6.0.3 + Angular 21.2.19**, all six targets green with counts unchanged
from the Phase 0 baseline. The accordion teardown race was **kept as a follow-up** by decision,
not fixed.

**Next: Phase 2 — Angular 22.** Before starting, note two things Phase 1 established:

1. **The TS 6 peer conflict is expected and resolves itself in Phase 2.** `@angular/build@21.2.20`
   and `ng-packagr@21.2.7` both pin `typescript: ">=5.9 <6.0"`, so `npm install` warns
   (`Could not resolve dependency: peer typescript@">=5.9 <6.0"`). It is a warning, not an error —
   the install succeeded and every target is green. `@angular/compiler-cli@21.2.19` already accepts
   `>=5.9 <6.1`. The v22 packages pin `>=6.0 <6.1`, so the warning disappears once Angular is bumped.
   **Do not "fix" it by downgrading TypeScript.**
2. `baseUrl` is gone from the root `tsconfig.json`, so **no file can use a workspace-root-relative
   specifier any more** (`from 'projects/rlb/...'`). Anything reaching into the library must use the
   `@open-rlb/ng-bootstrap` alias. If an `ng update` migration writes such a path, it will not resolve.

**Baseline to compare against** (all exit 0 on TS 6 + Angular 21):
`test-ci` 7 files / 8 tests · `lib:test-ci` 2 files / 2 tests · `lib:build` · `lib:test:ng-add` ·
`build:docs` · `lib:pack`. Watch the counts, not just exit codes — uncompilable specs vanish from
the count instead of failing.

---

## Phase 0 — Baseline + toolchain consolidation

### Recorded baseline (Angular 21.2.19, TypeScript 5.9.3, Node v24.16.0)

Measured on the unmodified `develop` tree before any change. This is the "before" picture.

| Command | Exit code | Reality |
|---|---|---|
| `npm run lib:build` | **0** | Green. Library + schematics build cleanly. |
| `npm test` | **1** | **Fails.** 5 compile errors, yet the Vitest summary prints `2 passed (2)`. |
| `npm run lib:test-ci` | **1** | **Fails instantly:** `Error: Unknown argument: karma-config`. |

#### `npm test` — the summary lies

Vitest reports `Test Files 2 passed (2)` while the process exits 1. The two files that pass are the
*library* specs (`rlb-form-fields`, `unique-id.service`) — the demo app's own specs never compile,
so they are silently absent from the count rather than reported as failures.

Root cause: the demo app project has `"root": ""`, so the `unit-test` builder's default include glob
resolves against the workspace root and sweeps `projects/` as well. The two projects' test runs overlap.

Pre-existing compile errors, none related to Angular 22:

1. `src/app/demo/demo.component.html:7` — `NG8004: No pipe found with name 'json'` (`JsonPipe` not imported)
2. `src/app/demo/demo.component.html:10` — `NG8002: Can't bind to 'ngModel'` (`FormsModule` not imported)
3. `src/app/demo/demo.component.ts:18` — `TS2416: Property 'data'` declared `ModalData<any>` but
   `IModal` now requires `Signal<ModalData<any>>` — stale against a signal migration of `IModal`
4. `src/app/pages/home/home.component.spec.ts:2-3` — imports `'../inputs/home.component'`, which does not exist
5. `src/app/app.component.spec.ts:7` — `declarations: [AppComponent]` on a standalone component

#### `npm run lib:test-ci` — never worked

`ng test --karma-config=./karma.conf.js` — the `@angular/build:unit-test` builder has no `karmaConfig`
option (verified against `node_modules/@angular/build/src/builders/unit-test/schema.json`; it exposes
`runnerConfig`). This is the script the GitLab CI `test` stage runs, so that stage has been failing.

#### Dead configuration confirmed

`runner` defaults to `vitest` and **`runnerConfig` defaults to `false`**. Neither `test` target in
`angular.json` sets it, so these four checked-in files are never loaded by `ng test`:

- `vitest.config.mts`
- `projects/rlb/ng-bootstrap/vitest.config.mts`
- `src/test-setup.ts`
- `projects/rlb/ng-bootstrap/src/test-setup.ts`

That last pair calls `setupZoneTestRunner()`, which contradicts the zoneless app — but it has never run.

### Work items

- [x] Create branch `chore/angular-22-upgrade`
- [x] Record baseline exit codes and errors (above)
- [x] Configure `include` + `providersFile` on both `angular.json` test targets
- [x] Delete the four bogus test-config files (see "The config was worse than dead")
- [x] Replace zone test setup with zoneless `providersFile` for both projects
- [x] Rewrite `lib:test-ci` without `--karma-config`; add a matching `test-ci`
- [x] Delete `karma.conf.js`; drop `karma*`, `jasmine-core`, `@types/jasmine`,
      `@angular-devkit/build-angular`, `@vitest/browser` (**502 packages removed**)
- [x] Switch both `tsconfig.spec.json` from `types: ["jasmine"]` to `["vitest/globals"]`
- [x] Separate the two spec `outDir`s, which both resolved to `out-tsc/spec`
- [x] Fix every pre-existing compile error and test failure
- [x] Delete dead code: `src/app/app.module.ts`, `src/app/demo/`
- [x] All targets green, still on Angular 21
- [x] Commit — `8c28184`

### Notes / decisions

- **Peer range will be `>=22.0.0 <23.0.0`, not `>=21 <23`.** Angular's partial-compilation linker is
  forward-compatible only: a v22-built artifact cannot be linked by a v21 consumer. Advertising `>=21`
  would convert an install-time incompatibility into a link-time crash inside consumer builds.
- The demo app's `DemoComponent` errors show `IModal` already moved to signal-based `data`. The demo
  was never updated because these specs have never compiled. Fixing them is in scope for Phase 0
  because they are the baseline gate, not because the upgrade requires it.

---

## Phase 0 result

All targets green on **Angular 21**, which is the baseline the upgrade needs.

| Command | Before | After |
|---|---|---|
| `npm run lib:build` | 0 | **0** |
| `npm run lib:test-ci` | 1 — `Unknown argument: karma-config` | **0** — 2 files, 2 tests |
| `npm run test-ci` (new) | n/a — demo specs never compiled | **0** — 7 files, 8 tests |
| `npm run lib:test:ng-add` | not run | **0** |
| `npm run build:docs` | not run | **0** |
| `npm run lib:pack` | not run | **0** — schematics + 7 skills verified in tarball |

### The config was worse than dead

`@angular/build` exposes only `.`, `./private` and `./package.json` — there is **no `@angular/build/vitest`
subpath**. Both `vitest.config.mts` files and both `test-setup.ts` files imported
`angularVitestPlugin` / `setupZoneTestRunner` from it, so they would have thrown on load had anything
loaded them. They were not merely unwired; they were copy-pasted from a different Angular version and
had never been executable. All four were deleted rather than repaired.

Replaced with native builder options, which cover the same ground:
- `include` — scopes each project's specs. The demo app has `"root": ""`, so the default glob was
  sweeping `projects/` too and both projects were running each other's specs.
- `providersFile` — `src/test-providers.ts` and `projects/rlb/ng-bootstrap/src/test-providers.ts`,
  each exporting `provideZonelessChangeDetection()`. This is what finally aligns the test environment
  with the zoneless app, replacing the `setupZoneTestRunner()` that had contradicted it on paper.

⚠️ **The `include` option is documented as "relative to the project root" but actually resolves against
`sourceRoot`.** `src/**/*.spec.ts` matched nothing for the library; `**/*.spec.ts` works. Worth knowing
before Phase 2 — if v22 corrects this to match the docs, these globs must be revisited.

⚠️ `providersFile` must also be listed in the spec `tsConfig`'s `include`, or the build fails with
`File '…test-providers.ts' not found in TypeScript compilation`. Both spec tsconfigs were updated.

### Pre-existing defects found and fixed

None of these were caused by the upgrade; all were latent behind specs that never compiled.

1. `src/app/pages/home/home.component.spec.ts` imported `'../inputs/home.component'` — the component
   sits next to it at `'./home.component'`.
2. Six specs used `declarations: [X]` on standalone components.
3. `src/app/app.component.spec.ts` asserted the stock CLI string `'ng-bootstrap app is running!'`
   against `.content span`, which the template has not contained for a long time. Assertion dropped;
   `provideRouter([])` added so the component can instantiate.
4. Docs page specs failed with `Highlight.js library was not imported!` — `provideHighlightOptions`
   is in `app.config.ts` but was absent from the test environment. Now in `src/test-providers.ts`.

### Dead code removed

- `src/app/app.module.ts` — unreachable from `src/main.ts` (`bootstrapApplication`). Removed
  `BrowserModule`, `BrowserAnimationsModule` and `HttpClientModule` from the compilation in one step.
- `src/app/demo/` (4 files) — `DemoComponent` had **zero references** anywhere in the repo, and its
  `IModal` implementation was stale (non-signal `data`), which was one of the original 5 compile
  errors. `ModalSampleComponent` is the live modal sample, registered as `'sample-dialog'`. Redundant.

**Correction to the plan:** the plan said to delete `src/app/routing.module.ts` as dead. It is not —
`src/app/app.config.ts:17` imports its `routes` const. Only the `RoutingModule` class and its
`RouterModule.forRoot` were dead; those were stripped and `routes` kept. `RoutingComponentsModule`
and `RoutingInputsModule` are live `loadChildren` targets and were left alone.

### Open finding — not fixed, out of scope

`ToggleAbstractComponent.ngOnDestroy` disposes its Bootstrap instance correctly, but Bootstrap's
own `transitionend`/`emulateTransitionEnd` callback can still be queued at that moment. It then
dereferences the element Bootstrap nulled during `dispose()`:

```
TypeError: Cannot read properties of null (reading 'classList')
  at collapse.js:151  ←  triggerTransitionEnd → util/index.js:71
```

Reproduced by tearing down `AccordionsComponent` mid-transition. Worked around in
`accordions.component.spec.ts` by letting the ~350ms transition settle before `fixture.destroy()`.
The underlying race is real in the browser too, just far less likely to be observed.

A proper fix belongs in `projects/rlb/ng-bootstrap/src/lib/components/abstract/toggle-abstract.component.ts`
— cancel or guard pending transition callbacks before `dispose()`. Deliberately **not** done here:
it is a library behavior change, and this phase is meant to establish a baseline, not alter runtime
behavior. Related smell spotted in the same file: `ngAfterContentChecked` calls `show()`/`hide()` on
*every* check while `status` is `'show'`/`'hide'`, rather than only on transition.

### Still to do in Phase 2 (deliberately deferred)

`provideAnimations()` at `src/app/app.config.ts:26` and the `@angular/animations` +
`@angular/platform-browser-dynamic` dependencies are still present. Removing them is plan step 12.

---

## Phase 1 — Node + TypeScript 6.0 ✅

Ran on Node v24.16.0, **TypeScript 5.9.3 → 6.0.3**, Angular untouched at 21.2.19.
`typescript@6.0.3` is the newest 6.0.x on the registry (7.0.2 is latest overall, irrelevant here —
Angular 22 pins `>=6.0 <6.1`).

### Work items

- [x] Add `engines` `"node": "^22.22.3 || ^24.15.0 || >=26.0.0"` to root `package.json`
- [x] Add `.nvmrc` (`24.16.0`) — matches the local toolchain and satisfies Angular 22's range
- [x] Bump `typescript` `~5.9.3` → `~6.0.3`
- [x] `tsconfig.schematics.json` — `moduleResolution: "node"` → `node16` (and `module` with it)
- [x] Root `tsconfig.json` — drop `experimentalDecorators`, drop `baseUrl`
- [x] Fix the fallout `baseUrl` removal exposed (below)
- [x] Full six-command sweep green, counts identical to the Phase 0 baseline

### `module` had to move with `moduleResolution`

TypeScript rejects `moduleResolution: "node16"` alongside `module: "commonjs"` — the two must agree.
So `tsconfig.schematics.json` is now `module: "node16"` + `moduleResolution: "node16"`.

**This does not change the emitted format.** Under `node16`, TypeScript picks the module format from
the nearest `package.json` to the *source*, which is `projects/rlb/ng-bootstrap/package.json` — it has
no `"type"` field, so CommonJS is the default. Verified on the built output:

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ngAdd = ngAdd;
const core_1 = require("@angular-devkit/core");
```

`lib:pack` → `verify-pack.cjs` still passes, so the `{"type":"commonjs"}` marker
(`schematics/package.json`) that lets `ng add` load these files survives.

### Removing `baseUrl` broke `build:docs` — and that was the point

`baseUrl: "./"` was letting four demo-app files import the library by **workspace-root-relative path**
instead of the alias. With `baseUrl` gone, `build:docs` failed with nine
`Could not resolve "projects/rlb/ng-bootstrap/..."` errors.

The demo app was already inconsistent before this: **6 files on `@open-rlb/ng-bootstrap`, 4 on
`projects/rlb/...`**. Both spellings resolve to the same file — `tsconfig.json` maps the alias to
`./projects/rlb/ng-bootstrap/src/public-api.ts` — so this was purely a spelling split. All nine
imports now use the alias, which is the entry point `CLAUDE.md` documents.

| File | Was | Now |
|---|---|---|
| `src/app/app.config.ts` | `projects/…/src/public-api` | `@open-rlb/ng-bootstrap` |
| `src/app/pages/components/modals/modal-sample.component.ts` | 2 imports (public-api + deep) | 1 import |
| `src/app/pages/components/toasts/toasts-sample.component.ts` | `projects/…/src/public-api` | `@open-rlb/ng-bootstrap` |
| `src/app/pages/components/calendar/calendar.component.ts` | 5 deep imports | 1 import |

Nothing published is affected — `src/` is the demo app and is not in the tarball, which contains only
`fesm2022/`, `types/`, `assets/`, `schematics/`, `README.md`, `package.json`. Audited at the same time:
the library source and the schematic templates contain **zero** workspace-alias or `projects/…`
specifiers, so the "workspace path leaks into shipped code" failure mode does not exist here.

### Public-API gap the reach-in was hiding ⚠️ library change

Three of the calendar's own input/output types were **never exported from the package**:

```ts
view       = model<CalendarView>('week', { alias: 'view' });
layout     = input<Partial<CalendarLayout>>({}, { alias: 'layout' });
dateChange = output<CalendarChangeEvent>({ alias: 'date-change' });
```

A consumer could not type a `(date-change)` handler. The demo never noticed because `baseUrl` let it
reach into `src/lib/` directly. Fixed by exporting the two interface files from the calendar barrel
(`src/lib/components/calendar/index.ts`):

```ts
export * from './interfaces/calendar-layout.interface';
export * from './interfaces/calendar-view.type';
```

Adds four names — `CalendarView`, `CalendarLayout`, `CalendarChangeEvent` (types, zero runtime) and
`DEFAULT_CALENDAR_LAYOUT` (a const). Purely **additive**; nothing renamed or removed. This is the only
Phase 1 change that reaches consumers.

### `getToday` — one call the alias could not reach

`src/app/pages/components/calendar/calendar.component.ts` imported `getToday` from the calendar's
internal `utils/calendar-date-utils`, which is not on the public API. Rather than widen the surface
further, the two live call sites now use the library's own one-line implementation directly:

```ts
export function getToday(timezone?: string): DateTz {
  return DateTz.now(timezone ?? getBrowserTimezone());
}
```

The demo always passes `this.timezone`, so `DateTz.now(this.timezone)` is exactly equivalent.
`DateTz` was already imported in that file.

### Verified green on TS 6.0.3 + Angular 21

| Command | Exit | Counts |
|---|---|---|
| `npm run lib:build` | **0** | — |
| `npm run test-ci` | **0** | 7 files, 8 tests |
| `npm run lib:test-ci` | **0** | 2 files, 2 tests |
| `npm run lib:test:ng-add` | **0** | all schematic assertions |
| `npm run lib:pack` | **0** | CJS marker + 7 skills in tarball |
| `npm run build:docs` | **0** | — |

Identical to the Phase 0 baseline. A red run from here on points at Angular 22, nothing else.

### Non-issues, checked and dismissed

- **`noUncheckedSideEffectImports` (now defaults `true`)** — the repo has **zero** bare side-effect
  imports (`grep "^import '"` across `src` and `projects` returns nothing). No exposure.
- **`types` now defaults to `[]`** — every leaf tsconfig already sets `types` explicitly. Nothing
  relied on ambient auto-inclusion.
- **`tsconfig.lib.json` path aliases** (`@shared/*`, `@/*`, `~/*`) — the latent bug is real: they
  resolved against the workspace root, and removing `baseUrl` silently repointed them at the library
  folder. It changed nothing because **they are unused** (verified by grep). See follow-ups.

### Follow-ups logged in Phase 1

1. **Accordion teardown race** — decided: keep as a follow-up, not fixed. See the Phase 0
   *Open finding* for the reproduction and the intended fix.
2. **The calendar docs snippet is wrong.** `calendar.component.ts:62` renders
   `import { DateTz, getToday } from '@open-rlb/date-tz';` to users, but `@open-rlb/date-tz` does not
   export `getToday` — it is the library's own helper. The `default: 'getToday()'` API-table entry
   (line 130) has the same problem. Pre-existing; untouched to keep Phase 1 scoped.
3. **Delete the unused `@shared/*`, `@/*`, `~/*` aliases** from `tsconfig.lib.json:10-14`. They have
   no consumers and only exist to be misconfigured.
4. **TS 6 peer warning from `@angular/build@21` / `ng-packagr@21`** — expected, resolves in Phase 2.
