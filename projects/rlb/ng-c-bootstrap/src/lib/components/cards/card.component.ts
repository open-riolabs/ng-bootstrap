import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Card } from './card.data';

@Component({
    selector: 'rlb-c-card',
    template: ` <ng-template #template>
    <rlb-card
      [style.width.px]="data?.width || 300"
      [overlay]="false"
      [align]="data?.align"
      [background]="data?.background"
      [border]="data?.border"
    >
      <rlb-card-header *ngIf="data?.header">{{ data?.header }}</rlb-card-header>
      <img
        *ngIf="data?.image?.src"
        rlb-card-image
        [src]="data?.image?.src"
        [alt]="data?.image?.alt"
      />
      <rlb-card-body
        *ngIf="data?.title || data?.subtitle || data?.text || data?.actions"
      >
        <h5 *ngIf="data?.title" rlb-card-title>{{ data?.title }}</h5>
        <h6 *ngIf="data?.subtitle" rlb-card-subtitle>{{ data?.subtitle }}</h6>
        <p *ngIf="data?.text" rlb-card-text>{{ data?.text }}</p>
        <a
          *ngFor="let action of data?.actions || []"
          [href]="action.link"
          rlb-card-link
        >
          {{ action.text }}
        </a>
      </rlb-card-body>
      <rlb-card-footer *ngIf="data?.footer">
        {{ data?.footer }}
      </rlb-card-footer>
    </rlb-card>
  </ng-template>`,
    standalone: false
})
export class CardComponent implements OnInit {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @Input() data!: Card | undefined;
  element!: HTMLElement;

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
