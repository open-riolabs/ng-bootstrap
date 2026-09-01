# Angular 21 → 22 upgrade: `@open-rlb/ng-bootstrap`

> **Status:** Phase 0 ✅ (`8c28184`) · Phase 1 ✅ (`1421f58`) · Phase 2 ✅ (`595c4c1`) · Phase 3 ✅ (`d3a1a76`) · Phase 4 ✅ (`5eacb84`). **Upgrade complete.**
> Branch `chore/angular-22-upgrade`. Live progress log: [`PROGRESS.md`](./PROGRESS.md).
> Now on **Angular 22.1.4 / CLI 22.1.6 / TypeScript 6.0.3**, all six targets green plus a browser pass.
> **Unpushed and unpublished.** Consumers are blocked until they reach v22 — see *Release readiness*.

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

## Phase 3 — Library packaging and published metadata ✅ DONE (commit `d3a1a76`)

14. ✅ Library peer ranges `>=21.0.0 <22.0.0` → `>=22.0.0 <23.0.0` for `@angular/{cdk,common,core,forms,router}`.
15. ✅ Schematic `@angular/cdk` pin `^21.0.0` → `^22.0.0`; `bootstrap-icons` aligned `^1.11.0` → `^1.13.1`.
16. ✅ **`@open-rlb/date-tz` floor unified at `2.1.1`.** Raised the two declarations that said `>=2.0.1`
    (root `package.json`, `README.md:59`) rather than lowering the library peer — lowering would let an
    install through that the peer check then rejects. Range *shapes* were left alone (`>=` in the peers,
    `^` in the schematic); only the floor was reconciled.
17. ✅ READMEs corrected. The root README was worse than the plan recorded — beyond "Angular 20+" and
    the unsatisfiable `@angular/core@^20.1.0` install line, it also claimed **Node.js v18+** and
    **Angular CLI 20+** in Prerequisites, and an "Angular 20+ compatible" feature bullet. All four fixed,
    plus `@angular/cdk` added to the install snippet (it is a peer dep but was never mentioned) and a
    note that the linker's forward-only compatibility is why v21 apps must stay on a v21-built release.
18. ✅ `CLAUDE.md` corrected on both counts — "Angular 21 component library" → 22, and the i18n claim.

### Also found and fixed in Phase 3 (not in the original list)

The **shipped skills** carried stale version claims, which matters because they land in consumer
projects via `ng add` / `sync-skills`: `rlb-components/SKILL.md:8` and `rlb-inputs/SKILL.md:8` both
said "Angular 18+ signals". Rewritten to state the actual requirement (Angular 22). Also dropped a
stale "Modern Angular 21 syntax" comment in `autocomplete-country.component.ts:90`.

### The i18n correction, verified rather than assumed

`CLAUDE.md` claimed the library "does not depend on a concrete translation implementation". Checked:
`rlb-bootstrap.module.ts:6` imports `TranslateModule`, `rlb-form-fields.component.ts:17` imports
`TranslatePipe` (5 uses in its template), and both are re-exported from `public-api.ts`.
`RLB_TRANSLATION_SERVICE` is honored in exactly one file, `input-validation.component.ts`. So
`@ngx-translate/core` is a hard peer dep — which the library's `package.json` already stated correctly
(it is not in `peerDependenciesMeta`); only the prose was wrong.

### Verified in the built artifact, and as a real consumer

`dist/rlb/ng-bootstrap/package.json` carries the `>=22.0.0 <23.0.0` peers, the compiled
`schematics/ng-add/index.js` carries `@angular/cdk ^22.0.0` and `bootstrap-icons ^1.13.1`, and the
README inside the tarball reads "Requires **Angular 22**". Full sweep green, counts unchanged.

The consumer check in Verification below was also run, since Phase 3 is what changed the peer ranges:
packed the tarball, `ng add`-ed it into a fresh `@angular/cli@22` app, and confirmed it resolved
**CDK 22.1.4**, registered the styles, wired `provideRlbBootstrap()`, scaffolded the starter, synced
7 skills and added the `postinstall`. Rendering the starter and building the consumer app succeeded
(830.66 kB initial) — which is the only proof that v22 partial-compilation output links in a v22 app.

## Phase 4 — CI ✅ DONE (commit `5eacb84`)

19. ✅ `production.yaml` rewritten. The **musl→glibc `node_modules` artifact** was the real defect:
    a `node:alpine` job tarred `node_modules` for a `node:lts-bullseye` job, and this tree pulls
    `esbuild`, `lmdb`, `@parcel/watcher` and `msgpackr-extract` — all with platform-specific binaries
    that do not survive that hop. Fixed by deleting the artifact-passing entirely: every job now runs
    `ubuntu-latest` + `setup-node` + `cache: npm` + its own `npm ci`. Also dropped `npm link husky` /
    `npm link @nestjs/cli` and three vestigial `cp` commands that copied root files into `dist/` while
    the publish ran from `dist/rlb/ng-bootstrap/`.
20. ✅ All Node declarations replaced by `node-version-file: .nvmrc` in both workflows — one source of
    truth, added in Phase 1. `pages.yaml` switched to `npm ci`.
21. ✅ Test job added: `test → build → deploy`, with `versioning` feeding `deploy` in parallel.
    `test` runs both suites; `build` also runs `lib:test:ng-add`. A red test now blocks publishing.
22. ✅ `.gitlab-ci.yml` **deleted** (user decision). It published to a GitLab registry under the old
    `@rlb:` scope, its test stage ran the Karma path Phase 0 deleted, and it installed Chrome via
    `apt-key add` + `dl-ssl.google.com` — both dead for years. `origin` is GitHub. Still in history.

Also fixed: root `package.json` `repository.url` still pointed at GitLab.

**Not verified:** workflows cannot run locally. Both files parse, have no tabs, and the `needs:` graph
is complete. `npm ci` was run locally against the current lockfile (exit 0) since that is the change
most likely to break the pipeline. `versioning` was left untouched to contain the risk.

## Release readiness and downstream consumers

**Status: the upgrade is complete and unpushed.** All five phases are committed on
`chore/angular-22-upgrade`; nothing is merged or published.

### Before merging

1. The workflows rewritten in Phase 4 are **reviewed, not executed** — the first run on `master` is
   the real test. Highest risk is `npm install` -> `npm ci` (verified locally, exit 0) and the removal
   of the cross-libc `node_modules` artifact. `versioning` was left untouched to contain that risk.
2. `CLAUDE.md` is **untracked in git**, so its Phase 3 corrections live on disk but in no commit and
   would vanish on a fresh clone. Decide whether to track it.
3. Release notes should mention the two API-surface changes from Phase 2 and 3: the calendar's
   `viewChange` -> `viewChangeEvent` property rename (template surface unchanged, `[(view)]` still
   works), and the four names newly exported from the calendar barrel.

### Consumers cannot take this release yet — verified

Attempted the install into `D:/git/work/ng-app` as a **dry run** (nothing written there):

```
npm error ERESOLVE unable to resolve dependency tree
npm error Found: @angular/cdk@21.2.14
npm error Could not resolve dependency:
npm error peer @angular/cdk@">=22.0.0 <23.0.0" from @open-rlb/ng-bootstrap@0.0.0
```

That is the `>=22 <23` peer decision working exactly as intended: a clean install-time refusal rather
than a link-time crash inside the consumer's build. `ng-app` is on Angular 21 / TypeScript 5.9.2, and
its `@open-rlb/date-tz ^2.0.5` is below the new `>=2.1.1` floor. It was **not** forced through with
`--legacy-peer-deps`, which would only move the failure to link time and leave that repo broken.

Two known consumers are blocked until they upgrade themselves:

| Repo | State | Note |
|---|---|---|
| `D:/git/work/ng-app` | Angular 21, TS 5.9.2, 47 specs on `@angular/build:karma` | brief written to its `task.md` |
| `D:/git/work/sicily-action.fe.transfeero` | Angular 21 | consumes **both** libraries; blocked behind `ng-app` |

**A handoff brief for a separate agent is at `D:/git/work/ng-app/task.md`**, carrying the dependency
research already done: every Angular-coupled third party there has a v22 release (NgRx 22,
`ngx-cookie-service` 22, `angular-auth-oidc-client` 22); `@ngx-translate/core@17` already peers
`>=16` and must **not** move to 18, since that would violate this library's `<18.0.0` peer; and
`@angular/build:karma` still exists in v22, so those 47 specs are not forced onto Vitest.

The proof that this library itself is sound is Phase 3's consumer check: this exact tarball was
`ng add`-ed into a fresh `@angular/cli@22` app, which then built clean with a library component rendered.

---

## Follow-on workstream — import cycles (branch `refactor/remove-import-cycles`)

**Separate from the upgrade.** Branched off `53032bc` so the five upgrade phases stay bisectable.
Motivated by a maintainer report of "a lot of problems related to barrel exports", and a standing
team workaround of importing by deep relative path instead of the package alias.

### The finding: the workaround was aimed one level too far out

A cycle scan over all 184 library source files found **5 import cycles**, all inside the library:

```
SELF-IMPORT:  public-api.ts  imports from './public-api'      <- the entry point imports itself
CYCLES (4):   all routed through a barrel or through rlb-bootstrap.module.ts
```

The self-import only "works" because `provideRlbBootstrap()` is a function — its bindings are not
dereferenced until call time, by which point the module graph has resolved. It is a latent fault,
not a working pattern, and it is the single most likely source of the reported flakiness.

**Consumers importing `@open-rlb/ng-bootstrap` were never the problem.** The correct rule has two halves:

| Context | Rule |
|---|---|
| Inside the library | Never import a barrel or `rlb-bootstrap.module`. Import the concrete file. |
| Outside the library | Always import the package name / path alias. |

Deep relative paths are the *fragile* half for consumers: a published package can add an `exports`
map at any time and they all break — the same hazard already logged below for `@open-rlb/date-tz/date-tz`.

### Tier 1 ✅ DONE — mechanical, provably zero-risk

13 leaf-to-barrel imports across 11 files rewritten to concrete file paths, plus the `public-api.ts`
self-import. Aggregate arrays (`COMPONENTS`, `INPUTS`, `TABLE`, `PIPES`, `MODALS`, `TOASTS`,
`CALENDAR_COMPONENTS`, `COMPONENT_BUILDER`) are **defined inside their barrels**, so barrel-composing-barrel
imports were deliberately left alone — that is the intended composition root, not the bug.

Result: **self-import gone, 4 multi-file cycles reduced to 1.**

Evidence the public surface is untouched:

| Check | Before | After |
|---|---|---|
| `export` statements changed | — | **0** (every changed line is part of an `import`) |
| Public exports in the `.d.ts` | 140 | **140** |
| FESM bundle | 773,451 bytes | **773,451 bytes — byte-identical** |

A byte-identical FESM means the emitted library is literally the same file. Full sweep green.

### Tier 2 ✅ DONE — the god-module import removed; the bundle prediction was wrong

**Five leaf components imported `RlbBootstrapModule`**, the aggregate that imports and exports the
whole library — the NgModule-era habit surviving into standalone components. Each now imports only
what its template actually uses, determined by matching every template against every selector the
library declares rather than by eye:

| Component | `RlbBootstrapModule` replaced with |
|---|---|
| `modals/common-modal.component.ts` | `ButtonComponent` |
| `modals/search-modal.component.ts` | `ButtonComponent`, `InputComponent` |
| `calendar-dialogs/.../calendar-toast.component.ts` | **nothing** — its template used no library declarable at all |
| `calendar-dialogs/.../calendar-overflow-events-container.component.ts` | `CalendarEventComponent` |
| `calendar-dialogs/.../event-create-edit.component.ts` | `InputComponent`, `OptionComponent`, `SelectComponent`, `SwitchComponent` |

**Result: zero import cycles in the library.** `RlbBootstrapModule` is now referenced only by its own
definition and by `provideRlbBootstrap()`.

Compiler-verified: build green (a missing import would be `NG8001`), and the NG8113 "unused import"
count is **30 before and 30 after**, with none of the five files among them — so nothing unused was
introduced either. All 30 are pre-existing.

#### ⚠️ The predicted tree-shaking win did not materialise — and the earlier diagnosis was wrong

Measured against the Phase 3 scratch consumer (a real Angular 22 app whose starter uses four
components): **830.66 kB before, 830.63 kB after.** No meaningful change.

The five components were a genuine *cycle* problem, but they were never the *bundle* problem. The
actual retainer is `provideRlbBootstrap()` itself, in `public-api.ts`:

```ts
export function provideRlbBootstrap(): (EnvironmentProviders | Provider)[] {
  return [
    RlbBootstrapModule,   // <- retains the entire library
    ...
```

`RlbBootstrapModule` declares `providers: []`. Putting it in a providers array collects providers
from its whole imported module graph — which contributes essentially nothing — while retaining
references to `...COMPONENTS, ...INPUTS, ...TABLE, ...PIPES`. Every consumer calling the documented
standalone entry point therefore keeps the whole library.

Measured by removing that one line as a throwaway experiment (**reverted, not committed**):
**830.63 kB -> 772.15 kB raw, 163.37 kB -> 151.12 kB transfer.** So about **58 kB raw / 12 kB gzipped**.

Real, but an order of magnitude less than the earlier "~700 kB" framing in this document implied.
The remainder is retained by the five components the modal and toast registries legitimately
reference, plus their transitive dependencies — `InputComponent` alone pulls
`InputValidationComponent` and `DataTableActionComponent`. That is inherent to the registry design,
not something an import cleanup can reach.

#### Tier 2b — proposed, not done

Dropping `RlbBootstrapModule` from `provideRlbBootstrap()`'s return array is worth ~12 kB gzipped for
every consumer. It looks behaviour-neutral for standalone apps, since the module has no providers of
its own and standalone components are imported per-component rather than via a module. But it is a
change to the published entry point's behaviour, and `importProvidersFrom` semantics mean it also
drops provider collection from `CommonModule`, `FormsModule`, `ReactiveFormsModule`, `TranslateModule`,
`RouterModule` and the CDK drag-drop directives. **Needs the maintainer's call**, and a browser pass.

### Browser verification

All five changed components were exercised in the running demo, zero console errors:

| Component | How |
|---|---|
| `EventCreateEditComponent` | clicked a calendar event — title input, datetime inputs, All Day switch and Color select with options all render |
| `CalendarOverflowEventsContainerComponent` | clicked "+N more" — the `rlb-calendar-event` chips render inside the dialog |
| `CommonModalComponent` | deleted an event — the "Event delete" confirm dialog renders with its `rlb-button` Cancel/Ok |
| `CalendarToastComponent` | confirmed the delete — "Event deleted successfully." toast fired |
| `SearchModalComponent` | no demo button exists, so driven directly via `ModalService.openModal('rlb-search', …)` in the page — the `rlb-input` and its projected `rlb-button` render |

### Tier 3 ✅ DONE — the guardrail

Cycles were at zero but nothing kept them there, and the same three mistakes are easy to make again.
ESLint with `import/no-cycle` was considered and rejected as disproportionate: there is **no ESLint
in this repo at all** (the `lib:lint` script has never worked), so adding it would mean standing up a
config and triaging whatever else it flags — a project in its own right, not a guardrail.

Instead, `scripts/check-imports.mjs` (no new dependency, ~140 lines, matching the existing
`scripts/*.mjs` convention) enforces the three invariants this workstream established:

1. **No import cycles**, including a file importing itself.
2. **Nothing imports `rlb-bootstrap.module` except `public-api.ts`** — the Tier 2 invariant.
3. **No deep imports past a package root** (`@open-rlb/date-tz/…`) — the consumer-test blocker.

Wired in as `npm run check:imports`, and into the CI `test` job ahead of both suites, so a regression
blocks the publish rather than reaching consumers.

**The guard was proved to fire**, not just to pass. Each violation was reintroduced deliberately and
the check was confirmed to catch it and exit 1:

| Violation reintroduced | Caught |
|---|---|
| `public-api.ts` importing itself | ✓ "1 file(s) import themselves" |
| a component importing `rlb-bootstrap.module` | ✓ "only public-api.ts may" |
| `@open-rlb/date-tz/date-tz` deep import | ✓ "deep import(s) past a package root" |
| a two-file cycle between a modal and a calendar component | ✓ "1 import cycle(s)" with the path |

Exit 1 on violation, exit 0 on a clean tree. Deliberately **not** enforced: leaf-imports-a-barrel where
it does not currently form a cycle. Barrel-composing-barrel is legitimate (that is how `COMPONENTS`,
`INPUTS` and friends are built), and a blanket rule would produce false positives; the cycle check
already catches the cases that actually cause harm.

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
- ~~Two deep imports `from "@open-rlb/date-tz/date-tz"`~~ — **FIXED** on `refactor/remove-import-cycles`.
  This turned out to be worse than logged: it did not merely risk breaking "the day date-tz adds an
  `exports` map", it already broke **consumer unit tests today**. See the import-cycles workstream above.
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
