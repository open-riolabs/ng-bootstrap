import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[component-host]',
    standalone: false
})
export class ComponentHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
