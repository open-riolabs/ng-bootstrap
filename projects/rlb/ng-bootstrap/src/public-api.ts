/*
 * Public API Surface of ng-bootstrap
 */

import { EnvironmentProviders, Provider } from '@angular/core';
import { SearchModalComponent, CommonModalComponent } from './public-api';
import { RlbBootstrapModule } from './public-api';
import { ModalRegistryOptions } from './public-api';

export * from './lib/rlb-bootstrap.module';
export * from './lib/components';
export * from './lib/pipes';
export * from './lib/data/datatable';
export * from './lib/forms/inputs';
export * from './lib/forms/rlb-form-fields/rlb-form-fields.component';

export * from './lib/shared/unique-id.service';
export * from './lib/shared/types';
export * from './lib/interfaces';
export * from './lib/modals';
export * from './lib/shared/i-date-tz';

export function provideRlbBootstrap(): (EnvironmentProviders | Provider)[] {
  return [
    RlbBootstrapModule,
    {
      provide: ModalRegistryOptions, useValue: {
        modals: {
          'rlb-search': SearchModalComponent,
          'rlb-common': CommonModalComponent
        }
      } as ModalRegistryOptions, multi: true
    }
  ]
}
