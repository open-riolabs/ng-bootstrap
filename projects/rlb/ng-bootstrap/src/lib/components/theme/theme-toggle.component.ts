import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { ButtonComponent } from '../buttons/buttons.component';
import { RLB_ICONS } from '../../shared/icons';
import { RlbTheme, ThemeService } from '../../shared/theme.service';
import { Color, Size } from '../../shared/types';

/**
 * A button that walks through the themes it is given and shows which one is on.
 *
 * The state is in {@link ThemeService}, so several of these on one page agree, and an application
 * that drives the theme from its own settings screen can skip this component entirely and call the
 * service.
 */
@Component({
  selector: 'rlb-theme-toggle',
  template: `
    <button
      type="button"
      rlb-button
      [color]="color()"
      [size]="size()"
      [outline]="outline()"
      [attr.aria-label]="label()"
      [attr.title]="label()"
      (click)="next()"
    >
      <i [class]="icon()" aria-hidden="true"></i>
      @if (showLabel()) {
        <span class="ms-2">{{ label() }}</span>
      }
      <ng-content></ng-content>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent],
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  protected icons = inject(RLB_ICONS);

  color = input<Color | undefined>('secondary');
  size = input<Size | undefined>('md');
  outline = input(true, { transform: booleanAttribute });
  /** Show the name of the current theme beside the icon. */
  showLabel = input(false, { alias: 'show-label', transform: booleanAttribute });

  /**
   * The themes this button walks through, in order. Drop `auto` to offer a plain light/dark switch.
   */
  modes = input<RlbTheme[]>(['light', 'dark', 'auto']);

  /** English by default, like the rest of the library's built-in words. */
  lightLabel = input('Light');
  darkLabel = input('Dark');
  autoLabel = input('System');

  /** What was asked for — `auto` stays `auto` here, unlike what the page actually shows. */
  readonly theme = this.themeService.theme;

  protected label = computed(() => {
    switch (this.theme()) {
      case 'light':
        return this.lightLabel();
      case 'dark':
        return this.darkLabel();
      default:
        return this.autoLabel();
    }
  });

  protected icon = computed(() => {
    switch (this.theme()) {
      case 'light':
        return this.icons.themeLight;
      case 'dark':
        return this.icons.themeDark;
      default:
        return this.icons.themeAuto;
    }
  });

  next() {
    const modes = this.modes();
    if (modes.length === 0) return;
    const at = modes.indexOf(this.theme());
    this.themeService.set(modes[(at + 1) % modes.length]);
  }
}
