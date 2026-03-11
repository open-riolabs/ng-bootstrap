import {
  booleanAttribute,
  Component,
  input,
  OnInit,
  output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'rlb-navbar-item',
  template: ` <ng-template #template>
    <li class="nav-item">
      <a
        class="nav-link {{ cssClass() }}"
        [routerLink]="routerLink()"
        routerLinkActive="active"
        (click)="click.emit($event)"
      >
        <ng-content select=":not(rlb-dropdown-container)"></ng-content>
      </a>
    </li>
  </ng-template>`,
  standalone: false
})
export class NavbarItemComponent implements OnInit {
  element!: HTMLElement;

  disabled = input(false, { alias: 'disabled', transform: booleanAttribute });
  routerLink = input<string | undefined>(undefined, { alias: 'router-link' });
  cssClass = input('', { alias: 'class' });

  click = output<MouseEvent>();

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  constructor(private viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
