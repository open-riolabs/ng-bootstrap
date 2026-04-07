import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'rlb-chat-container',
  template: `
    <ng-content />
  `,
  host: { class: 'chat-bubble__wrap' },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatContainerComponent {}
