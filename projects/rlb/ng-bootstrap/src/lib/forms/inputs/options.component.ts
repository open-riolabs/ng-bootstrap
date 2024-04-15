import { Component, Input, ViewContainerRef, Injector, TemplateRef, ViewChild, OnInit, EmbeddedViewRef, booleanAttribute } from '@angular/core';
import { WrappedComponent } from '../../shared/wrapped.component';
import { HostWrapper } from '../../shared/host-wrapper';

@Component({
  selector: 'rlb-option',
  template: `
    <ng-template #template>
      <option
        [attr.disabled]="disabled ? true : undefined"
        [attr.value]="value"
      >
        <ng-content></ng-content>
      </option>
    </ng-template>
  <ng-content></ng-content>`,
})
export class OptionComponent implements OnInit {
  @Input({ alias: 'disabled', transform: booleanAttribute }) disabled = false;
  @Input() value!: string | number | null | undefined;

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  constructor(private viewContainerRef: ViewContainerRef) { }
  private temp!: EmbeddedViewRef<any>;

  get _view() {
    return this.temp
  }

  ngOnInit() {
    this.temp = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
  }
}
