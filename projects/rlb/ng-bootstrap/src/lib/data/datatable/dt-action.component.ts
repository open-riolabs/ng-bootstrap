import {
  booleanAttribute,
  Component,
  EmbeddedViewRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

@Component({
    selector: 'rlb-dt-action',
    template: `
    <ng-template #template>
      <li (click)="onClick($event)" [routerLink]="routerLink">
        <button class="dropdown-item" type="button" [disabled]="disabled">
          <ng-content />
        </button>
      </li>
    </ng-template>`,
    standalone: false
})
export class DataTableActionComponent implements OnInit {
  @Input({ alias: 'disabled', transform: booleanAttribute }) disabled?: boolean = false;
  @Input() routerLink?: any[] | string | null | undefined
  @Output() click: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  element!: HTMLElement;
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  constructor(private viewContainerRef: ViewContainerRef) { }
  private temp!: EmbeddedViewRef<any>;

  get _view() {
    return this.temp
  }

  ngOnInit() {
    this.temp = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = this.temp.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }

  onClick(e: MouseEvent) {
    e?.preventDefault();
    this.click.emit(e);
  }
}
