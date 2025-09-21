import {
	Component,
	ElementRef,
	Input,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
	booleanAttribute, OnInit,
} from '@angular/core';

@Component({
    selector: 'rlb-nav',
    template: ` <ng-template #template>
    <ul
      [attr.id]="id ? id : undefined"
      class="nav nav-underline {{ cssClass }}"
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
    standalone: false
})
export class NavComponent implements OnInit {
  element!: HTMLElement;

  @Input({ alias: 'horizontal-alignment' }) horizontalAlignment?: 'center' | 'end';
  @Input({ alias: 'vertical', transform: booleanAttribute }) vertical?: boolean;
  @Input({ alias: 'fill', transform: booleanAttribute }) fill?: boolean;
  @Input({ alias: 'pills', transform: booleanAttribute }) pills?: boolean;
  @Input({ alias: 'id' }) id!: string;
  @Input({ alias: 'class' }) cssClass?: string = '';

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
