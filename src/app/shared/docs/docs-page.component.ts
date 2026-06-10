import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Page shell for a documentation page — Bootstrap 5.3 docs style.
 * Renders a title + lead header, then projects the page content.
 */
@Component({
  selector: 'docs-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="container-xxl my-4 docs-page">
      <header class="mb-4 pb-3 border-bottom">
        <h1 class="display-6 mb-2">{{ title() }}</h1>
        @if (lead()) {
          <p class="fs-5 text-body-secondary mb-0">{{ lead() }}</p>
        }
      </header>
      <ng-content />
    </div>
  `,
})
export class DocsPageComponent {
  title = input('');
  lead = input('');
}
