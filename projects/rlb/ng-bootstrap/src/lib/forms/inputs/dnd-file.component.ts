import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { UniqueIdService } from '../../shared/unique-id.service';

@Component({
  selector: 'rlb-file-dnd',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="rlb-dnd-container"
      rlb-dnd
      [multiple]="multiple()"
      (fileDropped)="onFileDropped($event)"
    >
      <input
        type="file"
        #fileDropRef
        class="d-none"
        [id]="userDefinedId()"
        [attr.multiple]="multiple() ? '' : null"
        (change)="fileBrowseHandler($event)"
      />

      <!-- Empty State -->
      <div class="d-flex flex-column align-items-center justify-content-center">
        <div
          class="mb-1"
          style="font-size: 5rem"
        >
          <i class="bi bi-cloud-arrow-up"></i>
        </div>
        <h3 class="fs-2 fw-bold m-0">{{ data()?.content?.drag || 'Drag & Drop files here' }}</h3>
        <p class="fs-4 fw-normal mb-4">
          {{ multiple() ? 'Supports multiple files' : 'Select a single file' }}
        </p>

        <label
          [for]="userDefinedId()"
          class="btn btn-primary px-4 py-2"
        >
          {{ data()?.content?.button || 'Browse Files' }}
        </label>
      </div>
    </div>

    <!-- File List Implementation -->
    @if (files().length > 0) {
      <div class="mt-3">
        @for (file of files(); track file.name + file.size) {
          <rlb-card>
            <rlb-card-body class="d-flex align-items-center">
              <div class="fs-3 flex-shrink-0">
                <i class="bi bi-file-earmark-text"></i>
              </div>

              <div
                class="mx-3 flex-grow-1"
                style="min-width: 0"
              >
                <div class="d-flex justify-content-between align-items-center mb-2 gap-2">
                  <span class="fw-bold text-truncate">{{ file.name }}</span>

                  <span class="text-secondary text-nowrap flex-shrink-0">
                    {{ formatBytes(file.size) }}
                  </span>
                </div>

                <rlb-progress
                  [height]="4"
                  [value]="100"
                ></rlb-progress>
              </div>

              <button
                rlb-button
                outline
                color="danger"
                class="flex-shrink-0 ms-1"
                (click)="deleteFile(file)"
                aria-label="Remove file"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </rlb-card-body>
          </rlb-card>
        }
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .rlb-dnd-container {
        border: 2px dashed rgba(255, 255, 255, 0.15);
        border-radius: 1rem;
        padding: 3rem 2rem;
        cursor: pointer;
      }

      /* Directive Class Binding */
      .rlb-dnd-over {
        border-color: var(--bs-border-color);
        background: rgba(99, 102, 241, 0.1);
        transform: scale(1.01);
      }
    `,
  ],
})
export class FileDndComponent {
  files = signal<File[]>([]);
  multiple = input(false, { transform: booleanAttribute });
  data = input<any>({});
  private idService = inject(UniqueIdService);
  userDefinedId = input(`dnd${this.idService.id}`, { alias: 'id' });

  filesChange = output<File[]>({ alias: 'files' });

  onFileDropped(newFiles: File[]) {
    this.updateFiles(newFiles);
  }

  fileBrowseHandler(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.updateFiles(Array.from(target.files));
      target.value = '';
    }
  }

  private updateFiles(incoming: File[]) {
    this.files.update(current => {
      const updated = this.multiple() ? [...current, ...incoming] : [incoming[incoming.length - 1]];
      this.filesChange.emit(updated);
      return updated;
    });
  }

  deleteFile(fileToRemove: File) {
    this.files.update(current => {
      const updated = current.filter(f => f !== fileToRemove);
      this.filesChange.emit(updated);
      return updated;
    });
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
