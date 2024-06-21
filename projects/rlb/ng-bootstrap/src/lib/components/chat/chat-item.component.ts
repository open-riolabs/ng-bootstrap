import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'rlb-chat-item',
  template: `
  <div [id]="id" class="chat-bubble-item" [class.left]="position==='left'" [class.right]="position==='right'">
    <button *ngIf="canReply && position === 'right'" class="reply-button" (click)="replyClick($event)">
      <i class="bi bi-reply-fill"></i>
    </button>
    <div class="avatar small" *ngIf="position === 'left'">
        <img [src]="avatar" alt="avatar">
    </div>
    <div class="text">
      <div class="replied-message" *ngIf="replayText">
        <span class="name">{{replaySubject}}</span>
        <p>{{replayText}}</p>
      </div>
      <div>
        <ng-content/>
      </div>
       <i class="bi bi-check-all float-end"></i>
     <span class="time float-end">{{ dateTime | date:'dd/MM HH:mm:ss' }}</span>
      <rlb-dropdown  direction="up" class="reaction">
        <a rlb-button *ngIf="!reaction" rlb-dropdown autoClose="manual" class="reaction add p-1" [class.right]="position==='right'" [class.left]="position==='left'">
          <i class="bi bi-plus m-0"></i>
        </a>
        <rlb-dropdown-container>
          <ng-content select="[reaction-picker]" />
        </rlb-dropdown-container>
      </rlb-dropdown>
      <span class="reaction" *ngIf="reaction" [class.right]="position==='right'" [class.left]="position==='left'" (click)="reactionClick.emit('remove')">{{reaction}}</span>
    </div>
    <div class="avatar small" *ngIf="position === 'right'">
        <img [src]="avatar" alt="avatar">
    </div>
    <button *ngIf="canReply && position === 'left'" class="reply-button" (click)="replyClick($event)">
      <i class="bi bi-reply-fill"></i>
    </button>
  </div>
  `,
  host: { '[class.ms-auto]': 'position === "right"' },
})
export class ChatItemComponent {

  @Input({ alias: 'id' }) id?: string = '';
  @Input({ alias: 'avatar' }) avatar?: string = '';
  @Input({ alias: 'text' }) text: string = '';
  @Input({ alias: 'date-time' }) dateTime?: Date | number = new Date();

  @Input({ alias: 'replay-text' }) replayText?: string;
  @Input({ alias: 'replay-subject' }) replaySubject?: string;
  @Input({ alias: 'replay-id' }) replayId?: string;

  @Input({ alias: 'position' }) position?: 'left' | 'right' = 'left';
  @Input({ alias: 'reaction' }) reaction?: string;

  @Output('reply') reply = new EventEmitter();
  @Output('reaction-click') reactionClick = new EventEmitter();
  @Input({ alias: 'can-reply' }) canReply?: boolean = false;

  replyClick(event: MouseEvent) {
    event?.stopPropagation();
    event?.preventDefault();
    this.reply.emit(this.replayId);
  }
}
