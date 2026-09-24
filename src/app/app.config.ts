import {
  ApplicationConfig,
  importProvidersFrom,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHighlightOptions } from 'ngx-highlightjs';

import {
  provideRlbTheme,
  CalendarOverflowEventsContainerComponent,
  CalendarToastComponent,
  CommonModalComponent,
  EventCreateEditComponent,
  ModalRegistryOptions,
  SearchModalComponent,
  ToastRegistryOptions,
} from '@open-rlb/ng-bootstrap';

import { routes } from './routing.module';
import { ModalOverlaysComponent } from './pages/components/modals/modal-overlays.component';
import { ModalSampleComponent } from './pages/components/modals/modal-sample.component';
import { ToastSampleComponent } from './pages/components/toasts/toasts-sample.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    // The page already ships data-bs-theme="dark" on <body>; this hands that attribute
    // to ThemeService so the toggle on /components/theme actually drives the site.
    provideRlbTheme({ target: 'body', defaultTheme: 'dark' }),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    {
      provide: ModalRegistryOptions,
      useValue: {
        modals: {
          'sample-dialog': ModalSampleComponent,
          'overlays-dialog': ModalOverlaysComponent,
          'rlb-search': SearchModalComponent,
          'rlb-common': CommonModalComponent,
          'rlb-calendar-event-create-edit': EventCreateEditComponent,
          'rlb-calendar-overlow-events-container': CalendarOverflowEventsContainerComponent,
        },
      },
      multi: true,
    },
    {
      provide: ToastRegistryOptions,
      useValue: {
        toasts: {
          'sample-toast': ToastSampleComponent,
          'rlb-calendar-toast': CalendarToastComponent,
        },
      },
      multi: true,
    },
    provideHighlightOptions({
      coreLibraryLoader: () => import('highlight.js/lib/core'),
      languages: {
        typescript: () => import('highlight.js/lib/languages/typescript'),
        html: () => import('highlight.js/lib/languages/xml'),
        scss: () => import('highlight.js/lib/languages/scss'),
        bash: () => import('highlight.js/lib/languages/bash'),
        json: () => import('highlight.js/lib/languages/json'),
      },
      themePath: 'assets/styles/github-dark.css',
    }),
  ],
};
