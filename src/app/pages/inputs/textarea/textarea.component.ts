import { Component } from '@angular/core';

@Component({
	selector: 'app-textarea',
	templateUrl: './textarea.component.html',
	standalone: false
})
export class TextareasComponent {
  html: string = `<rlb-textarea></rlb-textarea>`;
}
