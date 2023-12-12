import { Component, Input, ViewContainerRef, OnInit, ViewChild, TemplateRef } from '@angular/core'

@Component({
  selector: 'rlb-pagination-item',
  template: `
  <ng-template #template>
    <li class="page-item" 
      [class.disabled]="disabled" 
      [class.active]="active">
      <a class="page-link" *ngIf="isIcon;else e" [attr.disabled]="disabled">       
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </a>
      <ng-template #e>
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </ng-template>
    </li>
  </ng-template>
  <ng-template #content><ng-content /></ng-template>
  `
})
export class PaginationItemComponent implements OnInit {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  @Input() isIcon: boolean = false;
  @Input() disabled: boolean = false;
  @Input() active: boolean = false;

  constructor(private viewContainerRef: ViewContainerRef) {

  }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.viewContainerRef.element.nativeElement.remove()
  }
}