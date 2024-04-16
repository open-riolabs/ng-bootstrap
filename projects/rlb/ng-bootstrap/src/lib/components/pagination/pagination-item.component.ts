import {
  Component,
  Input,
  ViewContainerRef,
  OnInit,
  ViewChild,
  TemplateRef,
  booleanAttribute,
} from '@angular/core';

@Component({
  selector: 'rlb-pagination-item',
  template: `
    <ng-template #template>
      <li class="page-item {{ cssClass }}" [class.disabled]="disabled" [class.active]="active">
        <a class="page-link" *ngIf="isIcon; else e" [attr.disabled]="disabled">
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </a>
        <ng-template #e>
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </ng-template>
      </li>
    </ng-template>
    <ng-template #content><ng-content /></ng-template>
  `,
})
export class PaginationItemComponent implements OnInit {
  element!: HTMLElement;
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  @Input({ alias: 'isIcon', transform: booleanAttribute }) isIcon?: boolean;
  @Input({ alias: 'disabled', transform: booleanAttribute, }) disabled?: boolean;
  @Input({ alias: 'active', transform: booleanAttribute, }) active?: boolean;
  @Input({ alias: 'class' }) cssClass?: string = '';

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
