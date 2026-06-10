---
name: rlb-design
description: Bootstrap 5.3 + @open-rlb/ng-bootstrap design guidance for layout, spacing, typography, color palette, and responsive design. Use when making visual or design decisions for UIs in this project.
---

# RLB Bootstrap 5.3 Design Skill

You are an expert in designing Angular UIs using **Bootstrap 5.3** with the **@open-rlb/ng-bootstrap** component library. This skill guides layout, spacing, typography, color, and responsive design decisions.

## Bootstrap 5.3 Color Palette

The library uses a typed `Color` union:
```typescript
type Color = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
```

All components that accept a `color` input use this type.

## Layout & Grid

Use Bootstrap's 12-column grid system:
```html
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">...</div>
  </div>
</div>
```

Breakpoints: `xs` (default), `sm` (576px), `md` (768px), `lg` (992px), `xl` (1200px), `xxl` (1400px).

## Spacing

Use Bootstrap spacing utilities `m-{size}`, `p-{size}`, `gap-{size}` (0–5, auto).
Directional: `mt`, `mb`, `ms`, `me`, `mx`, `my`, `pt`, `pb`, `ps`, `pe`, `px`, `py`.

## Typography

- Headings: `h1`–`h6`, `.display-1`–`.display-6`
- Text utilities: `fw-bold`, `fw-semibold`, `fst-italic`, `text-{color}`, `text-{align}`
- Size: `fs-1`–`fs-6`
- Truncation: `text-truncate`, `text-break`

## Flexbox & Grid Utilities

```html
<div class="d-flex align-items-center justify-content-between gap-2">...</div>
<div class="d-grid gap-2">...</div>
```

## Background & Border

- Background: `bg-{color}`, `bg-opacity-{10|25|50|75|100}`
- Border: `border`, `border-{color}`, `border-{size}`, `rounded`, `rounded-{size}`, `rounded-pill`
- Shadow: `shadow-sm`, `shadow`, `shadow-lg`

## Sizing Utilities

- Width: `w-25`, `w-50`, `w-75`, `w-100`, `w-auto`, `mw-100`, `vw-100`
- Height: `h-25`, `h-50`, `h-75`, `h-100`, `h-auto`, `vh-100`, `min-vh-100`

## Overflow & Position

- `overflow-auto`, `overflow-hidden`, `overflow-scroll`
- `position-relative`, `position-absolute`, `position-fixed`, `position-sticky`
- `top-0`, `start-0`, `bottom-0`, `end-0`, `translate-middle`

## Visibility & Display

- `d-none`, `d-{bp}-block`, `d-{bp}-flex`, `d-{bp}-none`
- `visible`, `invisible`

## RLB Theme Conventions

- Use `color="primary"` for main actions, `color="secondary"` for secondary.
- Use `color="danger"` for destructive actions (delete, remove).
- Use `color="success"` / `color="warning"` / `color="info"` for status feedback.
- Prefer `outline` buttons for secondary actions inside cards or toolbars.
- Use `size="sm"` for table rows and dense UIs; `size="lg"` for hero sections.

## Page Layout Pattern

```html
<div class="container-fluid p-0 d-flex flex-column min-vh-100">
  <rlb-navbar>...</rlb-navbar>
  <div class="d-flex flex-grow-1 overflow-hidden">
    <rlb-sidebar>...</rlb-sidebar>
    <main class="flex-grow-1 overflow-auto p-3">
      <!-- page content -->
    </main>
  </div>
</div>
```

## Card-based Sections

```html
<div class="row g-3">
  <div class="col-12 col-md-6 col-xl-4">
    <rlb-card>
      <rlb-card-header>Title</rlb-card-header>
      <rlb-card-body>Content</rlb-card-body>
    </rlb-card>
  </div>
</div>
```

## Responsive Helpers

- Hide on mobile: `d-none d-md-block`
- Show only on mobile: `d-block d-md-none`
- Stack to row on md+: `flex-column flex-md-row`

## Design Principles

1. Mobile-first: design for small screens, enhance for larger ones.
2. Prefer utility classes over custom CSS.
3. Use semantic HTML (`main`, `section`, `nav`, `aside`).
4. Keep component `color` consistent with the app's design tokens.
5. Use `gap-*` on flex/grid containers instead of margin on children.
