import {
  Component,
  ContentChildren,
  DoCheck,
  Input,
  QueryList,
  OnInit,
  OnDestroy,
  ElementRef,
  Output,
  EventEmitter,
  booleanAttribute,
} from '@angular/core';
import { UniqueIdService } from '../../shared/unique-id.service';
import { CarouselSlideComponent } from './carousel-slide.component';
import { Carousel } from 'bootstrap';

@Component({
  selector: 'rlb-carousel',
  template: `
    <div class="carousel-indicators">
      <ng-container *ngIf="showIndicators">
        <ng-container *ngFor="let item of items; let i = index">
          <button
            type="button"
            [attr.data-bs-target]="'#' + id"
            [attr.data-bs-slide-to]="i"
            [attr.aria-label]="'Slide ' + (i + 1)"
          ></button>
        </ng-container>
      </ng-container>
    </div>
    <div class="carousel-inner">
      <ng-content select="rlb-carousel-slide" />
    </div>
    <button
      *ngIf="showControls"
      class="carousel-control-prev"
      type="button"
      [attr.data-bs-target]="'#' + id"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      *ngIf="showControls"
      class="carousel-control-next"
      type="button"
      [attr.data-bs-target]="'#' + id"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  `,
  host: {
    class: 'carousel slide',
    '[class.carousel-fade]': 'crossFade',
    '[id]': 'id',
    '[attr.data-bs-ride]':
      'autoplay === "auto" ? "carousel" : autoplay === "manual" ? "true": undefined',
    '[attr.data-bs-touch]': 'noTouch ? "false" : undefined',
    '[attr.data-bs-interval]': 'interval',
    '[attr.data-bs-keyboard]': '!keyboard ? "false" : undefined',
    '[attr.data-bs-wrap]': '!wrap ? "false" : undefined',
    '[attr.data-bs-pause]': 'pause === false ? "false" : undefined',
  },
})
export class CarouselComponent implements DoCheck, OnInit, OnDestroy {
  @ContentChildren(CarouselSlideComponent)
  public items!: QueryList<CarouselSlideComponent>;
  @Input() id!: string;
  @Input({ transform: booleanAttribute, alias: 'show-indicators' })
  showIndicators?: boolean = true;
  @Input({ transform: booleanAttribute, alias: 'show-controls' })
  showControls?: boolean = true;
  @Input({ transform: booleanAttribute, alias: 'cross-fade' })
  crossFade?: boolean = true;
  @Input('autoplay') autoplay?: 'auto' | 'manual' | 'none' = 'none';
  @Input('interval') interval?: number = 5000;
  @Input('pause') pauseProp?: false | 'hover' = 'hover';
  @Input({ transform: booleanAttribute, alias: 'wrap' }) wrap?: boolean = true;
  @Input({ transform: booleanAttribute, alias: 'no-touch' }) noTouch?: boolean =
    false;
  @Input({ transform: booleanAttribute, alias: 'keyboard' })
  keyboard?: boolean = true;
  @Output('slid') slid?: EventEmitter<Carousel.Event> =
    new EventEmitter<Carousel.Event>();
  @Output('slide') slide?: EventEmitter<Carousel.Event> =
    new EventEmitter<Carousel.Event>();

  private carousel!: Carousel;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    uniqueIdService: UniqueIdService,
  ) {
    if (!this.id) {
      this.id = `carousel${uniqueIdService.id}`;
    }
  }

  ngOnInit(): void {
    this.carousel = Carousel.getOrCreateInstance(
      this.elementRef.nativeElement,
      {
        interval: this.interval,
        keyboard: this.keyboard,
        ride:
          this.autoplay === 'auto'
            ? 'carousel'
            : this.autoplay === 'manual'
              ? true
              : undefined,
        touch: this.noTouch ? false : undefined,
        wrap: this.wrap,
        pause: this.pauseProp,
      },
    );
    this.elementRef.nativeElement.addEventListener(
      'slid.bs.carousel',
      this.__event_slid_handler,
    );
    this.elementRef.nativeElement.addEventListener(
      'slide.bs.carousel',
      this.__event_slide_handler,
    );
  }

  ngOnDestroy(): void {
    this.carousel?.dispose();
    this.elementRef.nativeElement.removeEventListener(
      'slid.bs.carousel',
      this.__event_slid_handler,
    );
    this.elementRef.nativeElement.removeEventListener(
      'slide.bs.carousel',
      this.__event_slide_handler,
    );
  }

  ngDoCheck(): void {}

  private __event_slid_handler(e: unknown): void {
    this.slid?.emit(e as Carousel.Event);
  }

  private __event_slide_handler(e: unknown): void {
    this.slide?.emit(e as Carousel.Event);
  }

  public prev(): void {
    this.carousel?.prev();
  }

  public next(): void {
    this.carousel?.next();
  }

  public pause(): void {
    this.carousel?.pause();
  }

  public cycle(): void {
    this.carousel?.cycle();
  }

  public to(index: number): void {
    this.carousel?.to(index);
  }
}
