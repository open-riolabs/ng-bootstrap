import {
  Component,
  Renderer2,
  Input,
  ViewChild,
  ViewContainerRef,
  TemplateRef,
  booleanAttribute,
} from '@angular/core';
import { Color } from '../../shared/types';

@Component({
  selector: 'span[rlb-badge], img[rlb-badge]',
  template: `
  <ng-template #template>
    <span [class]="style">
      <ng-content></ng-content>
      <span *ngIf="hiddenText" class="visually-hidden">{{ hiddenText }}</span>
    </span>
  </ng-template>`,
  standalone: false
})
export class BadgeComponent {
  element!: HTMLElement;

  @Input({ alias: 'pill', transform: booleanAttribute }) pill!: | boolean;
  @Input({ alias: 'color' }) color?: Color = 'primary';
  @Input({ alias: 'hidden-text' }) hiddenText?: string;
  @Input({ alias: 'border', transform: booleanAttribute }) border?: boolean;
  @Input({ alias: 'class' }) cssClass?: string = '';
  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) { }

  get style() {
    let style = 'badge';
    if (this.pill) {
      style += ` rounded-pill`;
    }
    if (this.color) {
      style += ` bg-${this.color}`;
    }
    if (this.border) {
      style += ` border`;
    }
    return style += (this.cssClass ? ` ${this.cssClass}` : '');
  }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
