import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TABLE } from './data/datatable';
import { INPUTS } from './forms/inputs';
import { COMPONENTS } from './components';
import { FormFieldsComponent } from './forms/rlb-form-fields/rlb-form-fields.component';
import { COMPONENT_BUILDER } from './shared/component-builder';
import { PIPES } from './pipes';
import { CdkDrag, CdkDragPlaceholder, CdkDragPreview, CdkDropList, CdkDropListGroup } from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [
    ...TABLE,
    ...INPUTS,
    ...COMPONENTS,
    ...COMPONENT_BUILDER,
    ...PIPES,
    FormFieldsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    CdkDrag,
    CdkDropListGroup,
    CdkDropList,
    CdkDragPlaceholder,
    CdkDragPreview
  ],
  exports: [
    ...TABLE,
    ...INPUTS,
    ...COMPONENTS,
    ...PIPES,
    FormFieldsComponent
  ],
  providers: [],
})
export class RlbBootstrapModule { }
