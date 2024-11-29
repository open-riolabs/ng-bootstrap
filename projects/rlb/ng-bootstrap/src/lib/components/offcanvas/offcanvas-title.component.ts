import { Component } from '@angular/core';

@Component({
    selector: 'h*[rlb-offcanvas-title]',
    template: `<ng-content></ng-content>`,
    host: { class: 'offcanvas-title' },
    standalone: false
})
export class OffcanvasTitleComponent {}
