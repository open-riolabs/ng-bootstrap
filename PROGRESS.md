# Angular 21 → 22 upgrade — progress log

Working branch: `chore/angular-22-upgrade`
Plan: [`plan.md`](./plan.md)

Status key: ✅ done · 🚧 in progress · ⏸️ blocked / awaiting review · ⬜ not started

| Phase | Scope | Status |
|---|---|---|
| 0 | Baseline + toolchain consolidation (still on Angular 21) | ✅ |
| 1 | Node + TypeScript 6.0 | ✅ |
| 2 | Angular 22 | ✅ |
| 3 | Library packaging & published metadata | ✅ |
| 4 | CI | ✅ |

---

## ▶ Resume here

**Last session ended:** 2026-09-01. **All five phases complete.** The upgrade is done on
`chore/angular-22-upgrade`; nothing has been pushed or merged.

Running on **Angular 22.1.4 / CLI 22.1.6 / TypeScript 6.0.3**. Six targets green from a clean
`npm ci`, a browser pass over the Bootstrap-JS components, and a full `ng add` + build against a
real Angular 22 consumer app.

**Before merging:**

1. The workflows are reviewed, not executed — the first run on `master` is the real test. Highest
   risk is `npm install` → `npm ci` (checked locally, exits 0) and the removal of the
   `node_modules` artifact. `versioning` was left untouched on purpose.
2. `CLAUDE.md` is **untracked** — its Phase 3 corrections exist on disk but in no commit, so they
   vanish on a fresh clone. Decide whether to track it.
3. Consumers cannot take this release until they are on Angular 22 themselves — verified: `ng-app`
   is still on Angular 21 / TypeScript 5.9.2, and its `@open-rlb/date-tz ^2.0.5` is below the new
   `>=2.1.1` floor. This is the forward-only linker constraint working as designed, not a defect.

The follow-up list lives at the end of [`plan.md`](./plan.md).

**Baseline** (all exit 0 on Angular 22 + TS 6):
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

---

## Phase 2 — Angular 22 ✅

**Angular 21.2.19 → 22.1.4**, CLI 21.1.5 → 22.1.6, CDK → 22.1.4, ng-packagr → 22.1.1,
`@schematics/angular` → 22.1.6. TypeScript stayed at 6.0.3 from Phase 1.

### Work items

- [x] `ng update @angular/core@22 @angular/cli@22 @angular/cdk@22`
- [x] Review every automated migration diff (below)
- [x] Bump the packages `ng update` left behind — `@schematics/angular` was still on `^21.1.5`
- [x] Drop `@angular/animations` and `@angular/platform-browser-dynamic`
- [x] Re-check the `angular.json` `include` globs (unchanged, see below)
- [x] Full sweep green, counts identical to the Phase 0/1 baseline
- [x] Browser pass over the Bootstrap-JS-backed components

### The TS 6 peer conflict became a hard error, so the CLI skew was skipped

Plan step 9 said to reconcile the CLI (`~21.1.2`, resolving 21.1.5) against `@angular/build`
(floated to 21.2.20) *before* updating. That turned out to be impossible: on TS 6 + Angular 21,
`npm i -D @angular/cli@~21.2` fails with

```
npm error Conflicting peer dependency: typescript@5.9.3
npm error   peer typescript@">=5.9 <6.0" from @angular/build@21.2.20
```

Phase 1's warning becomes an **error** for any *new* install, because npm re-resolves the tree.
Going straight to 22 was the way through — `ng update` resolved CLI and build together, and the
conflict disappeared once every package was on v22. Nothing needed `--legacy-peer-deps`.

`ng update` also refuses to run on a dirty tree, and counts the untracked `CLAUDE.md` as dirty.
Used `--allow-dirty` rather than committing a file that predates this work.

### The `Eager` stamping was reverted — 52 files, 6000 lines of churn

`ng update` stamped `changeDetection: ChangeDetectionStrategy.Eager` onto every component without an
explicit strategy: **50 demo-app files and 2 library files**
(`shared/empty-anchor.component.ts`, `shared/wrapped.component.ts`).

Worse, the migration **reformatted every file it touched** with its own printer. That is where 6024
insertions / 3835 deletions came from — `autocomplete.component.ts` alone reflowed 410 lines. It is
not the repo's style either: checked with `npx prettier --check`, and neither the original nor the
migrated file is Prettier-clean, so the churn buys nothing.

All 52 stamp-only files were reverted with `git checkout HEAD --`, which removes the stamp *and* the
reformatting in one step. Since **OnPush is the default in v22**, reverting is what actually lands
these components on OnPush — keeping the stamp would have opted them back into the old behavior, and
would have shipped two non-OnPush components in the published library, against its own convention.

Low risk here specifically because the app is zoneless: nothing triggers a change-detection pass
spontaneously, so a component relying on `Eager` traversal would already be broken today.

The diff after reverting is 9 files, and readable.

### Duplicate `viewChange` output on the calendar ⚠️ decision

`ng update`'s "migrate broken duplicate outputs" fired on the library's `calendar.component.ts`.
The cause is genuine: `view = model({ alias: 'view' })` generates an implicit `viewChange` output,
and line 65 declared an explicit `viewChange = output({ alias: 'view-change' })` — the same class
property name. v21 tolerated it; v22 rejects it. Note `currentDate` + `dateChange` already avoid
this by not sharing a property name, and there is a commented-out `// currentDateChange = output(...)`
in the same file showing someone hit this before.

Angular's automatic fix rewrote `view` into an `input()` plus a `linkedSignal`, which **silently drops
`[(view)]`** — documented as two-way in the demo API table and used in **4 places in the shipped skill**
`.claude/skills/rlb-calendar/SKILL.md`, which lands in consumer projects.

**Decision: preserve the public API instead.** Reverted the migration and renamed only the explicit
output property:

```ts
view = model<CalendarView>('week', { alias: 'view' });                     // unchanged
viewChangeEvent = output<CalendarChangeEvent>({ alias: 'view-change' });   // was: viewChange

setView(view: CalendarView) {
  this.view.set(view);
  this.viewChangeEvent.emit({ date: this.currentDate(), view });
}
```

The template-facing surface is **identical** — input `view`, two-way `[(view)]`, output `view-change`.
Only an internal property name changed, and `view` is now symmetric with how `currentDate`/`dateChange`
already work. Verified both ways: `build:docs` compiles with the demo template switched to `[(view)]`,
and clicking the view switcher in the browser logs `view change {date: DateTz, view: month}`.

### Other migrations, kept

- **`provideHttpClient()` → `provideHttpClient(withXhr())`** in the demo's `app.config.ts`. Preserves
  pre-v22 behavior (v22 defaults to fetch). Demo-only; the library never calls `HttpClient`.
- **`extendedDiagnostics` suppression** for `nullishCoalescingNotNullable` and `optionalChainNotNullable`
  added to all five tsconfigs. This is the official migration preserving pre-v22 diagnostics. Re-enabling
  them and fixing what they flag is a follow-up, not a version-bump task.

### `@angular/animations` and `@angular/platform-browser-dynamic` removed

Re-verified before removing, not just taken from the plan: zero `trigger(`/`animate(`/`state(`/
`transition(`/`keyframes(` calls, zero `@angular/animations` imports, no `platformBrowserDynamic()`,
no `bootstrapModule()`. The only reference was `provideAnimations()` at `app.config.ts:8,30`, now
deleted. Both packages are npm-deprecated, so this clears a v23 landmine at zero cost.

### The `include` globs did not need revisiting

Phase 0's ⚠️ finding was that `include` resolves against `sourceRoot` rather than the documented
project root, and that a v22 fix would break both globs. **v22 did not change this** — both projects
report the same counts as before (7 files / 8 tests, 2 files / 2 tests). Since the failure mode is
`No tests found` rather than a compile error, the counts are the only thing that proves it.

### Verified green on Angular 22.1.4 + TS 6.0.3

| Command | Exit | Counts |
|---|---|---|
| `npm run lib:build` | **0** | — |
| `npm run test-ci` | **0** | 7 files, 8 tests |
| `npm run lib:test-ci` | **0** | 2 files, 2 tests |
| `npm run lib:test:ng-add` | **0** | all schematic assertions |
| `npm run lib:pack` | **0** | CJS marker + 7 skills in tarball |
| `npm run build:docs` | **0** | — |

`scripts/test-ng-add.cjs` still passes, so v22 did not change the generated-app shape it hardcodes.

### Browser pass — the Bootstrap JS coupling

`npm start` on 4201, **zero console errors** across every page visited and every interaction.

| Exercised | Result |
|---|---|
| Modal via `ModalService` — open, edit, close | ✓ round-trip logged `{reason: ok, result: …}` |
| Calendar — generate events, overlap layout, `+N more` overflow, timezone conversion | ✓ |
| Calendar view switcher (Bootstrap dropdown + the renamed output) | ✓ logged `view change {date, view: month}` |
| Accordion / Collapse — `statusChange` lifecycle | ✓ count 0 → 2 (show + shown) |
| Popover — click to open | ✓ renders (see warning below) |
| Pages loading clean | home, accordions, carousels, modals, toasts, dropdowns, offcanvass, tooltips, calendar, inputs/autocomplete, inputs/select |

**Not covered by this pass, still worth a human look:** calendar drag-and-drop (the only
`@angular/cdk/drag-drop` consumer), scrollspy, navbar dropdowns, and actually opening an offcanvas.

### ⚠️ New in v22: `popover` is now a native HTML attribute

The tooltips page logs five warnings:

```
Found a 'popover' attribute with an invalid value.   (@angular/platform-browser)
```

`PopoverDirective` uses selector `[popover]` with `popover = input<string>({ alias: 'popover' })`, so
consumers write `popover="Some content"`. v22 now recognises `popover` as the **native** HTML attribute,
whose only valid values are `auto` / `manual` / `hint` / empty, and warns on anything else.

**Not broken** — verified in the browser: the trigger stays visible and the popover opens correctly.
But every consumer using popovers will now see console warnings. Renaming the selector would be a
breaking API change, so it is out of scope for a version bump. Logged as a follow-up.

---

## Phase 3 — Library packaging and published metadata ✅

Everything the library *advertises* now says Angular 22. No library code changed except one stale
comment; this phase is entirely about what consumers see.

### Work items

- [x] Peer ranges → `>=22.0.0 <23.0.0` for `@angular/{cdk,common,core,forms,router}`
- [x] `ng-add` schematic: `@angular/cdk` `^21.0.0` → `^22.0.0`; `bootstrap-icons` `^1.11.0` → `^1.13.1`
- [x] Reconcile the three-way `@open-rlb/date-tz` drift
- [x] Fix both READMEs
- [x] Fix `CLAUDE.md` — the Angular version *and* the i18n claim
- [x] Fix the stale version claims in the bundled skills (not in the original plan)
- [x] Verify the changes reached the built artifact, not just the source

### `date-tz`: raised the floor rather than lowering it

The floor was stated three different ways — `>=2.0.1` (root `package.json:44`, `README.md:59`),
`>=2.1.1` (library peer), `^2.1.1` (schematic) — invisible in-workspace because 2.1.4 was installed.

Unified on **2.1.1**, raising the two that said `2.0.1`. Lowering the peer to `2.0.1` instead would
have been the wrong direction: it would let an install succeed that the peer check then rejects.
Range *shapes* were deliberately left alone — `>=` in the peer deps, `^` in the schematic. The plan
said reconcile the floor, and turning the peer into `^2.1.1` would additionally cap it below 3.0,
which is a real semantic change nobody asked for.

### The root README was worse than the plan recorded

The plan listed two problems. There were five:

| Line | Was | Now |
|---|---|---|
| 28 | "**Angular 20+** compatible" feature bullet | Angular 22 |
| 64 | "requires Angular 20+" | requires Angular 22 (`>=22.0.0 <23.0.0`) |
| 67 | `npm install @angular/core@^20.1.0 …` — unsatisfiable against the peer range | `^22.0.0` |
| 188 | Prerequisites: "Node.js (v18 or higher)" | `^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0` |
| 190 | Prerequisites: "Angular CLI 20+" | Angular CLI 22+ |

Also added `@angular/cdk` to the install snippet — it is a peer dependency and the README never
mentioned it — and a note that Angular's linker is forward-compatible only, which is *why* v21
applications have to stay on a v21-built release rather than just installing the latest.

### The bundled skills were stale too — and they ship

Not in the original plan, and they matter more than the READMEs because `ng add` / `sync-skills`
copies them into consumer projects, where they become the guidance Claude follows:

- `.claude/skills/rlb-components/SKILL.md:8` — "All components use Angular 18+ signals"
- `.claude/skills/rlb-inputs/SKILL.md:8` — "They use Angular 18+ signals"

Both now state the actual requirement instead of the version an API first appeared in. Also dropped
a "Modern Angular 21 syntax" comment in `autocomplete-country.component.ts:90`.

### The i18n correction — checked, not assumed

`CLAUDE.md` claimed the library "does not depend on a concrete translation implementation in code
paths that translate at runtime". Verified against the source, and it is false:

- `rlb-bootstrap.module.ts:6` imports `TranslateModule`
- `rlb-form-fields.component.ts:17` imports `TranslatePipe`, used 5× in its template
- both are re-exported from `public-api.ts`, so a consumer cannot avoid them
- `RLB_TRANSLATION_SERVICE` is honored in exactly one file — `input-validation.component.ts`

So `@ngx-translate/core` is a hard peer dependency. The library's `package.json` already had this
right (it is *not* in `peerDependenciesMeta`); only the prose was wrong. Rewritten to describe the
abstraction as the direction of travel rather than a property the library already has.

### Verified in the artifact, not just the source

Source edits are not the deliverable here — what `npm publish` would upload is.

```
dist/rlb/ng-bootstrap/package.json      →  "@angular/core": ">=22.0.0 <23.0.0"  (all five)
dist/…/schematics/ng-add/index.js       →  '@angular/cdk', version: '^22.0.0'
                                           'bootstrap-icons', version: '^1.13.1'
tarball package/README.md               →  "Requires **Angular 22**"
```

Full sweep green with counts unchanged: `lib:build`, `test-ci` (7 files / 8 tests), `lib:test-ci`
(2 / 2), `lib:test:ng-add`, `lib:pack`, `build:docs`.

### Verified as a real consumer — the only test of the peer ranges

The plan flags this as the one thing that actually exercises the peer ranges and schematic pins,
and Phase 3 is exactly the phase that changed them. Ran the whole flow against a scratch app:

```bash
npx @angular/cli@22 new scratch-app --defaults      # real v22 app: core ^22.0.0, cli ^22.0.1
npm run lib:pack                                    # in this repo
npx ng add ../lib.tgz --skip-confirmation           # in the scratch app
```

`ng add` completed with exit 0 and did everything it advertises:

| Check | Result |
|---|---|
| `@angular/cdk` installed at a v22-compatible version | ✅ resolved **22.1.4** (from the new `^22.0.0` pin) |
| `bootstrap-icons` pin | ✅ `^1.13.1`, matching root — the drift is gone |
| `@open-rlb/date-tz` pin | ✅ `^2.1.1`, matching the unified floor |
| Bootstrap + Bootstrap Icons styles in `angular.json` | ✅ |
| `provideRlbBootstrap()` in the app providers | ✅ |
| Starter component scaffolded | ✅ `src/app/rlb-starter/` |
| `.claude/skills` synced | ✅ 7 skills + `.rlb-skills.json` manifest |
| `postinstall` added to the consumer | ✅ `ng g @open-rlb/ng-bootstrap:sync-skills` |

Then rendered `<app-rlb-starter />` and built the consumer app: **clean, 830.66 kB initial bundle.**
That is the part worth having — it proves the v22-built partial-compilation output links inside a
v22 consumer, which no test in this repo can cover.

---

## Phase 4 — CI ✅

The publish pipeline had a defect that would have shipped broken artifacts regardless of this
upgrade, plus no test gate at all. Both fixed.

### Work items

- [x] Rewrite `.github/workflows/production.yaml` — pin Node, kill the libc mismatch, drop the cruft
- [x] Add a test job ahead of the publish job
- [x] `.github/workflows/pages.yaml` — pin Node, `npm install` → `npm ci`
- [x] Delete `.gitlab-ci.yml` (decided: dead)
- [x] Fix `repository.url`, which still pointed at GitLab

### The `node_modules` artifact crossed a libc boundary

This was the real bug. The `dependencies` job ran in `node:alpine` (**musl**), tarred `node_modules`,
and handed it to a `build` job running `node:lts-bullseye` (**glibc**) and a `deploy` job on
`ubuntu-latest`. Native binaries do not survive that: this tree pulls `esbuild`, `lmdb`,
`@parcel/watcher` and `msgpackr-extract`, all of which ship or build platform-specific binaries.
Alpine-built ones are not loadable on Debian.

Rather than pin the two images to the same libc, the artifact-passing was **removed entirely**. Every
job now runs on `ubuntu-latest` with `actions/setup-node@v4`, `cache: npm`, and its own `npm ci`.
That is faster than tarring and uploading `node_modules`, and the class of bug disappears.

### One Node version, from one source of truth

All three Node declarations (`node:alpine`, `node:lts-bullseye`, `node-version: "22.x"`) are replaced
by `node-version-file: .nvmrc` in both workflows. `.nvmrc` was added in Phase 1 and satisfies Angular
22's `^22.22.3 || ^24.15.0 || >=26.0.0`, so the constraint is now declared once and CI follows it.

### A test gate, finally

`production.yaml` published without running a single test. It now has a `test` job that `build`
depends on, and `deploy` still depends on `build`:

```
versioning ─┐
test → build ─┴→ deploy
```

`test` runs both suites (`lib:test-ci` and `test-ci`); `build` additionally runs `lib:test:ng-add`,
the schematic smoke test, since that needs the build output anyway. A red test now blocks the publish.

### Removed cruft

- `npm link husky` and `npm link @nestjs/cli` — neither is a dependency of this repo. Template
  leftovers sitting in the publish path.
- `cp ./package.json ./dist`, `cp ./package-lock.json ./dist`, `cp ./README.md ./dist` in `deploy`.
  These copied the *root* files into `dist/`, while the publish then ran from `dist/rlb/ng-bootstrap/`
  — so they never affected the published package. ng-packagr already puts the correct
  `package.json` and the library README there.
- `npm install` → `npm ci` in both workflows, so the lockfile is actually enforced.

### `.gitlab-ci.yml` deleted

Decided with the user. The evidence it was dead:

- `origin` is `github.com/open-riolabs/ng-bootstrap`; the GitHub workflows are the live publish path
- its `deploy` publishes to a GitLab package registry under the **`@rlb:`** scope — the library has
  been `@open-rlb/` and published to npmjs for some time
- its `test` stage runs `npm run lib:test-ci` against Karma + Chrome, a path Phase 0 deleted
- it installs Chrome with `apt-key add` (removed from apt) and a key from `dl-ssl.google.com`
  (dead host) — that stage could not have passed in years

It remains in git history if it is ever wanted back.

Also fixed while here: root `package.json` `repository.url` still pointed at
`gitlab.com/riolabs/common/libraries/rlb-ng-bootstrap`. Now the GitHub URL.

### What is *not* verified

These workflows cannot be executed locally, so they are reviewed, not tested. What was checked:
both files parse, contain no tab characters, and the `needs:` graph is acyclic and complete.
`npm ci` was run locally against the current lockfile to confirm the `npm install` → `npm ci`
switch will not fail the pipeline — that is the one change with a real chance of breaking CI.

The first run on `master` is still the real test, and `versioning` (GitVersion in a dotnet container)
was left completely untouched to keep that risk contained.
