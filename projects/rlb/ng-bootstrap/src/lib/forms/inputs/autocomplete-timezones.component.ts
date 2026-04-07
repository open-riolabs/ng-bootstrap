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
import { DateTz } from '@open-rlb/date-tz';
import { AbstractComponent } from './abstract-field.component';
import { AutocompleteItem } from './autocomplete-model';

@Component({
  selector: 'rlb-autocomplete-timezones',
  template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation position-relative">
      <input
        #field
        [id]="id()"
        class="form-control"
        type="text"
        [value]="value() || ''"
        autocomplete="off"
        [attr.disabled]="disabled() ? true : undefined"
        [attr.readonly]="readonly() ? true : undefined"
        [attr.placeholder]="placeholder()"
        [class.form-control-lg]="size() === 'large'"
        [class.form-control-sm]="size() === 'small'"
        (blur)="touch()"
        [ngClass]="{
          'is-invalid': controlTouched() && invalid() && enableValidation(),
          'is-valid': controlTouched() && !invalid() && enableValidation(),
        }"
        (input)="update($event.target)"
        (keyup.enter)="onEnter($event.target)"
      />

      @if (showError()) {
        <rlb-input-validation [errors]="errors()" />
      }

      <!-- Dropdown Logic -->
      @if (isOpen()) {
        <div
          #autocomplete
          class="dropdown-menu show w-100 position-absolute overflow-y-auto shadow"
          [style.max-height.px]="maxHeight()"
          [style.max-width.px]="menuMaxWidth()"
          style="z-index: 1000; top: 100%;"
        >
          @if (!hasSuggestions()) {
            <a class="dropdown-item disabled text-center italic">No suggestions</a>
          } @else {
            @for (item of suggestions(); track item.value) {
              <a
                class="dropdown-item"
                (click)="selectItem(item, $event)"
                style="cursor: pointer"
              >
                {{ item.text }}
              </a>
            }
          }
        </div>
      }
    </div>
    @if (loading()) {
      <rlb-progress
        [height]="2"
        [infinite]="true"
        color="primary"
        class="w-100"
      />
    }
    <ng-content select="[after]"></ng-content>
  `,
  host: {
    '(document:pointerdown)': 'handleOutsideEvent($event)',
    '(document:keydown.escape)': 'onEscape($event)',
    '[attr.id]': 'null',
  },
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteTimezonesComponent extends AbstractComponent<string> {
  isOpen = signal(false);
  protected suggestions = signal<AutocompleteItem[]>([]);
  protected hasSuggestions = computed(() => this.suggestions().length > 0);
  private typingTimeout: any;

  disabled = model(false);
  readonly = input(false, { transform: booleanAttribute });
  placeholder = input('', { alias: 'placeholder' });
  size = input<'small' | 'large' | undefined>(undefined);
  maxHeight = input(200, { transform: numberAttribute, alias: 'max-height' });
  menuMaxWidth = input(null, { alias: 'menu-max-width', transform: numberAttribute });
  loading = input(false, { transform: booleanAttribute });
  userDefinedId = input('', { alias: 'id', transform: (v: string) => v || '' });
  enableValidation = input(false, { transform: booleanAttribute, alias: 'enable-validation' });

  el = viewChild<ElementRef<HTMLInputElement>>('field');
  dropdown = viewChild<ElementRef<HTMLElement>>('autocomplete');
  selected = output<string>();

  private readonly hostRef = inject(ElementRef<HTMLElement>);

  constructor() {
    super();
  }

  onEscape(event: Event) {
    if (this.isOpen()) {
      this.closeDropdown();
      this.el()?.nativeElement?.blur();
    }
  }

  update(ev: EventTarget | null) {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      if (!this.disabled()) {
        this.manageSuggestions((ev as HTMLInputElement)?.value);
      }
    }, 200);
  }

  // We leave onWrite empty because [value]="value() || ''" in the template
  // handles the synchronization automatically in a Zoneless/Signal world.
  override onWrite(data: string | undefined): void {}

  manageSuggestions(query: string) {
    if (query && query.length > 0) {
      this.openDropdown();
      const timezones = DateTz.timezones();
      const filtered = timezones.filter(tz => tz.toLowerCase().includes(query.toLowerCase()));

      this.suggestions.set(filtered.map(tz => ({ text: tz, value: tz })));
    } else {
      this.closeDropdown();
    }
  }

  selectItem(item: AutocompleteItem, ev?: Event) {
    ev?.stopPropagation();
    const val = item.value as string;
    this.selected.emit(val);
    this.setValue(val);
    this.closeDropdown();
  }

  onEnter(ev: EventTarget | null) {
    const t = ev as HTMLInputElement;
    if (!this.disabled() && t?.value) {
      this.setValue(t.value);
      this.closeDropdown();
    }
  }

  handleOutsideEvent(event: Event) {
    if (!this.isOpen()) return;
    const target = event.target as HTMLElement;
    const isInside =
      this.hostRef.nativeElement.contains(target) ||
      this.dropdown()?.nativeElement.contains(target);
    if (!isInside) this.closeDropdown();
  }

  openDropdown() {
    this.isOpen.set(true);
  }
  closeDropdown() {
    this.isOpen.set(false);
  }
}
