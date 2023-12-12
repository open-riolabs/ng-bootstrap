import { Component, ElementRef, Input, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";

@Component({
  selector: 'rlb-nav',
  template: `
  <ng-template #template>
    <ul 
      [attr.id]="id?id:undefined" 
      [class]="'nav w-100 ' + class"
      [class.justify-content-center]="horizontalAlignment === 'center'"
      [class.justify-content-end]="horizontalAlignment === 'end'"
      [class.flex-column]="vertical"
      [class.nav-pills]="view === 'pills'"
      [class.nav-underline]="view === 'underline'"
      [class.nav-tabs]="view === 'tab'"
      [class.nav-fill]="fill === 'fill'"
      [class.nav-justified]="fill === 'justified'">
      <ng-content select="rlb-nav-item" />
    </ul>
  </ng-template>`,
  host: {
    '[attr.class]': 'undefined',
    '[attr.id]': 'undefined'
  },
})
export class NavComponent {
  @Input() horizontalAlignment?: 'center' | 'end'
  @Input() vertical?: boolean = false;
  @Input() view?: 'tab' | 'pills' | 'underline' | 'none';
  @Input() fill?: 'fill' | 'justified'
  @Input() id!: string;
  @Input() class?: string;

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  constructor(private viewContainerRef: ViewContainerRef, private elementRef: ElementRef<HTMLElement>) {
    elementRef.nativeElement.remove();
  }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.viewContainerRef.element.nativeElement.remove()
  }
}