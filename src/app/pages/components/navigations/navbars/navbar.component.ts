import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../../shared/docs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class NavbarsComponent {
  basicExample = `<rlb-navbar color="primary" [dark]="true" expand="lg">
  <a rlb-navbar-brand href="#">My App</a>
  <rlb-navbar-items>
    <rlb-navbar-item router-link="/home">Home</rlb-navbar-item>
    <rlb-navbar-item router-link="/about">About</rlb-navbar-item>
  </rlb-navbar-items>
</rlb-navbar>`;

  textExample = `<rlb-navbar color="secondary" [dark]="true" expand="lg">
  <a rlb-navbar-brand href="#">Brand</a>
  <rlb-navbar-text>Signed in as Admin</rlb-navbar-text>
</rlb-navbar>`;

  dropdownExample = `<rlb-navbar color="dark" [dark]="true" expand="lg" [enable-dropdown-toggler]="true">
  <a rlb-navbar-brand href="#">Brand</a>
  <rlb-navbar-items>
    <rlb-navbar-item router-link="/home">Home</rlb-navbar-item>
    <rlb-navbar-dropdown-item [dropdown]="true">
      Dropdown
      <rlb-dropdown-container>
        <li rlb-dropdown-item>Action</li>
        <li rlb-dropdown-item>Another action</li>
      </rlb-dropdown-container>
    </rlb-navbar-dropdown-item>
  </rlb-navbar-items>
</rlb-navbar>`;

  formExample = `<rlb-navbar color="light" [dark]="false" expand="lg">
  <a rlb-navbar-brand href="#">Brand</a>
  <rlb-navbar-form>
    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
    <button rlb-button color="primary" type="submit">Search</button>
  </rlb-navbar-form>
</rlb-navbar>`;

  separatorExample = `<rlb-navbar color="primary" [dark]="true" expand="lg">
  <a rlb-navbar-brand href="#">Brand</a>
  <rlb-navbar-items>
    <rlb-navbar-item router-link="/home">Home</rlb-navbar-item>
    <rlb-navbar-separator />
    <rlb-navbar-item router-link="/settings">Settings</rlb-navbar-item>
  </rlb-navbar-items>
</rlb-navbar>`;

  navbarApi: DocApiRow[] = [
    { name: 'dark', type: 'boolean', default: 'true', description: 'Sets the Bootstrap data-bs-theme to "dark" (true) or "light" (false) on the nav element.', kind: 'Input' },
    { name: 'color', type: 'Color', default: 'undefined', description: 'Bootstrap contextual background color applied as bg-{color} (e.g. primary, secondary, dark).', kind: 'Input' },
    { name: 'expand', type: "'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'always'", default: 'undefined', description: 'Breakpoint at which the navbar expands. Use "always" for navbar-expand without a breakpoint.', kind: 'Input' },
    { name: 'placement', type: "'fixed-top' | 'fixed-bottom' | 'sticky-top' | 'sticky-bottom'", default: 'undefined', description: 'Positions the navbar using Bootstrap placement utilities.', kind: 'Input' },
    { name: 'class', type: 'string', default: "''", description: 'Additional CSS classes to apply to the nav element.', kind: 'Input' },
    { name: 'showSideBarToggler', type: 'boolean', default: 'true', description: 'Show or hide the sidebar toggle button on the left side of the navbar.', kind: 'Input' },
    { name: 'enable-dropdown-toggler', type: 'boolean', default: 'false', description: 'Show the Bootstrap collapse toggler button for mobile breakpoints.', kind: 'Input' },
  ];

  navbarItemsApi: DocApiRow[] = [
    { name: 'scroll', type: 'string', default: 'undefined', description: 'Enables scrollable nav items by applying navbar-nav-scroll and sets the --bs-scroll-height CSS variable.', kind: 'Input' },
    { name: 'class', type: 'string', default: "''", description: 'Additional CSS classes to apply to the ul.navbar-nav element.', kind: 'Input' },
    { name: 'click', type: 'MouseEvent', description: 'Emitted when any child rlb-navbar-item is clicked. Bubbles up from all contained items.', kind: 'Output' },
  ];

  navbarItemApi: DocApiRow[] = [
    { name: 'router-link', type: 'string', default: 'undefined', description: 'Route path passed to the Angular RouterLink directive. Adds the active class automatically via routerLinkActive.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Marks the nav item as disabled.', kind: 'Input' },
    { name: 'class', type: 'string', default: "''", description: 'Additional CSS classes applied to the inner a.nav-link element.', kind: 'Input' },
    { name: 'click', type: 'MouseEvent', description: 'Emitted when the nav link anchor is clicked.', kind: 'Output' },
  ];

  navbarDropdownItemApi: DocApiRow[] = [
    { name: 'dropdown', type: 'boolean', default: 'false', description: 'Enables Bootstrap dropdown behavior: adds the dropdown-toggle class, data-bs-toggle and aria-expanded attributes.', kind: 'Input' },
    { name: 'href', type: 'string', default: 'undefined', description: 'href applied to the anchor. Ignored when dropdown or toggle is set (replaced with #).', kind: 'Input' },
    { name: 'toggle', type: "'offcanvas' | 'collapse' | 'tab' | 'pill' | 'buttons-group'", default: 'undefined', description: 'Activates the item as a Bootstrap toggle trigger for the specified component type.', kind: 'Input' },
    { name: 'auto-close', type: "'default' | 'inside' | 'outside' | 'manual'", default: "'default'", description: 'Controls Bootstrap dropdown auto-close behavior (maps to data-bs-auto-close).', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Marks the item as disabled.', kind: 'Input' },
    { name: 'class', type: 'string', default: "''", description: 'Additional CSS classes applied to the inner a.nav-link element.', kind: 'Input' },
    { name: 'click', type: 'MouseEvent', description: 'Emitted when the nav link anchor is clicked.', kind: 'Output' },
    { name: 'status-changed', type: "'show' | 'shown' | 'hide' | 'hidden'", description: 'Emitted on Bootstrap dropdown lifecycle events (only fires when dropdown is true).', kind: 'Output' },
    { name: 'open()', type: 'void', description: 'Programmatically opens the Bootstrap dropdown.', kind: 'Method' },
    { name: 'close()', type: 'void', description: 'Programmatically closes the Bootstrap dropdown.', kind: 'Method' },
    { name: 'toggleDropdown()', type: 'void', description: 'Programmatically toggles the Bootstrap dropdown.', kind: 'Method' },
  ];

  navbarFormApi: DocApiRow[] = [
    { name: 'role', type: 'string', default: 'undefined', description: 'ARIA role applied to the form element.', kind: 'Input' },
    { name: 'class', type: 'string', default: "''", description: 'Additional CSS classes applied to the form element.', kind: 'Input' },
  ];

  navbarBrandApi: DocApiRow[] = [
    { name: '(no inputs)', type: '', description: 'Structural directive — adds the navbar-brand CSS class to the host element. Apply to an <a> or <span>.', kind: 'Content' },
  ];

  navbarSeparatorApi: DocApiRow[] = [
    { name: 'class', type: 'string', default: "''", description: 'Additional CSS classes applied to the separator li element.', kind: 'Input' },
  ];
}
