import { Component, signal } from '@angular/core';
import { FormControl } from '@angular/forms';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-segmented-doc',
  templateUrl: './segmented.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class SegmentedDocComponent {
  readonly period = signal('month');
  readonly view = signal('list');
  readonly plan = signal('pro');

  readonly skills = signal<string[]>(['Angular', 'TypeScript']);
  readonly recipients = signal<string[]>([]);
  readonly limited = signal<string[]>(['one', 'two']);
  readonly refused = signal<string | null>(null);

  readonly reactivePeriod = new FormControl('week');

  readonly frameworks = ['Angular', 'React', 'Vue', 'Svelte', 'Solid', 'Qwik'];

  segmentedExample = `<rlb-segmented [(ngModel)]="period" label="Period">
  <rlb-segmented-option value="day" label="Day" />
  <rlb-segmented-option value="week" label="Week" />
  <rlb-segmented-option value="month" label="Month" />
</rlb-segmented>`;

  segmentedIconExample = `<!-- Icon-only options still need a label: it becomes the accessible name. -->
<rlb-segmented [(ngModel)]="view" label="Layout" color="secondary">
  <rlb-segmented-option value="list" label="List" icon="bi bi-list-ul" />
  <rlb-segmented-option value="grid" label="Grid" icon="bi bi-grid-3x3-gap" />
  <rlb-segmented-option value="map" label="Map" icon="bi bi-geo-alt" disabled />
</rlb-segmented>`;

  segmentedBlockExample = `<rlb-segmented [(ngModel)]="plan" label="Plan" block size="lg">
  <rlb-segmented-option value="free" label="Free" />
  <rlb-segmented-option value="pro" label="Pro" />
  <rlb-segmented-option value="team" label="Team" />
</rlb-segmented>`;

  segmentedReactiveExample = `readonly reactivePeriod = new FormControl('week');

<rlb-segmented [formControl]="reactivePeriod" label="Period">…</rlb-segmented>`;

  tagExample = `<rlb-tag-input [(ngModel)]="skills" placeholder="Add a skill…" />`;

  tagSuggestionsExample = `<!-- Suggestions are a hint, not a list of allowed values. -->
<rlb-tag-input
  [suggestions]="frameworks"
  [separators]="[',', ' ']"
  placeholder="Type or pick"
  [(ngModel)]="recipients"
/>`;

  tagLimitExample = `<rlb-tag-input
  [max-tags]="3"
  [(ngModel)]="limited"
  (rejected)="onRejected($event)"
/>`;

  segmentedApi: DocApiRow[] = [
    { name: 'label', type: 'string | undefined', default: 'undefined', description: 'Names the group. A radio group without a name announces only its options, so the question they answer is lost.', kind: 'Input' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | undefined", default: 'undefined', description: 'Button size for the whole group.', kind: 'Input' },
    { name: 'color', type: "'primary' | 'secondary' | 'dark'", default: "'primary'", description: 'Which colour the taken option is filled with; the rest are outlined in it.', kind: 'Input' },
    { name: 'block', type: 'boolean', default: 'false', description: 'Stretches the group to the full width, splitting it evenly between the options.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables every option. A single option carries its own disabled.', kind: 'Input' },
    { name: 'ngModel / formControl', type: 'unknown', description: 'The value of the taken option, compared by identity — so objects work as well as strings.', kind: 'Two-way' },
    { name: 'choose(option)', type: 'void', description: 'Takes an option as a click would.', kind: 'Method' },
  ];

  segmentedOptionApi: DocApiRow[] = [
    { name: 'value', type: 'unknown', default: 'undefined', description: 'What this choice is worth. Written to the model as it is.', kind: 'Input' },
    { name: 'label', type: 'string | undefined', default: 'undefined', description: 'The text on the button, and the accessible name when only an icon is shown.', kind: 'Input' },
    { name: 'icon', type: 'string | undefined', default: 'undefined', description: 'Icon classes drawn before the label.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Skipped by the arrow keys as well as unclickable — a disabled stop in the middle of a keyboard walk is a dead end.', kind: 'Input' },
  ];

  tagApi: DocApiRow[] = [
    { name: 'suggestions', type: 'string[]', default: '[]', description: 'Offered as a datalist while typing. A hint, not a constraint: anything else is still accepted.', kind: 'Input' },
    { name: 'separators', type: 'string[]', default: "[',']", description: 'Characters that end a tag, besides Enter. Add a space for the fastest possible entry.', kind: 'Input' },
    { name: 'max-tags', type: 'number | undefined', default: 'undefined', description: 'How many tags may be added. Past it the box stops accepting and (rejected) says why.', kind: 'Input' },
    { name: 'allow-duplicates', type: 'boolean', default: 'false', description: 'Off, adding a tag that is already there is refused rather than silently ignored.', kind: 'Input' },
    { name: 'case-sensitive', type: 'boolean', default: 'false', description: 'Off, «Angular» and «angular » are the same tag.', kind: 'Input' },
    { name: 'ariaLabel / removeLabel', type: 'string', default: "'Tags' / 'Remove'", description: 'Names the field and each chip’s remove button, which has no text of its own.', kind: 'Input' },
    { name: 'rejected', type: "EventEmitter<{ value, reason: 'duplicate' | 'full' }>", description: 'A tag was refused. Nothing is shown by default: what to say about it belongs to the form, not the control.', kind: 'Output' },
    { name: 'ngModel / formControl', type: 'string[]', description: 'The tags, in the order they were added.', kind: 'Two-way' },
    { name: 'add(value) / remove(tag)', type: 'boolean / void', description: 'Adds or removes a tag from code. add returns whether it was taken.', kind: 'Method' },
  ];

  onRejected(event: { value: string; reason: 'duplicate' | 'full' }) {
    this.refused.set(`«${event.value}» refused: ${event.reason}`);
  }
}
