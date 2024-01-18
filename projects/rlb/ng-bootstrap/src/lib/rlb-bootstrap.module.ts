import { NgModule, ModuleWithProviders, ApplicationConfig } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TABLE } from './data/datatable';
import { INPUTS } from './forms/inputs';
import { COMPONENTS, ModalRegistryOptions } from './components';
import { FormFieldsComponent } from './forms/rlb-form-fields/rlb-form-fields.component';
import { COMPONENT_BUILDER } from './shared/component-builder';
import { SearchModalComponent } from './modals/search-modal.component';

@NgModule({
  declarations: [
    ...TABLE,
    ...INPUTS,
    ...COMPONENTS,
    ...COMPONENT_BUILDER,
    FormFieldsComponent,
    SearchModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
  ],
  exports: [
    ...TABLE,
    ...INPUTS,
    ...COMPONENTS,
    FormFieldsComponent,
    SearchModalComponent,
  ],
  providers: [],
})
export class RlbBootstrapModule { }
