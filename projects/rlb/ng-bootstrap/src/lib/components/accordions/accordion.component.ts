import {
  AfterContentInit,
  booleanAttribute,
  Component,
  ContentChildren,
  DoCheck,
  Input,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AccordionItemComponent } from './accordion-item.component';
import { Subscription } from "rxjs";

@Component({
    selector: 'rlb-accordion',
    template: `<ng-content select="[rlb-accordion-item]"></ng-content>`,
    host: {
        class: 'accordion',
        '[class.accordion-flush]': 'flush',
        '[id]': 'id',
    },
    standalone: false
})
export class AccordionComponent implements DoCheck, AfterContentInit, OnDestroy {
  @Input({ alias: 'flush', transform: booleanAttribute }) flush?: boolean = false;
  @Input({ alias: 'always-open', transform: booleanAttribute }) alwaysOpen?: boolean = false;
  @Input({ alias: 'id' }) id!: string;
  
  private subs: Subscription[] = [];

  @ContentChildren(AccordionItemComponent) public items!: QueryList<AccordionItemComponent>;
  constructor(private idService: UniqueIdService) { }

  ngDoCheck(): void {
    if (!this.id) {
      this.id = `accordion${this.idService.id}`;
    }

    if (this.items) {
      this.items.forEach((item) => {
        item.parentId = this.id;
        item.alwaysOpen = this.alwaysOpen;
      });
    }
  }
  
  ngAfterContentInit(): void {
    this.attachItemHandlers();
    this.enforceInitialState();
    this.items.changes.subscribe(() => {
      this.attachItemHandlers();
      this.enforceInitialState();
    });
  }
  
  ngOnDestroy(): void {
    this.cleanup();
  }
  
  private attachItemHandlers(): void {
    this.cleanup();
    
    this.items?.forEach((item) => {
      item.parentId = this.id;
      item.alwaysOpen = this.alwaysOpen;
      
      const sub = item.statusChange.subscribe((ev) => {
        if (!this.alwaysOpen && (ev === 'show' || ev === 'shown')) {
          this.items.forEach((other) => {
            if (other !== item && (other.status === 'show' || other.status === 'shown')) {
              other.close();
            }
          });
        }
      });
      
      this.subs.push(sub);
    });
  }
  
  private enforceInitialState(): void {
    if (!this.items) return;
    
    if (this.alwaysOpen) {
      return;
    }
    
    const opened = this.items.filter(
      (i) => i.expanded || i.status === 'show' || i.status === 'shown'
    );
    
    if (opened.length > 1) {
      opened.slice(1).forEach((i) => i.close());
    }
  }
  
  private cleanup(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.subs = [];
  }
}
