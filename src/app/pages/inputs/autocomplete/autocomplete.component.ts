import { Component } from '@angular/core';

@Component({
    selector: 'app-autocomplete',
    templateUrl: './autocomplete.component.html',
    standalone: false
})
export class AutocompletesComponent {

  html: string = `<rlb-autocomplete></rlb-autocomplete>`;
}
