import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  imports: [SHARED_IMPORTS],
})
export class AvatarsComponent {
  sample: string = `<rlb-avatar src="https://www.w3schools.com/howto/img_avatar.png"/>`;

  size: string = `<rlb-avatar src="https://www.w3schools.com/howto/img_avatar.png" [size]="30"/>`;

  shape: string = `<rlb-avatar src="https://www.w3schools.com/howto/img_avatar.png" [shape]="'square'"/>`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './avatar.component.html',
})
export class AvatarsComponent {}`;
}
