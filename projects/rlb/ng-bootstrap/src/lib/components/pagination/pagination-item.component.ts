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
      <li class="page-item {{cssClass}}" [class.disabled]="disabled" [class.active]="active">
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
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;

  @Input({ transform: booleanAttribute, alias: 'isIcon' }) isIcon?: boolean =
    false;
  @Input({ transform: booleanAttribute, alias: 'disabled' })
  disabled?: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'active' }) active?: boolean =
    false;
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
