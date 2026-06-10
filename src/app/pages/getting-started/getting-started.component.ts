import { Component, signal } from '@angular/core';

import { SHARED_IMPORTS } from '../../shared-imports';
import { DOCS_IMPORTS } from '../../shared/docs';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class GettingStartedComponent {
  copiedKey = signal('');

  copy(text: string, key: string) {
    navigator.clipboard?.writeText(text);
    this.copiedKey.set(key);
    setTimeout(() => this.copiedKey.set(''), 1500);
  }

  ngAddCmd = 'ng add @open-rlb/ng-bootstrap';

  npmCmd = 'npm install @open-rlb/ng-bootstrap';

  providersCode = `// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRlbBootstrap } from '@open-rlb/ng-bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRlbBootstrap(),
  ],
};`;

  stylesCode = `// angular.json → projects.<app>.architect.build.options.styles
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/bootstrap-icons/font/bootstrap-icons.css",
  "src/styles.scss"
]`;

  usageExample = `<rlb-card>
  <rlb-card-body>
    <h5 class="card-title">Hello ng-bootstrap</h5>
    <p class="card-text text-body-secondary">Your first component is ready.</p>
    <button rlb-button color="primary">Get started</button>
  </rlb-card-body>
</rlb-card>`;

  themeCode = `<!-- Toggle the whole app, or any subtree -->
<html data-bs-theme="dark">
  ...
</html>`;
}
