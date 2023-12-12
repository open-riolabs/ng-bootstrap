import { Component, Input, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";

@Component({
  selector: 'rlb-list-item-image',
  template: `
  <ng-template #template>
    <li class="list-group-item"
      [class.disabled]="disabled" 
      [class.list-group-item-action]="disabled !== true" 
      [class.active]="active"
      [attr.aria-current]="active">
      <div>
        <rlb-avatar [src]="profilePicture" [size]="avatarSize"></rlb-avatar>
      </div>
      <div class="ps-2 flex-grow-1">
        <div class="fw-bold">{{username}}</div>
        <span *ngIf="line1" class="d-block">{{line1}}</span>
        <span *ngIf="line2" class="d-block">{{line2}}</span>
      </div>
      <div *ngIf="unread">
        <span rlb-badge [pill]="true">{{unread}}</span>
      </div>
    </li>
  </ng-template>`,
  host: {

  },
})
export class ListItemImageComponent {
  @Input('active') active!: boolean
  @Input('disabled') disabled!: boolean
  @Input('avatar-size') avatarSize?: number = 50;
  @Input('username') username?: string;
  @Input('line-1') line1?: string;
  @Input('line-2') line2?: string;
  @Input('profile-picture') profilePicture?: string;
  @Input('unread') unread?: number | string;
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) { }
  
  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.viewContainerRef.element.nativeElement.remove()
  }
}