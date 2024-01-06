import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { HeaderLogo, HeaderUser, SidebarMode } from './sidebar-mode';

@Component({
  selector: 'rlb-sidebar-header',
  template: `
    <ng-template #template>
      <ng-container *ngIf="mode === 'user'"> user </ng-container>
      <ng-container *ngIf="mode === 'logo'">
        <a href="#" class="logo">
          <img [src]="_dataLogo?.image" [alt]="_dataLogo?.alt" />
          <span class="name">{{ _dataLogo?.text }}</span>
        </a>
      </ng-container>
      <ng-container *ngIf="mode === 'custom'">
        <ng-content></ng-content>
      </ng-container>
    </ng-template>
  `,
})
export class SidebarHeaderComponent implements OnInit {
  @Input('mode') mode!: SidebarMode;
  @Input('data') data!: HeaderLogo | HeaderUser;
  open: boolean = false;
  sidebarId: string = '';

  constructor(private viewContainerRef: ViewContainerRef) {}

  get _dataLogo(): HeaderLogo | null {
    if (this.mode === 'logo') {
      return this.data as HeaderLogo;
    }
    return null;
  }

  get _dataUser(): HeaderUser | null {
    if (this.mode === 'user') {
      return this.data as HeaderUser;
    }
    return null;
  }

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  element!: HTMLElement;

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(
      this.template,
    );
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
