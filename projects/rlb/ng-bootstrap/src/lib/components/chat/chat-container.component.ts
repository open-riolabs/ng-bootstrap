import { Component } from '@angular/core';

@Component({
  selector: 'rlb-chat-container',
  template: `<ng-content />`,
  host: { class: 'chat-bubble__wrap' },
})
export class ChatContainerComponent { }
