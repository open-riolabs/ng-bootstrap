import {
  booleanAttribute,
  Component,
  EmbeddedViewRef,
  input,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'rlb-dt-action',
  template: `
    <ng-template #template>
      <li
        (click)="onClick($event)"
        [routerLink]="routerLink()"
      >
        <button
          class="dropdown-item"
          type="button"
          [disabled]="disabled()"
        >
          <ng-content />
        </button>
      </li>
    </ng-template>
  `,
  standalone: false,
})
export class DataTableActionComponent {
  disabled = input(false, { alias: 'disabled', transform: booleanAttribute });
  routerLink = input<any[] | string | null | undefined>(undefined, { alias: 'routerLink' });
  clicked = output<MouseEvent>({ alias: 'click' });

  element!: HTMLElement;
  template = viewChild.required<TemplateRef<any>>('template');

  private temp!: EmbeddedViewRef<any>;

  get _view() {
    return this.temp;
  }

  constructor() {}

  onClick(e: MouseEvent) {
    e?.preventDefault();
    this.clicked.emit(e);
  }
}
