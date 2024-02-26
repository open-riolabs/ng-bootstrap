import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  booleanAttribute,
} from '@angular/core';

@Component({
  selector: 'rlb-list-item-image',
  template: `
    <div class="d-flex">
      <rlb-avatar *ngIf="avatar" [src]="avatar" [size]="avatarSize" />
      <div class="ps-2 flex-grow-1">
        <div class="fw-bold">{{ username }}</div>
        <span *ngIf="line1" class="d-block">{{ line1 }}</span>
        <span *ngIf="line2" class="d-block">{{ line2 }}</span>
      </div>
      <div *ngIf="pill">
        <span rlb-badge [pill]="true">{{ pill }}</span>
      </div>
    </div>
  `,
  host: {
    class: 'list-group-item',
    '[class.disabled]': 'disabled',
    '[class.list-group-item-action]': 'disabled !== true',
    '[class.active]': 'active',
    '[attr.aria-current]': 'active',
  },
})
export class ListItemImageComponent {
  @Input({ transform: booleanAttribute, alias: 'active' }) active!: boolean;
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled!: boolean;
  @Input('avatar-size') avatarSize?: number = 50;
  @Input('username') username?: string;
  @Input('line-1') line1?: string;
  @Input('line-2') line2?: string;
  @Input('avatar') avatar?: string;
  @Input('pill') pill?: number | string;

  constructor() { }
}
