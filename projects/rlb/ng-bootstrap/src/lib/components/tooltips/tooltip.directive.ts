import {
  booleanAttribute,
  Directive,
  effect,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Tooltip } from 'bootstrap';

@Directive({
  selector: '[tooltip]',
  standalone: false,
})
export class TooltipDirective implements OnInit, OnDestroy {
  private _tooltip: Tooltip | undefined;

  tooltip = input<string | null | undefined>(undefined, { alias: 'tooltip' });
  placement = input<'top' | 'bottom' | 'left' | 'right'>('top', { alias: 'tooltip-placement' });
  customClass = input('', { alias: 'tooltip-class' });
  html = input(false, { alias: 'tooltip-html', transform: booleanAttribute });

  constructor(private elementRef: ElementRef<HTMLElement>) {
    // We only need one effect to handle dynamic changes to the title text.
    effect(() => {
      const title = this.tooltip();

      if (this._tooltip) {
        if (title) {
          this._tooltip.enable();
          this._tooltip.setContent({ '.tooltip-inner': title });
        } else {
          this._tooltip.disable();
        }
      }
    });
  }

  ngOnInit() {
    this._tooltip = new Tooltip(this.elementRef.nativeElement, {
      title: this.tooltip() || '',
      placement: this.placement(),
      customClass: this.customClass(),
      html: this.html(),
    });
  }

  ngOnDestroy(): void {
    if (this._tooltip) {
      this._tooltip.dispose();
    }
  }
}
