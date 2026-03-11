import {
  booleanAttribute,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  Renderer2,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { VisibilityEventBase } from '../../../shared/types';
import { Dropdown } from 'bootstrap';

@Component({
  selector: 'rlb-navbar-dropdown-item',
  template: `
    <ng-template #template>
      <li
        class="nav-item"
        [class.dropdown]="dropdown()"
      >
        <a
          class="nav-link {{ cssClass() }}"
          [class.dropdown-toggle]="dropdown()"
          [attr.role]="dropdown() || toggle() ? 'button' : undefined"
          [attr.data-bs-toggle]="dropdown() ? 'dropdown' : undefined"
          [attr.aria-expanded]="dropdown() || toggle() ? 'false' : undefined"
          [attr.data-bs-auto-close]="_autoClose()"
          [href]="dropdown() || toggle() ? '#' : href()"
          (click)="click.emit($event)"
        >
          <ng-content select=":not(rlb-dropdown-container)"></ng-content>
        </a>
        <ng-content select="rlb-dropdown-container"></ng-content>
      </li>
    </ng-template>
  `,
  standalone: false,
})
export class NavbarDropdownItemComponent implements OnInit, OnDestroy {
  element!: HTMLElement;
  private listeners: (() => void)[] = [];

  disabled = input(false, { alias: 'disabled', transform: booleanAttribute });
  dropdown = input(false, { alias: 'dropdown', transform: booleanAttribute });
  href = input<string | undefined>(undefined);
  cssClass = input('', { alias: 'class' });
  toggle = input<'offcanvas' | 'collapse' | 'tab' | 'pill' | 'buttons-group' | undefined>(
    undefined,
  );
  autoClose = input<'default' | 'inside' | 'outside' | 'manual'>('default', {
    alias: 'auto-close',
  });

  click = output<MouseEvent>();
  statusChanged = output<VisibilityEventBase>({ alias: 'status-changed' });

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

  template = viewChild.required<TemplateRef<any>>('template');

  private viewContainerRef = inject(ViewContainerRef);
  private renderer = inject(Renderer2);
  private dropdownInstance?: Dropdown;

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template());
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();

    const anchor = this.element.querySelector('a');

    if (anchor && this.dropdown()) {
      anchor.setAttribute('data-bs-auto-close', this._autoClose());
      this.dropdownInstance = Dropdown.getOrCreateInstance(anchor);
      this.listeners.push(
        this.renderer.listen(anchor, 'show.bs.dropdown', () => this.statusChanged.emit('show')),
        this.renderer.listen(anchor, 'shown.bs.dropdown', () => this.statusChanged.emit('shown')),
        this.renderer.listen(anchor, 'hide.bs.dropdown', () => this.statusChanged.emit('hide')),
        this.renderer.listen(anchor, 'hidden.bs.dropdown', () => this.statusChanged.emit('hidden')),
      );
    }
  }

  open() {
    this.dropdownInstance?.show();
  }

  close() {
    this.dropdownInstance?.hide();
  }

  toggleDropdown() {
    this.dropdownInstance?.toggle();
  }

  ngOnDestroy() {
    this.listeners.forEach(unsub => unsub());
    this.listeners = [];
  }
}
