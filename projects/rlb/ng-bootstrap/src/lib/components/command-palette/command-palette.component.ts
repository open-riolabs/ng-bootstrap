import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  numberAttribute,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { RLB_ICONS } from '../../shared/icons';
import { RlbCommand, scoreCommand } from './command';

interface Row {
  command: RlbCommand;
  /** Set on the first command of a group; the rest sit under the same heading. */
  heading: string | null;
}

/**
 * Everything the application can do, one keystroke away.
 *
 * `SearchModalComponent` has been in the library for a while — a box and a list in a modal. This is
 * that idea grown up: a shortcut, fuzzy matching, groups, the commands you used last, and the whole
 * thing driven from the keyboard.
 *
 * Mount it once, near the root, the way `rlb-modal-container` is mounted. It renders nothing until
 * it opens.
 *
 * ```html
 * <rlb-command-palette [commands]="commands" />
 * ```
 *
 * Built on CDK Overlay: the application must load `@angular/cdk/overlay-prebuilt.css`.
 */
@Component({
  selector: 'rlb-command-palette',
  template: `
    <ng-template #panel>
      <div
        class="rlb-palette card shadow-lg"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="title()"
      >
        <div class="input-group input-group-lg border-bottom">
          <span class="input-group-text bg-transparent border-0">
            <i [class]="icons.search" aria-hidden="true"></i>
          </span>
          <input
            #field
            type="text"
            class="form-control border-0 shadow-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="rlb-palette-list"
            [attr.aria-activedescendant]="activeId()"
            [attr.placeholder]="placeholder()"
            [attr.aria-label]="title()"
            autocomplete="off"
            [value]="query()"
            (input)="onQuery($event)"
            (keydown)="onKeydown($event)"
          />
        </div>

        <div
          id="rlb-palette-list"
          class="rlb-palette-list overflow-auto py-1"
          role="listbox"
          [attr.aria-label]="title()"
        >
          @for (row of rows(); track row.command.id; let i = $index) {
            @if (row.heading) {
              <div class="px-3 pt-2 pb-1 text-body-secondary small fw-semibold text-uppercase">
                {{ row.heading }}
              </div>
            }
            <button
              type="button"
              class="rlb-palette-row btn btn-link text-reset text-decoration-none w-100 text-start d-flex align-items-center gap-3 px-3 py-2"
              role="option"
              [id]="'rlb-palette-row-' + i"
              [attr.aria-selected]="i === activeIndex()"
              [class.active]="i === activeIndex()"
              [disabled]="row.command.disabled"
              (mouseenter)="activeIndex.set(i)"
              (click)="run(row.command)"
            >
              @if (row.command.icon) {
                <i [class]="row.command.icon" aria-hidden="true"></i>
              }
              <span class="flex-grow-1 min-width-0">
                <span class="d-block text-truncate">{{ row.command.label }}</span>
                @if (row.command.hint) {
                  <small class="d-block text-body-secondary text-truncate">{{
                    row.command.hint
                  }}</small>
                }
              </span>
              @if (row.command.shortcut) {
                <kbd class="small">{{ row.command.shortcut }}</kbd>
              }
            </button>
          }

          @if (rows().length === 0) {
            <div class="px-3 py-4 text-center text-body-secondary">{{ emptyLabel() }}</div>
          }
        </div>
      </div>
    </ng-template>
  `,
  styles: `
    .rlb-palette {
      width: min(40rem, calc(100vw - 2rem));
    }
    .rlb-palette-list {
      max-height: min(24rem, 60vh);
    }
    .rlb-palette-row.active {
      background: var(--bs-secondary-bg);
    }
    .min-width-0 {
      min-width: 0;
    }
  `,
  host: {
    '(document:keydown)': 'onShortcut($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteComponent {
  protected icons = inject(RLB_ICONS);
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);

  commands = input<readonly RlbCommand[]>([]);

  /**
   * The shortcut that opens it: a `+`-joined list ending in one key, e.g. `mod+k`, `ctrl+shift+p`.
   * `mod` is Cmd on a Mac and Ctrl everywhere else. Empty turns the shortcut off.
   */
  shortcut = input('mod+k');
  /** Stops the shortcut and `open()` alike, for a screen where the palette makes no sense. */
  disabled = input(false, { transform: booleanAttribute });

  title = input('Commands');
  placeholder = input('Type a command…');
  emptyLabel = input('Nothing matches');
  recentLabel = input('Recent');
  /** How many recently used commands to keep at the top when the box is empty. 0 turns it off. */
  recentCount = input(3, { alias: 'recent-count', transform: numberAttribute });

  /** A command was chosen. It has already run. */
  executed = output<RlbCommand>();

  readonly isOpen = signal(false);
  protected query = signal('');
  protected activeIndex = signal(0);

  /** Ids most recently run, newest first. Kept in memory: a palette is a per-visit convenience. */
  private recent = signal<string[]>([]);

  private panelTemplate = viewChild.required<TemplateRef<unknown>>('panel');
  private field = viewChild<ElementRef<HTMLInputElement>>('field');
  private overlayRef?: OverlayRef;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.dispose());
  }

  protected activeId = computed(() =>
    this.rows().length ? 'rlb-palette-row-' + this.activeIndex() : null,
  );

  /**
   * What the list shows: the matches, best first, with a heading on the first command of each
   * group. With an empty box the recently used come first under their own heading — which is the
   * whole reason to have used the palette before.
   */
  protected rows = computed<Row[]>(() => {
    const query = this.query().trim();
    const available = this.commands().filter(command => !command.disabled || query !== '');

    let ordered: RlbCommand[];
    let recentIds: string[] = [];

    if (query === '') {
      recentIds = this.recent().slice(0, this.recentCount());
      const recentCommands = recentIds
        .map(id => available.find(command => command.id === id))
        .filter((command): command is RlbCommand => !!command);
      const rest = available.filter(command => !recentIds.includes(command.id));
      ordered = [...recentCommands, ...rest];
    } else {
      ordered = available
        .map(command => ({ command, score: scoreCommand(command, query) }))
        .filter((scored): scored is { command: RlbCommand; score: number } => scored.score !== null)
        .sort((a, b) => b.score - a.score)
        .map(scored => scored.command);
    }

    const recentShown = query === '' ? recentIds.length : 0;
    let lastHeading: string | null = null;

    return ordered.map((command, index) => {
      if (index < recentShown) {
        const heading = index === 0 ? this.recentLabel() : null;
        lastHeading = this.recentLabel();
        return { command, heading };
      }
      const group = command.group ?? null;
      const heading = group !== lastHeading ? group : null;
      lastHeading = group;
      return { command, heading };
    });
  });

  protected onShortcut(event: KeyboardEvent) {
    if (this.disabled() || !this.matchesShortcut(event)) return;
    event.preventDefault();
    this.isOpen() ? this.close() : this.open();
  }

  private matchesShortcut(event: KeyboardEvent): boolean {
    const spec = this.shortcut().trim().toLowerCase();
    if (spec === '') return false;

    const parts = spec.split('+').map(part => part.trim());
    const key = parts.pop();
    if (!key || event.key.toLowerCase() !== key) return false;

    const wants = (name: string) => parts.includes(name);
    // `mod` is Cmd on a Mac and Ctrl elsewhere; either satisfies it, so a page does not have to
    // sniff the platform to write one shortcut.
    const modOk = wants('mod') ? event.metaKey || event.ctrlKey : true;
    const ctrlOk = wants('ctrl') ? event.ctrlKey : wants('mod') ? true : !event.ctrlKey;
    const metaOk = wants('meta') || wants('cmd') ? event.metaKey : wants('mod') ? true : !event.metaKey;
    const shiftOk = wants('shift') === event.shiftKey;
    const altOk = wants('alt') === event.altKey;

    return modOk && ctrlOk && metaOk && shiftOk && altOk;
  }

  open() {
    if (this.overlayRef || this.disabled()) return;

    this.query.set('');
    this.activeIndex.set(0);

    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().centerHorizontally().top('12vh'),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: true,
    });

    this.overlayRef.attach(new TemplatePortal(this.panelTemplate(), this.viewContainerRef));
    this.overlayRef.backdropClick().subscribe(() => this.close());
    this.isOpen.set(true);

    // The box is the whole interface: it gets the focus before anything else can take it.
    queueMicrotask(() => this.field()?.nativeElement.focus());
  }

  close() {
    if (!this.overlayRef) return;
    this.dispose();
    this.isOpen.set(false);
  }

  private dispose() {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  protected onQuery(event: Event) {
    this.query.set((event.target as HTMLInputElement).value);
    this.activeIndex.set(0);
  }

  protected onKeydown(event: KeyboardEvent) {
    const rows = this.rows();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.move(1, rows.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.move(-1, rows.length);
        break;
      case 'Home':
        event.preventDefault();
        this.activeIndex.set(0);
        break;
      case 'End':
        event.preventDefault();
        this.activeIndex.set(Math.max(0, rows.length - 1));
        break;
      case 'Enter': {
        event.preventDefault();
        const row = rows[this.activeIndex()];
        if (row && !row.command.disabled) this.run(row.command);
        break;
      }
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
    }
  }

  /** Wraps around: from the last entry, down goes back to the first. */
  private move(step: number, length: number) {
    if (length === 0) return;
    this.activeIndex.update(current => (current + step + length) % length);
    queueMicrotask(() => this.scrollActiveIntoView());
  }

  private scrollActiveIntoView() {
    const id = this.activeId();
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ block: 'nearest' });
  }

  run(command: RlbCommand) {
    if (command.disabled) return;
    this.close();
    this.recent.update(ids => [command.id, ...ids.filter(id => id !== command.id)].slice(0, 20));
    command.run();
    this.executed.emit(command);
  }
}
