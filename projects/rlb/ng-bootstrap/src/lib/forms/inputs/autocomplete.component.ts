import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  numberAttribute,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { debounceTime, distinctUntilChanged, lastValueFrom, Observable, Subject } from 'rxjs';
import { AbstractComponent } from './abstract-field.component';
import { AutocompleteFn, AutocompleteItem } from './autocomplete-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { InputValidationComponent } from './input-validation.component';
import { DataTableActionComponent } from '../../data/datatable/dt-action.component';

@Component({
    selector: 'rlb-autocomplete',
    template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation position-relative">
      <input
        #field
        class="form-control"
        autocomplete="off"
        [value]="getText(value())"
        (input)="update($event.target)"
        (keyup.enter)="onEnter($event.target)"
        (blur)="touch()"
        [id]="id()"
        [type]="type()"
        [attr.disabled]="disabled() ? true : undefined"
        [attr.autocomplete]="inputAutocomplete()"
        [attr.readonly]="readonly() ? true : undefined"
        [attr.placeholder]="placeholder()"
        [class.form-control-lg]="size() === 'large'"
        [class.form-control-sm]="size() === 'small'"
        [ngClass]="{
          'is-invalid': controlTouched() && invalid() && enableValidation(),
          'is-valid': controlTouched() && !invalid() && enableValidation(),
        }"
      />

      @if (showError()) {
        <rlb-input-validation [errors]="errors()" />
      }

      @if (isOpen()) {
        <div
          #autocomplete
          class="dropdown-menu show w-100 position-absolute overflow-y-auto"
          [style.max-height.px]="maxHeight()"
          [style.max-width.px]="menuMaxWidth()"
          style="z-index: 1000; top: 100%;"
        >
          @if (acLoading()) {
            <div class="dropdown-item disabled text-center">Loading...</div>
          } @else if (!hasSuggestions()) {
            <a class="dropdown-item disabled text-center">No suggestions</a>
          } @else {
            @for (item of suggestions(); track item.value) {
              <a
                class="dropdown-item d-flex align-items-center"
                (click)="selectItem(item, $event)"
                style="cursor: pointer"
              >
                @if (item.iconClass) {
                  <i
                    [class]="item.iconClass"
                    class="me-2"
                  ></i>
                }
                {{ item.text }}
              </a>
            }
          }
        </div>
      }
    </div>
    <ng-content select="[after]"></ng-content>
  `,
    host: {
        // Modern Angular 21 syntax for global listeners
        '(document:pointerdown)': 'onDocumentPointerDown($event)',
        '(document:keydown.escape)': 'onEscape($event)',
        '[attr.id]': 'null',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NgClass,
        InputValidationComponent,
        DataTableActionComponent,
    ],
})
export class AutocompleteComponent extends AbstractComponent<AutocompleteItem> {
  acLoading = signal(false);
  private typingTimeout: any;

  // State
  isOpen = signal(false);
  protected suggestions = signal<AutocompleteItem[]>([]);
  protected hasSuggestions = computed(() => this.suggestions().length > 0);

  // Inputs
  disabled = model(false);
  readonly = input(false, { transform: booleanAttribute, alias: 'readonly' });
  loading = input(false, { transform: booleanAttribute, alias: 'loading' });
  maxHeight = input(200, { transform: numberAttribute, alias: 'max-height' });
  placeholder = input('', { alias: 'placeholder' });

  autocomplete = input<AutocompleteFn>(() => [], { alias: 'autocomplete' });
  type = input<'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url' | string>(
    'text',
    { alias: 'type' },
  );
  size = input<'small' | 'large' | undefined>(undefined);
  charsToSearch = input(3, { alias: 'chars-to-search', transform: numberAttribute });
  menuMaxWidth = input(null, { alias: 'menu-max-width', transform: numberAttribute });
  userDefinedId = input('', { alias: 'id', transform: (v: string) => v || '' });
  enableValidation = input(false, { transform: booleanAttribute, alias: 'enable-validation' });
  inputAutocomplete = input('off');

  el = viewChild<ElementRef<HTMLInputElement>>('field');
  dropdown = viewChild<ElementRef<HTMLElement>>('autocomplete');
  selected = output<AutocompleteItem>();

  private readonly hostRef = inject(ElementRef<HTMLElement>);

  onDocumentPointerDown(event: PointerEvent) {
    this.handleOutsideEvent(event);
  }

  onEscape(event: Event) {
    if (this.isOpen()) {
      this.closeDropdown();
      this.el()?.nativeElement?.blur();
    }
  }

  private searchSubject = new Subject<string>();

  constructor() {
    super();
    // Use RxJS for cleaner debouncing
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(val => {
        this.manageSuggestions(val);
      });
  }

  update(ev: EventTarget | null) {
    if (this.disabled()) return;
    const t = ev as HTMLInputElement;
    const val = t.value;

    this.searchSubject.next(val);

    // OPTIONAL: If you want the form to have the "raw text" before selection:
    // this.setValue({ text: val, value: val });
  }

  override onWrite(data: AutocompleteItem | undefined): void {
    // const field = this.el();
    // if (field && field.nativeElement) {
    //   if (typeof data === 'string') {
    //     field.nativeElement.value = data;
    //   } else {
    //     field.nativeElement.value = data?.text || '';
    //   }
    // }
  }

  manageSuggestions(data: string) {
    // 1. Reset suggestions but keep dropdown state logic clean
    this.suggestions.set([]);

    if (data && data.length >= this.charsToSearch()) {
      this.openDropdown();
      try {
        const result = this.autocomplete()(data);

        if (result instanceof Promise) {
          this.acLoading.set(true);
          result
            .then(s => this.handleResults(s))
            .catch(() => this.handleResults([]))
            .finally(() => this.acLoading.set(false));
        } else if (result instanceof Observable) {
          this.acLoading.set(true);
          lastValueFrom(result)
            .then(s => this.handleResults(s))
            .catch(() => this.handleResults([]))
            .finally(() => this.acLoading.set(false));
        } else {
          this.handleResults(result);
        }
      } catch (e) {
        console.error('Error executing autocomplete function:', e);
        this.closeDropdown();
      }
    } else {
      this.closeDropdown();
    }
  }

  private handleResults(raw: Array<string | AutocompleteItem>) {
    const normalize = raw.map(r => (typeof r === 'string' ? { text: r, value: r } : r));
    this.suggestions.set(normalize);
  }

  selectItem(item: AutocompleteItem, ev?: Event) {
    ev?.stopPropagation();
    this.selected.emit(item);
    this.setValue(item);
    this.closeDropdown();
  }

  onEnter(ev: EventTarget | null) {
    const t = ev as HTMLInputElement;
    if (!this.disabled() && t && t.value) {
      const item: AutocompleteItem = {
        text: t.value,
        value: t.value,
      };
      this.setValue(item);
      this.closeDropdown();
    }
  }

  getText(d: AutocompleteItem | undefined) {
    if (d == null) return '';
    return typeof d === 'string' ? d : d?.text;
  }

  private handleOutsideEvent(event: Event) {
    if (!this.isOpen()) return;

    const target = event.target as HTMLElement;
    const dropdown = this.dropdown();

    const path: EventTarget[] = (event as any).composedPath ? (event as any).composedPath() : [];

    const clickedInsideHost = this.hostRef?.nativeElement?.contains(target);
    const clickedInsideDropdown = dropdown?.nativeElement?.contains
      ? dropdown.nativeElement.contains(target)
      : false;

    // Check path for Shadow DOM support
    const clickedInPath = path.length
      ? path.some(
          p => p === this.hostRef.nativeElement || (dropdown && p === dropdown.nativeElement),
        )
      : false;

    if (!(clickedInsideHost || clickedInsideDropdown || clickedInPath)) {
      this.closeDropdown();
    }
  }

  openDropdown() {
    if (this.isOpen()) return;
    this.isOpen.set(true);
  }

  closeDropdown() {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.acLoading.set(false);
  }
}
