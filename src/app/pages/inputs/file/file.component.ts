import { Component } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './file.component.html',
    standalone: false
})
export class FilesComponent {

  html: string = `<rlb-file></rlb-file>`;
}
