import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { OtpComponent } from './otp.component';

@Component({
  imports: [OtpComponent, FormsModule],
  template: `
    <rlb-otp
      [length]="length()"
      [alphanumeric]="alphanumeric()"
      [mask]="mask()"
      [ngModel]="value()"
      (ngModelChange)="value.set($event)"
      (completed)="completed.set($event)"
    />
  `,
})
class OtpHost {
  length = signal(6);
  alphanumeric = signal(false);
  mask = signal(false);
  value = signal('');
  completed = signal<string | null>(null);
}

describe('OtpComponent', () => {
  let fixture: ComponentFixture<OtpHost>;
  let host: OtpHost;
  let element: HTMLElement;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const boxes = () => Array.from(element.querySelectorAll('input')) as HTMLInputElement[];

  const type = async (slot: number, text: string) => {
    const box = boxes()[slot];
    box.value = text;
    box.dispatchEvent(new Event('input'));
    await settle();
  };

  const paste = async (slot: number, text: string) => {
    const event = new Event('paste') as ClipboardEvent;
    Object.defineProperty(event, 'clipboardData', { value: { getData: () => text } });
    boxes()[slot].dispatchEvent(event);
    await settle();
  };

  const key = async (slot: number, name: string) => {
    boxes()[slot].dispatchEvent(new KeyboardEvent('keydown', { key: name }));
    await settle();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [OtpHost] });
    fixture = TestBed.createComponent(OtpHost);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await settle();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('draws one box per character', () => {
    expect(boxes().length).toBe(6);

    host.length.set(4);
    fixture.detectChanges();

    expect(boxes().length).toBe(4);
  });

  it('binds the whole code as one string, not one value per box', async () => {
    await type(0, '1');
    await type(1, '2');
    await type(2, '3');

    expect(host.value()).toBe('123');
  });

  it('moves to the next box as each character is typed', async () => {
    await type(0, '4');

    expect(document.activeElement).toBe(boxes()[1]);
  });

  /** The thing the hand-written version always misses. */
  it('fills the rest of the boxes from a pasted code', async () => {
    await paste(0, '123456');

    expect(host.value()).toBe('123456');
    expect(boxes()[0].value).toBe('1');
    expect(boxes()[5].value).toBe('6');
  });

  it('takes a pasted code however it was formatted', async () => {
    await paste(0, '12 34-56');

    expect(host.value()).toBe('123456');
  });

  it('pastes from the box it was dropped into', async () => {
    await type(0, '9');
    await paste(1, '1234');

    expect(host.value()).toBe('91234');
  });

  /** Backspace in an empty box doing nothing is the other half of what people expect. */
  it('steps back on Backspace when the box is already empty', async () => {
    await type(0, '1');
    await type(1, '2');

    await key(2, 'Backspace');

    expect(host.value()).toBe('1');
    expect(document.activeElement).toBe(boxes()[1]);
  });

  it('clears the current box on Backspace when it has something in it', async () => {
    await paste(0, '123');

    await key(2, 'Backspace');

    expect(host.value()).toBe('12');
  });

  it('refuses letters unless it was asked for them', async () => {
    await type(0, 'a');
    expect(host.value()).toBe('');

    host.alphanumeric.set(true);
    await settle();

    await type(0, 'a');
    expect(host.value()).toBe('a');
  });

  it('says when the code is complete', async () => {
    await paste(0, '12345');
    expect(host.completed()).toBeNull();

    await type(5, '6');
    expect(host.completed()).toBe('123456');
  });

  it('hides what is typed when masked', async () => {
    expect(boxes()[0].type).toBe('text');

    host.mask.set(true);
    await settle();

    expect(boxes()[0].type).toBe('password');
  });

  it('names each box with its position', () => {
    expect(boxes()[2].getAttribute('aria-label')).toBe('Digit 3');
  });
});
