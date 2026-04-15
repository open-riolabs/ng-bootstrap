import { ApplicationConfig, importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHighlightOptions } from 'ngx-highlightjs';

import {
  CalendarOverflowEventsContainerComponent,
  CalendarToastComponent,
  CommonModalComponent,
  EventCreateEditComponent,
  ModalRegistryOptions,
  SearchModalComponent,
  ToastRegistryOptions,
} from 'projects/rlb/ng-bootstrap/src/public-api';

import { routes } from './routing.module';
import { ModalSampleComponent } from './pages/components/modals/modal-sample.component';
import { ToastSampleComponent } from './pages/components/toasts/toasts-sample.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(),
    provideAnimations(),
    {
      provide: ModalRegistryOptions,
      useValue: {
        modals: {
          'sample-dialog': ModalSampleComponent,
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
      },
      themePath: 'assets/styles/github-dark.css',
    }),
  ],
};
