import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { CommonModalComponent, ModalRegistryOptions, RlbBootstrapModule, ToastRegistryOptions, SearchModalComponent } from 'projects/rlb/ng-bootstrap/src/public-api';
import { FormsModule } from '@angular/forms';
import { DemoComponent } from './demo/demo.component';
import { ToastComponent } from './toast/toast.component';
import { RoutingModule } from './routing.module';
import { HomeComponent } from './pages/home/home.component';
import { GettingStartedComponent } from './pages/getting-started/getting-started.component';
import { AccordionsComponent } from './pages/components/accordions/accordions.component';
import { AlertsComponent } from './pages/components/alerts/alerts.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HighlightModule, provideHighlightOptions } from 'ngx-highlightjs';
import { ModalsComponent } from './pages/components/modals/modals.component';
import { ModalSampleComponent } from './pages/components/modals/modal-sample.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    ToastComponent,
    HomeComponent,
    GettingStartedComponent,
    AccordionsComponent,
    AlertsComponent,
    ModalsComponent,
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
          "demo-component": DemoComponent,
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
          "toast-component": ToastComponent
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
