import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../shared-imports';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [SHARED_IMPORTS],
})
export class HomeComponent {
  installCmd = 'ng add @open-rlb/ng-bootstrap';
  copied = false;

  copy() {
    navigator.clipboard?.writeText(this.installCmd);
    this.copied = true;
    setTimeout(() => (this.copied = false), 1500);
  }
}
