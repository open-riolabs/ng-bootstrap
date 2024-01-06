import { Component, OnInit } from '@angular/core';
import {
  ModalService,
  ToastService,
} from 'projects/rlb/ng-bootstrap/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-bootstrap';

  onSearch(text: string | null) {
    console.log(text);
  }
}
