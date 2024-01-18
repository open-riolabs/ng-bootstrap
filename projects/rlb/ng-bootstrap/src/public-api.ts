/*
 * Public API Surface of ng-bootstrap
 */

import { EnvironmentProviders, Provider } from '@angular/core';
import { SearchModalComponent } from './public-api';
import { RlbBootstrapModule } from './public-api';
import { ModalRegistryOptions } from './public-api';

export * from './lib/rlb-bootstrap.module';
export * from './lib/components';
export * from './lib/data/datatable';
export * from './lib/forms/inputs';
export * from './lib/forms/rlb-form-fields/rlb-form-fields.component';

export * from './lib/shared/types';
export * from './lib/interfaces';
export * from './lib/modals';

export function provideRlbBootstrap(): (EnvironmentProviders | Provider)[] {
  return [
    RlbBootstrapModule,
    { provide: ModalRegistryOptions, useValue: { modals: [SearchModalComponent] }, multi: true }
  ]
}
