import { Subscription } from 'rxjs';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { RLB_ICONS } from '../../shared/icons';
import { StepComponent } from './step.component';
import { RlbStepperHost } from './stepper-host';

/**
 * A form split into steps.
 *
 * This shipped for a while as a recipe on the docs page for wizards — a carousel, some nested
 * FormGroups and forty lines of glue that every project was copying and adapting. The recipe was
 * the specification; this is it as a component.
 */
@Component({
  selector: 'rlb-stepper',
  template: `
    <div
      class="rlb-stepper"
      [class.d-flex]="vertical()"
      [class.gap-4]="vertical()"
    >
      <ol
        class="rlb-stepper-head list-unstyled d-flex m-0 p-0"
        [class.flex-column]="vertical()"
        [class.gap-2]="vertical()"
        [class.mb-4]="!vertical()"
        [style.flex-shrink]="vertical() ? 0 : null"
      >
        @for (step of steps(); track step; let i = $index; let last = $last) {
          <li
            class="d-flex align-items-center"
            [class.flex-grow-1]="!vertical()"
          >
            <button
              type="button"
              class="btn btn-link text-decoration-none p-0 text-start d-flex align-items-center gap-2 text-reset"
              [disabled]="!selectable(i)"
              [attr.aria-current]="i === selectedIndex() ? 'step' : null"
              (click)="select(i)"
            >
              <span
                class="rlb-step-circle d-inline-flex align-items-center justify-content-center flex-shrink-0 rounded-circle border"
                [class]="circleClass(i)"
              >
                @if (statusOf(i) === 'done') {
                  <i [class]="icons.check" aria-hidden="true"></i>
                } @else if (statusOf(i) === 'error') {
                  <i [class]="icons.warning" aria-hidden="true"></i>
                } @else {
                  {{ i + 1 }}
                }
              </span>
              <span class="d-flex flex-column lh-sm">
                <span
                  class="fw-semibold"
                  [class.text-body]="i === selectedIndex()"
                  [class.text-body-secondary]="i !== selectedIndex()"
                  >{{ step.label() }}</span
                >
                @if (step.hint() || step.optional()) {
                  <small class="text-body-secondary">{{
                    step.hint() ?? optionalText()
                  }}</small>
                }
              </span>
            </button>

            @if (!last && !vertical()) {
              <span
                class="rlb-step-line flex-grow-1 mx-3"
                aria-hidden="true"
              ></span>
            }
          </li>
        }
      </ol>

      <div class="rlb-stepper-body flex-grow-1">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: `
    .rlb-step-circle {
      width: 2rem;
      height: 2rem;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .rlb-step-line {
      height: 1px;
      background: var(--bs-border-color);
      min-width: 1rem;
    }
  `,
  providers: [{ provide: RlbStepperHost, useExisting: forwardRef(() => StepperComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent implements RlbStepperHost {
  protected icons = inject(RLB_ICONS);

  steps = contentChildren(StepComponent);

  /**
   * Bumped whenever a step's control changes status.
   *
   * A `FormControl` is not a signal, so on its own a validity change never reaches an OnPush
   * component: the strip would keep a step locked after its form had become valid, and keep the
   * circle grey after it had been filled in. Reading this inside `statusOf` and `selectable` is
   * what ties the two worlds together.
   */
  private controlTick = signal(0);

  /** Which step is showing. Two-way, so the page can put it in the URL. */
  selectedIndex = model(0);

  orientation = input<'horizontal' | 'vertical'>('horizontal');

  /**
   * Refuses to move past a step that is not passable, and refuses to jump ahead over one. Without
   * it the strip is navigation and the user may wander.
   */
  linear = input(false, { transform: booleanAttribute });

  /** What an optional step says under its label when it has no hint of its own. */
  optionalLabel = input('Optional');

  /** The user asked to finish from the last step. */
  finish = output<void>();

  protected vertical = computed(() => this.orientation() === 'vertical');
  protected optionalText = computed(() => this.optionalLabel());

  constructor() {
    let subscriptions: Subscription[] = [];
    effect(() => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
      subscriptions = this.steps()
        .map(step => step.stepControl())
        .filter((control): control is NonNullable<typeof control> => !!control)
        .map(control => control.events.subscribe(() => this.controlTick.update(tick => tick + 1)));
    });
    inject(DestroyRef).onDestroy(() =>
      subscriptions.forEach(subscription => subscription.unsubscribe()),
    );
  }

  isStepSelected(step: unknown): boolean {
    return this.steps()[this.selectedIndex()] === step;
  }

  /** Whether this is the last step, so the caller knows to show «Finish» rather than «Next». */
  readonly isLast = computed(() => this.selectedIndex() >= this.steps().length - 1);
  readonly isFirst = computed(() => this.selectedIndex() === 0);

  /** Whether the step currently showing would let the stepper move on. */
  readonly currentPassable = computed(() => {
    this.controlTick();
    const step = this.steps()[this.selectedIndex()];
    return !step || step.passable;
  });

  protected statusOf(index: number): 'todo' | 'done' | 'error' | 'current' {
    this.controlTick();
    const step = this.steps()[index];
    if (!step) return 'todo';
    const forced = step.state();
    if (forced === 'error') return 'error';
    if (forced === 'done') return 'done';

    const control = step.stepControl();
    if (control && control.invalid && control.touched) return 'error';
    if (step.completed()) return 'done';
    if (index < this.selectedIndex() && step.passable) return 'done';
    return index === this.selectedIndex() ? 'current' : 'todo';
  }

  protected circleClass(index: number): string {
    switch (this.statusOf(index)) {
      case 'done':
        return 'bg-success border-success text-white';
      case 'error':
        return 'bg-danger border-danger text-white';
      case 'current':
        return 'bg-primary border-primary text-white';
      default:
        return 'bg-body-secondary border-secondary-subtle text-body-secondary';
    }
  }

  /** In a linear stepper a step opens only once everything before it would let go. */
  protected selectable(index: number): boolean {
    this.controlTick();
    if (!this.linear()) return true;
    if (index <= this.selectedIndex()) return true;
    return this.steps()
      .slice(0, index)
      .every(step => step.passable);
  }

  select(index: number) {
    if (index < 0 || index >= this.steps().length) return;
    if (!this.selectable(index)) return;
    this.selectedIndex.set(index);
  }

  /**
   * Moves on, or reports that it cannot.
   *
   * A linear stepper that will not move marks the step's control touched on the way out: refusing
   * silently leaves the user pressing a button that does nothing, with no idea which field is
   * wrong.
   */
  next(): boolean {
    const step = this.steps()[this.selectedIndex()];
    if (this.linear() && step && !step.passable) {
      step.stepControl()?.markAllAsTouched();
      return false;
    }
    if (this.isLast()) {
      this.finish.emit();
      return true;
    }
    this.selectedIndex.set(this.selectedIndex() + 1);
    return true;
  }

  previous() {
    if (!this.isFirst()) this.selectedIndex.set(this.selectedIndex() - 1);
  }

  reset() {
    this.selectedIndex.set(0);
  }
}
