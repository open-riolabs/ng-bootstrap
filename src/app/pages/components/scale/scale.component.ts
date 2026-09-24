import { Component, signal } from '@angular/core';
import { RlbCommand } from '@open-rlb/ng-bootstrap';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

interface Row {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-scale',
  templateUrl: './scale.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class ScaleComponent {
  private nextId = 1;

  readonly rows = signal<Row[]>(this.batch(50));
  readonly loading = signal(false);
  readonly loaded = signal(1);

  readonly lastCommand = signal<string | undefined>(undefined);

  readonly commands: RlbCommand[] = [
    { id: 'new-user', label: 'New user', group: 'Users', icon: 'bi bi-person-plus', shortcut: 'N', keywords: ['create', 'add'], run: () => this.say('New user') },
    { id: 'invite', label: 'Invite user', group: 'Users', icon: 'bi bi-envelope', keywords: ['email'], run: () => this.say('Invite user') },
    { id: 'export', label: 'Export users as CSV', group: 'Users', icon: 'bi bi-download', run: () => this.say('Export users') },
    { id: 'dash-settings', label: 'Dashboard settings', group: 'System', icon: 'bi bi-sliders', run: () => this.say('Dashboard settings') },
    { id: 'billing', label: 'Billing & invoices', group: 'System', icon: 'bi bi-receipt', keywords: ['fatture', 'payment'], run: () => this.say('Billing') },
    { id: 'theme', label: 'Toggle dark mode', group: 'System', icon: 'bi bi-circle-half', keywords: ['appearance'], run: () => this.say('Toggle dark mode') },
    { id: 'logout', label: 'Sign out', icon: 'bi bi-box-arrow-right', keywords: ['logout', 'esci'], run: () => this.say('Sign out') },
    { id: 'danger', label: 'Delete the workspace', group: 'System', icon: 'bi bi-trash', disabled: true, run: () => this.say('never') },
  ];

  private batch(count: number): Row[] {
    const names = ['George', 'Paul', 'Alex', 'Bianca', 'Lucia', 'Mario'];
    return Array.from({ length: count }, () => {
      const id = this.nextId++;
      return { id, name: `${names[id % names.length]} ${id}`, email: `user${id}@example.com` };
    });
  }

  private say(what: string) {
    this.lastCommand.set(what);
  }

  /** The caller has to ignore the event while a page is already in flight — the list cannot know. */
  loadMore() {
    if (this.loading() || this.loaded() >= 6) return;
    this.loading.set(true);
    setTimeout(() => {
      this.rows.update(current => [...current, ...this.batch(50)]);
      this.loaded.update(n => n + 1);
      this.loading.set(false);
    }, 400);
  }

  virtualExample = `<rlb-virtual-list
  [items]="rows()"
  [item-size]="52"
  height="22rem"
  (near-end)="loadMore()">
  <ng-template let-row let-i="index">
    <div class="px-3 py-2 border-bottom d-flex justify-content-between">
      <span>{{ i + 1 }} — {{ row.name }}</span>
      <span class="text-body-secondary">{{ row.email }}</span>
    </div>
  </ng-template>
</rlb-virtual-list>`;

  paletteExample = `<!-- Mount it once, near the root, like rlb-modal-container. -->
<rlb-command-palette [commands]="commands" shortcut="mod+k" />

readonly commands: RlbCommand[] = [
  {
    id: 'new-user',
    label: 'New user',
    group: 'Users',
    icon: 'bi bi-person-plus',
    keywords: ['create', 'add'],
    run: () => this.router.navigate(['/users/new']),
  },
  // …
];`;

  virtualApi: DocApiRow[] = [
    { name: 'items', type: 'readonly T[]', default: '[]', description: 'The whole list. Only what is on screen is rendered.', kind: 'Input' },
    { name: 'item-size', type: 'number', default: '48', description: 'The height of one row in pixels — fixed, and it must match what the template renders or the scrollbar lies about how long the list is.', kind: 'Input' },
    { name: 'height', type: 'string', default: "'20rem'", description: 'A CSS length for the viewport. Without a height there is nothing to scroll inside.', kind: 'Input' },
    { name: 'threshold', type: 'number', default: '10', description: 'How far from the end, in rows, (near-end) fires.', kind: 'Input' },
    { name: 'track-by', type: '(index, item) => unknown', default: 'the index', description: 'What identifies a row, for the CDK recycling.', kind: 'Input' },
    { name: 'bordered', type: 'boolean', default: 'true', description: 'Draws a border and rounds the viewport.', kind: 'Input' },
    { name: 'near-end', type: 'void', description: 'The user is within threshold rows of the bottom. Fires once per arrival — but the caller must still ignore it while a page is in flight.', kind: 'Output' },
    { name: 'scrolled-index', type: 'number', description: 'The first row currently rendered.', kind: 'Output' },
    { name: '<ng-template>', type: 'let-item, let-i="index"', description: 'The row template, projected as the only content.', kind: 'Content' },
  ];

  paletteApi: DocApiRow[] = [
    { name: 'commands', type: 'readonly RlbCommand[]', default: '[]', description: 'Everything the palette can do. Each needs a stable id — it is how «recent» remembers it.', kind: 'Input' },
    { name: 'shortcut', type: 'string', default: "'mod+k'", description: 'A +-joined list ending in one key. mod is Cmd on a Mac and Ctrl everywhere else, so one string covers both. Empty turns the shortcut off.', kind: 'Input' },
    { name: 'recent-count', type: 'number', default: '3', description: 'How many recently used commands sit at the top when the box is empty. 0 turns it off.', kind: 'Input' },
    { name: 'title / placeholder / emptyLabel / recentLabel', type: 'string', description: 'The words. English defaults.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Stops the shortcut and open() alike.', kind: 'Input' },
    { name: 'executed', type: 'RlbCommand', description: 'A command was chosen. It has already run.', kind: 'Output' },
    { name: 'open() / close()', type: 'void', description: 'Drive it from a button as well as the shortcut.', kind: 'Method' },
  ];

  commandApi: DocApiRow[] = [
    { name: 'id', type: 'string', description: 'Stable across renders: how «recently used» remembers this command.', kind: 'Input' },
    { name: 'label', type: 'string', description: 'What it is called. Searched.', kind: 'Input' },
    { name: 'hint', type: 'string | undefined', description: 'A second line, for what the label could not say.', kind: 'Input' },
    { name: 'group', type: 'string | undefined', description: 'The heading it is listed under. Ungrouped commands come first.', kind: 'Input' },
    { name: 'keywords', type: 'string[] | undefined', description: 'Extra words the search should match — synonyms, the old name, an abbreviation. Also searched.', kind: 'Input' },
    { name: 'shortcut', type: 'string | undefined', description: 'Shown beside the command. Display only; the palette does not bind it.', kind: 'Input' },
    { name: 'disabled', type: 'boolean | undefined', description: 'Hidden until searched for, then listed and not runnable.', kind: 'Input' },
    { name: 'run', type: '() => void', description: 'What happens when it is chosen.', kind: 'Method' },
  ];
}
