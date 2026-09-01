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
- **i18n** ready with `@ngx-translate/core`
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

### Required Angular Dependencies

This library requires **Angular 22** (`>=22.0.0 <23.0.0`) and the following packages:

```bash
npm install @angular/core@^22.0.0 @angular/common@^22.0.0 @angular/forms@^22.0.0 @angular/router@^22.0.0
npm install @angular/cdk@^22.0.0
npm install @ngx-translate/core@^17.0.0
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

### 2. Include Bootstrap Styles

Add Bootstrap CSS to your `angular.json` or import in your main styles file:

```scss
@import 'bootstrap/scss/bootstrap';
@import 'bootstrap-icons/font/bootstrap-icons';
```

### 3. Use Components

```html
<rlb-button [variant]="'primary'">Click Me</rlb-button>
<rlb-alert [variant]="'success'">Success message</rlb-alert>
<rlb-input
  [label]="'Username'"
  [(ngModel)]="username"
></rlb-input>
```

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
- **DataTable** - Advanced data tables with sorting, filtering, and pagination

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
