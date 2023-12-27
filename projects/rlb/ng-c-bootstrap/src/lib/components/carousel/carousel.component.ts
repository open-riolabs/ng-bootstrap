import { Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Carousel } from './carousel.data';

@Component({
  selector: 'rlb-c-accordion',
  template: `
  <ng-template #template>
    <rlb-carousel
      [show-indicators]="data?.showIndicators"
      [show-controls]="data?.showControls"
      [cross-fade]="data?.crossFade"
      [autoplay]="data?.autoplay"
      [interval]="data?.interval"
      [pause]="data?.pauseProp"
      [wrap]="data?.wrap"
      [no-touch]="data?.noTouch"
      [keyboard]="data?.keyboard">
      <rlb-carousel-slide *ngFor="let slide of data?.slides || []">
        <img [src]="slide.image" class="d-block w-100" alt="...">
        <rlb-carousel-caption *ngIf="slide.title || slide.content">
          <h5>{{ slide.title }}</h5>
          <p>{{ slide.content }}</p>
        </rlb-carousel-caption>
      </rlb-carousel-slide>
    </rlb-carousel>
  </ng-template>`
})
export class CarouselComponent implements OnInit {
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @Input() data!: Carousel | undefined;
  element!: HTMLElement;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template);
    this.element = (templateView.rootNodes[0]);
    this.viewContainerRef.element.nativeElement.remove();
  }

}
