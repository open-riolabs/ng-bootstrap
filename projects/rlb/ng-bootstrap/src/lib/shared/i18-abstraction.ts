import { InjectionToken } from '@angular/core';


export interface RlbTranslationService {
	instant(key: string, params?: { [key: string]: any }): string;
}

export const RLB_TRANSLATION_SERVICE = new InjectionToken<RlbTranslationService>(
	'RLB_TRANSLATION_SERVICE_TOKEN'
);