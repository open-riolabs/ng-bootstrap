import {
  booleanAttribute,
  Component,
  EmbeddedViewRef,
  input,
  OnInit,
  output,
  TemplateRef,
  viewChild,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'rlb-dt-action',
  template: `
    <ng-template #template>
      <li (click)="onClick($event)" [routerLink]="routerLink()">
        <button class="dropdown-item" type="button" [disabled]="disabled()">
          <ng-content />
        </button>
      </li>
    </ng-template>`,
  standalone: false
})
export class DataTableActionComponent implements OnInit {
  disabled = input(false, { alias: 'disabled', transform: booleanAttribute });
  routerLink = input<any[] | string | null | undefined>(undefined, { alias: 'routerLink' });
  clicked = output<MouseEvent>({ alias: 'click' });

  element!: HTMLElement;
  template = viewChild.required<TemplateRef<any>>('template');

  constructor(private viewContainerRef: ViewContainerRef) { }
  private temp!: EmbeddedViewRef<any>;

  get _view() {
    return this.temp;
  }

  ngOnInit() {
    this.temp = this.viewContainerRef.createEmbeddedView(
      this.template(),
    );
    this.element = this.temp.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }

  onClick(e: MouseEvent) {
    e?.preventDefault();
    this.clicked.emit(e);
  }
}
