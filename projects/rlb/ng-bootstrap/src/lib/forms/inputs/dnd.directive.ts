import {
  Directive,
  Output,
  Input,
  EventEmitter,
  HostBinding,
  HostListener,
  booleanAttribute
} from '@angular/core';

@Directive({
  selector: '[rlb-dnd]'
})
export class DndDirective {
  @HostBinding('class.fileover') fileOver!: boolean;
  @Input({ alias: 'multiple', transform: booleanAttribute }) multi: boolean = false;
  @Output() fileDropped = new EventEmitter<File[]>();

  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
  }

  @HostListener('drop', ['$event']) public ondrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;
    let files = evt.dataTransfer?.files;
    if (files && files.length > 1) {
      if (!this.multi) {
        const _f = []
        for (let i = 0; i < files.length; i++) _f.push(files[i]);
        this.fileDropped.emit(_f);
      }
      else {
        this.fileDropped.emit([files[0]]);
      }
    }
  }
}
