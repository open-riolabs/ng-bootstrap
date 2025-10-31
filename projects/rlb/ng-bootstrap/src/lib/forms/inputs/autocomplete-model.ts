import { Observable } from "rxjs";

export interface AutocompleteItem<T = any> {
	text: string;
	value: string;
	iconClass?: string;
	data?: T
}

export type AutocompleteFn = (q?: string) => Array<AutocompleteItem | string> | Promise<Array<AutocompleteItem | string>> | Observable<Array<AutocompleteItem | string>>;