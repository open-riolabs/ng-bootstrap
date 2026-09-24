/**
 * The slice of `rlb-stepper` that a step talks to.
 *
 * A step is content the caller writes inside the stepper, so it reaches it through its element
 * injector rather than by importing it — the import check in this repo rejects cycles. It asks
 * about itself by identity rather than by index, because a step does not know where it sits.
 */
export abstract class RlbStepperHost {
  abstract isStepSelected(step: unknown): boolean;
}
