/*
 * Public API Surface of ng-bootstrap
 */

import { EnvironmentProviders, Provider } from '@angular/core';
import {
  CalendarOverflowEventsContainerComponent,
  CommonModalComponent,
  EventCreateEditComponent,
  ModalRegistryOptions,
  RlbBootstrapModule,
  SearchModalComponent
} from './public-api';


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

export * from './lib/components/calendar/calendar-dialogs/index'

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
