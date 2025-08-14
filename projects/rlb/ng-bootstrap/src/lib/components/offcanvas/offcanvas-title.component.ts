import { Component } from '@angular/core';

// TODO
// Ask if we need this component, RlbOffcanvasTitleDirective should be more flexible and useful

@Component({
    selector: 'h*[rlb-offcanvas-title]',
    template: `<ng-content></ng-content>`,
    host: { class: 'offcanvas-title' },
    standalone: false
})
export class OffcanvasTitleComponent {}
