import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { HighlightModule } from 'ngx-highlightjs';

/**
 * A Bootstrap-docs style example: a live preview box on top, followed by the
 * highlighted source code with a copy-to-clipboard button.
 */
@Component({
  selector: 'docs-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HighlightModule],
  template: `
    @if (heading()) {
      <h2 class="h4 mt-5 mb-2">{{ heading() }}</h2>
    }
    @if (description()) {
      <p class="text-body-secondary">{{ description() }}</p>
    }

    <div class="bd-example border rounded-top-3 p-4">
      <ng-content />
    </div>

    @if (code()) {
      <div class="bd-code position-relative border border-top-0 rounded-bottom-3">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary bd-copy"
          [attr.aria-label]="copied() ? 'Copied' : 'Copy to clipboard'"
          (click)="copy()">
          <i class="bi" [class.bi-clipboard]="!copied()" [class.bi-check2]="copied()"></i>
        </button>
        <pre class="m-0"><code [highlight]="code()" [language]="language()"></code></pre>
      </div>
    }
  `,
  styles: [`
    .bd-example { background-color: var(--bs-body-bg); }
    .bd-code { background-color: var(--bs-tertiary-bg); }
    .bd-code pre { padding: 1rem; margin: 0; overflow: auto; }
    .bd-code pre code { background: transparent; padding: 0; }
    .bd-copy { position: absolute; top: .5rem; right: .5rem; z-index: 2; }
  `],
})
export class DocsExampleComponent {
  heading = input('');
  description = input('');
  code = input('');
  language = input<'html' | 'typescript' | 'scss' | 'css'>('html');
  copied = signal(false);

  copy() {
    navigator.clipboard?.writeText(this.code());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }
}
