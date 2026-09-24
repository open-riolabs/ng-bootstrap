import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { RlbStepperHost } from './stepper-host';

/** What the step's circle is saying. */
export type RlbStepState = 'todo' | 'done' | 'error';

/**
 * One step of an `rlb-stepper`.
 *
 * Its content stays in the DOM while another step is showing, merely hidden — a wizard is almost
 * always a form split in three, and tearing down the fields of step 1 to show step 2 would throw
 * away everything typed into them.
 */
@Component({
  selector: 'rlb-step',
  template: `<ng-content></ng-content>`,
  host: {
    '[style.display]': 'selected() ? null : "none"',
    '[attr.aria-hidden]': 'selected() ? null : "true"',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepComponent {
  private host = inject(RlbStepperHost, { optional: true });

  /** What this step is called, in the strip at the top. */
  label = input('');
  /** A line under the label, for whatever the label could not say. */
  hint = input<string | undefined>(undefined);
  /** A step the user may skip even in a linear stepper. */
  optional = input(false, { transform: booleanAttribute });

  /**
   * The form this step is responsible for. A linear stepper refuses to move past a step whose
   * control is invalid, and marks it touched so the fields say why.
   */
  stepControl = input<AbstractControl | undefined>(undefined, { alias: 'step-control' });

  /** Force the circle. Left alone, it is worked out from `stepControl` and from what came before. */
  state = input<RlbStepState | undefined>(undefined);
  /** Mark the step finished even if it has no control to prove it. */
  completed = input(false, { transform: booleanAttribute });

  selected = computed(() => this.host?.isStepSelected(this) ?? true);

  /** Whether the stepper may leave this step. Optional steps always may. */
  get passable(): boolean {
    if (this.optional()) return true;
    if (this.state() === 'error') return false;
    const control = this.stepControl();
    if (control) return control.valid;
    return true;
  }
}
