import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './dropdown.component.html',
})
export class DropdownsComponent {

  sample: string = `<rlb-dropdown>
  <button rlb-button rlb-dropdown>Dropdown Button</button>
  <rlb-dropdown-container>
    <p>Dropdown Container</p>
  </rlb-dropdown-container>
</rlb-dropdown>`;

  direction: string = `<rlb-dropdown [direction]="'right'">
  <button rlb-button rlb-dropdown>Dropdown Button</button>
  <rlb-dropdown-container>
    <p>Dropdown Container</p>
  </rlb-dropdown-container>
</rlb-dropdown>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './dropdown.component.html',
})
export class DropdownsComponent {}`;
}
