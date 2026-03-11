import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
  input,
} from '@angular/core';

@Component({
  selector: 'rlb-pagination-item',
  template: `
    <ng-template #template>
      <li class="page-item {{ cssClass() }}" [class.disabled]="disabled()" [class.active]="active()">
        @if (isIcon()) {
          <a class="page-link d-block" [attr.disabled]="disabled() ? true : null">
            <ng-container *ngTemplateOutlet="content"></ng-container>
          </a>
        } @else {
          <ng-container *ngTemplateOutlet="content"></ng-container>
        }
        <ng-template #e>
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </ng-template>
      </li>
    </ng-template>
    <ng-template #content><ng-content /></ng-template>
    `,
  standalone: false
})
export class PaginationItemComponent implements OnInit {
  element!: HTMLElement;
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  isIcon = input(false, { alias: 'isIcon', transform: booleanAttribute });
  disabled = input(false, { alias: 'disabled', transform: booleanAttribute });
  active = input(false, { alias: 'active', transform: booleanAttribute });
  cssClass = input('', { alias: 'class' });

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
