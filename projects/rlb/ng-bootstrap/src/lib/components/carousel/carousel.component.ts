import { AfterViewInit, Component, ContentChildren, DoCheck, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, booleanAttribute } from '@angular/core';
import { Carousel } from 'bootstrap';
import { UniqueIdService } from '../../shared/unique-id.service';
import { CarouselSlideComponent } from './carousel-slide.component';

@Component({
  selector: 'rlb-carousel',
  template: `
      <ng-container *ngIf="!hideIndicators">
        <div class="carousel-indicators">
          <ng-container *ngFor="let item of items; let i = index">
            <button
              type="button"
              [class.active]="item.active"
              [attr.data-bs-target]="'#' + id"
              [attr.data-bs-slide-to]="i"
              [attr.aria-label]="'Slide ' + (i + 1)"
            ></button>
          </ng-container>
        </div>
      </ng-container>
    <div class="carousel-inner">
      <ng-content select="rlb-carousel-slide" />
    </div>
    <button
      *ngIf="!hideControls"
      class="carousel-control-prev"
      type="button"
      [attr.data-bs-target]="'#' + id"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      *ngIf="!hideControls"
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
    '[attr.data-bs-ride]': 'autoplay === "auto" ? "carousel" : autoplay === "manual" ? "true": undefined',
    '[attr.data-bs-touch]': 'noTouch ? undefined : true',
    '[attr.data-bs-interval]': 'interval',
    '[attr.data-bs-keyboard]': '!keyboard ? "false" : undefined',
    '[attr.data-bs-wrap]': '!wrap ? "false" : undefined',
    '[attr.data-bs-pause]': 'pause === false ? "false" : undefined',
  },
  standalone: false
})
export class CarouselComponent implements DoCheck, OnInit, OnDestroy, AfterViewInit {
  @ContentChildren(CarouselSlideComponent) public items!: QueryList<CarouselSlideComponent>;
  @Input() id!: string;

  @Input({ transform: booleanAttribute, alias: 'hide-indicators' }) hideIndicators?: boolean;
  @Input({ transform: booleanAttribute, alias: 'hide-controls' }) hideControls?: boolean;
  @Input({ transform: booleanAttribute, alias: 'cross-fade' }) crossFade?: boolean = false;
  @Input('autoplay') autoplay?: 'auto' | 'manual' | 'none' = 'none';
  @Input('interval') interval?: number = 500;
  @Input('pause') pauseProp?: false | 'hover' = 'hover';
  @Input({ transform: booleanAttribute, alias: 'wrap' }) wrap?: boolean = true;
  @Input({ transform: booleanAttribute, alias: 'no-touch' }) noTouch?: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'keyboard' }) keyboard?: boolean = true;
  @Output('slid') slid?: EventEmitter<Carousel.Event> = new EventEmitter<Carousel.Event>();
  @Output('slide') slide?: EventEmitter<Carousel.Event> = new EventEmitter<Carousel.Event>();

  private carousel!: Carousel;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private idService: UniqueIdService,
  ) { }

  ngOnInit(): void {
    this.carousel = Carousel.getOrCreateInstance(
      this.elementRef.nativeElement,
      {
        interval: this.interval,
        keyboard: this.keyboard,
        ride: this.adaptRide(this.autoplay),
        touch: this.noTouch ? false : true,
        wrap: this.wrap,
        pause: this.pauseProp,
      },
    );
    this.elementRef.nativeElement.addEventListener('slid.bs.carousel', e => this.__event_slid_handler(e));
    this.elementRef.nativeElement.addEventListener('slide.bs.carousel', e => this.__event_slid_handler(e));
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

  ngDoCheck(): void {
    if (!this.id) {
      this.id = `carousel${this.idService.id}`;
    }
  }

  ngAfterViewInit(): void {
    if (this.items && this.items.length) {
      const firstItem = this.items.get(0);
      if (firstItem) {
        firstItem.classActive = true;
        firstItem.active = true;
      }
    }
  }

  private __event_slid_handler(e: unknown): void {
    this.items.forEach((item, index) => {
      item.active = index === (e as Carousel.Event).to;
    });
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

  adaptRide(o?: 'auto' | 'manual' | 'none') {
    if (o === 'auto') return 'carousel';
    if (o === 'manual') return true;
    if (o === 'none') return false;
    return undefined;
  }
}
