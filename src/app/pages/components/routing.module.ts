import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AlertsComponent } from './alerts/alerts.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'accordions', component: AlertsComponent },
  { path: 'alerts', component: AlertsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingComponentsModule {}
