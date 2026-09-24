import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TagInputComponent } from './tag-input.component';

@Component({
  imports: [TagInputComponent, FormsModule],
  template: `
    <rlb-tag-input
      [separators]="separators()"
      [max-tags]="maxTags()"
      [allow-duplicates]="allowDuplicates()"
      [case-sensitive]="caseSensitive()"
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
      (rejected)="rejected.set($event)"
    />
  `,
})
class TagHost {
  separators = signal<string[]>([',']);
  maxTags = signal<number | undefined>(undefined);
  allowDuplicates = signal(false);
  caseSensitive = signal(false);
  value = signal<string[]>([]);
  rejected = signal<{ value: string; reason: string } | null>(null);
}

describe('TagInputComponent', () => {
  let fixture: ComponentFixture<TagHost>;
  let host: TagHost;
  let element: HTMLElement;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const field = () => element.querySelector('input') as HTMLInputElement;
  // rlb-badge removes its own host element and leaves the rendered span in its place,
  // so the chips are found by the class it draws with rather than by the attribute.
  const chips = () =>
    Array.from(element.querySelectorAll('span.badge')).map(chip => chip.textContent!.trim());

  const enter = async (text: string, key = 'Enter') => {
    field().value = text;
    field().dispatchEvent(new KeyboardEvent('keydown', { key }));
    await settle();
  };

  const blur = async (text: string) => {
    field().value = text;
    field().dispatchEvent(new Event('blur'));
    await settle();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [TagHost] });
    fixture = TestBed.createComponent(TagHost);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await settle();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('makes a tag on Enter and empties the box', async () => {
    await enter('angular');

    expect(host.value()).toEqual(['angular']);
    expect(chips()).toEqual(['angular']);
    expect(field().value).toBe('');
  });

  it('makes a tag on any of its separators', async () => {
    host.separators.set([',', ' ']);
    await settle();

    await enter('angular', ' ');

    expect(host.value()).toEqual(['angular']);
  });

  it('trims what it is given', async () => {
    await enter('  spaced  ');

    expect(host.value()).toEqual(['spaced']);
  });

  it('ignores an empty entry', async () => {
    await enter('   ');

    expect(host.value()).toEqual([]);
  });

  /** Losing what is in the box on blur is the way this control usually loses data. */
  it('commits a half-typed tag when the field is left', async () => {
    await blur('typescript');

    expect(host.value()).toEqual(['typescript']);
  });

  it('takes back the last tag on Backspace in an empty box', async () => {
    await enter('one');
    await enter('two');

    await enter('', 'Backspace');

    expect(host.value()).toEqual(['one']);
  });

  it('leaves the tags alone when Backspace has something to delete', async () => {
    await enter('one');

    field().value = 'part';
    field().dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    await settle();

    expect(host.value()).toEqual(['one']);
  });

  it('refuses a duplicate and says why', async () => {
    await enter('Angular');
    await enter('angular ');

    expect(host.value()).toEqual(['Angular']);
    expect(host.rejected()).toEqual({ value: 'angular', reason: 'duplicate' });
  });

  it('treats case as significant when asked to', async () => {
    host.caseSensitive.set(true);
    await settle();

    await enter('Angular');
    await enter('angular');

    expect(host.value()).toEqual(['Angular', 'angular']);
  });

  it('refuses a tag past the limit and says why', async () => {
    host.maxTags.set(2);
    await settle();

    await enter('one');
    await enter('two');
    await enter('three');

    expect(host.value()).toEqual(['one', 'two']);
    expect(host.rejected()).toEqual({ value: 'three', reason: 'full' });
  });

  it('removes a tag from its own button', async () => {
    await enter('one');
    await enter('two');

    const remove = element.querySelector('[aria-label="Remove one"]') as HTMLButtonElement;
    remove.click();
    await settle();

    expect(host.value()).toEqual(['two']);
  });
});
