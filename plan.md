# Angular 21 → 22 upgrade: `@open-rlb/ng-bootstrap`

> **Status:** Phase 0 ✅ (`8c28184`) · Phase 1 ✅ (`1421f58`) · Phase 2 ✅ (`595c4c1`) · Phase 3 ⏸️ next · Phase 4 not started.
> Branch `chore/angular-22-upgrade`. Live progress log: [`PROGRESS.md`](./PROGRESS.md).
> Now on **Angular 22.1.4 / CLI 22.1.6 / TypeScript 6.0.3**, all six targets green plus a browser pass.

## Context

The repo is on Angular **21.1.2 declared / 21.2.19 installed**. Angular **22** shipped 2026-06-03; latest is 22.1.4 (CLI 22.1.6). We want to move the library and its demo/docs app to v22.

The verdict up front: **the Angular-facing source code is in excellent shape and is not the problem.** The demo app and library are already standalone, signal-based, zoneless, OnPush, and on the new control flow. The v22 breaking changes barely touch them. What is *not* ready is everything around the code — the test toolchain is misconfigured to the point that `ng test` runs none of the checked-in config, there is no lint gate, no test job in the GitHub publish pipeline, and the version metadata (peer ranges, schematic pins, READMEs) is already internally inconsistent *before* the bump.

So the risk here is not "will the code compile on v22." It is "we have no reliable way to tell whether it still works." Scope agreed with the user: **version bump only** — fix what breaks, log deprecations as follow-ups. Peer range goes to `>=22.0.0 <23.0.0`. Toolchain gets fixed *before* the bump so there is a trustworthy baseline.

---

## Hard requirements (verified against the npm registry)

| | Required by Angular 22 | Repo today | Action |
|---|---|---|---|
| Node | `^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0` | local v24.16.0 ✓; CI runs 22 / `node:alpine` / `node:lts-bullseye` / `node:latest` | pin CI |
| TypeScript | `>=6.0 <6.1` (ng-packagr peer) | `~5.9.3` | **hard bump to 6.0.x** |
| rxjs | `^6.5.3 \|\| ^7.4.0` | `~7.8.2` ✓ | none |
| zone.js | peer `~0.15 \|\| ~0.16`, not installed | not installed ✓ (app is zoneless) | none |

TypeScript 6.0 is the real cost of this upgrade, not Angular 22.

### Why the peer range is `>=22 <23`, not `>=21 <23`

Angular's partial-compilation linker is **forward-compatible only**. A library compiled with v22 emits partial declarations that a v21 consumer's `@angular/compiler-cli` cannot link. Advertising `>=21` would turn an install-time incompatibility into a link-time crash inside consumer builds. Angular 21 consumers stay on the last 21-built release of this library.

---

## v22 breaking changes vs. this codebase

| Breaking change | Exposure | Verdict |
|---|---|---|
| `OnPush` becomes the default `changeDetection`; old behavior renamed `ChangeDetectionStrategy.Eager` | Library is already 100% explicit `OnPush` | **No-op for the library.** The `ng update` migration will want to stamp `Eager` onto components lacking an explicit strategy — review that diff in the demo app and prefer deleting the stamp over keeping it. |
| Router `paramsInheritanceStrategy` default `'emptyOnly'` → `'always'` | Demo app routes only; no colliding param names | Low. Verify docs routes still resolve. |
| `data-*` binds as an attribute, not a property | **Zero exposure.** All 55 `data-bs-*` sites are either static attributes or already the explicit `[attr.data-bs-*]` form (`carousel.component.ts`, `scrollspy.directive.ts`, `navbar*.ts`, `sidebar.component.ts`, `offcanvas-header.component.ts`) | **Already correct.** This was the biggest theoretical risk for a Bootstrap wrapper and it is fully mitigated. |
| Duplicate input bindings are now a compile error | Unknown until compiled | Caught by the build. |
| HTTP transfer cache skips credentialed requests | No SSR, no HttpClient usage beyond `provideHttpClient()` | None. |
| Node 22+ / TypeScript 6.0+ | See table above | **The actual work.** |

### TypeScript 6.0 changes that hit this repo specifically

- **`moduleResolution: "node"` is deprecated.** `projects/rlb/ng-bootstrap/tsconfig.schematics.json` uses it and does not extend the root config. Must move to `node16`/`nodenext` (keeping `module: "commonjs"` output, which schematics require).
- **`baseUrl` is deprecated** as a resolution root. Root `tsconfig.json` sets `baseUrl: "./"`. `paths` become relative to the tsconfig's own directory — which incidentally *fixes* the latent bug in `projects/rlb/ng-bootstrap/tsconfig.lib.json:10-14`, where `@shared/*`, `@/*`, `~/*` currently resolve against the **workspace root** rather than the library folder. Those aliases appear unused, so this is silent today; re-check after the bump.
- **`types` now defaults to `[]`** instead of every installed `@types` package. Every leaf tsconfig here already sets `types` explicitly except the root — verify nothing relied on ambient auto-inclusion.
- **`noUncheckedSideEffectImports` now defaults to `true`.** Watch side-effect imports such as `import '@angular/compiler'` in the test setup files.
- `strict` defaulting to `true` and `target` defaulting to `es2025` are no-ops — both already set explicitly.
- `experimentalDecorators: true` in root `tsconfig.json:21` is a leftover; Angular has not needed it since v15. Drop it and confirm the build.

---

## Phase 0 — Establish a baseline ✅ DONE (commit `8c28184`)

Completed on branch `chore/angular-22-upgrade`. No Angular versions changed. Full write-up in
[`PROGRESS.md`](./PROGRESS.md); summary and the corrections it forced on the rest of this plan below.

**Result — every target green on Angular 21:**

| Command | Before | After |
|---|---|---|
| `lib:build` | 0 | 0 |
| `lib:test-ci` | **1** — `Unknown argument: karma-config` | **0** (2 files, 2 tests) |
| `test-ci` *(new script)* | n/a — demo specs never compiled | **0** (7 files, 8 tests) |
| `lib:test:ng-add` · `build:docs` · `lib:pack` | not run | **0** · **0** · **0** |

`npm test` previously exited **1** with 5 compile errors while printing `2 passed` — the demo app's
specs never compiled, so they were absent from the count rather than reported as failures.

**The config was not merely unwired — it was inert.** `@angular/build` exposes only `.`, `./private`
and `./package.json`; there is **no `./vitest` subpath**. Both `vitest.config.mts` files and both
`test-setup.ts` files imported `angularVitestPlugin` / `setupZoneTestRunner` from it, so they would
have thrown on load had anything loaded them. All four were deleted rather than repaired, along with
`karma.conf.js`. Replaced with the builder's native options: `include` (scoping each project's specs)
and `providersFile` (supplying `provideZonelessChangeDetection()`, finally matching the test
environment to the zoneless app). Dropping `karma*`, `jasmine-core`, `@types/jasmine`,
`@angular-devkit/build-angular` and `@vitest/browser` removed **502 packages**.

### Two findings that change the rest of this plan

1. **`include` resolves against `sourceRoot`, not project root** — contradicting the builder schema's
   own description. `src/**/*.spec.ts` matched nothing for the library; `**/*.spec.ts` works. **If v22
   corrects this to match the docs, both `include` globs in `angular.json` break.** Check this early
   in Phase 2.
2. **`providersFile` must also appear in the spec `tsConfig`'s `include`**, or the build fails with
   `File '…test-providers.ts' not found in TypeScript compilation`. Both spec tsconfigs now list it —
   keep that in mind if TypeScript 6's `rootDir`/`include` changes shift anything in Phase 1.

### Corrections to what this plan originally assumed

- **`src/app/routing.module.ts` was NOT dead.** `src/app/app.config.ts:17` imports its `routes` const.
  Only the `RoutingModule` class and its `RouterModule.forRoot` were dead; those were stripped and
  `routes` kept. `RoutingComponentsModule` / `RoutingInputsModule` are live `loadChildren` targets.
- **`src/app/demo/` was dead and was removed** (4 files, zero references repo-wide). Its stale
  non-signal `IModal` implementation was one of the original 5 compile errors. `ModalSampleComponent`
  is the live modal sample, registered as `'sample-dialog'`.
- `src/app/app.module.ts` was deleted as planned, removing `BrowserModule`,
  `BrowserAnimationsModule` and `HttpClientModule` from the compilation in one step.

### Pre-existing defects fixed (none upgrade-related)

All were latent behind specs that never compiled: a wrong import path in `home.component.spec.ts`
(`'../inputs/home.component'` → `'./home.component'`); `declarations:` used for standalone components
in six specs; a stock CLI assertion against markup the template no longer contains; and missing
`provideHighlightOptions` in the test environment (now in `src/test-providers.ts`).

### ⚠️ Open decision carried into Phase 1 — RESOLVED: kept as a follow-up

Tearing down an accordion mid-transition throws
`TypeError: Cannot read properties of null (reading 'classList')` at `bootstrap/js/src/collapse.js:151`.
`ToggleAbstractComponent.ngOnDestroy` disposes correctly, but Bootstrap's own queued `transitionend`
callback then dereferences the element `dispose()` nulled. Real in the browser too, just rarely seen.

Worked around in `accordions.component.spec.ts` (let the ~350ms transition settle before
`fixture.destroy()`) and **deliberately not fixed** — it is a library runtime behavior change, and
Phase 0 was meant to establish a baseline, not alter behavior.

**Decision (2026-09-01): keep as a logged follow-up.** Not fixed in Phase 1. The proper fix belongs in
`projects/rlb/ng-bootstrap/src/lib/components/abstract/toggle-abstract.component.ts` — guard or cancel
pending transition callbacks before `dispose()`. Related smell in the same file:
`ngAfterContentChecked` calls `show()`/`hide()` on *every* check while `status` is `'show'`/`'hide'`,
rather than only on transition.

---

## Phase 1 — Node and TypeScript ✅ DONE (commit `1421f58`)

All items below are complete on **TypeScript 6.0.3**, Angular untouched at 21.2.19. Full write-up in
[`PROGRESS.md`](./PROGRESS.md); what it changed for the rest of this plan is summarised after the list.

6. ✅ `engines` `"node": "^22.22.3 || ^24.15.0 || >=26.0.0"` added to root `package.json`; `.nvmrc` added (`24.16.0`).
7. ✅ `typescript` bumped `~5.9.3` → `~6.0.3` (newest 6.0.x; Angular 22 pins `>=6.0 <6.1`).
   - ✅ `tsconfig.schematics.json` — `moduleResolution: "node"` → `node16`. **`module` had to move with it**
     (TypeScript rejects `node16` resolution alongside `module: "commonjs"`). Emitted output is still
     CommonJS, because `node16` reads the format from `projects/rlb/ng-bootstrap/package.json`, which has
     no `"type"` field. `verify-pack.cjs` confirms the marker survives.
   - ✅ Root `tsconfig.json` — `experimentalDecorators` and `baseUrl` both removed.
     `useDefineForClassFields: false` kept.
   - ✅ `tsconfig.lib.json` aliases re-verified: `@shared/*`, `@/*`, `~/*` are genuinely **unused**, so the
     latent misresolution changed nothing. Deleting them is a logged follow-up.
8. ✅ Full sweep green on **TS 6 + Angular 21**, counts identical to the Phase 0 baseline.
9. ✅ Both `providersFile` entries and `types: ["vitest/globals"]` survived the TS 6 bump untouched.

### What Phase 1 changed for Phase 2

- **A TS 6 peer warning is expected and is not a failure.** `@angular/build@21.2.20` and `ng-packagr@21.2.7`
  pin `typescript: ">=5.9 <6.0"`, so `npm install` warns. It is a warning, not an error; every target is
  green. `@angular/compiler-cli@21.2.19` already allows `>=5.9 <6.1`. The v22 packages pin `>=6.0 <6.1`,
  so the warning clears when Angular is bumped. **Do not resolve it by downgrading TypeScript.**
- **No workspace-root-relative specifiers can survive any more.** With `baseUrl` gone, `from 'projects/rlb/…'`
  no longer resolves. Nine such imports in the demo app were rewritten to the `@open-rlb/ng-bootstrap`
  alias. If an `ng update` migration emits such a path in Phase 2, it will fail to resolve — check for it.
- **The library's public API grew by four names.** `CalendarView`, `CalendarLayout`, `CalendarChangeEvent`
  and `DEFAULT_CALENDAR_LAYOUT` are now exported from the calendar barrel. They are the types of
  `<rlb-calendar>`'s own `view` / `layout` inputs and `date-change` / `view-change` outputs, and were
  previously unreachable by consumers — the demo only compiled because `baseUrl` let it reach into
  `src/lib/`. Purely additive. Relevant to Phase 3, which touches published metadata.

---

## Phase 2 — Angular 22 ✅ DONE (commit `595c4c1`)

**Angular 21.2.19 → 22.1.4**, CLI → 22.1.6, CDK → 22.1.4, ng-packagr → 22.1.1, `@schematics/angular` → 22.1.6.
Full write-up in [`PROGRESS.md`](./PROGRESS.md). Outcome per original step:

9. ⚠️ **Reconciling the CLI skew first was impossible and was skipped.** On TS 6 + Angular 21,
   `npm i -D @angular/cli@~21.2` fails outright — `Conflicting peer dependency: typescript@5.9.3`
   from `@angular/build@21.2.20`. Phase 1's *warning* becomes an *error* for any new install.
   Going straight to `ng update @angular/core@22 @angular/cli@22 @angular/cdk@22` resolved CLI and
   build together and cleared the conflict. `--allow-dirty` was needed only because `ng update`
   counts the untracked `CLAUDE.md` as a dirty tree.
10. ✅ **All 52 `Eager` stamps reverted.** The migration also reformatted every file it touched with
    its own printer (6024 insertions / 3835 deletions, and not Prettier-clean either way), so
    `git checkout HEAD --` removed stamp and churn together. Since OnPush is v22's default, reverting
    is what lands these on OnPush; keeping the stamp would have opted them back into the old behavior
    and shipped two non-OnPush components in the library. See Phase 2's ⚠️ calendar decision below.
11. ✅ `@schematics/angular` was the one `ng update` left behind (still `^21.1.5`). All Angular
    ranges in root `package.json` are now 22.
12. ✅ `@angular/animations` and `@angular/platform-browser-dynamic` removed, along with the single
    `provideAnimations()` call. Re-verified unused before removing, not taken on faith.
13. ✅ **The `include` globs did not need revisiting** — v22 did not correct the `sourceRoot`
    discrepancy. Proven by the counts (7/8 and 2/2), since the failure mode is `No tests found`.
14. ✅ Rebuilt and exercised by hand in the browser: zero console errors across 11 pages, with
    modals, calendar events/view-switch, accordion `statusChange` and popovers actually interacted
    with. **Not covered:** calendar drag-and-drop, scrollspy, navbar dropdowns, opening an offcanvas.

### ⚠️ Calendar `[(view)]` — decided, preserved

`view = model({alias:'view'})` generates an implicit `viewChange` output that collided with the
explicit `viewChange = output({alias:'view-change'})` property. v22 rejects this. Angular's automatic
fix rewrites `view` to `input()` + `linkedSignal`, which **drops `[(view)]`** — documented as two-way
and used in 4 places in the shipped `rlb-calendar` skill.

**Chosen instead:** rename only the explicit output property to `viewChangeEvent`. The template-facing
surface is unchanged (`view`, `[(view)]`, `view-change`), and `view` becomes symmetric with how
`currentDate`/`dateChange` already avoid the collision. Verified by compiling the demo with `[(view)]`
and by the browser logging `view change {date, view: month}`. Worth a release-note line in Phase 3.

### ⚠️ New in v22: `popover` is a native HTML attribute

`PopoverDirective`'s `[popover]` selector now collides with the native attribute, producing
`Found a 'popover' attribute with an invalid value.` warnings in every consumer console.
**Functionally fine** — verified the popover still opens. Renaming the selector would be a breaking
change, so it is a follow-up, not version-bump work.

## Phase 3 — Library packaging and published metadata

14. **`projects/rlb/ng-bootstrap/package.json:5-9`** — peer ranges `>=21.0.0 <22.0.0` → `>=22.0.0 <23.0.0` for `@angular/{cdk,common,core,forms,router}`.
15. **`projects/rlb/ng-bootstrap/schematics/ng-add/index.ts:32`** — `{ name: '@angular/cdk', version: '^21.0.0' }` → `'^22.0.0'`. This is the second, easy-to-miss place the Angular major is encoded, and `^21.0.0` will not resolve a v22 CDK into a consumer app. While in this array (lines 29-36), also align `bootstrap-icons` (`^1.11.0` here vs `^1.13.1` in root `package.json:43`).
16. **Reconcile the `@open-rlb/date-tz` floor** — it is currently stated three different ways: `>=2.0.1` (root `package.json:42` and `README.md:59`), `>=2.1.1` (library peer, line 11), `^2.1.1` (schematic, line 30). Installed is 2.1.4, which is why the drift is invisible in-workspace. Pick one floor and apply it to all four.
17. **Fix the READMEs, which are already wrong today and will now be two majors stale:**
    - `README.md:65` — "requires Angular 20+"
    - `README.md:67` — `npm install @angular/core@^20.1.0 …`, which *contradicts* the current `>=21.0.0` peer range and produces an unsatisfiable install
    - `projects/rlb/ng-bootstrap/README.md:5` — "Supports **Angular 17.2+** (built with Angular 21)" — this is the README that ships in the npm tarball
    - `CLAUDE.md:7` — "An Angular 21 component library"
18. Also correct `CLAUDE.md:61`, which claims the library "does not depend on a concrete translation implementation." That is not true: `rlb-bootstrap.module.ts:6,19` imports `TranslateModule` and `rlb-form-fields.component.ts:17,31` imports `TranslatePipe` (used 5× in its template). Both are exported from `public-api.ts`, so `@ngx-translate/core` is a genuine hard peer dep, not an optional one. The `RLB_TRANSLATION_SERVICE` abstraction is only honored in `input-validation.component.ts`.

---

## Phase 4 — CI

19. `.github/workflows/production.yaml` is the publish path and needs attention regardless: it has **no test job**, uses three different unpinned Node images (`node:alpine`, `node:lts-bullseye`, `22.x`) across jobs that share a `node_modules` artifact **across libc boundaries** (musl → glibc), and runs `npm link husky` / `npm link @nestjs/cli` — neither is a dependency of this repo; both are template cruft in the publish path.
20. Pin all CI Node versions to one value satisfying Angular 22's engines. Switch `npm install` → `npm ci` in `.github/workflows/pages.yaml` so the lockfile is actually enforced.
21. Add a test job to the GitHub pipeline before the publish job.
22. `.gitlab-ci.yml` runs the now-deleted karma path and installs Chrome via the long-broken `apt-key add` + `dl-ssl.google.com` key. If GitLab is dead, delete the file; if not, it needs the same Vitest rewrite.

---

## Deliberately out of scope (log as follow-ups)

- **The Bootstrap accordion teardown race** in `toggle-abstract.component.ts` — decided in Phase 1 to
  keep as a follow-up. See the Phase 0 open finding for the reproduction and the intended fix.
- **The calendar docs snippet is wrong** (found in Phase 1). `src/app/pages/components/calendar/calendar.component.ts:62`
  renders `import { DateTz, getToday } from '@open-rlb/date-tz';` to readers, but `@open-rlb/date-tz`
  exports no `getToday` — it is the library's own internal helper. The `default: 'getToday()'` API-table
  entry at line 130 has the same problem.
- **Delete the unused `@shared/*`, `@/*`, `~/*` aliases** from `tsconfig.lib.json:10-14` (found in Phase 1).
  Nothing imports them; they exist only to be misconfigured.
- **`PopoverDirective`'s `[popover]` selector collides with the native HTML `popover` attribute** in
  Angular 22 (found in Phase 2), warning in every consumer console. Works, but noisy. Renaming the
  selector is a breaking change and needs its own major.
- **Re-enable the `nullishCoalescingNotNullable` / `optionalChainNotNullable` extended diagnostics**
  that the v22 migration suppressed across all five tsconfigs, and fix what they flag.
- 16 `[ngClass]` bindings in the library (~7 are single-key `is-invalid` toggles trivially convertible to `[class.is-invalid]`).
- 3 remaining decorators: `@ViewChild` (`shared/wrapped.component.ts:22`), `@HostListener` (`forms/inputs/abstract-autocomplete.component.ts:149`), and `@Self() @Optional()` param decorators on a field alongside `inject()` (`forms/inputs/abstract-field.component.ts:28`).
- ~40 constructor-injected params that could be `inject()`.
- Two deep imports `from "@open-rlb/date-tz/date-tz"` (`calendar-week-grid.component.ts:14`, `calendar-day-grid.component.ts:15`) that resolve only because that package ships no `exports` map — they will break the day it adds one.
- `highlight.js` is dynamically imported in `src/app/app.config.ts:51-57` but is **not** in root `package.json`; it resolves only transitively through `ngx-highlightjs`.
- No ESLint at all, despite a `lib:lint` script and an `eslint-disable` comment in `sync-skills/index.ts:153`.
- Signal Forms / `resource()` / Angular Aria adoption — explicitly deferred; the forms layer is the library's core.

---

## Verification

**Automated** — this is the sweep Phase 0 made trustworthy. All six exit 0 on Angular 21 as of `8c28184`;
any red after this point is caused by the change under test.

```bash
node --version              # must satisfy ^22.22.3 || ^24.15.0 || >=26
npm ci
npm run test-ci             # demo app specs   (7 files,  8 tests)
npm run lib:test-ci         # library specs    (2 files,  2 tests)
npm run lib:build           # ng-packagr + schematics compile
npm run lib:test:ng-add     # schematic smoke test (requires lib:build first)
npm run lib:pack            # runs verify-pack.cjs: asserts the CommonJS marker
                            # and bundled skills survive npm pack
npm run build:docs          # exercises prepare-pages.mjs
```

`test-ci` and `lib:test-ci` are the non-watch CI forms. Bare `npm test` runs both projects in watch
mode; `npm test -- --no-watch` is the one-shot equivalent.

**Read the counts, not just the exit code.** The pre-Phase-0 failure mode was Vitest printing
`2 passed` while the process exited 1, because uncompilable specs are omitted from the count rather
than failed. A sudden drop in file/test count means specs stopped compiling — treat it as a failure
even if the summary looks green.

Note `scripts/test-ng-add.cjs` builds a synthetic workspace hardcoded to today's generated-app shape (`architect`, `@angular/build:application`, `bootstrapApplication` + `ApplicationConfig`). If v22 changed that shape, this harness fails even when the schematic is fine — read its assertions before believing a failure.

**Manual — the Bootstrap JS coupling is the part tests will not cover.** The library instantiates Bootstrap plugin classes directly in 12 places, and `components/abstract/toggle-abstract.component.ts:12-18,82-120` duck-types the plugin surface with a locally declared `_bs_component` shim plus hardcoded `show./shown./hide./hidden./hidePrevented.${eventPrefix}` event strings. Nothing type-checks that against the real Bootstrap API. Run `npm start` (port 4201) and click through:

- Modals (`ModalService` + `[rlb-modal]`), Toasts, Offcanvas, Dropdowns (standalone + navbar), Collapse/Accordion, Carousel (autoplay + controls), Tooltips, Popovers, Scrollspy
- **Calendar drag-and-drop** in all three views — the only `@angular/cdk/drag-drop` consumer, using `[cdkDropListSortingDisabled]`, `*cdkDragPlaceholder`, `<ng-template cdkDragPreview matchSize>`, and the three-generic `CdkDragDrop<T,U,V>` shape. These are the CDK APIs that historically shift between majors.
- Form inputs end-to-end — validation state, `AbstractComponent` CVA wiring, and the zoneless `statusChanges` mirroring in `forms/inputs/abstract-field.component.ts`
- Responsive behavior driven by `@angular/cdk/layout` `BreakpointObserver` / `MediaMatcher`

**Then verify as a real consumer,** which is the only test of the peer ranges and the schematic pins: `npm run lib:pack`, install the tarball into a scratch Angular 22 app, run `ng add @open-rlb/ng-bootstrap`, and confirm it installs a v22-compatible CDK, registers the Bootstrap styles, wires `provideRlbBootstrap()`, and syncs `.claude/skills`.
