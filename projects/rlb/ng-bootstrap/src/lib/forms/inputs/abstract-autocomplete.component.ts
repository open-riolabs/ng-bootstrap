import {
  booleanAttribute,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  numberAttribute,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractComponent } from './abstract-field.component';
import { AutocompleteItem } from "./autocomplete-model";

@Component({
	template: '',
	standalone: false
})
export abstract class AbstractAutocompleteComponent
  extends AbstractComponent<AutocompleteItem>
	implements ControlValueAccessor {

	acLoading: boolean = false;
	protected typingTimeout: any; // protected, to gain access to child classes
	isOpen = false;

	protected suggestionsList: AutocompleteItem[] = [];
	protected activeIndex: number = -1;

	// COMMON INPUT/OUTPUT
	@Input({ transform: booleanAttribute, alias: 'disabled' }) disabled? = false;
	@Input({ transform: booleanAttribute, alias: 'readonly' }) readonly? = false;
	@Input({ transform: booleanAttribute, alias: 'loading' }) loading?: boolean = false;
	@Input({ transform: numberAttribute, alias: 'max-height' }) maxHeight?: number = 200;
	@Input({ alias: 'placeholder' }) placeholder?: string = '';
	@Input() size?: 'small' | 'large' | undefined;
	@Input({ alias: 'id', transform: (v: string) => v || '' }) userDefinedId: string = '';
	@Input({ alias: 'chars-to-search', transform: numberAttribute }) charsToSearch: number = 3;

	@ViewChild('field', { read: ElementRef, static: false }) el!: ElementRef<HTMLInputElement>;
	@ViewChild('autocomplete', { read: ElementRef, static: false }) dropdown!: ElementRef<HTMLElement>;
  @Output() selected: EventEmitter<AutocompleteItem> = new EventEmitter<AutocompleteItem>();

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

  override onWrite(data?: AutocompleteItem): void {
		if (this.el && this.el.nativeElement) {
			// this.el.nativeElement.value = this.getItemText(data);
			if (typeof data === 'object' && data !== null) {
        this.el.nativeElement.value = this.getItemText(data);
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

    // this.value = inputValue as any;
    const valueToPropagate = inputValue === '' ? { text: '', value: '' } : inputValue;
    this.setValue(valueToPropagate as any);

    if (this.control && this.control.control) {
			this.control.control.markAsDirty();
			this.control.control.updateValueAndValidity();
		}

    if (this.typingTimeout) {
			clearTimeout(this.typingTimeout);
		}

    this.typingTimeout = setTimeout(() => {
			if (!this.disabled) {
				this.getSuggestions(inputValue); // Call specific for a class
			}
		}, 500);
	}

  onEnter(ev: EventTarget | null) {
		const t = ev as HTMLInputElement;
		if (!this.disabled && t && t.value) {
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
				this.onEnter(this.el?.nativeElement);
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
		let newIndex = this.activeIndex + step;

    if (newIndex >= this.suggestionsList.length) {
			newIndex = 0;
		} else if (newIndex < 0) {
			newIndex = this.suggestionsList.length - 1;
		}

    this.setActiveItem(newIndex);
	}

  setActiveItem(index: number) {
		if (this.activeIndex !== -1 && this.dropdown.nativeElement.children[this.activeIndex]) {
			const oldItem = this.dropdown.nativeElement.children[this.activeIndex];
			this.renderer.removeClass(oldItem, 'active');
		}

    this.activeIndex = index;

    if (this.activeIndex !== -1 && this.dropdown.nativeElement.children[this.activeIndex]) {
			const newItem = this.dropdown.nativeElement.children[this.activeIndex];
			this.renderer.addClass(newItem, 'active');
			newItem.scrollIntoView({ block: 'nearest' });
		}
	}

  selectActiveItem() {
		if (this.activeIndex !== -1) {
			const itemData = this.suggestionsList[this.activeIndex];
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
			this.onEnter(this.el?.nativeElement);
		}
	}

  // =========================================================================
	// DROPDOWN MANAGEMENT (COMMON)
	// =========================================================================

  openDropdown() {
		if (!this.dropdown || !this.dropdown.nativeElement || this.isOpen) return;
		this.renderer.setStyle(this.dropdown.nativeElement, 'display', 'block');
		// this.renderer.addClass(this.dropdown.nativeElement, 'show');
		this.isOpen = true;
	}

  closeDropdown() {
		if (!this.dropdown || !this.dropdown.nativeElement || !this.isOpen) return;
		this.renderer.setStyle(this.dropdown.nativeElement, 'display', 'none');
		this.isOpen = false;
		this.clearDropdown();
		this.acLoading = false;
		this.activeIndex = -1;
		this.suggestionsList = [];
	}

  clearDropdown() {
		if (!this.dropdown || !this.dropdown.nativeElement) return;
		while (this.dropdown.nativeElement.firstChild) {
			this.dropdown.nativeElement.removeChild(this.dropdown.nativeElement.lastChild!);
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
		if (!this.dropdown || !this.dropdown.nativeElement) return;
		this.clearDropdown();
		this.suggestionsList = [];
		this.activeIndex = -1;

    const normalizedSuggestions = suggestions.map(suggestion =>
			typeof suggestion === 'string' ? { text: suggestion, value: suggestion } : suggestion
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
				this.activeIndex = i;
				this.selectActiveItem();
				ev.stopPropagation();
			});
			this.renderer.appendChild(this.dropdown.nativeElement, el);
		}
	}
}
