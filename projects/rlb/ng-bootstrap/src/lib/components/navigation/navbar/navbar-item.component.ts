import { Component, ElementRef, Input, Renderer2, AfterViewInit, booleanAttribute, ViewChild, TemplateRef, ViewContainerRef, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'rlb-navbar-item',
  template: `
    <ng-template #template>
      <li class="nav-item" [class.dropdown]="dropdown">
        <a [class]="'nav-link '+ classList" 
          [class.dropdown-toggle]="dropdown" 
          [attr.role]="dropdown ? 'button' : undefined"
          [attr.data-bs-toggle]="dropdown ? 'dropdown' : undefined"
          [attr.aria-expanded]="dropdown ? 'false' : undefined"
          [href]="dropdown?'#':href"
          (click)="click.emit($event)">
          <ng-content></ng-content>
        </a>
      </li>
    </ng-template>`
})
export class NavbarItemComponent implements OnInit {

  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled?: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'dropdown' }) dropdown?: boolean = false;
  @Input({ alias: 'href' }) href?: string;
  @Input('class') classList!: string;
  @Output() click = new EventEmitter<MouseEvent>();

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template);
    this.element = (templateView.rootNodes[0]);
    this.viewContainerRef.element.nativeElement.remove();
  }
}
