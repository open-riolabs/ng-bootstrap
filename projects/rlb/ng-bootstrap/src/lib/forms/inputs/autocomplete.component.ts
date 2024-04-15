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
  numberAttribute,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Observable, lastValueFrom } from 'rxjs';
import { AbstractComponent } from './abstract-field.component';
import { UniqueIdService } from '../../shared/unique-id.service';

export type AutocompleteItem = string | { text: string, value: string }
export type AutocompleteFn = (q?: string) => AutocompleteItem[] | Promise<AutocompleteItem[]> | Observable<AutocompleteItem[]>

@Component({
  selector: 'rlb-autocomplete',
  template: `
    <div class="input-group has-validation">
      <ng-content select="[before]"></ng-content>
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
      <rlb-progress class="w-100" [height]="2" [infinite]="loading || acLoading" color="primary" />
      <ng-content select="[after]"></ng-content>
      <div class="invalid-feedback">
        {{ errors | json }}
      </div>
      <div
        #autocomplete
        [id]="id+'-ac'"
        class="dropdown-menu overflow-y-auto w-100 position-relative"
        aria-labelledby="dropdownMenu"
        [style.max-height.px]="maxHeight"></div>
    </div>`,
})
export class AutocompleteComponent
  extends AbstractComponent<AutocompleteItem>
  implements ControlValueAccessor {
  @Input({ transform: booleanAttribute, alias: 'disabled' }) disabled? = false;
  @Input({ transform: booleanAttribute, alias: 'readonly' }) readonly? = false;
  @Input({ transform: booleanAttribute, alias: 'before-text' }) beforeText?: boolean = false;
  @Input({ transform: booleanAttribute, alias: 'loading' }) loading?: boolean = false;
  @Input({ transform: numberAttribute, alias: 'max-height' }) maxHeight?: number = 200;
  @Input() placeholder?: string = '';
  @Input({ alias: 'autocomplete' }) autocomplete: AutocompleteFn = () => { return [] };
  @Input() type?:
    | 'text'
    | 'email'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'url'
    | string = 'text';
  @Input() size?: 'small' | 'large' | undefined = undefined;
  @ViewChild('field') el!: ElementRef<HTMLInputElement>;
  @ViewChild('autocomplete') dropdown!: ElementRef<HTMLElement>;
  @Output() selected: EventEmitter<AutocompleteItem> = new EventEmitter<AutocompleteItem>();
  acLoading: boolean = false;

  constructor(
    idService: UniqueIdService,
    private readonly renderer: Renderer2,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);
  }

  update(ev: EventTarget | null) {
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
      const suggestions = this.autocomplete(data);
      if (suggestions instanceof Promise) {
        this.acLoading = true;
        suggestions.then((suggestions) => {
          this.renderAc(suggestions);
        });
        suggestions.finally(() => {
          this.acLoading = false;
        });
      }
      else if (suggestions instanceof Observable) {
        this.acLoading = true;
        const prm = lastValueFrom(suggestions);
        prm.then((suggestions) => {
          this.renderAc(suggestions);
        });
        prm.finally(() => {
          this.acLoading = false;
        });
      } else {
        this.renderAc(suggestions);
      }
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
      this.renderer.setAttribute(el, 'disabled', 'true')
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
    return typeof d === 'string' ? d : d?.text;
  }
}
