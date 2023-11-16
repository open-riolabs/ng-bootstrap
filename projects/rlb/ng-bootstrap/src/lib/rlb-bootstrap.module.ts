import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';

import { TABLE } from './data/datatable';
import { INPUTS } from './forms/inputs';
import { COMPONENTS } from './components';
import { FormFieldsComponent } from './forms/rlb-form-fields/rlb-form-fields.component';
import { ModalRegistryOptions } from './components/modals/options/modal-registry.options';
import { COMPONENT_BUILDER } from './shared/component-builder';
import { FOR_ROOT_OPTIONS_TOKEN, RlbBootstrapOptions } from './rlb-bootstrap';
import { modalRegistryProvider } from './components/modals/providers/modal-registry.provider';
import { ModalRegistry } from './components/modals/options/modal-registry';
import { ToastRegistryOptions } from './components/toast/options/toast-registry.options';
import { toastRegistryProvider } from './components/toast/providers/modal-registry.provider';

@NgModule({
  declarations: [
    ...TABLE,
    ...INPUTS,
    ...COMPONENTS,
    ...COMPONENT_BUILDER,
    FormFieldsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule
  ],
  exports: [
    ...TABLE,
    ...INPUTS,
    ...COMPONENTS,
    FormFieldsComponent
  ]
})
export class RlbBootstrapModule {
  static forRoot(options?: RlbBootstrapOptions): ModuleWithProviders<RlbBootstrapModule> {
    return ({
      ngModule: RlbBootstrapModule,
      providers: [
        {
          provide: FOR_ROOT_OPTIONS_TOKEN,
          useValue: options
        },
        {
          provide: ModalRegistryOptions,
          useFactory: modalRegistryProvider(),
          deps: [FOR_ROOT_OPTIONS_TOKEN],
          multi: true,
        },
        {
          provide: ToastRegistryOptions,
          useFactory: toastRegistryProvider(),
          deps: [FOR_ROOT_OPTIONS_TOKEN],
          multi: true
        }
      ]
    });
  }

  static forChild(options?: ModalRegistry): ModuleWithProviders<RlbBootstrapModule> {
    return ({
      ngModule: RlbBootstrapModule,
      providers: [
        {
          provide: FOR_ROOT_OPTIONS_TOKEN,
          useExisting: FOR_ROOT_OPTIONS_TOKEN
        },
        {
          provide: ModalRegistryOptions,
          useFactory: modalRegistryProvider(options),
          deps: [FOR_ROOT_OPTIONS_TOKEN],
          multi: true,
        },
        {
          provide: ToastRegistryOptions,
          useFactory: toastRegistryProvider(),
          deps: [FOR_ROOT_OPTIONS_TOKEN],
          multi: true
        }
      ]
    });
  }
}
