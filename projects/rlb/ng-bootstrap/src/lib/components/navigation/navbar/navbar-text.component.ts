import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'rlb-navbar-text',
  template: `
    <ng-template #template>
      <span class="navbar-text {{ cssClass() }}">
        <ng-content />
      </span>
    </ng-template>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarTextComponent implements OnInit {
  element!: HTMLElement;

  cssClass = input('', { alias: 'class' });

  template = viewChild.required<TemplateRef<any>>('template');

  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    const templateView = this.viewContainerRef.createEmbeddedView(this.template());
    this.element = templateView.rootNodes[0];
    this.viewContainerRef.element.nativeElement.remove();
  }
}
