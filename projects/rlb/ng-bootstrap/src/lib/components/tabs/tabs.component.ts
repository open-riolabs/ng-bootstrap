import {
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
  input,
} from '@angular/core';

@Component({
  selector: 'rlb-tabs',
  template: ` <ng-template #template>
    <ul
      role="tablist"
      [attr.id]="id() ? id() : undefined"
      [class]="'nav ' + cssClass()"
      [class.justify-content-center]="horizontalAlignment() === 'center'"
      [class.justify-content-end]="horizontalAlignment() === 'end'"
      [class.flex-column]="vertical()"
      [class.nav-pills]="view() === 'pills'"
      [class.nav-underline]="view() === 'underline'"
      [class.nav-tabs]="view() === 'tab'"
      [class.nav-fill]="fill() === 'fill'"
      [class.nav-justified]="fill() === 'justified'"
    >
      <ng-content select="rlb-tab" />
    </ul>
  </ng-template>`,
  standalone: false
})
export class TabsComponent {
  element!: HTMLElement;

  horizontalAlignment = input<'center' | 'end' | undefined>(undefined, { alias: 'horizontal-alignment' });
  view = input<'tab' | 'pills' | 'underline' | 'none'>('tab', { alias: 'view' });
  vertical = input(false, { alias: 'vertical', transform: booleanAttribute });
  fill = input<'fill' | 'justified' | undefined>(undefined, { alias: 'fill' });
  id = input<string | undefined>(undefined, { alias: 'id' });
  cssClass = input('', { alias: 'class' });

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef<HTMLElement>,
  ) {
    elementRef.nativeElement.remove();
  }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
