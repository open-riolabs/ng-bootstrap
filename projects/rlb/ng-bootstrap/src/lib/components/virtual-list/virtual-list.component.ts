import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChild,
  input,
  numberAttribute,
  output,
  TemplateRef,
} from '@angular/core';

/**
 * A long list that only renders what is on screen.
 *
 * `@angular/cdk` has been a peer dependency of this library from the start, and the only thing it
 * was used for was `BreakpointObserver` — its virtual scroller was already paid for and never
 * reached. This is a thin wrapper over it: the CDK does the scrolling, this decides what the list
 * looks like and when to ask for more.
 *
 * ```html
 * <rlb-virtual-list [items]="rows" [item-size]="56" height="24rem" (near-end)="loadMore()">
 *   <ng-template let-row let-i="index">
 *     <div class="px-3 py-2 border-bottom">{{ i + 1 }} — {{ row.name }}</div>
 *   </ng-template>
 * </rlb-virtual-list>
 * ```
 */
@Component({
  selector: 'rlb-virtual-list',
  template: `
    <cdk-virtual-scroll-viewport
      [itemSize]="itemSize()"
      [minBufferPx]="itemSize() * 4"
      [maxBufferPx]="itemSize() * 8"
      [style.height]="height()"
      class="rlb-virtual-viewport"
      [class.border]="bordered()"
      [class.rounded]="bordered()"
      (scrolledIndexChange)="onScrolledIndexChange($event)"
    >
      <ng-container *cdkVirtualFor="let item of items(); let index = index; trackBy: trackByFn()">
        <ng-container
          [ngTemplateOutlet]="row()!"
          [ngTemplateOutletContext]="{ $implicit: item, index: index }"
        />
      </ng-container>
    </cdk-virtual-scroll-viewport>
  `,
  host: { class: 'd-block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf, NgTemplateOutlet],
})
export class VirtualListComponent<T = unknown> {
  items = input<readonly T[]>([]);

  /**
   * The height of one row in pixels — fixed, and it must match what the template actually renders
   * or the scrollbar lies about how long the list is.
   */
  itemSize = input(48, { alias: 'item-size', transform: numberAttribute });

  /** A CSS length for the viewport. Without a height there is nothing to scroll inside. */
  height = input('20rem');

  bordered = input(true, { transform: booleanAttribute });

  /**
   * How far from the end, in rows, `(near-end)` fires. Big enough that the next batch arrives
   * before the user reaches the bottom.
   */
  threshold = input(10, { transform: numberAttribute });

  /** What identifies a row, for the CDK's own recycling. Defaults to the index. */
  trackBy = input<((index: number, item: T) => unknown) | undefined>(undefined, {
    alias: 'track-by',
  });

  /**
   * The user is `threshold` rows from the bottom. Fires once per arrival, not per scroll event —
   * but the caller still has to ignore it while a page is already in flight.
   */
  nearEnd = output<void>({ alias: 'near-end' });

  /** The first row currently rendered. */
  scrolledIndex = output<number>({ alias: 'scrolled-index' });

  /** The row template the caller projected. */
  private row_ = contentChild(TemplateRef);
  protected row = () => this.row_() as TemplateRef<{ $implicit: T; index: number }> | undefined;

  protected trackByFn = () => this.trackBy() ?? ((index: number) => index);

  private lastFired = -1;

  protected onScrolledIndexChange(index: number) {
    this.scrolledIndex.emit(index);

    const total = this.items().length;
    if (total === 0) return;

    // `index` is the first rendered row, so it stops short of `total` by however many fit on
    // screen. Comparing against `total` therefore fires a little before the true bottom, which is
    // the point: the next batch should arrive before the user gets there.
    const reached = index + this.threshold() >= total;
    if (!reached) {
      // Away from the end again: the next arrival is a new one.
      this.lastFired = -1;
      return;
    }
    if (this.lastFired === total) return;
    this.lastFired = total;
    this.nearEnd.emit();
  }
}
