import { Component } from '@angular/core';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    standalone: false
})
export class NavsComponent {

  html: string = `<rlb-nav id="mainNav" horizontal-alignment="center" vertical="false" fill="true" pills="true" class="custom-nav-class">
 <rlb-nav-item href="#1">
  Home
 </rlb-nav-item>
 <rlb-nav-item href="#2">
  About
 </rlb-nav-item>
 <rlb-nav-item href="#3">
  Services
 </rlb-nav-item>
 <rlb-nav-item href="#4">
  Contact
 </rlb-nav-item>
</rlb-nav>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './nav.component.html',
})
export class NavsComponent {}`;
}
