import {
  Component,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  booleanAttribute,
} from '@angular/core';

@Component({
  selector: 'rlb-nav',
  template: ` <ng-template #template>
    <ul
      [attr.id]="id ? id : undefined"
      [class]="'nav nav-underline {{classList}}'"
      [class.justify-content-center]="horizontalAlignment === 'center'"
      [class.justify-content-end]="horizontalAlignment === 'end'"
      [class.flex-column]="vertical"
      [class.nav-pills]="pills"
      [class.nav-fill]="fill"
    >
      <ng-content select="rlb-nav-item" />
    </ul>
  </ng-template>`,
  host: {
    '[attr.class]': 'undefined',
    '[attr.id]': 'undefined',
  },
})
export class NavComponent {
  @Input() horizontalAlignment?: 'center' | 'end';
  @Input({ transform: booleanAttribute, alias: 'vertical' })
  vertical?: boolean = false;
  @Input({ alias: 'fill', transform: booleanAttribute }) fill?: boolean = false;
  @Input({ alias: 'pills', transform: booleanAttribute }) pills?: boolean =
    false;
  @Input() id!: string;
  @Input('class') classList?: string;

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
