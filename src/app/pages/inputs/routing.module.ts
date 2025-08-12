import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputsComponent } from './input/inputs.component';
import { InputsHomeComponent } from './inputs-home/inputs-home.component';
import { AutocompletesComponent } from './autocomplete/autocomplete.component';
import { CheckboxsComponent } from './checkbox/checkbox.component';
import { ColorsComponent } from './color/color.component';
import { DatalistsComponent } from './datalist/datalist.component';
import { FilesComponent } from './file/file.component';
import { FileDndsComponent } from './file-dnd/filednd.component';
import { InputGroupsComponent } from './input-group/input-group.component';
import { OptionsComponent } from './option/option.component';
import { RangesComponent } from './range/range.component';
import { SelectsComponent } from './select/select.component';
import { SwitchesComponent } from './switch/switch.component';
import { TextareasComponent } from './textarea/textarea.component';
import { RadiosComponent } from './radio/radio.component';
import { InputValidationsComponent } from './input-validation/input-validation.component';

const routes: Routes = [
  { path: '', component: InputsHomeComponent },
  { path: 'autocomplete', component: AutocompletesComponent },
  { path: 'checkbox', component: CheckboxsComponent },
  { path: 'color', component: ColorsComponent },
  { path: 'datalist', component: DatalistsComponent },
  { path: 'file', component: FilesComponent },
  { path: 'file-dnd', component: FileDndsComponent },
  { path: 'input', component: InputsComponent },
  { path: 'input-group', component: InputGroupsComponent },
  { path: 'input-validation', component: InputValidationsComponent },
  { path: 'option', component: OptionsComponent },
  { path: 'radio', component: RadiosComponent },
  { path: 'range', component: RangesComponent },
  { path: 'select', component: SelectsComponent },
	{ path: 'switch', component: SwitchesComponent },
  { path: 'textarea', component: TextareasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingInputsModule { }
