import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHighlightOptions } from 'ngx-highlightjs';

/**
 * Providers for the demo app's test environment, mirroring `src/app/app.config.ts`.
 *
 * - The app runs zoneless and ships no zone.js polyfill, so tests must too.
 * - Most docs pages render `<code [highlight]>`; without highlight options ngx-highlightjs
 *   throws "Highlight.js library was not imported!" during change detection.
 * - Docs pages use `routerLink`, which needs a router to be present.
 */
export default [
  provideZonelessChangeDetection(),
  provideRouter([]),
  provideHighlightOptions({
    coreLibraryLoader: () => import('highlight.js/lib/core'),
    languages: {
      typescript: () => import('highlight.js/lib/languages/typescript'),
      html: () => import('highlight.js/lib/languages/xml'),
      scss: () => import('highlight.js/lib/languages/scss'),
      bash: () => import('highlight.js/lib/languages/bash'),
      json: () => import('highlight.js/lib/languages/json'),
    },
  }),
];
