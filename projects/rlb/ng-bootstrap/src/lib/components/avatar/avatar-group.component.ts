import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  numberAttribute,
} from '@angular/core';
import { AvatarComponent } from './avatar.component';

/**
 * Who is on this: a pile of avatars, overlapping, with the rest counted.
 *
 * Almost only layout — `rlb-avatar` already existed — but the counting is the part that gets
 * written again in every project, usually without an accessible name, so a screen reader hears
 * «+3» and nothing else.
 */
@Component({
  selector: 'rlb-avatar-group',
  template: `
    <div
      class="d-inline-flex align-items-center"
      [attr.role]="ariaLabel() ? 'group' : null"
      [attr.aria-label]="ariaLabel()"
      [style.--rlb-avatar-overlap]="overlap() + 'px'"
    >
      <div class="rlb-avatar-stack d-inline-flex align-items-center">
        <ng-content></ng-content>
      </div>

      @if (overflow() > 0) {
        <span
          class="rlb-avatar-more d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary-subtle text-body-secondary fw-semibold"
          [style.width.px]="size()"
          [style.height.px]="size()"
          [style.font-size.px]="size() * 0.38"
          [attr.aria-label]="overflowLabel()(overflow())"
        >
          +{{ overflow() }}
        </span>
      }
    </div>
  `,
  styles: `
    /*
     * The children, not the rlb-avatar selector: that component removes its own host element on
     * init and leaves a bare <img> behind, so a rule written against it matches nothing.
     */
    .rlb-avatar-stack ::ng-deep > * + * {
      margin-left: calc(var(--rlb-avatar-overlap) * -1);
    }
    /* A ring in the page colour, so the overlap reads as one in front of another rather than as
       one smudge. box-shadow rather than a border, because the avatar writes its own inline. */
    .rlb-avatar-stack ::ng-deep > * {
      box-shadow: 0 0 0 2px var(--bs-body-bg);
    }
    .rlb-avatar-more {
      box-shadow: 0 0 0 2px var(--bs-body-bg);
      margin-left: calc(var(--rlb-avatar-overlap) * -1);
      /* Positioned, so it paints above the images it overlaps: an image is atomic inline content
         and would otherwise cover the background of a later element that is merely static. */
      position: relative;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarGroupComponent {
  avatars = contentChildren(AvatarComponent);

  /**
   * How many more there are beyond the avatars projected here.
   *
   * The group counts rather than hides: the caller writes the `@for` and so already decides how
   * many to draw, and a component that silently dropped projected content would be lying about
   * what it was given.
   */
  extra = input(0, { transform: numberAttribute });

  /** Diameter of the «+N» badge, matching the avatars beside it. */
  size = input(50, { transform: numberAttribute });
  /** How far each avatar sits over the one before. */
  overlap = input(12, { transform: numberAttribute });

  ariaLabel = input<string | undefined>(undefined);
  /** How the count is said. A function, because «+3 more» does not translate as glued parts. */
  overflowLabel = input<(count: number) => string>((count: number) => `${count} more`);

  protected overflow = computed(() => Math.max(0, this.extra()));
}
