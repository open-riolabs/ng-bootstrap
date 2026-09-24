import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  EmbeddedViewRef,
  inject,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { RLB_DEFAULTS } from '../../shared/defaults';
import { RLB_ICONS } from '../../shared/icons';
import { DataTableHost } from './dt-host';

@Component({
    selector: 'rlb-dt-header',
    template: `
    <ng-template #template>
      @if (!hidden()) {
      <th
        [class]="cssClass()"
        [style]="thStyle()"
        [attr.aria-sort]="ariaSort()"
        [class.align-top]="hasFilterRow()"
      >
        <div class="d-flex align-items-center gap-1">
          <ng-content></ng-content>
          @if (canSort()) {
            <button
              type="button"
              class="btn btn-link btn-sm p-0 text-reset lh-1"
              [attr.aria-label]="sortText()"
              (click)="toggleSort()"
            >
              <i [class]="sortIcon()" aria-hidden="true"></i>
            </button>
          }
        </div>
        @if (canFilter()) {
          <input
            type="text"
            class="form-control form-control-sm mt-1 fw-normal"
            [value]="filterValue()"
            [attr.placeholder]="filterPlaceholder()"
            [attr.aria-label]="filterText()"
            (input)="onFilter($event)"
          />
        }
      </th>
      }
    </ng-template>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableHeaderComponent {
  private host = inject(DataTableHost, { optional: true });
  private defaults = inject(RLB_DEFAULTS).table;
  protected icons = inject(RLB_ICONS);

  field = input<string | undefined>(undefined);
  type = input<'number' | 'string' | undefined>(undefined);
  sortable = input(false, { transform: booleanAttribute });
  filtrable = input(false, { transform: booleanAttribute });
  cssClass = input<string | undefined>(undefined, { alias: 'class' });
  cssStyle = input<string | undefined>(undefined, { alias: 'style' });

  /**
   * Lets the user hide this column from the table's column menu. Needs a `field`, which is how the
   * table remembers the choice, and a `label`, because the heading itself is projected content the
   * table cannot read.
   */
  hideable = input(false, { transform: booleanAttribute });
  /** Name for this column in the column menu. Falls back to `field`. */
  label = input<string | undefined>(undefined);

  /**
   * What the control that sorts this column is called.
   *
   * Its only content is an arrow, so without this a screen reader announces «button» and stops.
   * English by default, like the table's other labels; a caller that translates passes its own.
   */
  sortLabel = input<string | undefined>(undefined);
  /** What the box that filters this column is called, for the same reason. */
  filterLabel = input<string | undefined>(undefined);
  filterPlaceholder = input<string | undefined>(undefined);

  protected sortText = computed(() => this.sortLabel() ?? this.defaults.sortLabel);
  protected filterText = computed(() => this.filterLabel() ?? this.defaults.filterLabel);

  /** The name this column goes by in the column menu. */
  menuLabel = computed(() => this.label() ?? this.field() ?? '');

  element!: HTMLElement;
  template = viewChild.required<TemplateRef<any>>('template');

  private temp!: EmbeddedViewRef<any>;

  get _view() {
    return this.temp;
  }

  /**
   * `sortable` and `filtrable` both need a `field`: without one the header has no way to say which
   * column the query is about. They are also inert outside an `rlb-dt-table`, which is where the
   * query lives.
   */
  canSort = computed(() => this.sortable() && !!this.field() && !!this.host);
  canFilter = computed(() => this.filtrable() && !!this.field() && !!this.host);
  canHide = computed(() => this.hideable() && !!this.field() && !!this.host);

  hidden = computed(() => this.host?.isColumnHidden(this.field()) ?? false);

  /** True when some column in this table filters, so this one lines up with it. */
  hasFilterRow = computed(() => this.host?.hasFilterRow() ?? false);

  /**
   * A sticky header stays put while the body scrolls, and needs an opaque background of its own or
   * the rows show through it.
   */
  protected thStyle = computed(() => {
    const parts: string[] = [];
    const own = this.cssStyle();
    if (own) parts.push(own);
    if (this.host?.stickyHeader()) {
      parts.push('position: sticky', 'top: 0', 'z-index: 2', 'background: var(--bs-body-bg)');
    }
    return parts.join('; ');
  });

  /** The direction this column is sorting in, or undefined when another column is. */
  direction = computed(() => {
    const sorting = this.host?.sorting();
    return sorting && sorting.column === this.field() ? sorting.direction : undefined;
  });

  ariaSort = computed(() => {
    if (!this.canSort()) return null;
    const direction = this.direction();
    if (direction === 'asc') return 'ascending';
    if (direction === 'desc') return 'descending';
    return 'none';
  });

  sortIcon = computed(() => {
    const direction = this.direction();
    if (direction === 'asc') return this.icons.sortAscending;
    if (direction === 'desc') return this.icons.sortDescending;
    return this.icons.sortNone;
  });

  filterValue = computed(() => {
    const field = this.field();
    if (!field) return '';
    const value = this.host?.filter()[field];
    return value === undefined || value === null ? '' : String(value);
  });

  toggleSort() {
    const field = this.field();
    if (field && this.canSort()) this.host!.toggleSort(field);
  }

  onFilter(event: Event) {
    const field = this.field();
    if (!field || !this.canFilter()) return;
    this.host!.setFilter(field, (event.target as HTMLInputElement).value);
  }
}
