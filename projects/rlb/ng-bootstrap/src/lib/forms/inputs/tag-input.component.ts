import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  numberAttribute,
  output,
  viewChild,
} from '@angular/core';
import { BadgeComponent } from '../../components/badges/badge.component';
import { RLB_ICONS } from '../../shared/icons';
import { AbstractComponent } from './abstract-field.component';

/**
 * Free-text tags, made as you type them.
 *
 * `rlb-select-chips` already existed but is bound to a list of options: it can only offer what it
 * was given. This is the other half — labels, skills, recipients, anything the user invents on the
 * spot — with `suggestions` as a hint rather than a constraint.
 */
@Component({
  selector: 'rlb-tag-input',
  template: `
    <div
      class="form-control d-flex flex-wrap align-items-center gap-1 rlb-tag-field"
      [class.is-invalid]="showError() && invalid()"
      [class.is-valid]="showError() && !invalid()"
      [class.disabled]="isDisabled()"
      (click)="focusField()"
    >
      @for (tag of tags(); track tag) {
        <span
          rlb-badge
          pill
          color="secondary"
          class="d-inline-flex align-items-center gap-1 flex-shrink-0"
        >
          {{ tag }}
          @if (!isDisabled() && !readonly()) {
            <button
              type="button"
              class="btn btn-sm p-0 border-0 lh-1 text-reset"
              [attr.aria-label]="removeLabel() + ' ' + tag"
              (click)="remove(tag); $event.stopPropagation()"
            >
              <i [class]="icons.close" style="font-size: 0.7em" aria-hidden="true"></i>
            </button>
          }
        </span>
      }

      <input
        #field
        type="text"
        class="border-0 flex-grow-1 bg-transparent rlb-tag-entry"
        autocomplete="off"
        [id]="id()"
        [attr.list]="suggestions().length ? listId : null"
        [attr.placeholder]="tags().length ? '' : (placeholder() ?? '')"
        [attr.aria-label]="ariaLabel()"
        [disabled]="isDisabled()"
        [readonly]="readonly()"
        (keydown)="onKeydown($event)"
        (blur)="onBlur($event)"
      />

      @if (suggestions().length) {
        <datalist [id]="listId">
          @for (suggestion of suggestions(); track suggestion) {
            <option [value]="suggestion"></option>
          }
        </datalist>
      }
    </div>
  `,
  styles: `
    .rlb-tag-field {
      min-height: calc(1.5em + 0.75rem + calc(var(--bs-border-width, 1px) * 2));
      height: auto;
      cursor: text;
    }
    .rlb-tag-field.disabled {
      background-color: var(--bs-secondary-bg);
      pointer-events: none;
    }
    .rlb-tag-entry {
      min-width: 6rem;
      outline: none;
    }
  `,
  host: { '[attr.id]': 'null' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BadgeComponent],
})
export class TagInputComponent extends AbstractComponent<string[]> {
  protected icons = inject(RLB_ICONS);

  disabled = input(false, { transform: booleanAttribute });
  readonly = input(false, { transform: booleanAttribute });
  placeholder = input<string | undefined>(undefined);
  protected userDefinedId = input<string | undefined>(undefined, { alias: 'inputId' });

  /** Offered as a datalist. A hint, not a constraint: anything else is still accepted. */
  suggestions = input<string[]>([]);
  /** Keys that end a tag, besides Enter. */
  separators = input<string[]>([',']);
  maxTags = input<number | undefined>(undefined, {
    alias: 'max-tags',
    transform: (v: unknown) => (v === undefined || v === null || v === '' ? undefined : numberAttribute(v)),
  });
  allowDuplicates = input(false, { alias: 'allow-duplicates', transform: booleanAttribute });
  /** Trims and lowercases before comparing, so «Angular» and «angular » are the same tag. */
  caseSensitive = input(false, { alias: 'case-sensitive', transform: booleanAttribute });

  ariaLabel = input('Tags');
  removeLabel = input('Remove');

  /** Someone tried to add a tag that was refused, and why. */
  rejected = output<{ value: string; reason: 'duplicate' | 'full' }>();

  /** Through the same counter as every other id here, so it is the same on a server render. */
  protected readonly listId = 'rlb-tags' + this.idService.id;
  private field = viewChild<ElementRef<HTMLInputElement>>('field');

  isDisabled = computed(() => this.disabled() || this.cvaDisabled());
  protected tags = computed(() => this.value() ?? []);
  protected full = computed(() => {
    const max = this.maxTags();
    return max !== undefined && this.tags().length >= max;
  });

  protected focusField() {
    if (!this.isDisabled()) this.field()?.nativeElement.focus();
  }

  add(raw: string): boolean {
    const tag = raw.trim();
    if (tag === '' || this.isDisabled() || this.readonly()) return false;

    if (this.full()) {
      this.rejected.emit({ value: tag, reason: 'full' });
      return false;
    }

    if (!this.allowDuplicates() && this.contains(tag)) {
      this.rejected.emit({ value: tag, reason: 'duplicate' });
      return false;
    }

    this.setValue([...this.tags(), tag]);
    return true;
  }

  private contains(tag: string): boolean {
    const same = (a: string, b: string) =>
      this.caseSensitive() ? a === b : a.toLowerCase() === b.toLowerCase();
    return this.tags().some(existing => same(existing, tag));
  }

  remove(tag: string) {
    if (this.isDisabled() || this.readonly()) return;
    this.setValue(this.tags().filter(existing => existing !== tag));
    this.touch();
  }

  protected onKeydown(event: KeyboardEvent) {
    const element = event.target as HTMLInputElement;

    if (event.key === 'Enter' || this.separators().includes(event.key)) {
      event.preventDefault();
      if (this.add(element.value)) element.value = '';
      return;
    }

    // Backspace in an empty box takes back the last tag — the one thing everyone tries.
    if (event.key === 'Backspace' && element.value === '') {
      const tags = this.tags();
      if (tags.length) {
        event.preventDefault();
        this.remove(tags[tags.length - 1]);
      }
    }
  }

  /** Leaving the field commits whatever was half-typed rather than silently dropping it. */
  protected onBlur(event: Event) {
    const element = event.target as HTMLInputElement;
    if (this.add(element.value)) element.value = '';
    this.touch();
  }
}
