import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { NgClass } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { flattenTree, RlbTreeNode } from '../../components/tree/tree-node';
import { TreeComponent } from '../../components/tree/tree.component';
import { RLB_ICONS } from '../../shared/icons';
import { AbstractComponent } from './abstract-field.component';
import { DATE_PICKER_POSITIONS } from './date-picker-positions';
import { InputValidationComponent } from './input-validation.component';

/**
 * A select whose options are a tree: a category, a folder, a place in an org chart.
 *
 * `rlb-select` flattens the shape, and a hand-indented `<option>` list only pretends to have one —
 * the indentation is decoration, the keyboard and the screen reader still see a flat list. This
 * keeps the real structure in the panel and puts only the chosen labels in the box.
 *
 * The value is ids: one `string` on its own, or a `string[]` with `multiple`. Ids rather than
 * nodes, because a form that round-trips through JSON should not carry whole subtrees with it.
 */
@Component({
  selector: 'rlb-tree-select',
  template: `
    <div
      class="input-group"
      [class.input-group-sm]="size() === 'small'"
      [class.input-group-lg]="size() === 'large'"
    >
      <button
        #field
        type="button"
        class="form-control text-start d-flex align-items-center gap-1"
        [id]="id()"
        [disabled]="isDisabled()"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="tree"
        [attr.aria-label]="ariaLabel()"
        [ngClass]="{
          'is-invalid': controlTouched() && invalid() && enableValidation(),
          'is-valid': controlTouched() && !invalid() && enableValidation(),
        }"
        (click)="toggle()"
      >
        @if (chosen().length === 0) {
          <span class="text-body-secondary text-truncate">{{ placeholder() }}</span>
        } @else if (multiple()) {
          <span class="d-flex flex-wrap gap-1">
            @for (node of chosen(); track node.id) {
              <span class="badge text-bg-secondary d-inline-flex align-items-center gap-1">
                {{ node.label }}
                @if (!isDisabled() && !readonly()) {
                  <i
                    role="button"
                    tabindex="0"
                    [class]="icons.close"
                    [attr.aria-label]="removeLabel() + ' ' + node.label"
                    (click)="remove(node, $event)"
                    (keydown.enter)="remove(node, $event)"
                    (keydown.space)="remove(node, $event)"
                  ></i>
                }
              </span>
            }
          </span>
        } @else {
          <span class="text-truncate">{{ chosen()[0]?.label }}</span>
        }
      </button>

      @if (clearable() && chosen().length > 0 && !isDisabled() && !readonly()) {
        <button
          type="button"
          class="btn btn-outline-secondary"
          [attr.aria-label]="clearLabel()"
          (click)="clear()"
        >
          <i [class]="icons.close" aria-hidden="true"></i>
        </button>
      }

      <button
        type="button"
        class="btn btn-outline-secondary"
        tabindex="-1"
        aria-hidden="true"
        [disabled]="isDisabled()"
        (click)="toggle()"
      >
        <i [class]="icons.chevronDown" aria-hidden="true"></i>
      </button>
    </div>

    @if (showError()) {
      <rlb-input-validation [errors]="errors()" />
    }

    <ng-template #panel>
      <div class="card shadow" [style.width.px]="panelWidth()">
        @if (searchable()) {
          <div class="card-header p-2">
            <input
              #search
              type="search"
              class="form-control form-control-sm"
              autocomplete="off"
              [placeholder]="searchPlaceholder()"
              [attr.aria-label]="searchPlaceholder()"
              (input)="query.set($any($event.target).value)"
            />
          </div>
        }
        <div class="card-body p-1 overflow-auto rlb-tree-select-body">
          <rlb-tree
            [nodes]="nodes()"
            [checkboxes]="multiple()"
            [branch-selectable]="branchesSelectable()"
            [filter]="query()"
            [expanded]="expanded()"
            (expandedChange)="expanded.set($event)"
            [selected]="ids()"
            (selectedChange)="onSelected($event)"
            [ariaLabel]="ariaLabel() || placeholder()"
            [emptyLabel]="emptyLabel()"
            (activated)="onActivated($event)"
          />
        </div>
      </div>
    </ng-template>
  `,
  styles: `
    .rlb-tree-select-body {
      max-height: 16rem;
    }
  `,
  host: { '[attr.id]': 'null' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TreeComponent, InputValidationComponent],
})
export class TreeSelectComponent extends AbstractComponent<string | string[] | undefined> {
  protected icons = inject(RLB_ICONS);
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private elementRef = inject(ElementRef<HTMLElement>);

  disabled = input(false, { transform: booleanAttribute });
  readonly = input(false, { transform: booleanAttribute });
  placeholder = input('Choose…');
  size = input<'small' | 'large' | undefined>(undefined);
  protected userDefinedId = input<string | undefined>(undefined, { alias: 'inputId' });
  enableValidation = input(false, { alias: 'enable-validation', transform: booleanAttribute });

  nodes = input<readonly RlbTreeNode[]>([]);
  /** Take several, with a tick box on every node and a branch that ticks what is under it. */
  multiple = input(false, { transform: booleanAttribute });
  /** A branch can be chosen too. Off, branches only open. */
  branchesSelectable = input(false, { alias: 'branches-selectable', transform: booleanAttribute });
  searchable = input(true, { transform: booleanAttribute });
  clearable = input(true, { transform: booleanAttribute });

  ariaLabel = input<string | undefined>(undefined);
  searchPlaceholder = input('Search');
  emptyLabel = input('Nothing found');
  clearLabel = input('Clear');
  removeLabel = input('Remove');

  readonly isOpen = signal(false);
  protected query = signal('');
  protected expanded = signal<string[]>([]);
  protected panelWidth = signal<number | null>(null);

  private panelTemplate = viewChild.required<TemplateRef<unknown>>('panel');
  private field = viewChild<ElementRef<HTMLButtonElement>>('field');
  private searchBox = viewChild<ElementRef<HTMLInputElement>>('search');
  private overlayRef?: OverlayRef;

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => this.dispose());
  }

  isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  /** The value as a list, whatever shape it came in as. */
  protected ids = computed<string[]>(() => {
    const value = this.value();
    if (value == null) return [];
    return Array.isArray(value) ? value : [value];
  });

  /**
   * The chosen nodes, looked up by id.
   *
   * An id with no node behind it is dropped rather than shown as itself: a stale id from an old
   * saved form should read as «nothing chosen», not as a label that is really a database key.
   */
  protected chosen = computed(() => {
    const wanted = new Set(this.ids());
    if (wanted.size === 0) return [];
    return flattenTree(this.nodes()).filter(node => wanted.has(node.id));
  });

  toggle() {
    this.isOpen() ? this.close() : this.open();
  }

  open() {
    if (this.overlayRef || this.isDisabled() || this.readonly()) return;

    this.panelWidth.set(this.elementRef.nativeElement.getBoundingClientRect().width);
    // Opening on the branches that hold what is already chosen saves the first few clicks.
    this.expanded.update(open => [...new Set([...open, ...this.ancestorsOfChosen()])]);

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.elementRef)
        .withPositions(DATE_PICKER_POSITIONS)
        .withPush(true),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    this.overlayRef.attach(new TemplatePortal(this.panelTemplate(), this.viewContainerRef));
    this.overlayRef.backdropClick().subscribe(() => this.close());
    this.overlayRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
      }
    });
    this.isOpen.set(true);
    queueMicrotask(() => this.searchBox()?.nativeElement.focus());
  }

  close() {
    if (!this.overlayRef) return;
    this.dispose();
    this.isOpen.set(false);
    this.query.set('');
    this.touch();
    this.field()?.nativeElement.focus();
  }

  private dispose() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  /** Every branch above something already chosen, so the panel opens showing it. */
  private ancestorsOfChosen(): string[] {
    const wanted = new Set(this.ids());
    const out: string[] = [];

    const walk = (list: readonly RlbTreeNode[], above: string[]): boolean => {
      let found = false;
      for (const node of list) {
        const below = node.children?.length ? walk(node.children, [...above, node.id]) : false;
        if (wanted.has(node.id) || below) {
          above.forEach(id => out.push(id));
          if (below) out.push(node.id);
          found = true;
        }
      }
      return found;
    };

    walk(this.nodes(), []);
    return out;
  }

  protected onSelected(ids: string[]) {
    if (this.readonly()) return;

    if (this.multiple()) {
      this.setValue(ids);
      return;
    }

    this.setValue(ids[0]);
  }

  /**
   * A select that takes one thing is done as soon as that thing is picked — but a branch click
   * only opened the branch, and closing the panel there would undo the click the user just made.
   */
  protected onActivated(node: RlbTreeNode) {
    if (this.multiple()) return;
    if (node.children?.length && !this.branchesSelectable()) return;
    this.close();
  }

  protected remove(node: RlbTreeNode, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.setValue(this.ids().filter(id => id !== node.id));
  }

  clear() {
    this.setValue(this.multiple() ? [] : undefined);
    this.touch();
  }
}
