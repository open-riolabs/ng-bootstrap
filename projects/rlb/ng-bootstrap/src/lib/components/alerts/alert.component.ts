import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
  TemplateRef,
  booleanAttribute,
} from '@angular/core';
import { Color } from '../../shared/types';

@Component({
  selector: 'rlb-alert',
  template: ` <ng-template #template>
    <div class="alert alert-{{ color }} {{ cssClass }}" role="alert">
      <ng-content></ng-content>
      <button
        *ngIf="dismissible"
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        (click)="dismissed.emit()"
      ></button>
    </div>
  </ng-template>`,
})
export class AlertComponent {
  element!: HTMLElement;

  @Input({ alias: 'color' }) color: Color = 'primary';
  @Input({alias: 'dismissible', transform: booleanAttribute}) dismissible?: boolean;
  @Input({ alias: 'class' }) cssClass?: string = '';

  @Output() dismissed: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
