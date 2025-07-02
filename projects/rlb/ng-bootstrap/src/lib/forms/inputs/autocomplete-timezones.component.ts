import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Optional,
  Output,
  Renderer2,
  Self,
  ViewChild,
  booleanAttribute,
  numberAttribute
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { timezones } from '@open-rlb/date-tz';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractComponent } from './abstract-field.component';
import { AutocompleteItem } from './autocomplete.component';

@Component({
  selector: 'rlb-autocomplete-timezones',
  template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation">
      <input
        #field
        [id]="id"
        class="form-control"
        type="text"
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
      class="dropdown-menu overflow-y-auto w-100 position-relative"
      aria-labelledby="dropdownMenu"
      [style.max-height.px]="maxHeight">
    </div>
   `,
  standalone: false
})
export class AutocompleteTimezonesComponent
  extends AbstractComponent<AutocompleteItem>
  implements ControlValueAccessor {
  acLoading: boolean = false;
  private typingTimeout: any;

  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled? = false;
  @Input({ transform: booleanAttribute, alias: 'readonly' }) readonly? = false;
  @Input({ transform: booleanAttribute, alias: 'before-text' }) beforeText?: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'loading' }) loading?: boolean = false;
  @Input({ transform: numberAttribute, alias: 'max-height' }) maxHeight?: number = 200;
  @Input({ alias: 'placeholder' }) placeholder?: string = '';
  @Input() size?: 'small' | 'large' | undefined;
  @Input({ alias: 'id', transform: (v: string) => v || '' }) userDefinedId: string = '';

  @ViewChild('field') el!: ElementRef<HTMLInputElement>;
  @ViewChild('autocomplete') dropdown!: ElementRef<HTMLElement>;
  @Output() selected: EventEmitter<AutocompleteItem> = new EventEmitter<AutocompleteItem>();

  constructor(
    idService: UniqueIdService,
    private readonly renderer: Renderer2,
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
    if (!this.disabled) {
      const t = ev as HTMLInputElement;
      this.manageSuggestions(t?.value);
    }
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
    this.renderer.setStyle(this.dropdown.nativeElement, 'display', 'block');
    while (this.dropdown.nativeElement.firstChild) {
      if (this.dropdown.nativeElement.lastChild) {
        this.dropdown.nativeElement.removeChild(this.dropdown.nativeElement.lastChild);
      }
    }
    if (data && data.length > 0) {
      const suggestions = Object.keys(timezones).map(key => ({ text: key, value: key })).filter(o => {
        const _c = o as { text: string, value: string; };
        return _c.text.toLowerCase().startsWith(data.toLowerCase());
      });
      this.renderAc(suggestions);
    } else {
      this.renderer.setStyle(this.dropdown.nativeElement, 'display', 'none');
    }
  }

  renderAc(suggestions: AutocompleteItem[]) {
    if (suggestions.length > 0) {
      for (const suggestion of suggestions) {
        const el = this.renderer.createElement('a');
        this.renderer.addClass(el, 'dropdown-item');
        this.renderer.appendChild(el, this.renderer.createText(typeof suggestion === 'string' ? suggestion : suggestion.text));
        this.renderer.listen(el, 'click', () => {
          this.selected.emit(suggestion);
          this.setValue(suggestion);
          this.renderer.setStyle(this.dropdown.nativeElement, 'display', 'none');
        });
        this.renderer.appendChild(this.dropdown.nativeElement, el);
      }
    } else {
      const el = this.renderer.createElement('a');
      this.renderer.addClass(el, 'dropdown-item');
      this.renderer.addClass(el, 'disabled');
      this.renderer.addClass(el, 'text-center');
      this.renderer.setAttribute(el, 'disabled', 'true');
      this.renderer.appendChild(el, this.renderer.createText('No suggestions'));
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
    return typeof d === 'string' ? d : d?.text || '';
  }
}
