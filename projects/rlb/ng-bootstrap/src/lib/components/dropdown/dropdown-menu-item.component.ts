import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * One line of a dropdown menu: an action, a link, a heading or a rule.
 *
 * The action used to be a `<span role="button">`. Tab skipped it, Enter did nothing on it, and the
 * arrow keys had nothing to move between — a role without the behaviour it claims. It is a real
 * `<button>` now, which is what Bootstrap's own markup uses and what the menu's keyboard needs.
 */
@Component({
  selector: 'li[rlb-dropdown-item]',
  template: `
    @if (!link() && !divider() && !header()) {
      <button
        type="button"
        class="dropdown-item"
        [class.active]="active()"
        [class.disabled]="disabled()"
        [class.text-wrap]="textWrap()"
        [class.text-break]="textWrap()"
        [disabled]="disabled()"
        [attr.aria-current]="active() ? true : null"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </button>
    }
    @if (link()) {
      <a
        class="dropdown-item"
        [routerLink]="link()"
        [class.active]="active()"
        [class.disabled]="disabled()"
        [class.text-wrap]="textWrap()"
        [class.text-break]="textWrap()"
        [attr.tabindex]="disabled() ? -1 : null"
        [attr.aria-current]="active() ? true : null"
        [attr.aria-disabled]="disabled() ? true : null"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </a>
    }
    @if (header()) {
      <h6 class="dropdown-header">
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </h6>
    }
    @if (divider()) {
      <hr class="dropdown-divider" />
    }
    <ng-template #content><ng-content /></ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, RouterLink],
})
export class DropdownMenuItemComponent {
  active = input(false, { alias: 'active', transform: booleanAttribute });
  disabled = input(false, { alias: 'disabled', transform: booleanAttribute });
  header = input(false, { alias: 'header', transform: booleanAttribute });
  divider = input(false, { alias: 'divider', transform: booleanAttribute });
  link = input<string | undefined>(undefined, { alias: 'link' });
  textWrap = input(false, { alias: 'text-wrap', transform: booleanAttribute });
}
