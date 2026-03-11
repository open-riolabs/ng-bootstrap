import { Component, Inject, model, Optional } from "@angular/core";
import { ValidationErrors } from "@angular/forms";
import { RLB_TRANSLATION_SERVICE, RlbTranslationService } from "../../shared/i18-abstraction";

@Component({
	selector: 'rlb-input-validation',
	host: { class: 'invalid-feedback' },
	template: `
		@if (errors()) {
		  @for (errorKey of getErrorKeys(errors()); track errorKey) {
		    <span>
		      {{ getTranslatedError(errorKey, errors()[errorKey]) }}
		    </span>
		  }
		}
		`,
	standalone: false
})
export class InputValidationComponent {
	errors = model<ValidationErrors>({}, { alias: 'errors' });

	constructor(
		@Optional() @Inject(RLB_TRANSLATION_SERVICE) private translationService: RlbTranslationService | null
	) {
	}

	getErrorKeys(errors: ValidationErrors | null | undefined): string[] {
		if (!errors) return [];
		return Object.keys(errors);
	}

	getTranslatedError(errorKey: string, errorValue: any): string {
		const i18nKey = `common.form.validation.${errorKey}`; // Create i18n key ex: 'common.form.validation.required'

		if (this.translationService) {
			return this.translationService.instant(i18nKey, errorValue);
		}

		// fallback
		return `${i18nKey}: ${JSON.stringify(errorValue)}`;
	}
}
