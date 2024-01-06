import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ElementRef,
  booleanAttribute,
} from '@angular/core';

@Component({
  selector: 'rlb-tabs',
  template: ` <ng-template #template>
    <ul
      role="tablist"
      [attr.id]="id ? id : undefined"
      [class]="'nav ' + class"
      [class.justify-content-center]="horizontalAlignment === 'center'"
      [class.justify-content-end]="horizontalAlignment === 'end'"
      [class.flex-column]="vertical"
      [class.nav-pills]="view === 'pills'"
      [class.nav-underline]="view === 'underline'"
      [class.nav-tabs]="view === 'tab'"
      [class.nav-fill]="fill === 'fill'"
      [class.nav-justified]="fill === 'justified'"
    >
      <ng-content select="rlb-tab" />
    </ul>
  </ng-template>`,
})
export class TabsComponent {
  @Input('horizontal-alignment') horizontalAlignment?: 'center' | 'end';
  @Input() view?: 'tab' | 'pills' | 'underline' | 'none' = 'tab';
  @Input({ transform: booleanAttribute, alias: 'vertical' })
  vertical?: boolean = false;
  @Input() fill?: 'fill' | 'justified';
  @Input() id?: string;
  @Input() class?: string;

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;

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
