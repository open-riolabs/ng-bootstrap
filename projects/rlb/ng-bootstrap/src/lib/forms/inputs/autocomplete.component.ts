import {
  booleanAttribute,
  Component,
  ElementRef,
  HostListener,
  input,
  model,
  numberAttribute,
  Optional,
  output,
  Renderer2,
  Self,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { lastValueFrom, Observable } from 'rxjs';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractComponent } from './abstract-field.component';
import { AutocompleteFn, AutocompleteItem } from "./autocomplete-model";


@Component({
  selector: 'rlb-autocomplete',
  template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
      <input
        #field
        [id]="id"
        class="form-control"
        [type]="type()"
        [attr.autocomplete]="inputAutocomplete()"
        [attr.disabled]="disabled() ? true : undefined"
        [attr.readonly]="readonly() ? true : undefined"
        [attr.placeholder]="placeholder()"
        [class.form-control-lg]="size() === 'large'"
        [class.form-control-sm]="size() === 'small'"
        [value]="getText(value)"
        (blur)="touch()"
				[ngClass]="{
        'is-invalid': control?.touched && control?.invalid && enableValidation(),
        'is-valid': control?.touched && control?.valid && enableValidation()
        }"
        (input)="update($event.target)"
        (keyup.enter)="onEnter($event.target)"
        />
        @if (errors() && showError() && enableValidation()) {
          <rlb-input-validation [errors]="errors()"/>
        }
      </div>
      @if (loading() || acLoading()) {
        <rlb-progress
          [height]="2"
          [infinite]="loading() || acLoading()"
          color="primary"
          class="w-100"
          />
      }
      <ng-content select="[after]"></ng-content>
      <div
        #autocomplete
        [id]="id+'-ac'"
        class="dropdown-menu overflow-y-auto w-100 position-absolute"
        aria-labelledby="dropdownMenu"
        [style.max-height.px]="maxHeight()"
        [style.width]="'fit-content !important'"
      [style.max-width.px]="menuMaxWidth()"></div>
    `,
  standalone: false,
  host: {
    style: 'position: relative;',
  }
})
export class AutocompleteComponent
  extends AbstractComponent<AutocompleteItem>
  implements ControlValueAccessor {
  acLoading = signal(false);
  private typingTimeout: any;
  isOpen = signal(false);

  disabled = model(false);
  readonly = input(false, { transform: booleanAttribute, alias: 'readonly' });
  loading = input(false, { transform: booleanAttribute, alias: 'loading' });
  maxHeight = input(200, { transform: numberAttribute, alias: 'max-height' });
  placeholder = input('', { alias: 'placeholder' });
  autocomplete = input<AutocompleteFn>(() => { return []; }, { alias: 'autocomplete' });
  type = input<'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url' | string>('text', { alias: 'type' });
  size = input<'small' | 'large' | undefined>(undefined);
  charsToSearch = input(3, { alias: 'chars-to-search', transform: numberAttribute });
  menuMaxWidth = input(400, { alias: 'menu-max-width', transform: numberAttribute });
  userDefinedId = input('', { alias: 'id', transform: (v: string) => v || '' });
  enableValidation = input(false, { transform: booleanAttribute, alias: 'enable-validation' });
  inputAutocomplete = input('one-time-code');

  el = viewChild<ElementRef<HTMLInputElement>>('field');
  dropdown = viewChild<ElementRef<HTMLElement>>('autocomplete');
  selected = output<AutocompleteItem>();

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent) {
    this.handleOutsideEvent(event);
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: Event) {
    if (this.isOpen()) {
      this.closeDropdown();
      this.el()?.nativeElement?.blur();
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
      if (!this.disabled()) {
        const t = ev as HTMLInputElement;
        this.manageSuggestions(t?.value);
      }
    }, 500);
  }

  override onWrite(data: AutocompleteItem): void {
    const field = this.el();
    if (field && field.nativeElement) {
      if (typeof data === 'string') {
        field.nativeElement.value = data;
      } else {
        field.nativeElement.value = data?.text;
      }
    }
  }

  manageSuggestions(data: string) {
    this.clearDropdown();
    if (data && data.length >= this.charsToSearch()) {
      this.openDropdown();
      const suggestions = this.autocomplete()(data);
      if (suggestions instanceof Promise) {
        this.acLoading.set(true);
        suggestions.then(s => this.renderAc(s)).finally(() => (this.acLoading.set(false)));
      } else if (suggestions instanceof Observable) {
        this.acLoading.set(true);
        lastValueFrom(suggestions).then(s => this.renderAc(s)).finally(() => (this.acLoading.set(false)));
      } else {
        this.renderAc(suggestions);
      }
    } else {
      this.closeDropdown();
    }
  }

  renderAc(suggestions: Array<string | AutocompleteItem>) {
    const dropdown = this.dropdown();
    if (!dropdown) return;
    this.clearDropdown();
    if (!suggestions || suggestions.length === 0) {
      const el = this.renderer.createElement('a');
      this.renderer.addClass(el, 'dropdown-item');
      this.renderer.addClass(el, 'disabled');
      this.renderer.addClass(el, 'text-center');
      this.renderer.setAttribute(el, 'disabled', 'true');
      this.renderer.appendChild(el, this.renderer.createText('No suggestions'));
      this.renderer.appendChild(dropdown.nativeElement, el);
      return;
    }

    for (const suggestion of suggestions) {
      const itemData: AutocompleteItem = typeof suggestion === 'string'
        ? { text: suggestion, value: suggestion }
        : suggestion;

      const el = this.renderer.createElement('a');
      this.renderer.addClass(el, 'dropdown-item');

      if (itemData.iconClass) {
        const icon = this.renderer.createElement('i');

        const classes = itemData.iconClass.split(/\s+/);
        for (const cls of classes) {
          if (cls) {
            this.renderer.addClass(icon, cls);
          }
        }
        this.renderer.addClass(icon, 'me-2');
        this.renderer.appendChild(el, icon);
      }

      this.renderer.appendChild(el, this.renderer.createText(itemData.text));

      this.renderer.listen(el, 'click', (ev: Event) => {
        this.selected.emit(itemData);
        this.setValue(itemData);
        this.closeDropdown();
        ev.stopPropagation();
      });
      this.renderer.appendChild(dropdown.nativeElement, el);
    }
  }


  onEnter(ev: EventTarget | null) {
    const t = ev as HTMLInputElement;
    const dropdown = this.dropdown();
    if (!this.disabled() && t && t.value && dropdown) {
      const item: AutocompleteItem = {
        text: t.value,
        value: t.value
      };
      this.setValue(item);
      this.renderer.setStyle(dropdown.nativeElement, 'display', 'none');
    }
  }

  getText(d: AutocompleteItem) {
    if (d == null) return '';
    return typeof d === 'string' ? d : d?.text;
  }

  private handleOutsideEvent(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = this.dropdown();

    const path: EventTarget[] = (event as any).composedPath ? (event as any).composedPath() : [];

    const clickedInsideHost = this.hostRef?.nativeElement?.contains(target);
    const clickedInsideDropdown = dropdown?.nativeElement?.contains ? dropdown.nativeElement.contains(target) : false;
    const clickedInPath = path.length ? path.some(p => p === this.hostRef.nativeElement || (dropdown && p === dropdown.nativeElement)) : false;

    if (!(clickedInsideHost || clickedInsideDropdown || clickedInPath)) {
      this.closeDropdown();
    }
  }

  openDropdown() {
    const dropdown = this.dropdown();
    if (!dropdown || this.isOpen()) return;
    this.renderer.setStyle(dropdown.nativeElement, 'display', 'block');
    this.isOpen.set(true);
  }

  closeDropdown() {
    const dropdown = this.dropdown();
    if (!dropdown || !this.isOpen()) return;
    this.renderer.setStyle(dropdown.nativeElement, 'display', 'none');
    this.isOpen.set(false);
    this.clearDropdown();
    this.acLoading.set(false);
  }

  clearDropdown() {
    const dropdown = this.dropdown();
    if (!dropdown) return;
    while (dropdown.nativeElement.firstChild) {
      dropdown.nativeElement.removeChild(dropdown.nativeElement.lastChild!);
    }
  }
}
