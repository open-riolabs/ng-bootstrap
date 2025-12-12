import { booleanAttribute, Component, Input, Optional, Renderer2, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { DateTz } from '@open-rlb/date-tz';
import { UniqueIdService } from '../../shared/unique-id.service';
import { AutocompleteItem } from "./autocomplete-model";
import { AbstractAutocompleteComponent } from "./abstract-autocomplete.component";

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
				[attr.autocomplete]="'off'"
				[class.form-control-lg]="size === 'large'"
        [class.form-control-sm]="size === 'small'"
        (blur)="touch()"
				[ngClass]="{
        'is-invalid': control?.touched && control?.invalid,
        'is-valid': control?.touched && control?.valid
        }"
        (input)="update($event.target)"
      />
			<rlb-input-validation *ngIf="errors && showError" [errors]="errors"/>
		</div>
		<rlb-progress
			*ngIf="loading || acLoading"
			[height]="2"
			[infinite]="loading || acLoading"
			color="primary"
			class="w-100"
		/>
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
	extends AbstractAutocompleteComponent
  implements ControlValueAccessor {

	@Input({ transform: booleanAttribute, alias: 'enable-flag-icons' }) enableFlagIcons?: boolean = false;

  constructor(
		idService: UniqueIdService,
		renderer: Renderer2,
		@Self() @Optional() override control?: NgControl,
	) {
		super(idService, renderer, control);
	}

  protected override getSuggestions(query: string) {
		this.clearDropdown();
		this.activeIndex = -1;

    if (query && query.length > 0) {
			this.openDropdown();
      const timezones = DateTz.timezones()
      const suggestions = timezones.filter(o => {
				return o.toLowerCase().includes(query.toLowerCase());
			});
			this.renderAc(suggestions);
		} else {
			this.closeDropdown();
		}
	}

  protected override getItemText(data?: AutocompleteItem | string): string {
		if (typeof data === 'object' && data !== null && 'text' in data) {
			return (data as AutocompleteItem).text || '';
		} else if (typeof data === 'string') {
			return data || '';
		}
		return '';
	}
}
