import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RLB_ICONS } from '../../shared/icons';

/**
 * Nothing to show, said properly.
 *
 * `rlb-dt-noitems` already existed but only works inside the datatable, so every list, card and
 * page outside one has been inventing its own empty state. This is the same thing, unhooked:
 * an icon, a line saying what is missing, a sentence saying why, and the action that would fix it.
 */
@Component({
  selector: 'rlb-empty-state',
  template: `
    <div
      class="d-flex flex-column align-items-center text-center"
      [class.py-5]="size() === 'md'"
      [class.py-3]="size() === 'sm'"
    >
      @if (iconClass()) {
        <i
          [class]="iconClass()"
          [style.font-size]="size() === 'sm' ? '1.75rem' : '2.5rem'"
          class="text-body-secondary mb-3 d-block lh-1"
          aria-hidden="true"
        ></i>
      }

      @if (title()) {
        <div
          class="fw-semibold text-body"
          [class.fs-5]="size() === 'md'"
          [class.fs-6]="size() === 'sm'"
        >
          {{ title() }}
        </div>
      }

      <div class="text-body-secondary mt-1" style="max-width: 32rem">
        <ng-content></ng-content>
      </div>

      <div class="mt-3 d-flex gap-2 justify-content-center flex-wrap">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `,
  host: { role: 'status' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  private icons = inject(RLB_ICONS);

  /** The line in bold. */
  title = input<string | undefined>(undefined);

  /**
   * Which of the four this is. `search` and `error` pick a fitting icon so the common cases need
   * no icon at all; `custom` draws only what `icon` says, which may be nothing.
   */
  variant = input<'empty' | 'search' | 'error' | 'custom'>('empty');

  /** An icon class, overriding whatever the variant would have chosen. */
  icon = input<string | undefined>(undefined);

  size = input<'sm' | 'md'>('md');

  protected iconClass = computed(() => {
    const own = this.icon();
    if (own !== undefined) return own;
    switch (this.variant()) {
      case 'search':
        return this.icons.search;
      case 'error':
        return this.icons.warning;
      case 'custom':
        return undefined;
      default:
        return this.icons.empty;
    }
  });
}
