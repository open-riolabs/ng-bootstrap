import {
  booleanAttribute,
  Component,
  computed,
  input,
  OnInit,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { Color } from '../../shared/types';

@Component({
  selector: 'span[rlb-badge], img[rlb-badge]',
  template: `
  <ng-template #template>
    <span [class]="style()">
      <ng-content></ng-content>
      @if (hiddenText()) {
        <span class="visually-hidden">{{ hiddenText() }}</span>
      }
    </span>
  </ng-template>`,
  standalone: false
})
export class BadgeComponent implements OnInit {
  element!: HTMLElement;

  pill = input(false, { alias: 'pill', transform: booleanAttribute });
  color = input<Color | undefined>('primary', { alias: 'color' });
  hiddenText = input<string | undefined>(undefined, { alias: 'hidden-text' });
  border = input(false, { alias: 'border', transform: booleanAttribute });
  cssClass = input<string | undefined>('', { alias: 'class' });

  template = viewChild.required<TemplateRef<any>>('template');

  style = computed(() => {
    let style = 'badge';
    if (this.pill()) {
      style += ` rounded-pill`;
    }
    if (this.color()) {
      style += ` bg-${this.color()}`;
    }
    if (this.border()) {
      style += ` border`;
    }
    return style += (this.cssClass() ? ` ${this.cssClass()}` : '');
  });

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template(),
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
