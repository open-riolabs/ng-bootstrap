import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './avatar.component.html',
})
export class AvatarsComponent {

  html: string = `<rlb-avatar src="https://www.w3schools.com/howto/img_avatar.png" [size]="35" />`;

  ts: string = `@Component({
  selector: 'app-modal',
  templateUrl: './avatar.component.html',
})
export class AvatarsComponent {}`;
}
