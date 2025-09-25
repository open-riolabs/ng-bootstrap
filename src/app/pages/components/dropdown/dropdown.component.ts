import { Component } from '@angular/core';

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    standalone: false
})
export class DropdownsComponent {
  message: number = 0;
  
  onStatus(event: 'show' | 'shown' | 'hide' | 'hidden') {
    console.log('Dropdown status:', event);
    this.message++
  }
  
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
	
	links: string = `<rlb-dropdown>
 <button rlb-button rlb-dropdown>Dropdown Links</button>
 <ul rlb-dropdown-menu>
  <li rlb-dropdown-item link="/">Home (root path)</li>
  <li rlb-dropdown-item link="/getting-started">Getting started (Absolute path)</li>
  <li rlb-dropdown-item link="not-found">Not found (Relative path)</li>
 </ul>
</rlb-dropdown>
	`
  
  offset: string = `<rlb-dropdown>
 <button rlb-button rlb-dropdown [offset]="[10, 25]">
  Dropdown Button
 </button>
 <rlb-dropdown-container>
  <p>Custom content inside dropdown</p>
 </rlb-dropdown-container>
</rlb-dropdown>`
  
  placement: string = `<rlb-dropdown>
 <button rlb-button rlb-dropdown>Dropdown Button responsive placement</button>
 <rlb-dropdown-container [placement]="'right'" [placement-lg]="'left'">
  <p>Custom content inside dropdown</p>
 </rlb-dropdown-container>
</rlb-dropdown>
  `
  
  statusChange: string = `<rlb-dropdown>
 <button rlb-button rlb-dropdown (status-changed)="onStatus($event)">Dropdown</button>
 <rlb-dropdown-container>Content</rlb-dropdown-container>
</rlb-dropdown>`

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './dropdown.component.html',
})
export class DropdownsComponent {}`;
}
