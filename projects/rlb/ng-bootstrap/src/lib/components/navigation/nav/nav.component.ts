import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'rlb-nav',
  template: ` <ng-template #template>
    <ul
      class="nav {{ cssClass() }}"
      [class.nav-tabs]="effectiveView() === 'tab' || effectiveView() === 'tabs'"
      [class.nav-pills]="effectiveView() === 'pills'"
      [class.nav-underline]="effectiveView() === 'underline'"
      [class.nav-fill]="effectiveFill() === 'fill'"
      [class.nav-justified]="effectiveFill() === 'justified'"
      [class.flex-column]="vertical()"
      [class.justify-content-center]="horizontalAlignment() === 'center'"
      [class.justify-content-end]="horizontalAlignment() === 'end'"
    >
      <ng-content select="rlb-nav-item" />
    </ul>
  </ng-template>`,
  standalone: false
})
export class NavComponent implements OnInit {
  element!: HTMLElement;

  horizontalAlignment = input<'center' | 'end' | undefined>(undefined, { alias: 'horizontal-alignment' });
  view = input<'tab' | 'tabs' | 'pills' | 'underline' | 'none'>('tab', { alias: 'view' });
  pills = input(false, { transform: booleanAttribute });
  tabs = input(false, { transform: booleanAttribute });
  underline = input(false, { transform: booleanAttribute });

  vertical = input(false, { alias: 'vertical', transform: booleanAttribute });

  fill = input<'fill' | 'justified' | boolean | undefined, any>(undefined, {
    alias: 'fill',
    transform: (v: any) => {
      if (v === 'fill' || v === 'justified') return v;
      return booleanAttribute(v);
    }
  });

  cssClass = input('', { alias: 'class' });

  effectiveView = computed(() => {
    if (this.pills()) return 'pills';
    if (this.tabs()) return 'tab';
    if (this.underline()) return 'underline';
    return this.view();
  });

  effectiveFill = computed(() => {
    const val = this.fill();
    if (val === 'fill' || val === 'justified') return val;
    return val === true ? 'fill' : undefined;
  });

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
