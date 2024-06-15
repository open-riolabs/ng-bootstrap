import { Component, Input, booleanAttribute, numberAttribute } from '@angular/core';
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
        <span *ngIf="counterEmpty" rlb-badge [pill]="counterPill" [color]="counterColor" [border]="counterBorder">&nbsp;</span>
        <span *ngIf="!counterEmpty"rlb-badge [pill]="counterPill" [color]="counterColor" [border]="counterBorder">{{ counter }}</span>
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
  @Input({ transform: booleanAttribute, alias: 'active', }) active!: boolean;
  @Input({ transform: booleanAttribute, alias: 'disabled', }) disabled!: boolean;
  @Input({ transform: booleanAttribute, alias: 'counter-empty', }) counterEmpty?: string;
  @Input({ transform: booleanAttribute, alias: 'counter-pill', }) counterPill?: boolean;
  @Input({ transform: booleanAttribute, alias: 'counter-border', }) counterBorder?: boolean;
  @Input({ transform: numberAttribute, alias: 'avatar-size', }) avatarSize?: number = 50;
  @Input({ alias: 'username' }) username?: string;
  @Input({ alias: 'line-1' }) line1?: string;
  @Input({ alias: 'line-2' }) line2?: string;
  @Input({ alias: 'avatar' }) avatar?: string;
  @Input({ alias: 'counter' }) counter?: number | string;
  @Input({ alias: 'counter-color' }) counterColor?: Color | undefined;
  @Input({ alias: 'icon' }) icon?: string;
}
