import { Component } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './autocomplete.component.html',
    standalone: false
})
export class AutocompletesComponent {

  html: string = `<rlb-autocomplete></rlb-autocomplete>`;
}
