import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GettingStartedComponent } from './pages/getting-started/getting-started.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

/**
 * The two big sections load on demand.
 *
 * They used to be written as `loadChildren: () => RoutingComponentsModule` over a plain top-of-file
 * import, which reads as lazy but is not: the static import pulls every documentation page into the
 * initial chunk. That is how the bundle reached 1.99 MB against a 2 MB error budget — and CI builds
 * this site, so the next page anyone added would have failed the GitHub Pages deploy rather than
 * merely warning.
 */
export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', redirectTo: '' },
  { path: 'getting-started', component: GettingStartedComponent },
  {
    path: 'components',
    loadChildren: () => import('./pages/components/routing.module').then(m => m.RoutingComponentsModule),
  },
  {
    path: 'inputs',
    loadChildren: () => import('./pages/inputs/routing.module').then(m => m.RoutingInputsModule),
  },
  { path: '**', component: NotFoundComponent },
];
