import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { SHARED_IMPORTS } from './shared-imports';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [SHARED_IMPORTS, RouterModule],
})
export class AppComponent {
  title = 'ng-bootstrap';

  onSearch(text: string | null) {
    console.log(text);
  }
}
