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

  groupExample = `<rlb-avatar-group [extra]="4" ariaLabel="On this ticket">
  @for (member of team(); track member.id) {
    <rlb-avatar [src]="member.photo" [size]="40" />
  }
</rlb-avatar-group>`;

  groupOverlapExample = `<rlb-avatar-group [overlap]="4" [size]="40" [extra]="2">…</rlb-avatar-group>
<rlb-avatar-group [overlap]="24" [size]="40" [extra]="2">…</rlb-avatar-group>`;

  groupLabelExample = `<!-- A function, because «+3 more» does not translate as glued parts. -->
<rlb-avatar-group
  [extra]="12"
  [overflowLabel]="italianCount"
  ariaLabel="Partecipanti"
>…</rlb-avatar-group>

italianCount = (count: number) => 'altre ' + count + ' persone';`;

  readonly photo = 'https://www.w3schools.com/howto/img_avatar.png';
  readonly italianCount = (count: number) => 'altre ' + count + ' persone';

  groupApi: DocApiRow[] = [
    { name: 'extra', type: 'number', default: '0', description: 'How many more there are beyond the avatars projected here. The group counts rather than hides: the caller writes the @for and so already decides how many to draw.', kind: 'Input' },
    { name: 'size', type: 'number', default: '50', description: 'Diameter of the «+N» badge. Match it to the avatars beside it.', kind: 'Input' },
    { name: 'overlap', type: 'number', default: '12', description: 'How far each avatar sits over the one before, in pixels.', kind: 'Input' },
    { name: 'ariaLabel', type: 'string | undefined', default: 'undefined', description: 'Names the pile — «On this ticket», «Attendees». With one the group is announced as a group; without, it is just images.', kind: 'Input' },
    { name: 'overflowLabel', type: '(count: number) => string', default: "count => `${count} more`", description: 'What the badge is called. A function rather than a string, because a count glued to a word does not translate.', kind: 'Input' },
  ];

  api: DocApiRow[] = [
    { name: 'src', type: 'string | undefined', default: 'undefined', description: 'URL of the image to display as the avatar.', kind: 'Input' },
    { name: 'size', type: 'number', default: '50', description: 'Width and height of the avatar in pixels.', kind: 'Input' },
    { name: 'shape', type: "'circle' | 'round' | 'square'", default: "'circle'", description: "Shape of the avatar: fully round (circle), slightly rounded corners (round), or no rounding (square).", kind: 'Input' },
    { name: 'class', type: 'string | undefined', default: "''", description: 'Additional CSS class(es) applied to the rendered image element.', kind: 'Input' },
  ];
}
