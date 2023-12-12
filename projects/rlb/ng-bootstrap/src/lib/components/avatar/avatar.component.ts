import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'rlb-avatar',
  template: `
    <ng-template #template>
      <img *ngIf="src" [src]="src" alt="Avatar"
       [style.vertical-align]="'middle'"
       [style.width.px]="size"
       [style.width.px]="size" 
       [style.height.px]="size"
       [style.border]="'2px solid #cbcbcb'"
       [style.border-radius]="_borderRadius" />
    </ng-template>
  `,
})

export class AvatarComponent {

  @Input() size?: number = 50;
  @Input() style?: "circle" | "round" | "square" = "circle";
  @Input() src?: string;

  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  constructor(private viewContainerRef: ViewContainerRef) { }

  get _borderRadius() {
    switch (this.style) {
      case "circle": return "50%";
      case "round": return "5px";
      case "square": return "0px";
      default: return "50%";
    }
  }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.viewContainerRef.element.nativeElement.remove()
  }
}
