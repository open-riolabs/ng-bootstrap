import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  OnInit,
  output,
  Signal,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  RlbDropdownAlign,
  RlbDropdownAutoClose,
  RlbDropdownHost,
  RlbDropdownToggle,
} from '../../dropdown/dropdown-host';
import { RlbDropdownOverlay } from '../../dropdown/dropdown-overlay.service';
import { VisibilityEventBase } from '../../../shared/types';

/**
 * One entry of a navbar, which may itself open a menu.
 *
 * It is its own dropdown host — the anchor it builds is the toggle, and whatever
 * `rlb-dropdown-container` is projected into it is the menu — so it rides the same CDK Overlay as
 * every other dropdown in the library instead of a second `bootstrap.Dropdown` of its own.
 */
@Component({
  selector: 'rlb-navbar-dropdown-item',
  template: `
    <ng-template #template>
      <li class="nav-item list-unstyled" [class.dropdown]="dropdown()">
        <a
          class="nav-link {{ cssClass() }}"
          [class.dropdown-toggle]="dropdown()"
          [class.disabled]="disabled()"
          [attr.role]="isButton() ? 'button' : null"
          [attr.tabindex]="isButton() ? 0 : null"
          [attr.aria-haspopup]="dropdown() ? 'true' : null"
          [attr.aria-expanded]="dropdown() ? isOpen() : null"
          [attr.aria-disabled]="disabled() ? true : null"
          [attr.href]="isButton() ? null : href()"
          (click)="onClick($event)"
          (keydown)="onKeydown($event)"
        >
          <ng-content select=":not(rlb-dropdown-container)"></ng-content>
        </a>
        <ng-content select="rlb-dropdown-container"></ng-content>
      </li>
    </ng-template>
  `,
  providers: [
    RlbDropdownOverlay,
    { provide: RlbDropdownHost, useExisting: forwardRef(() => NavbarDropdownItemComponent) },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarDropdownItemComponent implements OnInit, RlbDropdownHost {
  element!: HTMLElement;

  private overlay = inject(RlbDropdownOverlay);
  private viewContainerRef = inject(ViewContainerRef);

  disabled = input(false, { alias: 'disabled', transform: booleanAttribute });
  dropdown = input(false, { alias: 'dropdown', transform: booleanAttribute });
  href = input<string | undefined>(undefined);
  cssClass = input('', { alias: 'class' });
  toggle = input<'offcanvas' | 'collapse' | 'tab' | 'pill' | 'buttons-group' | undefined>(
    undefined,
  );
  autoClose = input<RlbDropdownAutoClose>('default', { alias: 'auto-close' });

  click = output<MouseEvent>();
  statusChanged = output<VisibilityEventBase>({ alias: 'status-changed' });

  readonly isOpen = this.overlay.isOpen;

  /** An entry that opens something is a button, not a link — and so has no href to jump to. */
  protected isButton = computed(() => this.dropdown() || !!this.toggle());

  template = viewChild.required<TemplateRef<any>>('template');

  private noOffset = signal<number[]>([]);

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template());
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();

    const anchor = this.element.querySelector('a');
    if (anchor && this.dropdown()) this.registerToggle(this.asToggle(anchor));
  }

  private asToggle(element: HTMLElement): RlbDropdownToggle {
    return {
      element,
      offset: this.noOffset,
      autoClose: this.autoClose,
      emitStatus: (event: VisibilityEventBase) => this.statusChanged.emit(event),
    };
  }

  registerToggle(toggle: RlbDropdownToggle) {
    this.overlay.setToggle(toggle);
  }

  registerMenu(element: HTMLElement, align: Signal<RlbDropdownAlign>) {
    this.overlay.setMenu(element, align);
  }

  open(focusFirst = false) {
    this.overlay.open(focusFirst);
  }

  close(returnFocus = false) {
    this.overlay.close(returnFocus);
  }

  /** Kept under its old name: `toggle` is already an input here. */
  toggleDropdown() {
    this.overlay.toggleOpen();
  }

  handleToggleKeydown(event: KeyboardEvent) {
    this.overlay.handleToggleKeydown(event);
  }

  protected onClick(event: MouseEvent) {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    // Without an href there is nothing to follow, but an anchor still wants stopping.
    if (this.isButton()) event.preventDefault();
    if (this.dropdown()) this.toggleDropdown();
    this.click.emit(event);
  }

  protected onKeydown(event: KeyboardEvent) {
    if (!this.dropdown() || this.disabled()) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleDropdown();
      return;
    }
    this.handleToggleKeydown(event);
  }
}
