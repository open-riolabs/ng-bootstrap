import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopconfirmDirective } from './popconfirm.directive';

/**
 * «Are you sure?», asked next to the button that asked it.
 *
 * `openConfirmModal` already existed, but a modal across the whole screen is the wrong size of
 * interruption for «delete this row» — which is the confirmation a console asks most often. What
 * matters here is that nothing happens until the user says yes, and that every other way out says
 * no.
 */
@Component({
  imports: [PopconfirmDirective],
  template: `
    <button
      type="button"
      rlb-popconfirm="Eliminare la riga?"
      popconfirm-title="Attenzione"
      confirm-label="Elimina"
      cancel-label="Annulla"
      (confirmed)="confirmed = confirmed + 1"
      (cancelled)="cancelled = cancelled + 1"
    >
      Elimina
    </button>
  `,
})
class HostComponent {
  popconfirm = viewChild.required(PopconfirmDirective);
  confirmed = 0;
  cancelled = 0;
}

describe('PopconfirmDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const trigger = () => fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  const panel = () => document.querySelector('rlb-popconfirm-panel');
  const panelButton = (label: string) =>
    Array.from(document.querySelectorAll('rlb-popconfirm-panel button')).find(
      b => b.textContent?.trim() === label,
    ) as HTMLButtonElement | undefined;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(async () => {
    host.popconfirm().close();
    await settle();
    TestBed.resetTestingModule();
  });

  it('opens nothing until the trigger is clicked', () => {
    expect(panel()).toBeNull();
  });

  it('opens a panel with what it was told to ask', async () => {
    trigger().click();
    await settle();

    expect(panel()).not.toBeNull();
    expect(panel()!.textContent).toContain('Eliminare la riga?');
    expect(panel()!.textContent).toContain('Attenzione');
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
  });

  it('emits nothing on the way in — that is the whole point', async () => {
    trigger().click();
    await settle();

    expect(host.confirmed).toBe(0);
    expect(host.cancelled).toBe(0);
  });

  it('confirms and closes when the user says yes', async () => {
    trigger().click();
    await settle();

    panelButton('Elimina')!.click();
    await settle();

    expect(host.confirmed).toBe(1);
    expect(host.cancelled).toBe(0);
    expect(panel()).toBeNull();
  });

  it('cancels when the user says no', async () => {
    trigger().click();
    await settle();

    panelButton('Annulla')!.click();
    await settle();

    expect(host.confirmed).toBe(0);
    expect(host.cancelled).toBe(1);
    expect(panel()).toBeNull();
  });

  /** The speed bump only works if a stray Return does not press «yes». */
  it('starts with focus on the cancel button, not on the confirm', async () => {
    trigger().click();
    await settle();

    expect(document.activeElement).toBe(panelButton('Annulla'));
  });

  it('treats a second click on the trigger as closing it', async () => {
    trigger().click();
    await settle();
    trigger().click();
    await settle();

    expect(panel()).toBeNull();
    expect(host.confirmed).toBe(0);
  });
});
