import { Component, signal } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class FabsComponent {
  /** Last value pasted into the fab input, shown so the example proves it fired. */
  readonly pasted = signal<string | undefined>(undefined);

  basicExample = `<rlb-fab>
  <i class="bi bi-plus-lg"></i>
</rlb-fab>`;

  colorExample = `<rlb-fab color="primary"><i class="bi bi-plus-lg"></i></rlb-fab>
<rlb-fab color="danger"><i class="bi bi-trash"></i></rlb-fab>
<rlb-fab color="success" outline><i class="bi bi-check-lg"></i></rlb-fab>`;

  sizeExample = `<rlb-fab size="xs"><i class="bi bi-plus-lg"></i></rlb-fab>
<rlb-fab size="sm"><i class="bi bi-plus-lg"></i></rlb-fab>
<rlb-fab size="md"><i class="bi bi-plus-lg"></i></rlb-fab>
<rlb-fab size="lg"><i class="bi bi-plus-lg"></i></rlb-fab>`;

  positionExample = `<!-- Pins the button to a corner of the viewport with position-fixed. -->
<rlb-fab position="br"><i class="bi bi-plus-lg"></i></rlb-fab>`;

  inputExample = `<rlb-fab-input (pasteAccepted)="onPaste($event)">
  <rlb-fab color="primary">
    <i class="bi bi-clipboard"></i>
  </rlb-fab>
  <rlb-input placeholder="Paste here" />
</rlb-fab-input>`;

  onPaste(text: string) {
    this.pasted.set(text);
  }

  fabApi: DocApiRow[] = [
    { name: 'color', type: 'Color', default: "'primary'", description: 'Bootstrap colour of the button.', kind: 'Input' },
    { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Diameter of the button.', kind: 'Input' },
    { name: 'outline', type: 'boolean', default: 'false', description: 'Render as an outline button.', kind: 'Input' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button.', kind: 'Input' },
    { name: 'position', type: "'br' | 'bl' | 'tr' | 'tl' | undefined", default: 'undefined', description: 'Pins the button to a corner of the viewport using position-fixed. Left unset, the button flows inline like any other.', kind: 'Input' },
    { name: '(default)', type: 'ng-content', description: 'Content of the button, normally a single icon.', kind: 'Content' },
  ];

  fabInputApi: DocApiRow[] = [
    { name: 'pasteAccepted', type: 'string', description: 'Emitted with the trimmed clipboard text when the user pastes into the revealed input. The input closes and clears itself afterwards.', kind: 'Output' },
    { name: 'open()', type: 'void', description: 'Reveals the input and moves focus into it.', kind: 'Method' },
    { name: 'close()', type: 'void', description: 'Hides the input and clears it, ready for the next interaction.', kind: 'Method' },
    { name: 'rlb-fab', type: 'ng-content', description: 'The button shown while the input is closed.', kind: 'Content' },
    { name: 'rlb-input', type: 'ng-content', description: 'The input revealed when the button is clicked. Typing into it is blocked on purpose — it accepts a paste and nothing else.', kind: 'Content' },
  ];
}
