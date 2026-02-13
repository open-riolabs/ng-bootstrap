import {
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
  input,
} from '@angular/core';

@Component({
  selector: 'rlb-tab',
  template: ` <ng-template #template>
    <li class="nav-item {{ cssClass() }}" role="presentation">
      <button
        class="nav-link"
        type="button"
        role="tab"
        [class.active]="active()"
        [disabled]="disabled()"
        toggle="tab"
        [attr.id]="target() + '-rlb-tab'"
        [toggle-target]="target()"
        [attr.aria-selected]="active()"
      >
        <ng-content></ng-content>
      </button>
    </li>
  </ng-template>`,
  host: {
    '[attr.class]': 'undefined',
    '[attr.id]': 'undefined',
  },
  standalone: false
})
export class TabComponent {
  element!: HTMLElement;

  active = input(false, { alias: 'active', transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  target = input.required<string>({ alias: 'target' });
  cssClass = input('', { alias: 'class' });

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
