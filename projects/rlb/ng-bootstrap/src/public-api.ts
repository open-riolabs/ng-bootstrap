/*
 * Public API Surface of ng-bootstrap
 */

import { EnvironmentProviders, Provider } from '@angular/core';
import { EventCreateEditComponent } from './lib/components/calendar/calendar-dialogs/calendar-event-create-edit/event-create-edit.component';
import { CalendarOverflowEventsContainerComponent } from './lib/components/calendar/calendar-dialogs/calendar-overflow-events-container/calendar-overflow-events-container.component';
import { CalendarToastComponent } from './lib/components/calendar/calendar-dialogs/calendar-toast/calendar-toast.component';
import { ModalRegistryOptions } from './lib/components/modals/options/modal-registry.options';
import { ToastRegistryOptions } from './lib/components/toast/options/toast-registry.options';
import { CommonModalComponent } from './lib/modals/common-modal.component';
import { SearchModalComponent } from './lib/modals/search-modal.component';


export * from './lib/components';
export * from './lib/data/datatable';
export * from './lib/forms/inputs';
export * from './lib/forms/rlb-form-fields/rlb-form-fields.component';
export * from './lib/pipes';
export * from './lib/rlb-bootstrap.module';

export * from './lib/interfaces';
export * from './lib/modals';
export * from './lib/shared/i18-abstraction';
export * from './lib/shared/types';
export * from './lib/shared/unique-id.service';
export * from './lib/utils';

export * from './lib/components/calendar/calendar-dialogs/index';

export function provideRlbBootstrap(): (EnvironmentProviders | Provider)[] {
  return [
    {
      provide: ModalRegistryOptions, useValue: {
        modals: {
          'rlb-search': SearchModalComponent,
          'rlb-common': CommonModalComponent,
          'rlb-calendar-event-create-edit': EventCreateEditComponent,
          'rlb-calendar-overlow-events-container': CalendarOverflowEventsContainerComponent
        }
      } as ModalRegistryOptions, multi: true
    },
    {
      provide: ToastRegistryOptions,
      useValue: {
        toasts: {
          "rlb-calendar-toast": CalendarToastComponent
        }
      },
      multi: true,
    },
  ];
}
