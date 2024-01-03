import { Component, AfterViewInit, ElementRef, Renderer2 } from "@angular/core";

@Component({
  selector: 'rlb-navbar-separator',
  template: `
    <ng-template #template>
        <li class="nav-item separator">
          
        </li>
      </ng-template>`,
})
export class NavbarSeparatorComponent implements AfterViewInit {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    const cont = this.elementRef.nativeElement.parentNode;
    const li = this.renderer.createElement('li');
    this.renderer.addClass(li, 'nav-item');
    this.renderer.addClass(li, 'separator');
    this.renderer.appendChild(li, this.elementRef.nativeElement);
    this.renderer.appendChild(cont, li);
  }
}