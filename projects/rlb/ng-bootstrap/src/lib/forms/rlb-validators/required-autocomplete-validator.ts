import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AutocompleteItem } from "../inputs";

export function requiredAutocompleteValue(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;
		
		if (value === null || value === undefined) {
			return { required: true };
		}
		
		if (typeof value === 'object' && value !== null && 'value' in value) {
			const item = value as AutocompleteItem;
			if (item.value === null || item.value === undefined || item.value.trim() === '') {
				return { required: true };
			}
		} else if (typeof value === 'string') {
			if (value.trim() === '') {
				return { required: true };
			}
		}
		
		return null;
	};
}