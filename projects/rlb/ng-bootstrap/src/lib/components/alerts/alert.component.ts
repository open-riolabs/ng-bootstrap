import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { Color } from '../../shared/types';

@Component({
    selector: 'rlb-alert',
    template: ` <ng-template #template>
      <div class="alert alert-{{ color() }} {{ cssClass() }}" role="alert">
        <ng-content></ng-content>
        @if (dismissible()) {
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            (click)="dismissed.emit()"
          ></button>
        }
      </div>
    </ng-template>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent implements OnInit {
  element!: HTMLElement;

  color = input<Color>('primary', { alias: 'color' });
  dismissible = input(false, { alias: 'dismissible', transform: booleanAttribute });
  cssClass = input<string | undefined>(undefined, { alias: 'class' });

  dismissed = output<void>();

  template = viewChild.required<TemplateRef<any>>('template');

  private viewContainerRef = inject(ViewContainerRef);

  constructor() { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template(),
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
