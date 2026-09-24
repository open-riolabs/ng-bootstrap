import { Component, signal } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class FeedbackComponent {
  readonly rows = signal(['Mario Rossi', 'Lucia Bianchi', 'Anna Verdi']);
  readonly lastAnswer = signal<string | undefined>(undefined);

  emptyExample = `<rlb-empty-state title="No users yet">
  Invite someone and they will show up here.
  <button actions rlb-button color="primary" size="sm">Invite</button>
</rlb-empty-state>`;

  variantsExample = `<rlb-empty-state variant="search" title="Nothing matches" size="sm">
  Try a shorter word.
</rlb-empty-state>

<rlb-empty-state variant="error" title="Could not load" size="sm">
  The server said no. Try again in a moment.
</rlb-empty-state>

<rlb-empty-state icon="bi bi-inboxes" title="Custom icon" size="sm">
  Any icon class works.
</rlb-empty-state>`;

  popconfirmExample = `<button
  rlb-button
  color="danger"
  size="sm"
  rlb-popconfirm="Delete this row?"
  popconfirm-title="This cannot be undone"
  confirm-label="Delete"
  cancel-label="Keep"
  (confirmed)="remove(row)">
  Delete
</button>`;

  placementExample = `<button rlb-button outline rlb-popconfirm="Sure?" placement="top">Top</button>
<button rlb-button outline rlb-popconfirm="Sure?" placement="right">Right</button>
<button rlb-button outline rlb-popconfirm="Sure?" placement="bottom">Bottom</button>
<button rlb-button outline rlb-popconfirm="Sure?" placement="left">Left</button>`;

  remove(row: string) {
    this.rows.update(current => current.filter(item => item !== row));
    this.lastAnswer.set('deleted ' + row);
  }

  restore() {
    this.rows.set(['Mario Rossi', 'Lucia Bianchi', 'Anna Verdi']);
    this.lastAnswer.set(undefined);
  }

  answer(text: string) {
    this.lastAnswer.set(text);
  }

  emptyApi: DocApiRow[] = [
    { name: 'title', type: 'string | undefined', default: 'undefined', description: 'The line in bold.', kind: 'Input' },
    { name: 'variant', type: "'empty' | 'search' | 'error' | 'custom'", default: "'empty'", description: 'Picks a fitting icon, so the common cases need no icon at all. custom draws only what icon says.', kind: 'Input' },
    { name: 'icon', type: 'string | undefined', default: 'undefined', description: 'An icon class, overriding whatever the variant would have chosen.', kind: 'Input' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Vertical padding and icon size.', kind: 'Input' },
    { name: '(default)', type: 'ng-content', description: 'The sentence under the title.', kind: 'Content' },
    { name: '[actions]', type: 'ng-content', description: 'Buttons under the text. Project them with the actions attribute.', kind: 'Content' },
  ];

  popconfirmApi: DocApiRow[] = [
    { name: 'rlb-popconfirm', type: 'string', default: "''", description: 'What is being asked. Also the accessible name of the panel when there is no title.', kind: 'Input' },
    { name: 'popconfirm-title', type: 'string | undefined', default: 'undefined', description: 'A bold line above the question.', kind: 'Input' },
    { name: 'confirm-label', type: 'string', default: "'Yes'", description: 'The button that goes ahead.', kind: 'Input' },
    { name: 'cancel-label', type: 'string', default: "'No'", description: 'The button that backs out.', kind: 'Input' },
    { name: 'confirm-color', type: 'Color', default: "'danger'", description: 'Colour of the confirm button. Danger by default, because this is usually a deletion.', kind: 'Input' },
    { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Where the panel opens. It flips to the opposite side when there is no room.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'The trigger stops opening anything.', kind: 'Input' },
    { name: 'confirmed', type: 'void', description: 'The user said yes. Nothing else in the directive acts on it.', kind: 'Output' },
    { name: 'cancelled', type: 'void', description: 'The user said no, pressed Escape or clicked away.', kind: 'Output' },
    { name: 'open() / close() / dismiss()', type: 'void', description: 'Drive it from code. dismiss closes and emits cancelled.', kind: 'Method' },
  ];
}
