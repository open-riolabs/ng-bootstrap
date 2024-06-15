import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'rlb-chat-item',
  template: `
  <div [id]="id" class="chat-bubble-item" [class.chat-bubble__left]="position==='left'" [class.chat-bubble__right]="position==='right'">
    <button *ngIf="canReply && position === 'right'" class="reply-button" (click)="replyClick($event)">
      <i class="bi bi-reply-fill"></i>
    </button>
    <div class="avatar small" *ngIf="position === 'left'">
        <img [src]="avatar" alt="avatar">
    </div>
    <div class="chat-bubble-item__text">
      <div class="chat-bubble__replied-message" *ngIf="replayText">
        <span class="replied-message__name">{{replaySubject}}</span>
        <p>{{replayText}}</p>
      </div>
      <div>
        <ng-content/>
      </div>
       <i class="bi bi-check-all float-end"></i>
     <span class="chat-bubble-item__time float-end">{{ dateTime | date:'dd/MM HH:mm:ss' }}</span>
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

  @Output() reply = new EventEmitter();
  @Input({ alias: 'can-reply' }) canReply?: boolean = false;

  replyClick(event: MouseEvent) {
    event?.stopPropagation();
    event?.preventDefault();
    this.reply.emit(this.replayId);
  }
}
