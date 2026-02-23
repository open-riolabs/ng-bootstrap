import {
  Directive,
  ElementRef,
  Renderer2,
  effect,
  input,
} from '@angular/core';
import { UniqueIdService } from '../../shared/unique-id.service';

@Directive({
  selector: '[helpText]',
  standalone: false
})
export class HelpText {
  private uniqueId: string;

  helpText = input<string>('', { alias: 'helpText' });

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    idService: UniqueIdService,
  ) {
    this.uniqueId = idService.id;

    effect(() => {
      const text = this.helpText();
      if (text) {
        const input = this.elementRef.nativeElement.querySelector('input');
        if (!input) return;

        this.renderer.setAttribute(
          input,
          'aria-labelledby',
          'help-text-' + this.uniqueId,
        );
        const textHelp = this.renderer.createElement('div');
        this.renderer.addClass(textHelp, 'form-text');
        this.renderer.setAttribute(textHelp, 'id', 'help-text-' + this.uniqueId);
        this.renderer.appendChild(
          textHelp,
          this.renderer.createText(text),
        );
        this.renderer.insertBefore(input.parentNode, textHelp, input.nextSibling);
      }
    });
  }
}
