import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './button.component.html',
})
export class ButtonsComponent {

color: string = `<button rlb-button [color]="'primary'">Search</button>
<button rlb-button [color]="'secondary'">Search</button>
<button rlb-button [color]="'success'">Search</button>
<button rlb-button [color]="'danger'">Search</button>
<button rlb-button [color]="'warning'">Search</button>
<button rlb-button [color]="'info'">Search</button>
<button rlb-button [color]="'light'">Search</button>
<button rlb-button [color]="'dark'">Search</button>`;
  
  size: string = `<button rlb-button [size]="'sm'">Search</button>
<button rlb-button [size]="'md'">Search</button>
<button rlb-button [size]="'lg'">Search</button>`;

  disabled: string = `<button rlb-button [disabled]="true">Search</button>`;

  outline: string = `<button rlb-button [outline]="true">Search</button>`;

  isLink: string = `<button rlb-button [isLink]="true">Search</button>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './button.component.html',
})
export class ButtonsComponent {}`;
}
