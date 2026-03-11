import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HighlightModule, provideHighlightOptions } from 'ngx-highlightjs';
import {
  CalendarOverflowEventsContainerComponent,
  CalendarToastComponent,
  CommonModalComponent,
  EventCreateEditComponent,
  ModalRegistryOptions,
  RlbBootstrapModule,
  SearchModalComponent,
  ToastRegistryOptions
} from 'projects/rlb/ng-bootstrap/src/public-api';
import { AppComponent } from './app.component';
import { AccordionsComponent } from './pages/components/accordions/accordions.component';
import { AlertsComponent } from './pages/components/alerts/alerts.component';
import { AvatarsComponent } from './pages/components/avatars/avatar.component';
import { BadgesComponent } from './pages/components/badges/badge.component';
import { BreadcrumbsComponent } from './pages/components/breadcrumbs/breadcrumb.component';
import { ButtonsComponent } from './pages/components/buttons/button.component';
import { CalendarComponent } from "./pages/components/calendar/calendar.component";
import { CardsComponent } from './pages/components/cards/card.component';
import { CollapesesComponent } from './pages/components/collapses/collapse.component';
import { DropdownsComponent } from './pages/components/dropdown/dropdown.component';
import { ListsComponent } from './pages/components/lists/list.component';
import { LoadersComponent } from './pages/components/loaders/loader.component';
import { ModalSampleComponent } from './pages/components/modals/modal-sample.component';
import { ModalsComponent } from './pages/components/modals/modals.component';
import { NavbarsComponent } from './pages/components/navigations/navbars/navbar.component';
import { NavsComponent } from './pages/components/navigations/navs/nav.component';
import { OffcanvassComponent } from './pages/components/offcanvass/offcanvas.component';
import { PaginationsComponent } from './pages/components/pagionations/pagionation.component';
import { PlaceholdersComponent } from './pages/components/placeholders/placeholder.component';
import { ScrollspysComponent } from './pages/components/scrollspys/scrollspy.component';
import { TablesComponent } from "./pages/components/tables/tables.component";
import { TabssComponent } from './pages/components/tabs/tab.component';
import { ToastsComponent } from './pages/components/toasts/toasts.component';
import { TooltipssComponent } from './pages/components/tooltipss/tooltips.component';
import { GettingStartedComponent } from './pages/getting-started/getting-started.component';
import { HomeComponent } from './pages/home/home.component';
import { AutocompletesComponent } from './pages/inputs/autocomplete/autocomplete.component';
import { CheckboxsComponent } from './pages/inputs/checkbox/checkbox.component';
import { ColorsComponent } from './pages/inputs/color/color.component';
import { DatalistsComponent } from './pages/inputs/datalist/datalist.component';
import { FileDndsComponent } from './pages/inputs/file-dnd/filednd.component';
import { FilesComponent } from './pages/inputs/file/file.component';
import { InputGroupsComponent } from './pages/inputs/input-group/input-group.component';
import { InputValidationsComponent } from './pages/inputs/input-validation/input-validation.component';
import { InputsComponent } from './pages/inputs/input/inputs.component';
import { InputsHomeComponent } from './pages/inputs/inputs-home/inputs-home.component';
import { OptionsComponent } from './pages/inputs/option/option.component';
import { RadiosComponent } from './pages/inputs/radio/radio.component';
import { RangesComponent } from './pages/inputs/range/range.component';
import { SelectsComponent } from './pages/inputs/select/select.component';
import { SwitchesComponent } from './pages/inputs/switch/switch.component';
import { TextareasComponent } from './pages/inputs/textarea/textarea.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RoutingModule } from './routing.module';
import { ToastSampleComponent } from "./pages/components/toasts/toasts-sample.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GettingStartedComponent,
    // components
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
    TablesComponent,
    LoadersComponent,
    OffcanvassComponent,
    PaginationsComponent,
    PlaceholdersComponent,
    ScrollspysComponent,
    TabssComponent,
    TooltipssComponent,
    NavsComponent,
    NavbarsComponent,
    NotFoundComponent,
    CalendarComponent,
    // inputs
    InputsHomeComponent,
    AutocompletesComponent,
    CheckboxsComponent,
    ColorsComponent,
    DatalistsComponent,
    FilesComponent,
    FileDndsComponent,
    InputsComponent,
    InputGroupsComponent,
    InputValidationsComponent,
    OptionsComponent,
    RadiosComponent,
    RangesComponent,
    SelectsComponent,
    SwitchesComponent,
    TextareasComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RlbBootstrapModule,
    FormsModule,
    RoutingModule,
    HighlightModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: ModalRegistryOptions,
      useValue: {
        modals: {
          "sample-dialog": ModalSampleComponent,
          'rlb-search': SearchModalComponent,
          'rlb-common': CommonModalComponent,
          'rlb-calendar-event-create-edit': EventCreateEditComponent,
          'rlb-calendar-overlow-events-container': CalendarOverflowEventsContainerComponent
        }
      },
      multi: true,
    },
    {
      provide: ToastRegistryOptions,
      useValue: {
        toasts: {
          "sample-toast": ToastSampleComponent,
          "rlb-calendar-toast": CalendarToastComponent
        }
      },
      multi: true,
    },
    provideHighlightOptions({
      coreLibraryLoader: () => import('highlight.js/lib/core'),
      languages: {
        typescript: () => import('highlight.js/lib/languages/typescript'),
        html: () => import('highlight.js/lib/languages/xml'),
        scss: () => import('highlight.js/lib/languages/scss'),
      },
      themePath: 'assets/styles/github-dark.css'
    })
  ],
})
export class AppModule { }
