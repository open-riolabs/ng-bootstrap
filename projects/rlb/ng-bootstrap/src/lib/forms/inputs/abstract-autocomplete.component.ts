import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  EventEmitter,
  HostListener,
  input,
  InputSignal,
  numberAttribute,
  Output,
  Renderer2,
  signal,
  viewChild
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractComponent } from './abstract-field.component';
import { AutocompleteItem } from './autocomplete-model';

@Component({
  template: '',
  standalone: false,
})
export abstract class AbstractAutocompleteComponent
  extends AbstractComponent<AutocompleteItem>
  implements ControlValueAccessor {
  acLoading = signal(false);
  protected typingTimeout: any; // protected, to gain access to child classes
  isOpen = false;

  protected suggestionsList: AutocompleteItem[] = [];
  protected activeIndex = signal(-1);

  // COMMON INPUT/OUTPUT
  disabled = input(false, { transform: booleanAttribute }) as unknown as InputSignal<boolean | undefined>;

  isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  readonly = input(false, { transform: booleanAttribute });
  loading = input(false, { transform: booleanAttribute });
  maxHeight = input(200, { transform: numberAttribute, alias: 'max-height' });
  placeholder = input('', { alias: 'placeholder' });
  size = input<'small' | 'large' | undefined>(undefined);

  userDefinedId = input('', { alias: 'id', transform: (v: string) => v || '' }) as unknown as InputSignal<string>;
  charsToSearch = input(3, { alias: 'chars-to-search', transform: numberAttribute });

  private _el = viewChild<ElementRef<HTMLInputElement>>('field');
  private _pendingValue: AutocompleteItem | string | undefined = undefined;

  get el(): ElementRef<HTMLInputElement> | undefined {
    const elValue = this._el();
    if (elValue && this._pendingValue !== undefined) {
      this.applyValueToInput(this._pendingValue);
      this._pendingValue = undefined; // Clear after applying
    }
    return elValue;
  }

  dropdownEl = viewChild<ElementRef<HTMLElement>>('autocomplete');

  get dropdown(): ElementRef<HTMLElement> {
    return this.dropdownEl()!;
  }

  @Output() selected: EventEmitter<AutocompleteItem> =
    new EventEmitter<AutocompleteItem>();

  protected abstract getSuggestions(query: string): void;

  protected abstract getItemText(data?: AutocompleteItem): string;

  protected constructor(
    idService: UniqueIdService,
    protected readonly renderer: Renderer2, // protected, to gain access to child classes
    control?: NgControl,
  ) {
    super(idService, control);
  }

  // =========================================================================
  // HTML FORM LOGIC
  // =========================================================================

  override onWrite(data?: AutocompleteItem | string): void {
    this._pendingValue = data;
    this.applyValueToInput(data);
  }

  private applyValueToInput(data?: AutocompleteItem | string): void {
    if (this.el && this.el.nativeElement) {
      if (data) {
        this.el.nativeElement.value = this.getItemText(
          data as AutocompleteItem,
        );
      } else {
        this.el.nativeElement.value = '';
      }
    }
  }

  // =========================================================================
  // INPUT HANDLING
  // =========================================================================

  update(ev: EventTarget | null) {
    const t = ev as HTMLInputElement;
    const inputValue = t?.value || '';

    const valueToPropagate =
      inputValue === ''
        ? { text: '', value: '' }
        : { text: inputValue, value: inputValue };
    this.setValue(valueToPropagate as any);

    if (this.control && this.control.control) {
      this.control.control.markAsDirty();
      this.control.control.updateValueAndValidity();
    }

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.typingTimeout = setTimeout(() => {
      if (!this.isDisabled()) {
        this.getSuggestions(inputValue);
      }
    }, 500);
  }

  onEnter(ev: EventTarget | null) {
    const t = ev as HTMLInputElement;
    if (!this.isDisabled() && t && t.value) {
      //this.setValue(t?.value);
      this.closeDropdown();
    }
  }

  // =========================================================================
  // COMMON NAVIGATE AND SELECT LOGIC
  // =========================================================================

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.isOpen || this.suggestionsList.length === 0) {
      if (event.key === 'Enter') {
        this.onEnter(this.el?.nativeElement || null);
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigate(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigate(-1);
        break;
      case 'Enter':
        event.preventDefault();
        this.selectActiveItem();
        break;
      case 'Escape':
        this.closeDropdown();
        this.el?.nativeElement?.blur();
        break;
    }
  }

  navigate(step: 1 | -1) {
    let newIndex = this.activeIndex() + step;

    if (newIndex >= this.suggestionsList.length) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = this.suggestionsList.length - 1;
    }

    this.setActiveItem(newIndex);
  }

  setActiveItem(index: number) {
    if (
      this.activeIndex() !== -1 &&
      this.dropdown.nativeElement.children[this.activeIndex()]
    ) {
      const oldItem = this.dropdown.nativeElement.children[this.activeIndex()];
      this.renderer.removeClass(oldItem, 'active');
    }

    this.activeIndex.set(index);

    const dropdown = this.dropdownEl();
    if (
      this.activeIndex() !== -1 &&
      dropdown &&
      dropdown.nativeElement.children[this.activeIndex()]
    ) {
      const newItem = dropdown.nativeElement.children[this.activeIndex()];
      this.renderer.addClass(newItem, 'active');
      newItem.scrollIntoView({ block: 'nearest' });
    }
  }

  selectActiveItem() {
    if (this.activeIndex() !== -1) {
      const itemData = this.suggestionsList[this.activeIndex()];
      this.selected.emit(itemData);

      this.setValue(itemData);

      if (this.el && this.el.nativeElement) {
        this.el.nativeElement.value = itemData.text;
      }

      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }

      this.closeDropdown();
    } else {
      this.onEnter(this.el?.nativeElement || null);
    }
  }

  // =========================================================================
  // DROPDOWN MANAGEMENT (COMMON)
  // =========================================================================

  openDropdown() {
    const dropdown = this.dropdownEl();
    if (!dropdown || !dropdown.nativeElement || this.isOpen) return;
    this.renderer.setStyle(dropdown.nativeElement, 'display', 'block');
    // this.renderer.addClass(this.dropdown.nativeElement, 'show');
    this.isOpen = true;
  }

  closeDropdown() {
    const dropdown = this.dropdownEl();
    if (!dropdown || !dropdown.nativeElement || !this.isOpen) return;
    this.renderer.setStyle(dropdown.nativeElement, 'display', 'none');
    this.isOpen = false;
    this.clearDropdown();
    this.acLoading.set(false);
    this.activeIndex.set(-1);
    this.suggestionsList = [];
  }

  clearDropdown() {
    const dropdown = this.dropdownEl();
    if (!dropdown || !dropdown.nativeElement) return;
    while (dropdown.nativeElement.firstChild) {
      dropdown.nativeElement.removeChild(
        dropdown.nativeElement.lastChild!,
      );
    }
  }

  // protected setValueSilent(val: string) {
  // 	this.value = val as any;
  //
  // 	if (this.control && this.control.control) {
  // 		this.control.control.setValue(val, { emitEvent: false });
  // 	}
  // }

  protected renderAc(suggestions: Array<AutocompleteItem | string>) {
    const dropdown = this.dropdownEl();
    if (!dropdown || !dropdown.nativeElement) return;
    this.clearDropdown();
    this.suggestionsList = [];
    this.activeIndex.set(-1);

    const normalizedSuggestions = suggestions.map((suggestion) =>
      typeof suggestion === 'string'
        ? { text: suggestion, value: suggestion }
        : suggestion,
    );

    this.suggestionsList = normalizedSuggestions;

    if (!this.suggestionsList || this.suggestionsList.length === 0) {
      const el = this.renderer.createElement('a');
      this.renderer.addClass(el, 'dropdown-item');
      this.renderer.addClass(el, 'disabled');
      this.renderer.addClass(el, 'text-center');
      this.renderer.setAttribute(el, 'disabled', 'true');
      this.renderer.appendChild(el, this.renderer.createText('No suggestions'));
      this.renderer.appendChild(this.dropdown.nativeElement, el);
      return;
    }

    for (let i = 0; i < this.suggestionsList.length; i++) {
      const itemData = this.suggestionsList[i];

      const el = this.renderer.createElement('a');
      this.renderer.addClass(el, 'dropdown-item');

      if (itemData.iconClass) {
        const icon = this.renderer.createElement('i');

        const classes = itemData.iconClass.split(/\s+/);
        for (const cls of classes) {
          if (cls) {
            // Angular renderer.addClass() method DOES NOT support expression like this: this.renderer.addClass(icon, 'bi bi-check')
            // it causes silent runtime error
            // Instead we should split it, and add one by one
            this.renderer.addClass(icon, cls);
          }
        }
        this.renderer.addClass(icon, 'me-2');
        this.renderer.appendChild(el, icon);
      }

      this.renderer.appendChild(el, this.renderer.createText(itemData.text));

      this.renderer.listen(el, 'click', (ev: Event) => {
        this.activeIndex.set(i);
        this.selectActiveItem();
        ev.stopPropagation();
      });
      this.renderer.appendChild(this.dropdown.nativeElement, el);
    }
  }
}
