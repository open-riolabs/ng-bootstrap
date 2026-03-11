import {
  booleanAttribute,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  output,
  OutputRefSubscription,
  signal,
  ViewContainerRef,
} from '@angular/core';
import { Collapse } from 'bootstrap';
import { VisibilityEvent } from '../../shared/types';
import { UniqueIdService } from '../../shared/unique-id.service';
import { ToggleAbstractComponent } from '../abstract/toggle-abstract.component';
import { AccordionBodyComponent } from './accordion-body.component';
import { AccordionHeaderComponent } from './accordion-header.component';

@Component({
  selector: 'div[rlb-accordion-item]',
  template: `
    <ng-content select="rlb-accordion-header"></ng-content>
    <ng-content select="[rlb-accordion-body]"></ng-content>
  `,
  host: { class: 'accordion-item' },
  standalone: false,
})
export class AccordionItemComponent
  extends ToggleAbstractComponent<Collapse>
  implements OnInit, OnDestroy
{
  element!: HTMLElement;
  public parentId = signal<string | undefined>(undefined);
  public alwaysOpen = signal(false);

  name = input<string | undefined>(undefined, { alias: 'name' });
  expanded = input(false, { alias: 'expanded', transform: booleanAttribute });
  cssClass = input('', { alias: 'class' });
  style = input<string | undefined>(undefined, { alias: 'style' });

  public override status: VisibilityEvent = 'hidden';
  public override statusChange = output<VisibilityEvent>({ alias: 'statusChange' });

  header = contentChild(AccordionHeaderComponent);
  body = contentChild(AccordionBodyComponent);

  private _internalName = signal('');
  effectiveName = computed(() => {
    const pId = this.parentId();
    if (!pId) return '';
    return this.name() || `${pId}-${this._internalName()}`;
  });

  private statusSub?: OutputRefSubscription; // Store subscription

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private viewContainerRef: ViewContainerRef,
    private idService: UniqueIdService,
  ) {
    super(elementRef);
    this._internalName.set(`item${this.idService.id}`);

    effect(() => {
      const pId = this.parentId();
      const name = this.effectiveName();
      if (pId && name) {
        const isOpen = this.status === 'show' || this.status === 'shown';
        const header = this.header();
        const body = this.body();

        if (header) {
          header.parentId.set(pId);
          header.itemId.set(name);
          header.expanded.set(isOpen);
        }

        if (body) {
          body.parentId.set(pId);
          body.itemId.set(name);
          body.expanded.set(isOpen);
        }
      }
    });
  }

  override ngOnInit(): void {
    const element = this.elementRef?.nativeElement.querySelector(
      '.accordion-collapse',
    ) as HTMLElement;
    super.ngOnInit(element);

    if (this.expanded()) {
      this.open();
    }

    // Reactively push the native Bootstrap state into Signals
    this.statusSub = this.statusChange.subscribe(status => {
      const isOpen = status === 'show' || status === 'shown';
      const header = this.header();
      const body = this.body();

      if (header) {
        header.expanded.set(isOpen);
      }
      if (body) {
        body.expanded.set(isOpen);
      }
    });
  }

  override ngOnDestroy(): void {
    // Pass the correct element so abstract class prevents memory leaks
    const element = this.elementRef?.nativeElement.querySelector(
      '.accordion-collapse',
    ) as HTMLElement;
    super.ngOnDestroy(element);

    // Clean up subscription
    this.statusSub?.unsubscribe();
  }

  override getOrCreateInstance(element: HTMLElement): Collapse {
    return Collapse.getOrCreateInstance(element, { toggle: false });
  }

  override get eventPrefix(): string {
    return 'bs.collapse';
  }
}
