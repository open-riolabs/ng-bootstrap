import { Component, Inject, Input, Optional } from "@angular/core";
import { ValidationErrors } from "@angular/forms";
import { RLB_TRANSLATION_SERVICE, RlbTranslationService } from "../../shared/i18-abstraction";

@Component({
    selector: 'rlb-input-validation',
    host: { class: 'invalid-feedback' },
	template: `
		<ng-container *ngIf="errors">
			<p *ngFor="let errorKey of getErrorKeys(errors)">
				{{ getTranslatedError(errorKey, errors[errorKey]) }}
			</p>
		</ng-container>
	`,
    standalone: false
})
export class InputValidationComponent {
  @Input({ alias: 'errors' }) public errors!: ValidationErrors;
	
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
