import { JsonPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';
import { RlbBootstrapModule } from '@open-rlb/ng-bootstrap';

export const SHARED_IMPORTS = [
  RlbBootstrapModule,
  HighlightModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  JsonPipe
] as const;
