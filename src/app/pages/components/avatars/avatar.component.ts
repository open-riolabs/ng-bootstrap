import { Component } from '@angular/core';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class AvatarsComponent {
  basicExample = `<rlb-avatar src="https://www.w3schools.com/howto/img_avatar.png" />`;

  sizeExample = `<rlb-avatar src="https://www.w3schools.com/howto/img_avatar.png" [size]="30" />
<rlb-avatar src="https://www.w3schools.com/howto/img_avatar.png" />
<rlb-avatar src="https://www.w3schools.com/howto/img_avatar.png" [size]="80" />`;

  shapeExample = `<rlb-avatar src="https://www.w3schools.com/howto/img_avatar.png" shape="circle" />
<rlb-avatar src="https://www.w3schools.com/howto/img_avatar.png" shape="round" />
<rlb-avatar src="https://www.w3schools.com/howto/img_avatar.png" shape="square" />`;

  api: DocApiRow[] = [
    { name: 'src', type: 'string | undefined', default: 'undefined', description: 'URL of the image to display as the avatar.', kind: 'Input' },
    { name: 'size', type: 'number', default: '50', description: 'Width and height of the avatar in pixels.', kind: 'Input' },
    { name: 'shape', type: "'circle' | 'round' | 'square'", default: "'circle'", description: "Shape of the avatar: fully round (circle), slightly rounded corners (round), or no rounding (square).", kind: 'Input' },
    { name: 'class', type: 'string | undefined', default: "''", description: 'Additional CSS class(es) applied to the rendered image element.', kind: 'Input' },
  ];
}
