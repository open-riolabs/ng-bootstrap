import { CdkDrag, CdkDragPlaceholder, CdkDragPreview, CdkDropList, CdkDropListGroup } from "@angular/cdk/drag-drop";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { COMPONENTS } from './components';
import { TABLE } from './data/datatable';
import { INPUTS } from './forms/inputs';
import { FormFieldsComponent } from './forms/rlb-form-fields/rlb-form-fields.component';
import { PIPES } from './pipes';
import { COMPONENT_BUILDER } from './shared/component-builder';

@NgModule({
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
        CdkDragPreview,
        ...TABLE,
        ...INPUTS,
        ...COMPONENTS,
        ...COMPONENT_BUILDER,
        ...PIPES,
        FormFieldsComponent
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
