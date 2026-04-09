import { booleanAttribute, Directive, input, output, signal } from '@angular/core';

@Directive({
  selector: '[rlb-dnd]',
  standalone: false,
  host: {
    '[class.rlb-dnd-over]': 'isOver()',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)',
  },
})
export class DndDirective {
  multiple = input(false, { transform: booleanAttribute });
  fileDropped = output<File[]>();
  isOver = signal(false);

  onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isOver.set(true);
  }

  onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isOver.set(false);
  }

  onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isOver.set(false);

    const files = evt.dataTransfer?.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const result = this.multiple() ? fileArray : [fileArray[0]];
      this.fileDropped.emit(result);
    }
  }
}
