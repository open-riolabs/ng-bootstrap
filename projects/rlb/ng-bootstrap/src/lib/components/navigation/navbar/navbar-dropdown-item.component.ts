import {
  booleanAttribute,
  Component,
  computed,
  input,
  OnInit,
  output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'rlb-navbar-dropdown-item',
  template: ` <ng-template #template>
    <li class="nav-item" [class.dropdown]="dropdown()">
      <a
        class="nav-link {{ cssClass() }}"
        [class.dropdown-toggle]="dropdown()"
        [attr.role]="(dropdown() || toggle()) ? 'button' : undefined"
        [attr.data-bs-toggle]="dropdown() ? 'dropdown' : undefined"
        [attr.aria-expanded]="(dropdown() || toggle()) ? 'false' : undefined"
        [attr.data-bs-auto-close]="_autoClose()"
        [href]="(dropdown() || toggle()) ? '#' : href()"
        (click)="click.emit($event)"
      >
        <ng-content select=":not(rlb-dropdown-container)"></ng-content>
      </a>
      <ng-content select="rlb-dropdown-container"></ng-content>
    </li>
  </ng-template>`,
  standalone: false
})
export class NavbarDropdownItemComponent implements OnInit {
  element!: HTMLElement;

  disabled = input(false, { alias: 'disabled', transform: booleanAttribute });
  dropdown = input(false, { alias: 'dropdown', transform: booleanAttribute });
  href = input<string | undefined>(undefined);
  cssClass = input('', { alias: 'class' });
  toggle = input<'offcanvas' | 'collapse' | 'tab' | 'pill' | 'buttons-group' | undefined>(undefined);
  autoClose = input<'default' | 'inside' | 'outside' | 'manual'>('default', { alias: 'auto-close' });

  click = output<MouseEvent>();

  _autoClose = computed(() => {
    switch (this.autoClose()) {
      case 'default':
        return 'true';
      case 'inside':
        return 'inside';
      case 'outside':
        return 'outside';
      case 'manual':
        return 'false';
      default:
        return 'true';
    }
  });

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
