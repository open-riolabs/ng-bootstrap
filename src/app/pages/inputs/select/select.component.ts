import { Component } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './select.component.html',
    standalone: false
})
export class SelectsComponent {

  html: string = `<rlb-select></rlb-select>`;
}
