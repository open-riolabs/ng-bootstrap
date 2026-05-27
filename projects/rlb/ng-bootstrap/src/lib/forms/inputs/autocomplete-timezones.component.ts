import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
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
import { NgClass } from '@angular/common';
import { InputValidationComponent } from './input-validation.component';
import { ProgressComponent } from '../../components/loaders/progress.component';

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
        (focus)="onFocus()"
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
          class="dropdown-menu show overflow-y-auto shadow"
          [style.max-height.px]="maxHeight()"
          [style.max-width.px]="menuMaxWidth()"
          [style.top.px]="dropdownTop()"
          [style.left.px]="dropdownLeft()"
          [style.width.px]="dropdownWidth()"
          style="z-index: 1050; position: fixed;"
        >
          @if (!hasSuggestions()) {
            <a class="dropdown-item disabled text-center italic">No suggestions</a>
          } @else {
            @for (item of suggestions(); track item.value) {
              <a
                class="dropdown-item"
                (mousedown)="selectItem(item, $event)"
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, InputValidationComponent, ProgressComponent],
})
export class AutocompleteTimezonesComponent extends AbstractComponent<string> {
  isOpen = signal(false);
  dropdownTop = signal(0);
  dropdownLeft = signal(0);
  dropdownWidth = signal(0);
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
  openOnFocus = input(false, { transform: booleanAttribute, alias: 'open-on-focus' });

  el = viewChild<ElementRef<HTMLInputElement>>('field');
  dropdown = viewChild<ElementRef<HTMLElement>>('autocomplete');
  selected = output<string>();

  private readonly hostRef = inject(ElementRef<HTMLElement>);

  constructor() {
    super();
    const destroyRef = inject(DestroyRef);
    const onScroll = (event: Event) => {
      if (!this.isOpen()) return;
      if (this.dropdown()?.nativeElement.contains(event.target as Node)) return;
      this.closeDropdown();
    };
    document.addEventListener('scroll', onScroll, { capture: true });
    destroyRef.onDestroy(() => document.removeEventListener('scroll', onScroll, { capture: true }));
  }

  onEscape(event: Event) {
    if (this.isOpen()) {
      this.closeDropdown();
      this.el()?.nativeElement?.blur();
    }
  }

  onFocus() {
    if (this.openOnFocus() && !this.isOpen()) {
      this.manageSuggestions('', true);
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

  manageSuggestions(query: string, showAll = false) {
    if (showAll || (query && query.length > 0)) {
      this.openDropdown();
      const timezones = DateTz.timezones();
      const filtered = showAll && !query
        ? timezones
        : timezones.filter(tz => tz.toLowerCase().includes(query.toLowerCase()));
      this.suggestions.set(filtered.map(tz => ({ text: tz, value: tz })));
    } else {
      this.closeDropdown();
    }
  }

  selectItem(item: AutocompleteItem, ev?: Event) {
    ev?.preventDefault();
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
    const rect = this.el()?.nativeElement.getBoundingClientRect();
    if (rect) {
      this.dropdownTop.set(rect.bottom);
      this.dropdownLeft.set(rect.left);
      this.dropdownWidth.set(rect.width);
    }
    this.isOpen.set(true);
  }
  closeDropdown() {
    this.isOpen.set(false);
  }
}
