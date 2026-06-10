import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type DocApiKind = 'Input' | 'Output' | 'Two-way' | 'Method' | 'Content';

export interface DocApiRow {
  /** Property / event / method / slot name (use the template alias when present). */
  name: string;
  /** Type or signature, e.g. `boolean`, `'sm' | 'lg'`, `EventEmitter<string>`. */
  type: string;
  /** Default value, omit if none. */
  default?: string;
  /** Human description. */
  description: string;
  /** Kind of API member. */
  kind: DocApiKind;
}

const KIND_CLASS: Record<DocApiKind, string> = {
  Input: 'text-bg-primary',
  Output: 'text-bg-warning',
  'Two-way': 'text-bg-info',
  Method: 'text-bg-secondary',
  Content: 'text-bg-success',
};

/**
 * Bootstrap-docs style API reference table. Pass the full list of inputs,
 * outputs, two-way bindings, methods and content slots of a component.
 */
@Component({
  selector: 'docs-api',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 class="h4 mt-5 mb-3">{{ heading() || 'API' }}</h2>
    @if (selector()) {
      <p class="mb-2"><code class="fs-6">&lt;{{ selector() }}&gt;</code></p>
    }
    <div class="table-responsive">
      <table class="table table-sm table-striped align-middle">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
            <th scope="col" class="text-end">Kind</th>
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track row.name + row.kind) {
            <tr>
              <td><code>{{ row.name }}</code></td>
              <td><code class="text-info-emphasis">{{ row.type }}</code></td>
              <td>
                @if (row.default) { <code>{{ row.default }}</code> }
                @else { <span class="text-body-tertiary">—</span> }
              </td>
              <td>{{ row.description }}</td>
              <td class="text-end">
                <span class="badge rounded-pill" [class]="kindClass(row.kind)">{{ row.kind }}</span>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="5" class="text-body-secondary">No public API.</td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class DocsApiComponent {
  heading = input('');
  selector = input('');
  rows = input<DocApiRow[]>([]);

  kindClass(kind: DocApiKind): string {
    return KIND_CLASS[kind] ?? 'text-bg-secondary';
  }
}
