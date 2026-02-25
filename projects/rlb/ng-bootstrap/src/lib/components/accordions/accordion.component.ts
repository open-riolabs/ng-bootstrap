import {
  booleanAttribute,
  Component,
  computed,
  contentChildren,
  effect,
  input,
  OnDestroy,
  OutputRefSubscription,
  signal,
} from '@angular/core';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AccordionItemComponent } from './accordion-item.component';

@Component({
  selector: 'rlb-accordion',
  template: `
    <ng-content select="[rlb-accordion-item]"></ng-content>
  `,
  host: {
    class: 'accordion',
    '[class.accordion-flush]': 'flush()',
    '[class.accordion-card-style]': 'cardStyle()',
    '[id]': 'effectiveId()',
  },
  standalone: false,
})
export class AccordionComponent implements OnDestroy {
  flush = input(false, { alias: 'flush', transform: booleanAttribute });
  alwaysOpen = input(false, { alias: 'always-open', transform: booleanAttribute });
  id = input<string | undefined>(undefined, { alias: 'id' });

  private _internalId = signal('');
  effectiveId = computed(() => this.id() || this._internalId());

  private subs: OutputRefSubscription[] = [];

  items = contentChildren(AccordionItemComponent);

  cardStyle = input(true, { alias: 'card-style', transform: booleanAttribute });

  constructor(private idService: UniqueIdService) {
    this._internalId.set(`accordion${this.idService.id}`);

    effect(() => {
      this.syncItems();
    });
  }

  private syncItems(): void {
    const items = this.items();
    const id = this.effectiveId();
    const alwaysOpen = this.alwaysOpen();

    items.forEach(item => {
      item.parentId.set(id);
      item.alwaysOpen.set(alwaysOpen);
    });

    this.attachItemHandlers();
    this.enforceInitialState();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private attachItemHandlers(): void {
    this.cleanup();
    const items = this.items();
    const alwaysOpen = this.alwaysOpen();
    const id = this.effectiveId();

    items.forEach(item => {
      item.parentId.set(id);
      item.alwaysOpen.set(alwaysOpen);

      const sub = item.statusChange.subscribe(ev => {
        if (!alwaysOpen && (ev === 'show' || ev === 'shown')) {
          items.forEach(other => {
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
    const items = this.items();
    if (items.length === 0) return;

    if (this.alwaysOpen()) {
      return;
    }

    const opened = items.filter(i => i.expanded() || i.status === 'show' || i.status === 'shown');

    if (opened.length > 1) {
      opened.slice(1).forEach(i => i.close());
    }
  }

  private cleanup(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.subs = [];
  }
}
