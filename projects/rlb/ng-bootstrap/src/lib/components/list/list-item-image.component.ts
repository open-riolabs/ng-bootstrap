import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
} from '@angular/core';

@Component({
  selector: 'rlb-list-item-image',
  template: ` <ng-template #template>
    <li
      class="list-group-item {{ cssClass }}"
      [class.disabled]="disabled"
      [class.list-group-item-action]="disabled !== true"
      [class.active]="active"
      [attr.aria-current]="active"
      (click)="click.emit($event)"
    >
      <div class="d-flex">
        <rlb-avatar [src]="profilePicture" [size]="avatarSize" />
        <div class="ps-2 flex-grow-1">
          <div class="fw-bold">{{ username }}</div>
          <span *ngIf="line1" class="d-block">{{ line1 }}</span>
          <span *ngIf="line2" class="d-block">{{ line2 }}</span>
        </div>
        <div *ngIf="unread">
          <span rlb-badge [pill]="true">{{ unread }}</span>
        </div>
      </div>
    </li>
  </ng-template>`,
  host: {},
})
export class ListItemImageComponent {
  @Input({ transform: booleanAttribute, alias: 'active' }) active!: boolean;
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled!: boolean;
  @Input('avatar-size') avatarSize?: number = 50;
  @Input('username') username?: string;
  @Input('line-1') line1?: string;
  @Input('line-2') line2?: string;
  @Input('profile-picture') profilePicture?: string;
  @Input('unread') unread?: number | string;
  @Input({ alias: 'class' }) cssClass?: string = '';
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @Output() click = new EventEmitter<MouseEvent>();
  element!: HTMLElement;

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
