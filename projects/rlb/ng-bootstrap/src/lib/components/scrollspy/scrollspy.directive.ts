import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  input,
  OnDestroy,
  output,
} from '@angular/core';
import { ScrollSpy } from 'bootstrap';

@Directive({
  selector: '[rlb-scrollspy]',
  host: {
    '[attr.data-bs-spy]': "'scroll'",
    '[attr.data-bs-target]': 'target()',
    '[attr.tabindex]': '0',
    '[attr.data-bs-root-margin]': 'rootMargin()',
    '[attr.data-bs-smooth-scroll]': 'smooth()',
    '[style.height]': 'height()',
    '[style.overflow-y]': "'auto'"
  },
  standalone: false
})
export class ScrollspyDirective implements AfterViewInit, OnDestroy {
  target = input.required<string>({ alias: 'rlb-scrollspy-target' });
  smooth = input(true, { alias: 'scroll-smooth', transform: booleanAttribute });
  rootMargin = input('', { alias: 'scroll-root-margin' });
  height = input('200px', { alias: 'height' });
  threshold = input<Array<number>>([], { alias: 'scroll-threshold' });
  scroll = output<Event>({ alias: 'scroll-change' });

  private scrollSpy!: ScrollSpy;

  constructor(private elementRef: ElementRef<HTMLElement>) {
    effect(() => {
      // Accessing signals to track changes
      this.target();
      this.rootMargin();
      this.threshold();

      // Refresh ScrollSpy if it exists
      this.scrollSpy?.refresh();
    });
  }

  ngAfterViewInit() {
    this.scrollSpy = ScrollSpy.getOrCreateInstance(
      this.elementRef.nativeElement,
      {
        target: this.target(),
        rootMargin: this.rootMargin(),
        threshold: this.threshold(),
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

  private __scroll_handler = (event: Event) => {
    this.scroll.emit(event);
  };
}
