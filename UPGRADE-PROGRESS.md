# Angular 21 → 22 upgrade — progress log

Working branch: `chore/angular-22-upgrade`
Plan: [`plan.md`](./plan.md)

Status key: ✅ done · 🚧 in progress · ⏸️ blocked / awaiting review · ⬜ not started

| Phase | Scope | Status |
|---|---|---|
| 0 | Baseline + toolchain consolidation (still on Angular 21) | ✅ |
| 1 | Node + TypeScript 6.0 | ⏸️ next |
| 2 | Angular 22 | ⬜ |
| 3 | Library packaging & published metadata | ⬜ |
| 4 | CI | ⬜ |

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
- [ ] Commit — awaiting review

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
