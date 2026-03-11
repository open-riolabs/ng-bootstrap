import {
  booleanAttribute,
  Component,
  computed,
  ElementRef,
  HostListener,
  input,
  model,
  numberAttribute,
  Optional,
  output,
  Self,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { DateTz } from '@open-rlb/date-tz';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AbstractComponent } from './abstract-field.component';
import { AutocompleteItem } from './autocomplete-model';

@Component({
  selector: 'rlb-autocomplete-timezones',
  template: `
    <ng-content select="[before]"></ng-content>
    <div class="input-group has-validation position-relative">
      <input
        #field
        [id]="id"
        class="form-control"
        type="text"
        [value]="value || ''"
        autocomplete="off"
        [attr.disabled]="disabled() ? true : undefined"
        [attr.readonly]="readonly() ? true : undefined"
        [attr.placeholder]="placeholder()"
        [class.form-control-lg]="size() === 'large'"
        [class.form-control-sm]="size() === 'small'"
        (blur)="touch()"
        [ngClass]="{
          'is-invalid': control?.touched && control?.invalid,
          'is-valid': control?.touched && control?.valid,
        }"
        (input)="update($event.target)"
        (keyup.enter)="onEnter($event.target)"
      />
      @if (errors() && showError()) {
        <rlb-input-validation [errors]="errors()" />
      }

      <!-- Dropdown Logic -->
      @if (isOpen()) {
        <div
          #autocomplete
          class="dropdown-menu show w-100 position-absolute overflow-y-auto"
          [style.max-height.px]="maxHeight()"
          style="z-index: 1000; top: 100%;"
        >
          @if (!hasSuggestions()) {
            <a class="dropdown-item disabled text-center">No suggestions</a>
          } @else {
            @for (item of suggestions(); track item.value) {
              <a
                class="dropdown-item"
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
    @if (loading()) {
      <rlb-progress
        [height]="2"
        [infinite]="loading()"
        color="primary"
        class="w-100"
      />
    }
    <ng-content select="[after]"></ng-content>
  `,
  standalone: false,
})
export class AutocompleteTimezonesComponent
  extends AbstractComponent<string>
  implements ControlValueAccessor
{
  // State
  isOpen = signal(false);
  protected suggestions = signal<AutocompleteItem[]>([]);
  protected hasSuggestions = computed(() => this.suggestions().length > 0);
  private typingTimeout: any;

  // Inputs
  disabled = model(false);
  readonly = input(false, { transform: booleanAttribute });
  placeholder = input('', { alias: 'placeholder' });
  size = input<'small' | 'large' | undefined>(undefined);
  maxHeight = input(200, { transform: numberAttribute, alias: 'max-height' });
  loading = input(false, { transform: booleanAttribute, alias: 'loading' });
  userDefinedId = input('', { alias: 'id', transform: (v: string) => v || '' });

  enableFlagIcons = input(false, { transform: booleanAttribute, alias: 'enable-flag-icons' });

  // View Children
  el = viewChild<ElementRef<HTMLInputElement>>('field');
  dropdown = viewChild<ElementRef<HTMLElement>>('autocomplete');
  selected = output<string>();

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
    private readonly hostRef: ElementRef<HTMLElement>,
    @Self() @Optional() override control?: NgControl,
  ) {
    super(idService, control);
  }

  update(ev: EventTarget | null) {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);

    this.typingTimeout = setTimeout(() => {
      if (!this.disabled()) {
        const t = ev as HTMLInputElement;
        this.manageSuggestions(t?.value);
      }
    }, 200);
  }

  override onWrite(data: string): void {
    const field = this.el();
    if (field && field.nativeElement) {
      // Timezones are simple strings, so we just set the value
      field.nativeElement.value = data || '';
    }
  }

  manageSuggestions(query: string) {
    this.suggestions.set([]);

    if (query && query.length > 0) {
      this.openDropdown();

      const timezones = DateTz.timezones();
      const filtered = timezones.filter(tz => tz.toLowerCase().includes(query.toLowerCase()));

      // Map string[] to AutocompleteItem[] for the template
      this.suggestions.set(
        filtered.map(tz => ({
          text: tz,
          value: tz,
        })),
      );
    } else {
      this.closeDropdown();
    }
  }

  selectItem(item: AutocompleteItem, ev?: Event) {
    ev?.stopPropagation();
    const val = item.value;

    this.selected.emit(val);
    this.setValue(val);
    this.closeDropdown();

    const field = this.el();
    if (field?.nativeElement) {
      field.nativeElement.value = val;
    }
  }

  onEnter(ev: EventTarget | null) {
    const t = ev as HTMLInputElement;
    if (!this.disabled() && t && t.value) {
      this.setValue(t.value);
      this.closeDropdown();
    }
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
  }
}
