import {
  Component,
  computed,
  input,
  numberAttribute,
  OnInit,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'rlb-avatar',
  template: `
    <ng-template #template>
      @if (src()) {
        <img
          [src]="src()!"
          alt="Avatar"
          [class]="cssClass()"
          [style.vertical-align]="'middle'"
          [style.width.px]="size()"
          [style.height.px]="size()"
          [style.border]="'2px solid #cbcbcb'"
          [style.border-radius]="_borderRadius()"
          />
      }
    </ng-template>
    `,
  standalone: false
})
export class AvatarComponent implements OnInit {
  element!: HTMLElement;

  size = input<number, unknown>(50, { alias: 'size', transform: numberAttribute });
  shape = input<'circle' | 'round' | 'square'>('circle', { alias: 'shape' });
  src = input<string | undefined>(undefined, { alias: 'src' });
  cssClass = input<string | undefined>('', { alias: 'class' });

  template = viewChild.required<TemplateRef<any>>('template');

  constructor(private viewContainerRef: ViewContainerRef) { }

  _borderRadius = computed(() => {
    switch (this.shape()) {
      case 'circle':
        return '50%';
      case 'round':
        return '5px';
      case 'square':
        return '0px';
      default:
        return '50%';
    }
  });

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template(),
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
