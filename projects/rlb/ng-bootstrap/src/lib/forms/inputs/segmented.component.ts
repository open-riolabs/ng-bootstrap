import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  forwardRef,
  inject,
  input,
  viewChildren,
} from '@angular/core';
import { Size } from '../../shared/types';
import { AbstractComponent } from './abstract-field.component';
import { SegmentedOptionComponent } from './segmented-option.component';
import { RlbSegmentedHost } from './segmented-host';

/**
 * A small set of choices, exactly one of them taken.
 *
 * Every project has been building this out of a `btn-group` and a handful of `[class.active]`
 * bindings, and getting the keyboard wrong in the same way each time: a group of buttons is not a
 * radio group, so Tab walks into every option instead of into the group.
 *
 * This is a real radio group — one tab stop, arrows to move — that happens to look like buttons.
 */
@Component({
  selector: 'rlb-segmented',
  template: `
    <div
      class="btn-group"
      role="radiogroup"
      [class.btn-group-sm]="size() === 'sm'"
      [class.btn-group-lg]="size() === 'lg'"
      [class.w-100]="block()"
      [attr.aria-label]="label()"
    >
      @for (option of options(); track option; let i = $index) {
        <button
          #button
          type="button"
          class="btn"
          role="radio"
          [class]="buttonClass(option)"
          [attr.aria-checked]="isSelected(option)"
          [disabled]="isDisabled() || option.disabled()"
          [tabIndex]="tabIndexFor(option, i)"
          (click)="choose(option)"
          (keydown)="onKeydown($event, i)"
          (blur)="touch()"
        >
          @if (option.icon()) {
            <i [class]="option.icon()" aria-hidden="true"></i>
          }
          @if (option.label()) {
            <span [class.ms-1]="option.icon()">{{ option.label() }}</span>
          }
        </button>
      }
    </div>

    <!-- The options are declarations, not markup: they say what exists, the buttons above draw it. -->
    <div hidden><ng-content></ng-content></div>
  `,
  host: { '[attr.id]': 'null' },
  providers: [{ provide: RlbSegmentedHost, useExisting: forwardRef(() => SegmentedComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentedComponent extends AbstractComponent<unknown> implements RlbSegmentedHost {
  options = contentChildren(SegmentedOptionComponent);
  private buttons = viewChildren<ElementRef<HTMLButtonElement>>('button');

  disabled = input(false, { transform: booleanAttribute });
  protected userDefinedId = input<string | undefined>(undefined, { alias: 'inputId' });

  size = input<Size | undefined>(undefined);
  color = input<'primary' | 'secondary' | 'dark'>('primary');
  /** Stretches the group to the width of its container. */
  block = input(false, { transform: booleanAttribute });
  /** What the group as a whole is called, for a screen reader. */
  label = input<string | undefined>(undefined);

  isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  isSelected(option: SegmentedOptionComponent): boolean {
    return this.value() === option.value();
  }

  protected buttonClass(option: SegmentedOptionComponent): string {
    return this.isSelected(option) ? `btn-${this.color()}` : `btn-outline-${this.color()}`;
  }

  /**
   * One tab stop for the whole group: focus lands on whatever is taken, or on the first option
   * when nothing is. This is what makes it a radio group rather than a row of buttons.
   */
  protected tabIndexFor(option: SegmentedOptionComponent, index: number): number {
    const options = this.options();
    const selectedIndex = options.findIndex(candidate => this.isSelected(candidate));
    const stop = selectedIndex === -1 ? 0 : selectedIndex;
    return index === stop ? 0 : -1;
  }

  choose(option: SegmentedOptionComponent) {
    if (this.isDisabled() || option.disabled()) return;
    this.setValue(option.value());
    this.touch();
  }

  protected onKeydown(event: KeyboardEvent, index: number) {
    const step =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0;
    if (step === 0) return;

    event.preventDefault();
    const options = this.options();
    const enabled = options.filter(option => !option.disabled());
    if (enabled.length === 0) return;

    // Wraps, and skips anything disabled on the way.
    let next = index;
    for (let hop = 0; hop < options.length; hop++) {
      next = (next + step + options.length) % options.length;
      if (!options[next].disabled()) break;
    }

    this.choose(options[next]);
    this.buttons()[next]?.nativeElement.focus();
  }
}
