import {
  AfterViewInit,
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  effect,
  ElementRef,
  input,
  model,
  numberAttribute,
  OnDestroy,
  output,
} from '@angular/core';
import { Carousel } from 'bootstrap';
import { UniqueIdService } from '../../shared/unique-id.service';
import { CarouselSlideComponent } from './carousel-slide.component';

@Component({
  selector: 'rlb-carousel',
  template: `
      @if (!hideIndicators()) {
        <div class="carousel-indicators">
          @for (item of items(); track item; let i = $index) {
            <button
              type="button"
              [class.active]="item.active()"
              [attr.data-bs-target]="'#' + id()"
              [attr.data-bs-slide-to]="i"
              [attr.aria-label]="'Slide ' + (i + 1)"
            ></button>
          }
        </div>
      }
      <div class="carousel-inner">
        <ng-content select="rlb-carousel-slide" />
      </div>
      @if (!hideControls()) {
        <button
          class="carousel-control-prev"
          type="button"
          [attr.data-bs-target]="'#' + id()"
          data-bs-slide="prev"
          >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
      }
      @if (!hideControls()) {
        <button
          class="carousel-control-next"
          type="button"
          [attr.data-bs-target]="'#' + id()"
          data-bs-slide="next"
          >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      }
      `,
  host: {
    class: 'carousel slide',
    '[class.carousel-fade]': 'crossFade()',
    '[id]': 'id()',
    '[attr.data-bs-ride]': 'autoplay() === "auto" ? "carousel" : autoplay() === "manual" ? "true": undefined',
    '[attr.data-bs-touch]': 'noTouch() ? undefined : true',
    '[attr.data-bs-interval]': 'interval()',
    '[attr.data-bs-keyboard]': '!keyboard() ? "false" : undefined',
    '[attr.data-bs-wrap]': '!wrap() ? "false" : undefined',
    '[attr.data-bs-pause]': 'pauseProp() === false ? "false" : undefined',
  },
  standalone: false
})
export class CarouselComponent implements OnDestroy, AfterViewInit {
  items = contentChildren(CarouselSlideComponent);

  _id = input<string | undefined>(undefined, { alias: 'id' });
  id = computed(() => this._id() || `carousel${this.idService.id}`);

  hideIndicators = input(false, { alias: 'hide-indicators', transform: booleanAttribute });
  hideControls = input(false, { alias: 'hide-controls', transform: booleanAttribute });
  crossFade = input(false, { alias: 'cross-fade', transform: booleanAttribute });
  autoplay = input<'auto' | 'manual' | 'none'>('auto');
  interval = input(500, { transform: numberAttribute });
  pauseProp = input<false | 'hover' | undefined>('hover', { alias: 'pause' });
  wrap = input(true, { transform: booleanAttribute });
  noTouch = input(false, { alias: 'no-touch', transform: booleanAttribute });
  keyboard = input(true, { transform: booleanAttribute });

  slid = output<Carousel.Event>();
  slide = output<Carousel.Event>();
  currentSlide = model(0, { alias: 'current-slide' });
  slideCountChange = output<number>({ alias: 'slide-count' });

  private carousel!: Carousel;

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private idService: UniqueIdService,
  ) {
    effect(() => {
      const index = this.currentSlide();
      this.carousel?.to(index);
    });

    effect(() => {
      this.slideCountChange.emit(this.items().length);
    });
  }

  ngOnDestroy(): void {
    if (this.carousel) {
      this.carousel.dispose();
      this.elementRef.nativeElement.removeEventListener(
        'slid.bs.carousel',
        this.__event_slid_handler,
      );
      this.elementRef.nativeElement.removeEventListener(
        'slide.bs.carousel',
        this.__event_slide_handler,
      );
    }
  }

  ngAfterViewInit(): void {
    this.carousel = Carousel.getOrCreateInstance(
      this.elementRef.nativeElement,
      {
        interval: this.interval(),
        keyboard: this.keyboard(),
        ride: this.adaptRide(this.autoplay()),
        touch: this.noTouch() ? false : true,
        wrap: this.wrap(),
        pause: this.pauseProp() as any,
      },
    );
    this.carousel.to(this.currentSlide());
    this.elementRef.nativeElement.addEventListener('slid.bs.carousel', e => this.__event_slid_handler(e));
    this.elementRef.nativeElement.addEventListener('slide.bs.carousel', e => this.__event_slide_handler(e));
  }

  private __event_slid_handler = (e: any): void => {
    this.currentSlide.set(e.to as number);
    this.slid.emit(e as Carousel.Event);
  };

  private __event_slide_handler = (e: unknown): void => {
    this.slide.emit(e as Carousel.Event);
  };

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

  get slideCount(): number {
    return this.items().length;
  }

  adaptRide(o?: 'auto' | 'manual' | 'none') {
    if (o === 'auto') return 'carousel';
    if (o === 'manual') return true;
    if (o === 'none') return false;
    return undefined;
  }
}
