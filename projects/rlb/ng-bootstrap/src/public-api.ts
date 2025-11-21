/*
 * Public API Surface of ng-bootstrap
 */

import { EnvironmentProviders, Provider } from '@angular/core';
import { CommonModalComponent, ModalRegistryOptions, RlbBootstrapModule, SearchModalComponent } from './public-api';

import {
  EventCreateEditComponent
} from "./lib/components/calendar/calendar-event-create-edit/event-create-edit.component";
import {
  CalendarOverflowEventsContainerComponent
} from "./lib/components/calendar/calendar-overflow-events-container/calendar-overflow-events-container.component"

export * from './lib/components';
export * from './lib/data/datatable';
export * from './lib/forms/inputs';
export * from './lib/forms/rlb-form-fields/rlb-form-fields.component';
export * from './lib/pipes';
export * from './lib/rlb-bootstrap.module';

export * from './lib/interfaces';
export * from './lib/modals';
export * from './lib/shared/types';
export * from './lib/shared/unique-id.service';
export * from './lib/utils';
export * from './lib/shared/i18-abstraction';

export function provideRlbBootstrap(): (EnvironmentProviders | Provider)[] {
  return [
    RlbBootstrapModule,
    {
      provide: ModalRegistryOptions, useValue: {
        modals: {
          'rlb-search': SearchModalComponent,
					'rlb-common': CommonModalComponent,
          'rlb-calendar-event-create-edit': EventCreateEditComponent,
          'rlb-calendar-overlow-events-container': CalendarOverflowEventsContainerComponent
        }
      } as ModalRegistryOptions, multi: true
    }
  ];
}
