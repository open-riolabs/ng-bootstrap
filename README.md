# @open-rlb/ng-bootstrap

A comprehensive Angular component library built on Bootstrap 5, providing a rich set of UI components, form controls, and utilities for building modern web applications.

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Getting Started](#-getting-started)
- [Components](#-components)
- [Forms](#-forms)
- [Development](#-development)
- [Building](#-building)
- [Testing](#-testing)
- [Publishing](#-publishing)
- [Styling](#-styling)
- [Configuration](#-configuration)
  - [Icons](#icons)
  - [Theme](#theme)
  - [Defaults](#defaults)
  - [Translations](#translations)
- [Claude Skills](#-claude-skills)
- [Additional Resources](#-additional-resources)
- [Author](#-author)
- [Contributors](#-contributors)
- [License](#-license)
- [Contributing](#-contributing)

## ✨ Features

- **Bootstrap 5** based components
- **Angular 22** compatible
- **TypeScript** support
- **i18n** ready through `RLB_TRANSLATION_SERVICE`, with no translation library of its own
- **Dark mode** on Bootstrap 5.3's `data-bs-theme`, as signals
- **Configurable** icon set and global defaults, through injection tokens
- **Accessible** components following Bootstrap patterns
- **Customizable** styling with SCSS
- **Form validation** built-in
- **Calendar** component with event management
- **Data tables** with advanced features
- **Modal** and **Toast** systems with registry support

## 📦 Installation

The fastest way is the `ng add` schematic. It installs the peer dependencies, registers the
Bootstrap styles in `angular.json`, wires `provideRlbBootstrap()` into your root providers,
scaffolds a starter component, and sets up the [Claude skills](#-claude-skills):

```bash
ng add @open-rlb/ng-bootstrap
```

Or install the package manually:

```bash
npm install @open-rlb/ng-bootstrap
```

### Peer Dependencies

Make sure you have the following peer dependencies installed:

```bash
npm install bootstrap@>=5.3.0 @types/bootstrap@>5.2.0 @open-rlb/date-tz@>=2.1.1
```

`@types/bootstrap` and `@ngx-translate/core` are optional: nothing in the library imports
`@ngx-translate/core`, and translations go through [`RLB_TRANSLATION_SERVICE`](#translations)
instead.

### Required Angular Dependencies

This library requires **Angular 22** (`>=22.0.0 <23.0.0`) and the following packages:

```bash
npm install @angular/core@^22.0.0 @angular/common@^22.0.0 @angular/forms@^22.0.0 @angular/router@^22.0.0
npm install @angular/cdk@^22.0.0
npm install bootstrap-icons@^1.13.1
```

Angular's partial-compilation linker is forward-compatible only, so a build of this library cannot be
linked by an older Angular. Applications still on Angular 21 should stay on the last 21-built release.

## 🚀 Getting Started

### 1. Import the Module

In your `app.module.ts` or standalone component:

```typescript
import { RlbBootstrapModule } from '@open-rlb/ng-bootstrap';

@NgModule({
  imports: [
    RlbBootstrapModule,
    // ... other modules
  ],
})
export class AppModule {}
```

Or using the standalone provider function:

```typescript
import { provideRlbBootstrap } from '@open-rlb/ng-bootstrap';

bootstrapApplication(AppComponent, {
  providers: [
    provideRlbBootstrap(),
    // ... other providers
  ],
});
```

`provideRlbBootstrap()` registers the built-in modals and toasts (`rlb-common`, `rlb-search` and the
calendar dialogs) so `ModalService` / `ToastService` can resolve them by name. It does **not** make the
components available to your templates — a providers array cannot supply declarables. Standalone
components import what they use directly:

```typescript
import { ButtonComponent, CardComponent } from '@open-rlb/ng-bootstrap';

@Component({ imports: [ButtonComponent, CardComponent], /* ... */ })
export class MyComponent {}
```

### 2. Include Bootstrap Styles

Add Bootstrap CSS to your `angular.json` or import in your main styles file:

```scss
@import 'bootstrap/scss/bootstrap';
@import 'bootstrap-icons/font/bootstrap-icons';
```

### 3. Use Components

```html
<!-- Buttons are attribute components: they sit on a real <button> or <a>. -->
<button rlb-button color="primary">Click Me</button>
<button rlb-button color="secondary" size="sm" outline>Small outline</button>

<rlb-alert color="success">Success message</rlb-alert>

<!-- Inputs are ControlValueAccessors: they work with ngModel and with reactive forms. -->
<rlb-input placeholder="Username" [(ngModel)]="username"></rlb-input>
```

Colors come from the Bootstrap palette (`primary`, `secondary`, `success`, `danger`, `warning`,
`info`, `light`, `dark`) and sizes are `sm` / `md` / `lg`.

## 🧩 Components

### UI Components

- **Accordion** - Collapsible content sections
- **Alert** - Contextual feedback messages
- **Avatar** - User profile images
- **Badge** - Small status indicators
- **Breadcrumb** - Navigation hierarchy
- **Button** - Action buttons with variants and groups
- **Card** - Content containers
- **Carousel** - Image/content sliders
- **Chat** - Chat interface components
- **Collapse** - Toggle content visibility
- **Dropdown** - Dropdown menus
- **List** - List components
- **Loader** - Loading indicators
- **Modal** - Dialog windows with registry system
- **Nav** - Navigation components
- **Navbar** - Navigation bars
- **Offcanvas** - Slide-out panels
- **Pagination** - Page navigation
- **Placeholder** - Loading placeholders
- **Scrollspy** - Scroll-based navigation
- **Sidebar** - Side navigation panels
- **Tabs** - Tabbed interfaces
- **Toast** - Notification toasts with registry
- **Tooltip** - Hover information

### Data Components

- **Calendar** - Full-featured calendar with event management
- **DataTable** - Tables with pagination, per-column sorting and filtering, row selection with
  bulk actions, hideable columns, a sticky header and CSV export, plus row actions, loading and
  empty-state slots. Sorting and filtering leave as a `(data-query)` for the caller to answer,
  and the export reads back the table that is on screen — because the table projects the rows,
  it never holds them.

## 📝 Forms

### Form Inputs

- **Input** - Text inputs with validation
- **Textarea** - Multi-line text inputs
- **Select** - Dropdown selects
- **Checkbox** - Checkbox inputs
- **Radio** - Radio button groups
- **Switch** - Toggle switches
- **Range** - Range sliders
- **Color** - Color picker
- **File** - File upload inputs
- **File DnD** - Drag and drop file upload
- **Datalist** - Autocomplete suggestions
- **Autocomplete** - Advanced autocomplete with:
  - Country selection
  - Timezone selection
  - Country dial code selection
- **Input Group** - Input with addons
- **Input Validation** - Form validation display
- **Form Fields** - Dynamic form field builder

## 🛠️ Development

### Prerequisites

- Node.js `^22.22.3 || ^24.15.0 || >=26.0.0` (matches Angular 22's own constraint; see `.nvmrc`)
- npm or yarn
- Angular CLI 22+

### Setup

1. Clone the repository:

```bash
git clone https://gitlab.com/riolabs/common/libraries/rlb-ng-bootstrap.git
cd rlb-ng-bootstrap
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The demo application will be available at `http://localhost:4201`

### Project Structure

```
ng-bootstrap/
├── projects/
│   └── rlb/
│       └── ng-bootstrap/          # Library source
│           ├── src/
│           │   ├── lib/
│           │   │   ├── components/ # UI components
│           │   │   ├── forms/      # Form components
│           │   │   ├── data/       # Data components
│           │   │   ├── modals/     # Modal system
│           │   │   ├── pipes/      # Pipes
│           │   │   └── shared/    # Shared utilities
│           │   └── public-api.ts  # Public API exports
│           └── package.json
├── src/                            # Demo application
└── angular.json
```

## 🔨 Building

### Build the Library

```bash
npm run lib:build
```

The build artifacts will be stored in the `dist/rlb/ng-bootstrap/` directory.

### Build for Production

```bash
ng build @open-rlb/ng-bootstrap --configuration production
```

### Watch Mode

```bash
npm run watch
```

This will build the library in watch mode, automatically rebuilding on file changes.

## 🧪 Testing

### Run Unit Tests

```bash
npm run lib:test
```

### Run Tests in CI Mode

```bash
npm run lib:test-ci
```

### Run Linting

```bash
npm run lib:lint
```

## 📦 Publishing

After building the library:

```bash
npm run lib:build
cd dist/rlb/ng-bootstrap
npm publish
```

## 🎨 Styling

The library includes custom SCSS files that can be customized:

- `_variables.scss` - Bootstrap variable overrides
- `_variables-dark.scss` - Dark theme variables
- `_custom.scss` - Custom styles
- `app.scss` - Main application styles
- `icons.scss` - Icon styles

## 🔧 Configuration

### Modal Registry

Register custom modals using `ModalRegistryOptions`:

```typescript
import { ModalRegistryOptions } from '@open-rlb/ng-bootstrap';

providers: [
  {
    provide: ModalRegistryOptions,
    useValue: {
      modals: {
        'my-custom-modal': MyCustomModalComponent,
      },
    },
    multi: true,
  },
];
```

### Toast Registry

Register custom toasts using `ToastRegistryOptions`:

```typescript
import { ToastRegistryOptions } from '@open-rlb/ng-bootstrap';

providers: [
  {
    provide: ToastRegistryOptions,
    useValue: {
      toasts: {
        'my-custom-toast': MyCustomToastComponent,
      },
    },
    multi: true,
  },
];
```

### Icons

Every icon the library draws goes through `RLB_ICONS`, named by meaning rather than by glyph. The
default set is [bootstrap-icons](https://icons.getbootstrap.com/), which is what `ng add` installs.
To point some or all of them at a different set, provide your own — names you leave out keep the
default:

```typescript
import { provideRlbIcons } from '@open-rlb/ng-bootstrap';

bootstrapApplication(AppComponent, {
  providers: [
    provideRlbBootstrap(),
    provideRlbIcons({
      refresh: 'fa-solid fa-arrows-rotate',
      delete: 'fa-solid fa-trash',
    }),
  ],
});
```

The full list of names is the `RlbIconSet` interface.

### Theme

Bootstrap 5.3 ships a full dark mode behind `data-bs-theme`. `provideRlbTheme()` drives it, keeps
the choice between visits and follows the operating system when asked to. It is deliberately **not**
part of `provideRlbBootstrap()`: an application that never asked for a theme should not suddenly
find `data-bs-theme` written on its `<html>`.

```typescript
import { provideRlbTheme } from '@open-rlb/ng-bootstrap';

bootstrapApplication(AppComponent, {
  providers: [provideRlbBootstrap(), provideRlbTheme()],
});
```

```html
<rlb-theme-toggle />
```

`ThemeService` exposes it as signals — `theme()` is what was asked for and may be `auto`,
`resolved()` is what Bootstrap was actually told. `storageKey: null` turns persistence off, and
`storage` takes anything with `getItem` / `setItem` for an application that keeps the preference on
the user's account.

### Defaults

Labels, page sizes and the date zone can be set once instead of on every element:

```typescript
import { provideRlbDefaults } from '@open-rlb/ng-bootstrap';

provideRlbDefaults({
  table: { pageSize: 25, pageSizes: [25, 50], actionsLabel: 'Azioni', sortLabel: 'Ordina' },
  date: { timezone: 'Europe/Rome' },
});
```

An element that says something still wins; anything left out keeps the built-in English word.

### Translations

The library does not depend on a translation library. Text a caller can pass in is an input with an
English default — `actionsLabel`, `loadMoreLabel`, `refreshLabel`, `sortLabel` — so translating it
is the caller's ordinary job. The one place a caller passes *keys* rather than text is
`rlb-form-fields`, whose field definitions are data; those resolve through `RLB_TRANSLATION_SERVICE`,
and are returned unchanged when nothing is registered.

Bridging `@ngx-translate/core` to it is one provider:

```typescript
import { TranslateService } from '@ngx-translate/core';
import { RLB_TRANSLATION_SERVICE } from '@open-rlb/ng-bootstrap';

providers: [{ provide: RLB_TRANSLATION_SERVICE, useExisting: TranslateService }];
```

The `rlbTranslate` pipe is exported for your own templates and resolves through the same token.

## 🤖 Claude Skills

The library ships the [Claude Code](https://claude.ai/code) skills that document its components
(`date-tz`, `rlb-components`, `rlb-inputs`, `rlb-modals`, `rlb-datatable`, `rlb-calendar`,
`rlb-design`). They travel inside the npm package, so every version you install carries the
guidance that matches it.

`ng add` copies them into your `.claude/skills/` and adds a `postinstall` script so they stay
current:

```json
{
  "scripts": {
    "postinstall": "ng g @open-rlb/ng-bootstrap:sync-skills"
  }
}
```

With that in place, any plain `npm install` — a fresh clone, a CI job, or pulling a teammate's
lockfile change — refreshes the skills to match the installed library version.

⚠️ **`npm update` does not trigger it.** npm only runs a project's own `postinstall` on a bare
`npm install`; targeted commands such as `npm update <pkg>` and `npm install <pkg>` skip root
lifecycle scripts. Follow an update with a bare install (which is a no-op for dependencies but does
run the script), or wrap it in a script:

```json
{
  "scripts": {
    "update:rlb": "npm update @open-rlb/ng-bootstrap && npm install"
  }
}
```

You can also run the schematic directly at any time:

```bash
ng g @open-rlb/ng-bootstrap:sync-skills
```

The sync is re-runnable and conservative:

- Skills the library ships are overwritten, so they always match the installed version.
- Skills you wrote yourself in `.claude/skills/` are never touched.
- Skills the library used to ship but no longer does are deleted. The list of library-owned folders
  is tracked in `.claude/skills/.rlb-skills.json`, which you should commit. Pass `--prune=false` to
  keep them instead.

**CI note:** the `postinstall` runs on every install, including in CI. It is idempotent, so an
up-to-date checkout produces no diff — but if someone bumps the library and forgets to commit the
refreshed skills, the install leaves a dirty working tree. If your pipeline asserts a clean tree,
set `RLB_SKIP_SKILL_SYNC=1` there and the schematic becomes a no-op.

Prefer to opt out entirely? `ng add @open-rlb/ng-bootstrap --skip-skills-auto-sync` installs the
skills once without the `postinstall`, and `--skip-skills` skips them altogether.

## 📚 Additional Resources

- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [Angular Documentation](https://angular.io/docs)
- [ngx-translate Documentation](https://github.com/ngx-translate/core)

## 👤 Author

**Giusseppe Riolo**

- Email: riolo.giuseppe@gmail.com
- GitHub: [@riologiuseppe](https://github.com/riologiuseppe)

## 👥 Contributors

**Denis**

- Email: [neorimne@gmail.com](mailto:neorimne@gmail.com)
- GitHub: [@Neorimne](https://github.com/Neorimne)

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private library. For contributions, please contact the maintainer.

---

Made with ❤️ using Angular and Bootstrap
