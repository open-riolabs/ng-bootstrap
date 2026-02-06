import {
	booleanAttribute,
	Component,
	ElementRef,
	HostListener,
	input,
	model,
	numberAttribute,
	output,
	Renderer2,
	signal,
	viewChild,
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

	acLoading = signal(false);
	protected typingTimeout: any;
	isOpen = signal(false);

	protected suggestionsList = signal<AutocompleteItem[]>([]);
	protected activeIndex = signal(-1);

	// COMMON INPUT/OUTPUT
	disabled = model(false);
	readonly = input(false, { transform: booleanAttribute, alias: 'readonly' });
	loading = input(false, { transform: booleanAttribute, alias: 'loading' });
	maxHeight = input(200, { transform: numberAttribute, alias: 'max-height' });
	placeholder = input('', { alias: 'placeholder' });
	size = input<'small' | 'large' | undefined>(undefined);
	userDefinedId = input('', { alias: 'id', transform: (v: string) => v || '' });
	charsToSearch = input(3, { alias: 'chars-to-search', transform: numberAttribute });

	el = viewChild<ElementRef<HTMLInputElement>>('field');
	dropdown = viewChild<ElementRef<HTMLElement>>('autocomplete');
	selected = output<AutocompleteItem>();

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
		const field = this.el();
		if (field && field.nativeElement) {
			if (typeof data === 'object' && data !== null) {
				field.nativeElement.value = this.getItemText(data);
			} else {
				field.nativeElement.value = '';
			}
		}
	}

	// =========================================================================
	// INPUT HANDLING
	// =========================================================================

	update(ev: EventTarget | null) {
		const t = ev as HTMLInputElement;
		const inputValue = t?.value || '';

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
			if (!this.disabled()) {
				this.getSuggestions(inputValue); // Call specific for a class
			}
		}, 500);
	}

	onEnter(ev: EventTarget | null) {
		const t = ev as HTMLInputElement;
		if (!this.disabled() && t && t.value) {
			this.closeDropdown();
		}
	}

	// =========================================================================
	// COMMON NAVIGATE AND SELECT LOGIC
	// =========================================================================

	@HostListener('document:keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		if (!this.isOpen() || this.suggestionsList().length === 0) {
			if (event.key === 'Enter') {
				this.onEnter(this.el()?.nativeElement || null);
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
				this.el()?.nativeElement?.blur();
				break;
		}
	}

	navigate(step: 1 | -1) {
		let newIndex = this.activeIndex() + step;

		if (newIndex >= this.suggestionsList().length) {
			newIndex = 0;
		} else if (newIndex < 0) {
			newIndex = this.suggestionsList().length - 1;
		}

		this.setActiveItem(newIndex);
	}

	setActiveItem(index: number) {
		const dropdown = this.dropdown();
		if (this.activeIndex() !== -1 && dropdown && dropdown.nativeElement.children[this.activeIndex()]) {
			const oldItem = dropdown.nativeElement.children[this.activeIndex()];
			this.renderer.removeClass(oldItem, 'active');
		}

		this.activeIndex.set(index);

		if (this.activeIndex() !== -1 && dropdown && dropdown.nativeElement.children[this.activeIndex()]) {
			const newItem = dropdown.nativeElement.children[this.activeIndex()];
			this.renderer.addClass(newItem, 'active');
			newItem.scrollIntoView({ block: 'nearest' });
		}
	}

	selectActiveItem() {
		if (this.activeIndex() !== -1) {
			const itemData = this.suggestionsList()[this.activeIndex()];
			this.selected.emit(itemData);

			this.setValue(itemData);

			if (this.el() && this.el()?.nativeElement) {
				this.el()!.nativeElement.value = itemData.text;
			}

			if (this.typingTimeout) {
				clearTimeout(this.typingTimeout);
			}

			this.closeDropdown();
		} else {
			this.onEnter(this.el()?.nativeElement || null);
		}
	}

	// =========================================================================
	// DROPDOWN MANAGEMENT (COMMON)
	// =========================================================================

	openDropdown() {
		const dropdown = this.dropdown();
		if (!dropdown || !dropdown.nativeElement || this.isOpen()) return;
		this.renderer.setStyle(dropdown.nativeElement, 'display', 'block');
		this.isOpen.set(true);
	}

	closeDropdown() {
		const dropdown = this.dropdown();
		if (!dropdown || !dropdown.nativeElement || !this.isOpen()) return;
		this.renderer.setStyle(dropdown.nativeElement, 'display', 'none');
		this.isOpen.set(false);
		this.clearDropdown();
		this.acLoading.set(false);
		this.activeIndex.set(-1);
		this.suggestionsList.set([]);
	}

	clearDropdown() {
		const dropdown = this.dropdown();
		if (!dropdown || !dropdown.nativeElement) return;
		while (dropdown.nativeElement.firstChild) {
			dropdown.nativeElement.removeChild(dropdown.nativeElement.lastChild!);
		}
	}

	protected renderAc(suggestions: Array<AutocompleteItem | string>) {
		const dropdown = this.dropdown();
		if (!dropdown || !dropdown.nativeElement) return;
		this.clearDropdown();
		this.suggestionsList.set([]);
		this.activeIndex.set(-1);

		const normalizedSuggestions = suggestions.map(suggestion =>
			typeof suggestion === 'string' ? { text: suggestion, value: suggestion } : suggestion
		);

		this.suggestionsList.set(normalizedSuggestions);

		if (!this.suggestionsList() || this.suggestionsList().length === 0) {
			const el = this.renderer.createElement('a');
			this.renderer.addClass(el, 'dropdown-item');
			this.renderer.addClass(el, 'disabled');
			this.renderer.addClass(el, 'text-center');
			this.renderer.setAttribute(el, 'disabled', 'true');
			this.renderer.appendChild(el, this.renderer.createText('No suggestions'));
			this.renderer.appendChild(dropdown.nativeElement, el);
			return;
		}

		for (let i = 0; i < this.suggestionsList().length; i++) {
			const itemData = this.suggestionsList()[i];

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
			this.renderer.appendChild(dropdown.nativeElement, el);
		}
	}
}
