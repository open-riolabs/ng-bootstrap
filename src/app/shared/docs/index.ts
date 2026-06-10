import { DocsApiComponent } from './docs-api.component';
import { DocsExampleComponent } from './docs-example.component';
import { DocsPageComponent } from './docs-page.component';

export * from './docs-api.component';
export * from './docs-example.component';
export * from './docs-page.component';

/** Convenience bundle to import the documentation layout components in a doc page. */
export const DOCS_IMPORTS = [
  DocsPageComponent,
  DocsExampleComponent,
  DocsApiComponent,
] as const;
