import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RatingComponent } from './rating.component';

@Component({
  imports: [RatingComponent, FormsModule],
  template: `
    <rlb-rating
      [max]="max()"
      [readonly]="readonly()"
      [clearable]="clearable()"
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
    />
  `,
})
class RatingHost {
  max = signal(5);
  readonly = signal(false);
  clearable = signal(true);
  value = signal(3);
}

describe('RatingComponent', () => {
  let fixture: ComponentFixture<RatingHost>;
  let host: RatingHost;
  let element: HTMLElement;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const control = () => element.querySelector('[role]') as HTMLElement;
  const stars = () => Array.from(element.querySelectorAll('.rlb-rating-star')) as HTMLElement[];
  const filled = () =>
    element.querySelectorAll('i.bi-star-fill').length;

  // mouseenter does not bubble, so it goes on the element that listens for it.
  const hoverStar = async (index: number) => {
    stars()[index].dispatchEvent(new MouseEvent('mouseenter'));
    await settle();
  };

  const press = async (key: string) => {
    control().dispatchEvent(new KeyboardEvent('keydown', { key }));
    await settle();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [RatingHost] });
    fixture = TestBed.createComponent(RatingHost);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await settle();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('fills as many stars as the score', async () => {
    expect(stars().length).toBe(5);
    expect(filled()).toBe(3);
  });

  /** A row of icons announces as nothing; a slider announces a value out of a maximum. */
  it('is a slider with a value while it can be changed', () => {
    expect(control().getAttribute('role')).toBe('slider');
    expect(control().getAttribute('aria-valuenow')).toBe('3');
    expect(control().getAttribute('aria-valuemax')).toBe('5');
    expect(control().getAttribute('tabindex')).toBe('0');
  });

  /** Read-only is a score being reported, not a control refusing to work. */
  it('drops out of the tab order when it is read-only', async () => {
    host.readonly.set(true);
    await settle();

    expect(control().getAttribute('role')).toBe('img');
    expect(control().getAttribute('tabindex')).toBeNull();
  });

  it('takes a score from a click', async () => {
    stars()[3].click();
    await settle();

    expect(host.value()).toBe(4);
  });

  it('clears when the star already chosen is clicked again', async () => {
    stars()[2].click();
    await settle();

    expect(host.value()).toBe(0);
  });

  it('keeps the score when clearing is off', async () => {
    host.clearable.set(false);
    await settle();

    stars()[2].click();
    await settle();

    expect(host.value()).toBe(3);
  });

  it('moves with the arrows and stops at either end', async () => {
    await press('ArrowRight');
    expect(host.value()).toBe(4);

    await press('ArrowLeft');
    await press('ArrowLeft');
    expect(host.value()).toBe(2);

    await press('End');
    expect(host.value()).toBe(5);

    await press('ArrowRight');
    expect(host.value()).toBe(5);

    await press('Home');
    expect(host.value()).toBe(0);

    await press('ArrowLeft');
    expect(host.value()).toBe(0);
  });

  /**
   * The pointer stays where it was after a click. Without dropping the preview, the stars would
   * keep showing the hovered score while aria-valuenow reported the real one.
   */
  it('drops the hover preview as soon as the keyboard takes over', async () => {
    await hoverStar(0);

    expect(filled()).toBe(1);
    expect(control().getAttribute('aria-valuenow')).toBe('3');

    await press('ArrowRight');

    expect(host.value()).toBe(4);
    expect(filled()).toBe(4);
    expect(control().getAttribute('aria-valuenow')).toBe('4');
  });
});
