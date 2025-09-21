import {
  booleanAttribute,
  Component,
  ContentChild,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewContainerRef
} from '@angular/core';
import { AccordionHeaderComponent } from './accordion-header.component';
import { AccordionBodyComponent } from './accordion-body.component';
import { UniqueIdService } from '../../shared/unique-id.service';
import { ToggleAbstractComponent } from '../abstract/toggle-abstract.component';
import { Collapse } from 'bootstrap';
import { VisibilityEvent } from '../../shared/types';

@Component({
    selector: 'div[rlb-accordion-item]',
    template: `
    <ng-content select="rlb-accordion-header"></ng-content>
    <ng-content select="[rlb-accordion-body]"></ng-content>
  `,
    host: { class: 'accordion-item' },
    standalone: false
})
export class AccordionItemComponent
  extends ToggleAbstractComponent<Collapse>
  implements DoCheck, OnInit {

  element!: HTMLElement;
  public parentId!: string;
  public alwaysOpen?: boolean = false;

  @Input({ alias: 'name' }) public name?: string;
  @Input({ transform: booleanAttribute, alias: 'expanded' }) expanded: boolean = false;
  @Input({ alias: 'class' }) cssClass?: string = '';
  @Input({ alias: 'style' }) style?: string;
  @Input({ alias: 'status' }) override status: VisibilityEvent = 'hidden';

  @Output('statusChange') override statusChange = new EventEmitter<VisibilityEvent>();


  @ContentChild(AccordionHeaderComponent) public header!: AccordionHeaderComponent;
  @ContentChild(AccordionBodyComponent) public body!: AccordionBodyComponent;

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private viewContainerRef: ViewContainerRef,
    private idService: UniqueIdService
  ) {
    super(elementRef);
  }

  override ngOnInit(): void {
    const element = this.elementRef?.nativeElement.querySelector('.accordion-collapse') as HTMLElement
    super.ngOnInit(element);
    
    if (this.expanded) {
      this.open();
    }
  }

  ngDoCheck(): void {
    if (this.parentId) {
      if (!this.name) {
        this.name = `${this.parentId}-item${this.idService.id}`;
      }
      
      const isOpen = this.status === 'show' || this.status === 'shown';

      if (this.header) {
        this.header.parentId = this.parentId;
        this.header.itemId = this.name;
        this.header.expanded = isOpen;
      }

      if (this.body) {
        this.body.parentId = this.parentId;
        this.body.itemId = this.name;
        this.body.expanded = isOpen;
      }
    }
  }
  
  override getOrCreateInstance(element: HTMLElement): Collapse {
    return Collapse.getOrCreateInstance(element, { toggle: false });
  }

  override get eventPrefix(): string {
    return 'bs.collapse';
  }
}
