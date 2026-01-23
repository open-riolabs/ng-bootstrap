import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, booleanAttribute } from '@angular/core';

@Component({
    selector: 'rlb-file-dnd',
    template: `
    <div class="rlb-file-dnd" rlb-dnd [multiple]="multiple" (fileDropped)="onFileDropped($event)">
      <input type="file" #fileDropRef id="fileDropRef" [attr.multiple]="multiple?'':undefined" (change)="fileBrowseHandler($event)" />
      <i class="bi bi-upload"></i>
      <h3>{{ data.content?.drag }}</h3>
      <h3>-</h3>
      <label class="btn btn-primary" for="fileDropRef">{{ data.content?.button }}</label>
    </div>
    <div class="rlb-file-dnd-list">
      @for (file of files; track file; let i = $index) {
        <div class="single-file">
          <i class="bi bi-file-earmark-image" style="font-size: 36px;"></i>
          <div class="info">
            <span class="d-block name"> {{ file.name }} </span>
            <span class="d-block size">{{ formatBytes(file.size) }}</span>
            <rlb-progress [height]="3" [value]="10" animated ></rlb-progress>
          </div>
          <button rlb-button outline class="p-0 mb-auto border-0">
            <i class="bi bi-trash" (click)="deleteFile(file)"></i>
          </button>
        </div>
      }
    </div>`,
    standalone: false
})
export class FileDndComponent {
  files: File[] = [];

  @Input({ alias: 'multiple', transform: booleanAttribute }) multiple: boolean = false;
  @Input({ alias: 'data' }) data: any = {};
  @Input({ alias: 'id', transform: (v: string) => v || '' }) userDefinedId: string = '';
  
  @Output('files') filesChange = new EventEmitter<File[]>();

  @ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;


  onFileDropped(files: File[]) {
    if (this.multiple) {
      this.files = files;
    }
    else {
      this.files = [files[files.length - 1]];
    }
    this.filesChange.emit(this.files);
    this.fileDropEl.nativeElement.value = "";
  }

  fileBrowseHandler(event: Event) {
    const _target = event.target as HTMLInputElement;
    if (_target.files && _target.files?.length) {
      let _f: File[] = []
      if (this.multiple) {
        for (let i = 0; i < _target.files.length; i++) _f.push(_target.files[i])
      } else {
        for (let i = 0; i < _target.files.length; i++) _f = [_target.files[i]]
      }
      this.files = _f;
      this.filesChange.emit(this.files);
      this.fileDropEl.nativeElement.value = "";
    }
  }

  deleteFile(index: File) {
    this.files.splice(this.files.indexOf(index), 1);
    this.filesChange.emit(this.files);
  }

  formatBytes(bytes: number, decimals: number = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}
