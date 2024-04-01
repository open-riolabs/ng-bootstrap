import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  booleanAttribute,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Color } from '../../shared/types';

@Component({
  selector: 'rlb-list-item-image',
  template: `
    <div class="d-flex">
      <rlb-avatar *ngIf="avatar" [src]="avatar" [size]="avatarSize" />
      <i *ngIf="!avatar && icon" [class]="icon" style="font-size: {{avatarSize}}px;"></i>
      <div class="ps-2 flex-grow-1">
        <div class="fw-bold">{{ username }}</div>
        <span *ngIf="line1" class="d-block">{{ line1 }}</span>
        <span *ngIf="line2" class="d-block">{{ line2 }}</span>
      </div>
      <div *ngIf="counter || counterEmpty">
        <span *ngIf="counterEmpty" rlb-badge [pill]="counterPill" [color]="counterColor">&nbsp;</span>
        <span *ngIf="!counterEmpty"rlb-badge [pill]="counterPill" [color]="counterColor">{{ counter }}</span>
      </div>
    </div>
  `,
  host: {
    class: 'list-group-item',
    '[class.disabled]': 'disabled',
    '[class.list-group-item-action]': 'disabled !== true',
    '[class.active]': 'active',
    '[attr.aria-current]': 'active',
  }
})
export class ListItemImageComponent {
  @Input({ transform: booleanAttribute, alias: 'active' }) active!: boolean;
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled!: boolean;
  @Input({ transform: booleanAttribute, alias: 'counter-empty' }) counterEmpty?: string;
  @Input({ transform: booleanAttribute, alias: 'counter-pill' }) counterPill?: boolean;
  @Input('avatar-size') avatarSize?: number = 50;
  @Input('username') username?: string;
  @Input('line-1') line1?: string;
  @Input('line-2') line2?: string;
  @Input('avatar') avatar?: string;
  @Input('counter') counter?: number | string;
  @Input('counter-color') counterColor?: Color | undefined;
  @Input('icon') icon?: string;
}
