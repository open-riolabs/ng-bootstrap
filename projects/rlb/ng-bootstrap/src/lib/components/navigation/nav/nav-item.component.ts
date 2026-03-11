import {
  booleanAttribute,
  Component,
  input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'rlb-nav-item',
  template: ` <ng-template #template>
    <li class="nav-item {{ cssClass() }}">
      <a
        class="nav-link"
        [class.active]="active()"
        [attr.aria-current]="active() ? 'page' : undefined"
        [class.disabled]="disabled()"
        [attr.disabled]="disabled() ? true : null"
        [attr.href]="href() || null"
      >
        <ng-content></ng-content>
      </a>
    </li>
  </ng-template>`,
  standalone: false
})
export class NavItemComponent implements OnInit {
  element!: HTMLElement;

  active = input(false, { alias: 'active', transform: booleanAttribute });
  disabled = input(false, { transform: booleanAttribute });
  cssClass = input('', { alias: 'class' });
  href = input<string | undefined>(undefined);

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
