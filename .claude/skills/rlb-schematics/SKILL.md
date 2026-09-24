---
name: rlb-schematics
description: How to install and configure @open-rlb/ng-bootstrap in a consuming Angular app — the ng-add schematic (dependencies, angular.json styles including @angular/cdk/overlay-prebuilt.css, provideRlbBootstrap, starter component), the sync-skills schematic that copies the bundled Claude skills into .claude/skills, the postinstall wiring, peer dependency ranges, and manual setup. Use when installing the library, fixing a broken or partial install, or when Claude skills are stale or missing after an update.
---

# RLB ng-Bootstrap Schematics Skill

The library ships **two** schematics and no generators. Both live in
`projects/rlb/ng-bootstrap/schematics/` and are registered by `collection.json`.

| Name | What it does |
|---|---|
| `ng-add` | Installs peer dependencies, registers the stylesheets, adds `provideRlbBootstrap()`, scaffolds a starter component, and runs `sync-skills`. |
| `sync-skills` | Copies the Claude skills bundled with the installed version into `.claude/skills`. Re-runnable — this is how you pick up skill updates after `npm update`. |

---

## Installing

```bash
ng add @open-rlb/ng-bootstrap
```

Options (all optional):

| Flag | Default | Effect |
|---|---|---|
| `--project <name>` | the first application project | Which workspace project to configure. Throws if the name is not in the workspace. |
| `--skip-starter` | `false` | Do not scaffold the starter component. |
| `--skip-skills` | `false` | Do not copy the Claude skills, and do not add the postinstall hook. |
| `--skip-skills-auto-sync` | `false` | Copy the skills once, but do not add the postinstall hook. |

### What it changes

**1. Dependencies**

| Package | Version installed | Where |
|---|---|---|
| `@open-rlb/date-tz` | `^2.1.1` | dependencies |
| `@ngx-translate/core` | `^17.0.0` | dependencies |
| `bootstrap` | `^5.3.0` | dependencies |
| `bootstrap-icons` | `^1.13.1` | dependencies |
| `@angular/cdk` | `^<your Angular major>.0.0` | dependencies |
| `@types/bootstrap` | `^5.2.0` | devDependencies |

`@angular/cdk` is **computed, not pinned**: the schematic reads the major of `@angular/core` from
your `package.json` and asks for `^<major>.0.0`, falling back to `^22.0.0` if it cannot read one.
Angular itself and `rxjs` are deliberately not installed — you already have them.

**2. `angular.json` styles** — three entries are prepended to the build target's `styles`:

```jsonc
"styles": [
  "node_modules/@angular/cdk/overlay-prebuilt.css",
  "node_modules/bootstrap-icons/font/bootstrap-icons.css",
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "src/styles.scss"
]
```

Each is added only if not already present. A project with no `build` target is skipped.

⚠️ **`@angular/cdk/overlay-prebuilt.css` is not optional.** It is what positions every panel the
library opens — dropdowns, tooltips, popovers, the datepicker, the time picker, the tree select, the
popconfirm and the command palette. Without it they all open in the top-left corner of the page.
See the **rlb-overlays** skill.

**3. A root provider** — `provideRlbBootstrap()` is added through the Angular CLI's own
`addRootProvider`, which for a standalone app edits **`app.config.ts`** (falling back to `main.ts`),
and for an NgModule app the root module's `providers`.

**4. A starter component** at `src/app/rlb-starter/rlb-starter.component.{ts,html}` —
`RlbStarterComponent`, selector `app-rlb-starter`. Skip it with `--skip-starter`.

**5. A postinstall hook**, unless skipped:

```jsonc
"scripts": { "postinstall": "ng g @open-rlb/ng-bootstrap:sync-skills" }
```

If a `postinstall` script already exists, the schematic **does not rewrite it** — it logs a warning
asking you to append `&& ng g @open-rlb/ng-bootstrap:sync-skills` yourself.

---

## Manual setup

If `ng add` cannot run (an unusual workspace, a monorepo with a non-standard layout), do the same
four things by hand:

```bash
npm i @open-rlb/ng-bootstrap @open-rlb/date-tz @angular/cdk bootstrap bootstrap-icons
npm i -D @types/bootstrap
```

```jsonc
// angular.json — build target
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/bootstrap-icons/font/bootstrap-icons.css",
  "node_modules/@angular/cdk/overlay-prebuilt.css",
  "src/styles.scss"
]
```

```typescript
// app.config.ts
import { provideRlbBootstrap } from '@open-rlb/ng-bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [provideRlbBootstrap() /* , provideRlbTheme(), provideRlbDefaults({…}) */],
};
```

⚠️ The README shipped **inside the package** shows only two stylesheets in its manual
`angular.json` snippet — it omits the CDK sheet. That snippet is stale; the schematic registers all
three, and all three are needed. Trust this list.

`provideRlbBootstrap()` registers the library's built-in modals (`rlb-common`, `rlb-search`, the
calendar dialogs) and the calendar toast. It does **not** turn on theming or set defaults — those
are separate, opt-in providers (`provideRlbTheme()`, `provideRlbDefaults()`, `provideRlbIcons()`).
See **rlb-components**.

### Peer dependencies

| Peer | Range | |
|---|---|---|
| `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/router`, `@angular/cdk` | `>=22.0.0 <23.0.0` | |
| `rxjs` | `^7.8.0` | |
| `bootstrap` | `>=5.3.0` | |
| `@open-rlb/date-tz` | `>=2.1.1` | |
| `@ngx-translate/core` | `>=16.0.0 <18.0.0` | optional |
| `@types/bootstrap` | `>=5.2.0` | optional |

Note that `ng add` installs `@ngx-translate/core@^17.0.0` even though the peer range allows 16 — and
the peer is optional. The library depends on no translation package at runtime; it resolves keys
through `RLB_TRANSLATION_SERVICE` when one is registered. See **rlb-components**.

---

## sync-skills

```bash
ng g @open-rlb/ng-bootstrap:sync-skills
ng g @open-rlb/ng-bootstrap:sync-skills --prune=false
```

| Option | Type | Default | Notes |
|---|---|---|---|
| `prune` | `boolean` | `true` | Deletes skills the library previously shipped but no longer does. Skills you wrote yourself are never touched. Only an explicit `--prune=false` disables it. |

There is **no** option for the target directory, no skill filter and no `--force`.

- **Target** is hardcoded: `/.claude/skills`, relative to the workspace root.
- **Library-shipped skills always overwrite.** Local edits to a skill the library ships will be lost
  on the next sync — fork it under a different name instead.
- A **manifest** is written to `.claude/skills/.rlb-skills.json`
  (`{ package, version, skills }`). It records which folders came from the library, which is how
  `prune` can delete stale ones without touching yours. **Commit it.**
- Set the environment variable **`RLB_SKIP_SKILL_SYNC`** to any value to make the schematic a no-op
  — useful in CI, or for a developer who does not use Claude Code.

### When skills look stale or missing

1. `npm update @open-rlb/ng-bootstrap` alone does not re-run the schematic unless the postinstall
   hook is wired. Run `ng g @open-rlb/ng-bootstrap:sync-skills` by hand.
2. If it warns that the package *shipped without Claude skills*, the package was built with a bare
   `ng build` instead of `npm run lib:build` — the skills are bundled by a post-build step.
3. If nothing happens at all, check `RLB_SKIP_SKILL_SYNC`.

---

## How the skills get into the package (for library maintainers)

`scripts/build-schematics.mjs` runs **after** `ng build @open-rlb/ng-bootstrap`, because ng-packagr
wipes the output directory. `npm run lib:build` does both.

It compiles the schematics with `tsconfig.schematics.json`, copies the non-TypeScript assets
(`collection.json`, the schemas, the `ng-add/files` templates), and then copies the repo-root
`.claude/skills/` into `dist/rlb/ng-bootstrap/schematics/sync-skills/claude-skills/`. That is the
one copy: `ng-add` reaches the skills by delegating to `sync-skills`.

It also pushes `schematics/package.json` onto the built `package.json`'s `files` array, because
ng-packagr's generated `.npmignore` contains `**/package.json` and `npm pack` would otherwise strip
the CommonJS marker that makes the compiled schematics loadable.

```
dist/rlb/ng-bootstrap/schematics/
  package.json            {"type": "commonjs"}
  collection.json
  ng-add/       index.js schema.js schema.json files/…
  sync-skills/  index.js schema.js schema.json claude-skills/<skill>/SKILL.md
```

**Therefore: editing a skill under `.claude/skills/` is all it takes to ship it.** Keep the
folder-per-skill layout with a `SKILL.md` and YAML frontmatter (`name`, `description`) — the whole
tree is copied verbatim, so a skill with extra reference files travels too.

`scripts/verify-pack.cjs` (via `npm run lib:pack`) asserts the tarball actually contains
`package/schematics/package.json` and at least one file under
`package/schematics/sync-skills/claude-skills/`. If you add a skill and the pack check fails, the
build step did not run.
