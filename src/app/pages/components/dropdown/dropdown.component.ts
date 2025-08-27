import { Component } from '@angular/core';

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    standalone: false
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
  
  autoclose: string = `<rlb-dropdown>
  <button rlb-button rlb-dropdown [auto-close]="'manual'">
    Manual Dropdown
  </button>
  <rlb-dropdown-container>
    <p>This dropdown won’t auto-close.</p>
  </rlb-dropdown-container>
</rlb-dropdown>`
  
  items: string = `<rlb-dropdown>
  <button rlb-button rlb-dropdown>Dropdown List</button>
  <ul rlb-dropdown-menu>
    <li rlb-dropdown-item active>Active Item</li>
    <li rlb-dropdown-item>Normal Item</li>
    <li rlb-dropdown-item disabled>Disabled Item</li>
    <li rlb-dropdown-item divider></li>
    <li rlb-dropdown-item header>Header</li>
  </ul>
</rlb-dropdown>`

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './dropdown.component.html',
})
export class DropdownsComponent {}`;
}
