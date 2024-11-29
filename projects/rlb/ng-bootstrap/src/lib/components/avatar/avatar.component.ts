import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  numberAttribute,
} from '@angular/core';

@Component({
    selector: 'rlb-avatar',
    template: `
    <ng-template #template>
      <img
        *ngIf="src"
        [src]="src"
        alt="Avatar"
        [class]="cssClass"
        [style.vertical-align]="'middle'"
        [style.width.px]="size"
        [style.width.px]="size"
        [style.height.px]="size"
        [style.border]="'2px solid #cbcbcb'"
        [style.border-radius]="_borderRadius"
      />
    </ng-template>
  `,
    standalone: false
})
export class AvatarComponent {
  element!: HTMLElement;

  @Input({ alias: 'size', transform: numberAttribute }) size?: number = 50;
  @Input({ alias: 'shape' }) shape?: 'circle' | 'round' | 'square' = 'circle';
  @Input({ alias: 'src' }) src?: string;
  @Input({ alias: 'class' }) cssClass?: string = '';

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) { }

  get _borderRadius() {
    switch (this.shape) {
      case 'circle':
        return '50%';
      case 'round':
        return '5px';
      case 'square':
        return '0px';
      default:
        return '50%';
    }
  }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
