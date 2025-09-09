import { booleanAttribute, Component, Input, TemplateRef, ViewChild, ViewContainerRef, } from '@angular/core';
import { Color } from '../../../shared/types';
import { UniqueIdService } from '../../../shared/unique-id.service';

@Component({
    selector: 'rlb-navbar',
    template: ` <ng-template #template>
    <nav
      class="navbar px-2 bg-{{ color }} {{ placement }} {{ _navExpand }} {{ cssClass }}"
      [attr.data-bs-theme]="dark"
    >
      <div class="container-fluid">
        <ng-content
          select="[rlb-navbar-brand], [rlb-button][toggle], rlb-navbar-separator"
        />
				<button
					class="navbar-toggler"
					[class.d-none]="!enableSidebarToggler"
					type="button"
					rlb-button
					toggle="sidebar"
					[toggle-target]="'sidebar'"
					aria-label="Toggle sidebar"
				>
					<span class="navbar-toggler-icon"></span>
				</button>
        <button
					class="navbar-toggler"
					[class.d-none]="!enableDropdownToggler"
          type="button"
          rlb-button
          toggle="collapse"
          [toggle-target]="navId"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" [id]="navId">
					<div class="p-3 d-flex w-100 flex-column flex-lg-row">
						<ng-content
							select="rlb-navbar-items, rlb-navbar-form, rlb-navbar-text, rlb-navbar-separator"
						/>
					</div>
        </div>
      </div>
    </nav>
  </ng-template>`,
    standalone: false
})
export class NavbarComponent {
  element!: HTMLElement;
  private _navId: string;

  public get navId(): string {
    return this._navId;
  }
  get _navExpand(): string | undefined {
    if (!this.expand) return undefined;
    else if (this.expand === 'always') return 'navbar-expand';
    else return `navbar-expand-${this.expand}`;
  }

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;

  @Input({ alias: 'dark', transform: booleanAttribute }) dark?: boolean;
  @Input({ alias: 'color' }) color?: Color;
  @Input({ alias: 'placement' }) placement?: 'fixed-top' | 'fixed-bottom' | 'sticky-top' | 'sticky-bottom';
  @Input({ alias: 'expand' }) expand?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'always';
  @Input({ alias: 'class' }) cssClass?: string = '';
  @Input({ alias: 'enable-dropdown-toggler', transform: booleanAttribute }) enableDropdownToggler: boolean = false;
  @Input({ alias: 'enable-sidebar-toggler', transform: booleanAttribute }) enableSidebarToggler: boolean = true;

  constructor(
    private idService: UniqueIdService,
    private viewContainerRef: ViewContainerRef,
  ) {
    this._navId = `nav${this.idService.id}`;
  }

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
