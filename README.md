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
- [Additional Resources](#-additional-resources)
- [Author](#-author)
- [Contributors](#-contributors)
- [License](#-license)
- [Contributing](#-contributing)

## ✨ Features

- **Bootstrap 5** based components
- **Angular 20+** compatible
- **TypeScript** support
- **i18n** ready with `@ngx-translate/core`
- **Accessible** components following Bootstrap patterns
- **Customizable** styling with SCSS
- **Form validation** built-in
- **Calendar** component with event management
- **Data tables** with advanced features
- **Modal** and **Toast** systems with registry support

## 📦 Installation

Install the package via npm:

```bash
npm install @open-rlb/ng-bootstrap
```

### Peer Dependencies

Make sure you have the following peer dependencies installed:

```bash
npm install bootstrap@>=5.3.0 @types/bootstrap@>5.2.0 @open-rlb/date-tz@>=2.0.1
```

### Required Angular Dependencies

This library requires Angular 20+ and the following packages:

```bash
npm install @angular/core@^20.1.0 @angular/common@^20.1.0 @angular/forms@^20.1.0 @angular/router@^20.1.0
npm install @ngx-translate/core@^16.0.4
npm install bootstrap-icons@^1.13.1
```

## 🚀 Getting Started

### 1. Import the Module

In your `app.module.ts` or standalone component:

```typescript
import { RlbBootstrapModule } from '@open-rlb/ng-bootstrap';

@NgModule({
  imports: [
    RlbBootstrapModule,
    // ... other modules
  ]
})
export class AppModule { }
```

Or using the standalone provider function:

```typescript
import { provideRlbBootstrap } from '@open-rlb/ng-bootstrap';

bootstrapApplication(AppComponent, {
  providers: [
    provideRlbBootstrap(),
    // ... other providers
  ]
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
<rlb-input [label]="'Username'" [(ngModel)]="username"></rlb-input>
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

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI 20+

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
        'my-custom-modal': MyCustomModalComponent
      }
    },
    multi: true
  }
]
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
        'my-custom-toast': MyCustomToastComponent
      }
    },
    multi: true
  }
]
```

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
