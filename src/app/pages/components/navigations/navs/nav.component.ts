import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './nav.component.html',
})
export class NavsComponent {

  html: string = `<rlb-nav id="mainNav" horizontal-alignment="center" vertical="false" fill="true" pills="true" class="custom-nav-class">
  <rlb-nav-item>
    <a class="nav-link active" href="#home">Home</a>
  </rlb-nav-item>
  <rlb-nav-item>
    <a class="nav-link" href="#about">About</a>
  </rlb-nav-item>
  <rlb-nav-item>
    <a class="nav-link" href="#services">Services</a>
  </rlb-nav-item>
  <rlb-nav-item>
    <a class="nav-link" href="#contact">Contact</a>
  </rlb-nav-item>
</rlb-nav>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './nav.component.html',
})
export class NavsComponent {}`;
}
