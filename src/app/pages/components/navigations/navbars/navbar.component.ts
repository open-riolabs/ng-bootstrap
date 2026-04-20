import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../../shared-imports';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [SHARED_IMPORTS],
})
export class NavbarsComponent {
  html: string = `<rlb-navbar color="primary" dark="true" expand="lg" placement="fixed-top" class="my-custom-navbar">
  <rlb-navbar-text>
    <span class="navbar-text">This is a Navbar</span>
  </rlb-navbar-text>
</rlb-navbar>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './navbar.component.html',
})
export class NavbarsComponent {}`;
}
