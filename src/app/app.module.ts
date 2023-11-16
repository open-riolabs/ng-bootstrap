import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RlbBootstrapModule } from 'projects/rlb/ng-bootstrap/src/public-api';
import { FormsModule } from '@angular/forms';
import { DemoComponent } from './demo/demo.component';
import { ToastComponent } from './toast/toast.component';
import { RoutingModule } from './routing.module';
import { HomeComponent } from './pages/home/home.component';
import { GettingStartedComponent } from './pages/getting-started/getting-started.component';
import { AccordionsComponent } from './pages/components/accordions/accordions.component';
import { AlertsComponent } from './pages/components/alerts/alerts.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    DemoComponent,
    ToastComponent,
    HomeComponent,
    GettingStartedComponent,
    AccordionsComponent,
    AlertsComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RlbBootstrapModule.forRoot({
      modals: [DemoComponent],
      toasts: [ToastComponent]
    }),
    FormsModule,
    RoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
