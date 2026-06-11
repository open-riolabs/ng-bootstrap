# @open-rlb/ng-bootstrap

Angular component library built on Bootstrap 5.3 (signals, OnPush), with timezone-aware
date handling via [`@open-rlb/date-tz`](https://www.npmjs.com/package/@open-rlb/date-tz).
Supports **Angular 17.2+** (built with Angular 21).

## Installation

### Recommended — `ng add`

```bash
ng add @open-rlb/ng-bootstrap
```

The schematic will:

- install the required dependencies (`bootstrap`, `bootstrap-icons`, `@open-rlb/date-tz`,
  `@ngx-translate/core`, `@angular/cdk`, and `@types/bootstrap`) at compatible versions;
- register the Bootstrap and Bootstrap Icons stylesheets in `angular.json`;
- add `provideRlbBootstrap()` to your application providers;
- scaffold a `RlbStarterComponent` (`src/app/rlb-starter/`) you can render to verify the setup
  (pass `--skip-starter` to opt out);
- copy the bundled Claude skills into `.claude/skills/` — `date-tz` plus the `rlb-*` component
  guides (pass `--skip-skills` to opt out).

### Manual

```bash
npm install @open-rlb/ng-bootstrap
```

When installed this way, npm pulls the declared peer dependencies automatically (npm 7+).
Then register the providers and styles yourself:

```typescript
// app.config.ts
import { provideRlbBootstrap } from '@open-rlb/ng-bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [provideRlbBootstrap()],
};
```

```jsonc
// angular.json → projects.<app>.architect.build.options.styles
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/bootstrap-icons/font/bootstrap-icons.css",
  "src/styles.scss"
]
```

## Usage

```html
<rlb-card>
  <rlb-card-header>Hello</rlb-card-header>
  <rlb-card-body>
    <button rlb-button color="primary">Click me</button>
  </rlb-card-body>
</rlb-card>
```

## Development

- `npm run lib:build` — builds the library **and** its `ng-add` schematics into `dist/rlb/ng-bootstrap`.
- `npm run lib:test:ng-add` — runs an isolated, in-memory check of the `ng-add` schematic
  (requires a prior `lib:build`).
- `npm run lib:pack` — builds and packs a publishable tarball.

## Publishing

```bash
npm run lib:build
cd dist/rlb/ng-bootstrap
npm publish
```
