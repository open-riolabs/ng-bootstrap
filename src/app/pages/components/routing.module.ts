import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AccordionsComponent } from './accordions/accordions.component';
import { ModalsComponent } from './modals/modals.component';
import { ToastsComponent } from './toasts/toasts.component';
import { DropdownsComponent } from './dropdown/dropdown.component';
import { CollapesesComponent } from './collapses/collapse.component';
import { AvatarsComponent } from './avatars/avatar.component';
import { BadgesComponent } from './badges/badge.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumb.component';
import { ButtonsComponent } from './buttons/button.component';
import { CardsComponent } from './cards/card.component';
import { ListsComponent } from './lists/list.component';
import { LoadersComponent } from './loaders/loader.component';
import { OffcanvassComponent } from './offcanvass/offcanvas.component';
import { PaginationsComponent } from './pagionations/pagionation.component';
import { PlaceholdersComponent } from './placeholders/placeholder.component';
import { ScrollspysComponent } from './scrollspys/scrollspy.component';
import { TabssComponent } from './tabs/tab.component';
import { TooltipssComponent } from './tooltipss/tooltips.component';
import { NavsComponent } from './navigations/navs/nav.component';
import { NavbarsComponent } from './navigations/navbars/navbar.component';
import { TablesComponent } from "./tables/tables.component";
import { CalendarComponent } from "./calendar/calendar.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'accordions', component: AccordionsComponent },
  { path: 'alerts', component: AlertsComponent },
  { path: 'modals', component: ModalsComponent },
  { path: 'toasts', component: ToastsComponent },
  { path: 'dropdowns', component:  DropdownsComponent},
  { path: 'collapses', component:  CollapesesComponent},
  { path: 'avatars', component: AvatarsComponent },
  { path: 'badges', component: BadgesComponent },
  { path: 'breadcrumbs', component: BreadcrumbsComponent },
  { path: 'buttons', component: ButtonsComponent },
  { path: 'cards', component: CardsComponent },
  { path: 'lists', component: ListsComponent },
  { path: 'tables', component: TablesComponent },
  { path: 'loaders', component: LoadersComponent },
  { path: 'offcanvass', component: OffcanvassComponent },
  { path: 'paginations', component: PaginationsComponent },
  { path: 'placeholders', component: PlaceholdersComponent },
  { path: 'scrollspys', component: ScrollspysComponent },
  { path: 'tabs', component: TabssComponent },
  { path: 'tooltips', component: TooltipssComponent },
  { path: 'navigation/navs', component: NavsComponent },
	{ path: 'navigation/navbars', component: NavbarsComponent },
	{ path: 'calendar', component: CalendarComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutingComponentsModule {}
