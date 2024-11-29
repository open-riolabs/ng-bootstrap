import { Component } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './filednd.component.html',
    standalone: false
})
export class FileDndsComponent {

  html: string = `<rlb-file-dnd></rlb-file-dnd>`;
}
