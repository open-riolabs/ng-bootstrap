import { Component, Input, ViewContainerRef, OnInit, ViewChild, TemplateRef, booleanAttribute } from '@angular/core'

@Component({
  selector: 'rlb-nav-item',
  template: `
  <ng-template #template>
    <li class="nav-item">
      <a 
        class="nav-link" 
        [class.active]="active" 
        [attr.href]="href||'#'"
        [class.disabled]
        [attr.aria-disabled]="disabled?'true':undefined">
        <ng-content />
      </a>
    </li>
  </ng-template>`
})
export class NavItemComponent implements OnInit {

  @Input() href?: string | any[] | null | undefined = '#';
  @Input({ alias: 'active', transform: booleanAttribute }) active?: boolean = false;
  @Input({ alias: 'disabled', transform: booleanAttribute }) disabled?: boolean = false;

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;


  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template);
    this.element = (templateView.rootNodes[0]);
    this.viewContainerRef.element.nativeElement.remove();
  }
}