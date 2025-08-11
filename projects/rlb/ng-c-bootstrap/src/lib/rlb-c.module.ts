import { NgModule } from '@angular/core';
import { COMPONENTS } from './components';
import { CommonModule } from '@angular/common';
import { RlbBootstrapModule } from '@lbdsh/lib-ng-bootstrap';

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, RlbBootstrapModule],
  exports: [...COMPONENTS],
})
export class RlbCBootstrapModule {}

