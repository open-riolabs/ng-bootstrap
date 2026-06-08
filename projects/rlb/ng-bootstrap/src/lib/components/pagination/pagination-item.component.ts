import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'rlb-pagination-item',
  template: `
    <ng-template #template>
      <li
        class="page-item {{ cssClass() }}"
        [class.disabled]="disabled()"
        [class.active]="active()"
      >
        <a
          class="page-link d-block"
          role="button"
          [attr.tabindex]="disabled() ? -1 : 0"
          [attr.aria-disabled]="disabled() ? true : null"
          [attr.aria-current]="active() ? 'page' : null"
          [style.cursor]="disabled() ? 'default' : 'pointer'"
          (click)="onActivate($event)"
          (keydown)="onKeydown($event)"
        >
          <ng-container *ngTemplateOutlet="content"></ng-container>
        </a>
      </li>
    </ng-template>
    <ng-template #content><ng-content /></ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
})
export class PaginationItemComponent implements OnInit {
  element!: HTMLElement;
  template = viewChild.required<TemplateRef<any>>('template');

  isIcon = input(false, { alias: 'isIcon', transform: booleanAttribute });
  disabled = input(false, { alias: 'disabled', transform: booleanAttribute });
  active = input(false, { alias: 'active', transform: booleanAttribute });
  cssClass = input('', { alias: 'class' });

  itemClick = output<void>();

  constructor(private viewContainerRef: ViewContainerRef) {}

  onActivate(event: Event) {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    this.itemClick.emit();
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') {
      return;
    }
    event.preventDefault();
    if (this.disabled()) {
      return;
    }
    this.itemClick.emit();
  }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template());
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
