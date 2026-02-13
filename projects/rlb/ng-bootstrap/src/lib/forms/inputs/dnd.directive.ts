import {
  booleanAttribute,
  Directive,
  input,
  output,
  signal
} from '@angular/core';

@Directive({
  selector: '[rlb-dnd]',
  standalone: false,
  host: {
    '[class.fileover]': 'fileOver()',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)'
  }
})
export class DndDirective {
  multi = input(false, { alias: 'multiple', transform: booleanAttribute });

  fileDropped = output<File[]>();

  fileOver = signal(false);

  onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver.set(true);
  }

  onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver.set(false);
  }

  onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver.set(false);
    let files = evt.dataTransfer?.files;
    if (files && files.length > 0) {
      const _f: File[] = [];
      if (files.length > 1 && !this.multi()) {
        _f.push(files[0]);
      }
      else {
        for (let i = 0; i < files.length; i++) _f.push(files[i]);
      }
      this.fileDropped.emit(_f);
    }
  }
}
