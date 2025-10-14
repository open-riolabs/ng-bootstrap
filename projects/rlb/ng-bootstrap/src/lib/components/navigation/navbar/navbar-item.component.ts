import {
	booleanAttribute,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
} from '@angular/core';

@Component({
	selector: 'rlb-navbar-item',
    template: ` <ng-template #template>
			<li class="nav-item">
      <a
        class="nav-link {{ cssClass }}"
				[routerLink]="routerLink"
				routerLinkActive='active'
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

  @Input({ alias: 'disabled', transform: booleanAttribute }) disabled?: boolean;
	@Input({ alias: 'router-link' }) routerLink?: string;
  @Input({ alias: 'class' }) cssClass?: string;


  @Output() click = new EventEmitter<MouseEvent>();
	
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
