import { Component } from '@angular/core';

@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    standalone: false
})
export class ColorsComponent {

  html: string = `<rlb-color></rlb-color>`;
}
