import {
	booleanAttribute,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	numberAttribute,
	Optional,
	Output,
	Renderer2,
	Self,
	ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { lastValueFrom, Observable } from 'rxjs';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractComponent } from './abstract-field.component';

export type AutocompleteItem = string | { text: string, value: string; iconClass?: string };
export type AutocompleteFn = (q?: string) => AutocompleteItem[] | Promise<AutocompleteItem[]> | Observable<AutocompleteItem[]>;

@Component({
  selector: 'rlb-autocomplete',
  template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
      <input
        #field
        [id]="id"
        class="form-control"
        [type]="type"
        [attr.disabled]="disabled ? true : undefined"
        [attr.readonly]="readonly ? true : undefined"
        [attr.placeholder]="placeholder"
        [class.form-control-lg]="size === 'large'"
        [class.form-control-sm]="size === 'small'"
        [value]="getText(value)"
        (blur)="touch()"
        [ngClass]="{ 'is-invalid': control?.touched && control?.invalid }"
        (input)="update($event.target)"
        (keyup.enter)="onEnter($event.target)"
      />
      <div class="invalid-feedback">
        {{ errors | json }}
      </div>
    </div>
    <rlb-progress class="w-100" [height]="2" [infinite]="loading || acLoading" color="primary" />
    <ng-content select="[after]"></ng-content>
    <div
      #autocomplete
      [id]="id+'-ac'"
      class="dropdown-menu overflow-y-auto w-100 position-absolute"
      aria-labelledby="dropdownMenu"
      [style.max-height.px]="maxHeight"
      [style.width]="'fit-content !important'"
      [style.max-width.px]="menuMaxWidth"></div>
   `,
  standalone: false,
  host: {
    style: 'position: relative;',
  }
})
export class AutocompleteComponent
  extends AbstractComponent<AutocompleteItem>
  implements ControlValueAccessor {
  acLoading: boolean = false;
	private typingTimeout: any;
	isOpen = false;
	
	@Input({ transform: booleanAttribute, alias: 'disabled' }) disabled? = false;
  @Input({ transform: booleanAttribute, alias: 'readonly' }) readonly? = false;
  @Input({ transform: booleanAttribute, alias: 'loading' }) loading?: boolean = false;
  @Input({ transform: numberAttribute, alias: 'max-height' }) maxHeight?: number = 200;
  @Input({ alias: 'placeholder' }) placeholder?: string = '';
  @Input({ alias: 'autocomplete' }) autocomplete: AutocompleteFn = () => { return []; };
  @Input({ alias: 'type' }) type?: 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url' | string = 'text';
  @Input() size?: 'small' | 'large' | undefined;
  @Input({ alias: 'chars-to-search', transform: numberAttribute }) charsToSearch: number = 3;
  @Input({ alias: 'menu-max-width', transform: numberAttribute }) menuMaxWidth: number = 400;
  @Input({ alias: 'id', transform: (v: string) => v || '' }) userDefinedId: string = '';

  @ViewChild('field') el!: ElementRef<HTMLInputElement>;
  @ViewChild('autocomplete') dropdown!: ElementRef<HTMLElement>;
  @Output() selected: EventEmitter<AutocompleteItem> = new EventEmitter<AutocompleteItem>();
	
	@HostListener('document:pointerdown', ['$event'])
	onDocumentPointerDown(event: PointerEvent) {
		this.handleOutsideEvent(event);
	}
	
	@HostListener('document:keydown.escape', ['$event'])
	onEscape(event: KeyboardEvent) {
		if (this.isOpen) {
			this.closeDropdown();
			this.el?.nativeElement?.blur();
		}
	}

  constructor(
    idService: UniqueIdService,
    private readonly renderer: Renderer2,
		private readonly hostRef: ElementRef<HTMLElement>,
		@Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);
  }

  update(ev: EventTarget | null) {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    this.typingTimeout = setTimeout(() => {
      if (!this.disabled) {
        const t = ev as HTMLInputElement;
        this.manageSuggestions(t?.value);
      }
    }, 500);
  }

  override onWrite(data: AutocompleteItem): void {
    if (this.el && this.el.nativeElement) {
      if (typeof data === 'string') {
        this.el.nativeElement.value = data;
      } else {
        this.el.nativeElement.value = data?.text;
      }
    }
  }
	
	manageSuggestions(data: string) {
		this.clearDropdown();
		if (data && data.length >= this.charsToSearch) {
			this.openDropdown();
			const suggestions = this.autocomplete(data);
			if (suggestions instanceof Promise) {
				this.acLoading = true;
				suggestions.then(s => this.renderAc(s)).finally(() => (this.acLoading = false));
			} else if (suggestions instanceof Observable) {
				this.acLoading = true;
				lastValueFrom(suggestions).then(s => this.renderAc(s)).finally(() => (this.acLoading = false));
			} else {
				this.renderAc(suggestions);
			}
		} else {
			this.closeDropdown();
		}
	}
	
	renderAc(suggestions: AutocompleteItem[]) {
		this.clearDropdown();
		if (!suggestions || suggestions.length === 0) {
			const el = this.renderer.createElement('a');
			this.renderer.addClass(el, 'dropdown-item');
			this.renderer.addClass(el, 'disabled');
			this.renderer.addClass(el, 'text-center');
			this.renderer.setAttribute(el, 'disabled', 'true');
			this.renderer.appendChild(el, this.renderer.createText('No suggestions'));
			this.renderer.appendChild(this.dropdown.nativeElement, el);
			return;
		}
		
		for (const suggestion of suggestions) {
			const itemData = (typeof suggestion === 'string' ? { text: suggestion, value: suggestion } : suggestion) as {
				text: string,
				value: string;
				iconClass?: string
			};
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
				this.selected.emit(suggestion);
				this.setValue(suggestion);
				this.closeDropdown();
				ev.stopPropagation();
			});
			this.renderer.appendChild(this.dropdown.nativeElement, el);
		}
	}
	
	
	onEnter(ev: EventTarget | null) {
    const t = ev as HTMLInputElement;
    if (!this.disabled && t && t.value) {
      this.setValue(t?.value);
      this.renderer.setStyle(this.dropdown.nativeElement, 'display', 'none');
    }
  }

  getText(d: AutocompleteItem) {
		if (d == null) return '';
    return typeof d === 'string' ? d : d?.text;
  }
	
	private handleOutsideEvent(event: Event) {
		const target = event.target as HTMLElement;
		
		const path: EventTarget[] = (event as any).composedPath ? (event as any).composedPath() : [];
		
		const clickedInsideHost = this.hostRef?.nativeElement?.contains(target);
		const clickedInsideDropdown = this.dropdown?.nativeElement?.contains ? this.dropdown.nativeElement.contains(target) : false;
		const clickedInPath = path.length ? path.some(p => p === this.hostRef.nativeElement || p === this.dropdown.nativeElement) : false;
		
		if (!(clickedInsideHost || clickedInsideDropdown || clickedInPath)) {
			this.closeDropdown();
		}
	}
	
	openDropdown() {
		if (!this.dropdown || this.isOpen) return;
		this.renderer.setStyle(this.dropdown.nativeElement, 'display', 'block');
		this.isOpen = true;
	}
	
	closeDropdown() {
		if (!this.dropdown || !this.isOpen) return;
		this.renderer.setStyle(this.dropdown.nativeElement, 'display', 'none');
		this.isOpen = false;
		this.clearDropdown();
		this.acLoading = false;
	}
	
	clearDropdown() {
		if (!this.dropdown) return;
		while (this.dropdown.nativeElement.firstChild) {
			this.dropdown.nativeElement.removeChild(this.dropdown.nativeElement.lastChild!);
		}
	}
}
