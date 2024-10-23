import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InputsComponent } from './input/inputs.component';
import { InputsHomeComponent } from './inputs-home/inputs-home.component';

const routes: Routes = [
  { path: '', component: InputsHomeComponent },
  { path: 'input', component: InputsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingInputsModule { }
