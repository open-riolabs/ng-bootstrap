import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StepComponent } from './step.component';
import { StepperComponent } from './stepper.component';

/**
 * A form split into steps, and the one rule that makes it worth having: a linear stepper does not
 * move past a step whose form is invalid, and says which one.
 *
 * This shipped for a while as a recipe on the docs page — a carousel and forty lines of glue that
 * every project copied. The recipe was the specification.
 */
@Component({
  imports: [StepperComponent, StepComponent, ReactiveFormsModule],
  template: `
    <rlb-stepper
      [linear]="linear()"
      [(selectedIndex)]="index"
      (finish)="finished = finished + 1"
    >
      <rlb-step
        label="Account"
        [step-control]="account"
      >
        <input
          data-step="1"
          [formControl]="email"
        />
      </rlb-step>
      <rlb-step
        label="Profilo"
        optional
      >
        <span data-step="2">due</span>
      </rlb-step>
      <rlb-step label="Conferma">
        <span data-step="3">tre</span>
      </rlb-step>
    </rlb-stepper>
  `,
})
class HostComponent {
  stepper = viewChild.required(StepperComponent);
  linear = signal(false);
  index = 0;
  finished = 0;

  email = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  account = new FormGroup({ email: this.email });
}

describe('StepperComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  /** A step is hidden, not destroyed, so «visible» means its host has no display:none. */
  const visibleSteps = () =>
    Array.from(element.querySelectorAll('rlb-step'))
      .filter(step => (step as HTMLElement).style.display !== 'none')
      .map(step => step.querySelector('[data-step]')?.getAttribute('data-step'));

  const headButtons = () =>
    Array.from(element.querySelectorAll('.rlb-stepper-head button')) as HTMLButtonElement[];

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await settle();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('shows one step at a time and keeps the others in the DOM', async () => {
    expect(visibleSteps()).toEqual(['1']);
    expect(element.querySelectorAll('rlb-step').length).toBe(3);
  });

  it('keeps what was typed when the user goes on and comes back', async () => {
    const field = element.querySelector('[data-step="1"]') as HTMLInputElement;
    host.email.setValue('mario@example.com');
    await settle();

    host.stepper().next();
    await settle();
    expect(visibleSteps()).toEqual(['2']);

    host.stepper().previous();
    await settle();
    expect(field.value).toBe('mario@example.com');
  });

  it('walks freely when it is not linear, invalid step or not', async () => {
    headButtons()[2].click();
    await settle();

    expect(visibleSteps()).toEqual(['3']);
  });

  it('refuses to move past an invalid step when linear, and says which field', async () => {
    host.linear.set(true);
    await settle();

    expect(host.stepper().next()).toBe(false);
    await settle();

    expect(visibleSteps()).toEqual(['1']);
    expect(host.email.touched).toBe(true);
  });

  it('moves once the step is valid', async () => {
    host.linear.set(true);
    host.email.setValue('mario@example.com');
    await settle();

    expect(host.stepper().next()).toBe(true);
    await settle();
    expect(visibleSteps()).toEqual(['2']);
  });

  it('locks the steps ahead while linear, and opens them as the way clears', async () => {
    host.linear.set(true);
    await settle();
    expect(headButtons()[2].disabled).toBe(true);

    host.email.setValue('mario@example.com');
    await settle();
    // Step 2 is optional, so with step 1 valid the last one is reachable.
    expect(headButtons()[2].disabled).toBe(false);
  });

  it('finishes instead of advancing on the last step', async () => {
    host.stepper().select(2);
    await settle();

    host.stepper().next();
    await settle();

    expect(host.finished).toBe(1);
    expect(visibleSteps()).toEqual(['3']);
  });

  it('marks the steps already passed as done', async () => {
    host.email.setValue('mario@example.com');
    host.stepper().next();
    await settle();

    expect(headButtons()[0].querySelector('.rlb-step-circle')?.className).toContain('bg-success');
  });
});
