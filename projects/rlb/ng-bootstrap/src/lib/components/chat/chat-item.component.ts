import { booleanAttribute, Component, input, output } from '@angular/core';
import { VisibilityEventBase } from '../../shared/types';

@Component({
  selector: 'rlb-chat-item',
  template: `
  <div [id]="id()" class="chat-bubble-item" [class.left]="position() ==='left'" [class.right]="position() === 'right'">
    @if (canReply() && position() === 'right') {
      <button class="reply-button" (click)="replyClick($event)">
        <i class="bi bi-reply-fill"></i>
      </button>
    }
    @if (position() === 'left') {
      <div class="avatar small">
        <img [src]="avatar()" alt="avatar">
      </div>
    }
    <div class="text">
      @if (replayText()) {
        <div class="replied-message">
          <span class="name">{{ replaySubject() }}</span>
          <p>{{ replayText() }}</p>
        </div>
      }
      <div>
        <ng-content/>
      </div>
      <i class="bi bi-check-all float-end"></i>
      <span class="time float-end">{{ dateTime() | date:'dd/MM HH:mm:ss' }}</span>
      <rlb-dropdown direction="up" class="reaction">
        @if (!reaction()) {
          <a rlb-button rlb-dropdown
            autoClose="manual" class="reaction add p-1"
            [class.right]="position() === 'right'" [class.left]="position() === 'left'"
            (status-changed)="reactionSelector.emit($event)">
            <i class="bi bi-plus m-0 p-0"></i>
          </a>
        }
        <rlb-dropdown-container>
          <ng-content select="[reaction-picker]" />
        </rlb-dropdown-container>
      </rlb-dropdown>
      @if (reaction()) {
        <span class="reaction" [class.right]="position() === 'right'" [class.left]="position() === 'left'" (click)="reactionClick.emit('remove')">{{ reaction() }}</span>
      }
    </div>
    @if (position() === 'right') {
      <div class="avatar small">
        <img [src]="avatar()" alt="avatar">
      </div>
    }
    @if (canReply() && position() === 'left') {
      <button class="reply-button" (click)="replyClick($event)">
        <i class="bi bi-reply-fill"></i>
      </button>
    }
  </div>
  `,
  host: { '[class.ms-auto]': 'position() === "right"' },
  standalone: false
})
export class ChatItemComponent {
  id = input('', { alias: 'id' });
  avatar = input('', { alias: 'avatar' });
  text = input('', { alias: 'text' });
  dateTime = input<Date | number | undefined>(new Date(), { alias: 'date-time' });

  replayText = input<string | undefined>(undefined, { alias: 'replay-text' });
  replaySubject = input<string | undefined>(undefined, { alias: 'replay-subject' });
  replayId = input<string | undefined>(undefined, { alias: 'replay-id' });

  position = input<'left' | 'right'>('left', { alias: 'position' });
  reaction = input<string | undefined>(undefined, { alias: 'reaction' });

  reply = output<string | undefined>();
  reactionClick = output<string>();
  canReply = input(false, { alias: 'can-reply', transform: booleanAttribute });
  reactionSelector = output<VisibilityEventBase>();

  replyClick(event: MouseEvent) {
    event?.stopPropagation();
    event?.preventDefault();
    this.reply.emit(this.replayId());
  }
}
