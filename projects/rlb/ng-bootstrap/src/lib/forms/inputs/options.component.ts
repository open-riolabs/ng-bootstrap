import { Component, EmbeddedViewRef, OnInit, TemplateRef, ViewContainerRef, booleanAttribute, input, viewChild } from '@angular/core';

@Component({
  selector: 'rlb-option',
  template: `
    <ng-template #template>
      <option
        [attr.disabled]="disabled() ? true : undefined"
        [attr.value]="value()"
      >
        <ng-content></ng-content>
      </option>
    </ng-template>
  <ng-content></ng-content>`,
  standalone: false
})
export class OptionComponent implements OnInit {
  private temp!: EmbeddedViewRef<any>;

  disabled = input(undefined, { transform: booleanAttribute });
  value = input<string | number | null>();
  cssValue = input<string | number | null>(undefined, { alias: 'class' });

  template = viewChild.required<TemplateRef<any>>('template');

  constructor(private viewContainerRef: ViewContainerRef) { }

  get _view() {
    return this.temp;
  }

  ngOnInit() {
    this.temp = this.viewContainerRef.createEmbeddedView(
      this.template(),
    );
  }
}
