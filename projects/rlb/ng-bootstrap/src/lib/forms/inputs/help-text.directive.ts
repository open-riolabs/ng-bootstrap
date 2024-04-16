import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  DoCheck,
} from '@angular/core';
import { UniqueIdService } from '../../shared/unique-id.service';

@Directive({
  selector: '[helpText]',
})
export class HelpText implements DoCheck {
  private uniqueId: string;

  @Input({ alias: 'helpText' }) helpText!: string;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private idService: UniqueIdService,
  ) {
    this.uniqueId = idService.id;
  }

  ngDoCheck() {
    if (this.helpText) {
      const input = this.elementRef.nativeElement.querySelector('input');
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
        this.renderer.createText(this.helpText),
      );
      this.renderer.insertBefore(input.parentNode, textHelp, input.nextSibling);
    }
  }
}
