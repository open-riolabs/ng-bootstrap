import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Superseded by `RlbOffcanvasTitleDirective`, which is what `[rlb-offcanvas-title]` actually uses.
 *
 * Its selector `h*[rlb-offcanvas-title]` is not valid CSS — `h*` matches no element — so this
 * component has never matched anything, and the `offcanvas-title` class it means to apply never
 * landed. Kept exported so nothing breaks; write the attribute on a heading and the directive
 * handles it.
 */

@Component({
    selector: 'h*[rlb-offcanvas-title]',
    template: `<ng-content></ng-content>`,
    host: { class: 'offcanvas-title' },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffcanvasTitleComponent {}
