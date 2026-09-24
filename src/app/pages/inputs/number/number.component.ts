import { Component, signal } from '@angular/core';
import { FormControl } from '@angular/forms';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-number-doc',
  templateUrl: './number.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class NumberDocComponent {
  readonly amount = signal<number | null>(1234.5);
  readonly price = signal<number | null>(49.9);
  readonly weight = signal<number | null>(72);
  readonly quantity = signal<number | null>(3);

  readonly score = signal(4);
  readonly published = signal(3);

  readonly code = signal('');
  readonly lastCode = signal<string | null>(null);

  readonly reactiveAmount = new FormControl<number | null>(1000);

  numberExample = `<rlb-number [(ngModel)]="amount" />`;

  currencyExample = `<!-- The locale decides the symbol, its side and the grouping. -->
<rlb-number currency="EUR" locale="it-IT" [(ngModel)]="price" />
<rlb-number currency="EUR" locale="en-GB" [(ngModel)]="price" />
<rlb-number currency="USD" locale="en-US" [(ngModel)]="price" />`;

  affixExample = `<rlb-number suffix="kg" [decimals]="1" [(ngModel)]="weight" />
<rlb-number prefix="#" align="left" [(ngModel)]="quantity" />`;

  boundsExample = `<!-- Out-of-range typing is put back inside on blur, not while typing. -->
<rlb-number [min]="1" [max]="10" [(ngModel)]="quantity" />`;

  reactiveNumberExample = `readonly reactiveAmount = new FormControl<number | null>(1000);

<rlb-number currency="EUR" locale="it-IT" [formControl]="reactiveAmount" />`;

  ratingExample = `<rlb-rating [(ngModel)]="score" />`;

  ratingOptionsExample = `<rlb-rating [max]="10" color="danger" show-value [(ngModel)]="score" />
<rlb-rating readonly [ngModel]="4" />
<rlb-rating [clearable]="false" [(ngModel)]="score" />`;

  otpExample = `<rlb-otp [(ngModel)]="code" (completed)="onCompleted($event)" />`;

  otpOptionsExample = `<rlb-otp [length]="4" mask [(ngModel)]="code" />
<rlb-otp alphanumeric [length]="8" [(ngModel)]="code" />`;

  numberApi: DocApiRow[] = [
    { name: 'locale', type: 'string', default: "'en-GB'", description: 'Which locale decides the grouping separator and the decimal mark.', kind: 'Input' },
    { name: 'currency', type: 'string | undefined', default: 'undefined', description: 'An ISO code such as EUR or USD. With one the value is written as money, with the symbol and its position taken from locale.', kind: 'Input' },
    { name: 'decimals', type: 'number | undefined', default: 'undefined', description: 'Digits after the decimal mark. Left out, a currency uses its own and anything else allows 0 to 3.', kind: 'Input' },
    { name: 'min / max', type: 'number | undefined', default: 'undefined', description: 'Bounds. Applied when the field is left, never mid-typing: clamping a half-typed number is how 1 becomes 10 under your hands.', kind: 'Input' },
    { name: 'prefix / suffix', type: 'string | undefined', default: 'undefined', description: 'Text pinned to either side of the box, for units that are not currencies (kg, %, ms).', kind: 'Input' },
    { name: 'align', type: "'left' | 'right'", default: "'right'", description: 'Numbers line up on the right by default so digits sit under digits in a column of fields.', kind: 'Input' },
    { name: 'placeholder / name / size / readonly / disabled', type: 'string | boolean', description: 'As on every other input in the library.', kind: 'Input' },
    { name: 'enable-validation', type: 'boolean', default: 'false', description: 'Paints the Bootstrap is-valid / is-invalid state once the control has been touched.', kind: 'Input' },
    { name: 'ngModel / formControl', type: 'number | null', description: 'The number, never the formatted string. An empty box is null.', kind: 'Two-way' },
  ];

  ratingApi: DocApiRow[] = [
    { name: 'max', type: 'number', default: '5', description: 'How many stars there are.', kind: 'Input' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Shows a score without offering to change it. The control then reads as an image with a label rather than a slider.', kind: 'Input' },
    { name: 'color', type: 'string', default: "'warning'", description: 'Bootstrap colour name used for the filled stars.', kind: 'Input' },
    { name: 'show-value', type: 'boolean', default: 'false', description: 'Writes «3 / 5» beside the stars, for when the exact number matters more than the shape.', kind: 'Input' },
    { name: 'clearable', type: 'boolean', default: 'true', description: 'Clicking the star that is already chosen sets the score back to 0.', kind: 'Input' },
    { name: 'ariaLabel', type: 'string', default: "'Rating'", description: 'What the control is called. Stars carry no text, so without this it announces as an unnamed slider.', kind: 'Input' },
    { name: 'ngModel / formControl', type: 'number', description: 'The score, 0 when nothing is chosen.', kind: 'Two-way' },
    { name: 'choose(index)', type: 'void', description: 'Sets the score as a click on that star would.', kind: 'Method' },
  ];

  otpApi: DocApiRow[] = [
    { name: 'length', type: 'number', default: '6', description: 'How many boxes there are, and how long a complete code is.', kind: 'Input' },
    { name: 'alphanumeric', type: 'boolean', default: 'false', description: 'Accepts letters as well as digits, and stops asking phones for a numeric keypad.', kind: 'Input' },
    { name: 'mask', type: 'boolean', default: 'false', description: 'Hides what is typed, for a PIN rather than a code read off a screen.', kind: 'Input' },
    { name: 'ariaLabel', type: 'string', default: "'One-time code'", description: 'Names the group of boxes.', kind: 'Input' },
    { name: 'slotLabel', type: 'string', default: "'Digit'", description: 'Names each box, with its position after it: the third box announces as «Digit 3».', kind: 'Input' },
    { name: 'size', type: "'small' | 'large' | undefined", default: 'undefined', description: 'Box size, as on every other input.', kind: 'Input' },
    { name: 'completed', type: 'EventEmitter<string>', description: 'Fires once every box is filled, which is where a verification form submits itself.', kind: 'Output' },
    { name: 'ngModel / formControl', type: 'string', description: 'The whole code as one string, not one value per box.', kind: 'Two-way' },
  ];

  onCompleted(code: string) {
    this.lastCode.set(code);
  }
}
