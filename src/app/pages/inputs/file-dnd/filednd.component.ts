import { Component, signal } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-file-dnd',
  templateUrl: './filednd.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class FileDndsComponent {
  selectedFiles = signal<File[]>([]);

  basicExample = `<rlb-file-dnd (files)="selectedFiles.set($event)"></rlb-file-dnd>`;

  multipleExample = `<rlb-file-dnd [multiple]="true" (files)="selectedFiles.set($event)"></rlb-file-dnd>`;

  customLabelExample = `<rlb-file-dnd
  [data]="{ content: { drag: 'Drop your images here', button: 'Pick Images' } }"
  (files)="selectedFiles.set($event)">
</rlb-file-dnd>`;

  api: DocApiRow[] = [
    {
      name: 'multiple',
      type: 'boolean',
      default: 'false',
      description: 'When true, allows selecting or dropping multiple files at once. When false, only the last selected file is kept.',
      kind: 'Input',
    },
    {
      name: 'data',
      type: 'any',
      default: '{}',
      description: 'Object for customising UI labels. Supports data.content.drag (drop-zone heading) and data.content.button (browse button text).',
      kind: 'Input',
    },
    {
      name: 'id',
      type: 'string',
      description: 'ID forwarded to the hidden file input element. Auto-generated when omitted.',
      kind: 'Input',
    },
    {
      name: 'files',
      type: 'File[]',
      description: 'Emits the current file list whenever a file is added (via drag-and-drop or the file picker) or removed with the delete button.',
      kind: 'Output',
    },
  ];
}
