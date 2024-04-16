import {
  Component,
  Input,
  ViewContainerRef,
  OnInit,
  ViewChild,
  TemplateRef,
  booleanAttribute,
} from '@angular/core';

@Component({
  selector: 'rlb-nav-item',
  template: ` <ng-template #template>
    <li class="nav-item {{ cssClass }}">
      <a
        class="nav-link"
        [class.active]="active"
        [attr.href]="href || '#'"
        [class.disabled]
        [attr.aria-disabled]="disabled ? 'true' : undefined"
      >
        <ng-content />
      </a>
    </li>
  </ng-template>`,
})
export class NavItemComponent implements OnInit {
  element!: HTMLElement;

  @Input({ alias: 'href' }) href?: string | any[] | null | undefined = '#';
  @Input({ alias: 'active', transform: booleanAttribute }) active?: boolean;
  @Input({ alias: 'disabled', transform: booleanAttribute }) disabled?: boolean;
  @Input({ alias: 'class' }) cssClass?: string = '';

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
