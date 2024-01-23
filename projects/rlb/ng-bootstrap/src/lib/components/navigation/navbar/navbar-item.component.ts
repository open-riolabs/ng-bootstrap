import {
  Component,
  Input,
  booleanAttribute,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'rlb-navbar-item',
  template: ` <ng-template #template>
    <li class="nav-item" [class.dropdown]="dropdown">
      <a
        [class]="'nav-link ' + classList||''"
        [class.dropdown-toggle]="dropdown"
        [attr.role]="(dropdown || toggle) ? 'button' : undefined"
        [attr.data-bs-toggle]="dropdown ? 'dropdown' : undefined"
        [attr.aria-expanded]="(dropdown || toggle) ? 'false' : undefined"
        [attr.data-bs-auto-close]="_autoClose"
        [href]="(dropdown || toggle) ? '#' : href"
        (click)="click.emit($event)"
      >
        <ng-content select=":not(rlb-dropdown-container)"></ng-content>
      </a>
      <ng-content select="rlb-dropdown-container"></ng-content>
    </li>
  </ng-template>`,
})
export class NavbarItemComponent implements OnInit {
  @Input({ transform: booleanAttribute, alias: 'disabled' })
  disabled?: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'dropdown' })
  dropdown?: boolean = false;
  @Input({ alias: 'href' }) href?: string;
  @Input('class') classList!: string;
  @Input('toggle') toggle?: | 'offcanvas' | 'collapse' | 'tab' | 'pill' | 'buttons-group';
  @Input() autoClose!: 'default' | 'inside' | 'outside' | 'manual';
  @Output() click = new EventEmitter<MouseEvent>();

  get _autoClose() {
    switch (this.autoClose) {
      case 'default':
        return 'true';
      case 'inside':
        return 'inside';
      case 'outside':
        return 'outside';
      case 'manual':
        return 'false';
    }
  }

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
