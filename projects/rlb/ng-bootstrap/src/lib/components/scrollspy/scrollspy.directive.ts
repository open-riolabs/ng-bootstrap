import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  booleanAttribute,
} from '@angular/core';
import { ScrollSpy } from 'bootstrap';

@Directive({
  selector: '[rlb-scrollspy]',
  host: {
    'attr.data-bs-spy': 'scroll',
    '[attr.data-bs-target]': 'target',
    'attr.tabindex': '0',
    '[attr.data-bs-root-margin]': 'rootMargin',
    '[attr.data-bs-smooth-scroll]': 'smooth',
  },
})
export class ScrollspyDirective implements AfterViewInit, OnDestroy, OnChanges {
  @Input({ alias: 'rlb-scrollspy', required: true }) target!: string;
  @Input({ transform: booleanAttribute, alias: 'scroll-smooth' })
  smooth!: boolean;
  @Input({ alias: 'scroll-root-margin' }) rootMargin!: string;
  @Input({ alias: 'scroll-threshold' }) threshold!: Array<number>;
  @Output('scroll-change') scroll: EventEmitter<void> =
    new EventEmitter<void>();

  private scrollSpy!: ScrollSpy;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    this.scrollSpy = ScrollSpy.getOrCreateInstance(
      this.elementRef.nativeElement,
      {
        target: this.target,
        rootMargin: this.rootMargin,
        threshold: this.threshold,
      },
    );
    this.elementRef.nativeElement.addEventListener(
      'activate.bs.scrollspy',
      this.__scroll_handler,
    );
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.removeEventListener(
      'activate.bs.scrollspy',
      this.__scroll_handler,
    );
    this.scrollSpy?.dispose();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.scrollSpy?.refresh();
  }

  private __scroll_handler(event: Event) {
    this.scroll.emit();
  }
}
