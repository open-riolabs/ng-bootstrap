import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './dropdown.component.html',
})
export class DropdownsComponent {

  html: string = `<rlb-dropdown>
          <button rlb-button rlb-dropdown after outline
            autoClose="outside">
            this is a dropdown
          </button>
          <rlb-dropdown-container>
            <p>This is the content</p>
          </rlb-dropdown-container>
        </rlb-dropdown>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './dropdown.component.html',
})
export class DropdownsComponent {}`;
}
