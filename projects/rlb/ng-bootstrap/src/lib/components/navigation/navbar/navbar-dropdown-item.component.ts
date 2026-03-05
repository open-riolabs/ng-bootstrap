import {
  booleanAttribute,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  Renderer2,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

import { Dropdown } from 'bootstrap';
import { VisibilityEventBase } from '../../../shared/types';

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
export class NavbarDropdownItemComponent {
  element!: HTMLElement;
  private dropdownInstance?: Dropdown;
  private viewContainerRef = inject(ViewContainerRef);
  private renderer = inject(Renderer2);
  private destroyRef = inject(DestroyRef);

  template = viewChild.required<TemplateRef<any>>('template');

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

  constructor() {
    effect(() => {
      const template = this.template();
      const dropdownEnabled = this.dropdown();

      const templateView = this.viewContainerRef.createEmbeddedView(template);
      this.element = templateView.rootNodes[0];

      this.viewContainerRef.element.nativeElement.remove();

      const anchor = this.element.querySelector('a');

      if (!anchor || !dropdownEnabled) return;

      this.dropdownInstance = Dropdown.getOrCreateInstance(anchor);

      const unsubShow = this.renderer.listen(anchor, 'show.bs.dropdown', () =>
        this.statusChanged.emit('show'),
      );

      const unsubShown = this.renderer.listen(anchor, 'shown.bs.dropdown', () =>
        this.statusChanged.emit('shown'),
      );

      const unsubHide = this.renderer.listen(anchor, 'hide.bs.dropdown', () =>
        this.statusChanged.emit('hide'),
      );

      const unsubHidden = this.renderer.listen(anchor, 'hidden.bs.dropdown', () =>
        this.statusChanged.emit('hidden'),
      );

      this.destroyRef.onDestroy(() => {
        unsubShow();
        unsubShown();
        unsubHide();
        unsubHidden();
        this.dropdownInstance?.dispose();
      });
    });
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
}
