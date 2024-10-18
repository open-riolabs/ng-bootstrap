import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AccordionsComponent } from './accordions/accordions.component';
import { ModalsComponent } from './modals/modals.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'accordions', component: AccordionsComponent },
  { path: 'alerts', component: AlertsComponent },
  { path: 'modals', component: ModalsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingComponentsModule {}
