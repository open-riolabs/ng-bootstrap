import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { CommonModalComponent, ModalRegistryOptions, RlbBootstrapModule, ToastRegistryOptions, SearchModalComponent, TabsComponent } from 'projects/rlb/ng-bootstrap/src/public-api';
import { FormsModule } from '@angular/forms';
import {  ToastSampleComponent } from './pages/components/toasts/toasts-sample.component';
import { RoutingModule } from './routing.module';
import { HomeComponent } from './pages/home/home.component';
import { GettingStartedComponent } from './pages/getting-started/getting-started.component';
import { AccordionsComponent } from './pages/components/accordions/accordions.component';
import { AlertsComponent } from './pages/components/alerts/alerts.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HighlightModule, provideHighlightOptions } from 'ngx-highlightjs';
import { ModalsComponent } from './pages/components/modals/modals.component';
import { ModalSampleComponent } from './pages/components/modals/modal-sample.component';
import { ToastsComponent } from './pages/components/toasts/toasts.component';
import { DropdownsComponent } from './pages/components/dropdown/dropdown.component';
import { CollapesesComponent } from './pages/components/collapses/collapse.component';
import { AvatarsComponent } from './pages/components/avatars/avatar.component';
import { BadgesComponent } from './pages/components/badges/badge.component';
import { BreadcrumbsComponent } from './pages/components/breadcrumbs/breadcrumb.component';
import { ButtonsComponent } from './pages/components/buttons/button.component';
import { CardsComponent } from './pages/components/cards/card.component';
import { ListsComponent } from './pages/components/lists/list.component';
import { LoadersComponent } from './pages/components/loaders/loader.component';
import { OffcanvassComponent } from './pages/components/offcanvass/offcanvas.component';
import { PaginationsComponent } from './pages/components/pagionations/pagionation.component';
import { PlaceholdersComponent } from './pages/components/placeholders/placeholder.component';
import { ScrollspysComponent } from './pages/components/scrollspys/scrollspy.component';
import { TabssComponent } from './pages/components/tabs/tab.component';
import { TooltipssComponent } from './pages/components/tooltipss/tooltips.component';
import { NavsComponent } from './pages/components/navigations/navs/nav.component';
import { NavbarsComponent } from './pages/components/navigations/navbars/navbar.component';
import { InputsComponent } from './pages/inputs/input/inputs.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GettingStartedComponent,
    AccordionsComponent,
    AlertsComponent,
    ModalsComponent,
    ToastsComponent,
    DropdownsComponent,
    CollapesesComponent,
    AvatarsComponent,
    BadgesComponent,
    BreadcrumbsComponent,
    ButtonsComponent,
    CardsComponent,
    ListsComponent,
    LoadersComponent,
    OffcanvassComponent,
    PaginationsComponent,
    PlaceholdersComponent,
    ScrollspysComponent,
    TabssComponent,
    TooltipssComponent,
    NavsComponent,
    NavbarsComponent,
    InputsComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RlbBootstrapModule,
    FormsModule,
    RoutingModule,
    HighlightModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: ModalRegistryOptions,
      useValue: {
        modals: {
          "sample-dialog": ModalSampleComponent,
          'rlb-search': SearchModalComponent,
          'rlb-common': CommonModalComponent
        }
      },
      multi: true,
    },
    {
      provide: ToastRegistryOptions,
      useValue: {
        toasts: {
          "sample-toast": ToastSampleComponent
        }
      },
      multi: true,
    },
    provideHighlightOptions({
      fullLibraryLoader: () => import('highlight.js')
    })
  ],
})
export class AppModule { }
