import { Component } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './datalist.component.html',
    standalone: false
})
export class DatalistsComponent {

  html: string = `<rlb-datalist></rlb-datalist>`;
}
