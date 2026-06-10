import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../../shared/docs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class NavsComponent {
  basicExample = `<rlb-nav>
  <rlb-nav-item href="#">Home</rlb-nav-item>
  <rlb-nav-item href="#">About</rlb-nav-item>
  <rlb-nav-item href="#">Services</rlb-nav-item>
  <rlb-nav-item href="#" disabled>Contact</rlb-nav-item>
</rlb-nav>`;

  tabsExample = `<rlb-nav view="tabs">
  <rlb-nav-item href="#" active>Home</rlb-nav-item>
  <rlb-nav-item href="#">Profile</rlb-nav-item>
  <rlb-nav-item href="#">Messages</rlb-nav-item>
  <rlb-nav-item href="#" disabled>Settings</rlb-nav-item>
</rlb-nav>`;

  pillsExample = `<rlb-nav pills>
  <rlb-nav-item href="#" active>Home</rlb-nav-item>
  <rlb-nav-item href="#">Profile</rlb-nav-item>
  <rlb-nav-item href="#">Messages</rlb-nav-item>
</rlb-nav>`;

  underlineExample = `<rlb-nav underline>
  <rlb-nav-item href="#" active>Home</rlb-nav-item>
  <rlb-nav-item href="#">Profile</rlb-nav-item>
  <rlb-nav-item href="#">Messages</rlb-nav-item>
</rlb-nav>`;

  fillExample = `<rlb-nav view="tabs" fill="true">
  <rlb-nav-item href="#" active>Home</rlb-nav-item>
  <rlb-nav-item href="#">Profile</rlb-nav-item>
  <rlb-nav-item href="#">Messages</rlb-nav-item>
</rlb-nav>`;

  justifiedExample = `<rlb-nav view="tabs" fill="justified">
  <rlb-nav-item href="#" active>Home</rlb-nav-item>
  <rlb-nav-item href="#">Profile</rlb-nav-item>
  <rlb-nav-item href="#">Messages</rlb-nav-item>
</rlb-nav>`;

  verticalExample = `<rlb-nav pills vertical>
  <rlb-nav-item href="#" active>Home</rlb-nav-item>
  <rlb-nav-item href="#">Profile</rlb-nav-item>
  <rlb-nav-item href="#">Messages</rlb-nav-item>
</rlb-nav>`;

  alignmentExample = `<rlb-nav horizontal-alignment="center">
  <rlb-nav-item href="#" active>Home</rlb-nav-item>
  <rlb-nav-item href="#">Profile</rlb-nav-item>
  <rlb-nav-item href="#">Messages</rlb-nav-item>
</rlb-nav>

<rlb-nav horizontal-alignment="end">
  <rlb-nav-item href="#" active>Home</rlb-nav-item>
  <rlb-nav-item href="#">Profile</rlb-nav-item>
  <rlb-nav-item href="#">Messages</rlb-nav-item>
</rlb-nav>`;

  navApi: DocApiRow[] = [
    {
      name: 'view',
      type: "'tab' | 'tabs' | 'pills' | 'underline' | 'none'",
      default: "'tab'",
      description: "Sets the visual style of the nav. Use 'tab' or 'tabs' for tabbed appearance, 'pills' for pill style, 'underline' for underline style, or 'none' for plain links.",
      kind: 'Input',
    },
    {
      name: 'pills',
      type: 'boolean',
      default: 'false',
      description: 'Shorthand to apply the pills visual style. Takes precedence over the view input.',
      kind: 'Input',
    },
    {
      name: 'tabs',
      type: 'boolean',
      default: 'false',
      description: 'Shorthand to apply the tabs visual style. Takes precedence over the view input when pills is false.',
      kind: 'Input',
    },
    {
      name: 'underline',
      type: 'boolean',
      default: 'false',
      description: 'Shorthand to apply the underline visual style.',
      kind: 'Input',
    },
    {
      name: 'fill',
      type: "'fill' | 'justified' | boolean",
      default: 'undefined',
      description: "Controls how nav items fill available width. Use 'fill' or true for proportional fill, 'justified' for equal-width items.",
      kind: 'Input',
    },
    {
      name: 'vertical',
      type: 'boolean',
      default: 'false',
      description: 'Stack nav items vertically using flex-column.',
      kind: 'Input',
    },
    {
      name: 'horizontal-alignment',
      type: "'center' | 'end'",
      default: 'undefined',
      description: 'Aligns nav items horizontally. Omit for default (start) alignment.',
      kind: 'Input',
    },
    {
      name: 'class',
      type: 'string',
      default: "''",
      description: 'Additional CSS classes applied to the inner <ul> element.',
      kind: 'Input',
    },
  ];

  navItemApi: DocApiRow[] = [
    {
      name: 'href',
      type: 'string',
      default: 'undefined',
      description: 'Link target for the nav item anchor (e.g. a URL or #id fragment).',
      kind: 'Input',
    },
    {
      name: 'active',
      type: 'boolean',
      default: 'false',
      description: 'Marks the item as active. Applies the active CSS class and sets aria-current="page".',
      kind: 'Input',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables the nav link, adding the disabled CSS class and the disabled attribute.',
      kind: 'Input',
    },
    {
      name: 'class',
      type: 'string',
      default: "''",
      description: 'Additional CSS classes applied to the outer <li> element.',
      kind: 'Input',
    },
  ];
}
