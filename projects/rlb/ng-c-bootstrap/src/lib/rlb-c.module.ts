import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RlbBootstrapModule } from '@open-rlb/ng-bootstrap';
import { COMPONENTS } from './components';

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, RlbBootstrapModule],
  exports: [...COMPONENTS],
})
export class RlbCBootstrapModule { }

