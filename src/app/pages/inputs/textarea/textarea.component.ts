import { Component } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './textarea.component.html',
    standalone: false
})
export class TextareasComponent {

  html: string = `<rlb-textarea></rlb-textarea>`;
}
