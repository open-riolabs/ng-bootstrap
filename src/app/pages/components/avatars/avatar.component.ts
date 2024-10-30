import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './avatar.component.html',
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
