import { Component } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './option.component.html',
    standalone: false
})
export class OptionsComponent {

  html: string = `<rlb-option>text</rlb-option>`;
}
