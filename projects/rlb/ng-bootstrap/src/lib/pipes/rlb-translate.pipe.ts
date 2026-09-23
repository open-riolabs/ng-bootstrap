import { inject, Pipe, PipeTransform } from '@angular/core';
import { RLB_TRANSLATION_SERVICE } from '../shared/i18-abstraction';

/**
 * Translates a key through whatever translation service the application registered on
 * {@link RLB_TRANSLATION_SERVICE}, and returns the key unchanged when it registered none.
 *
 * This is the library's one translation seam. It used to have four: English words written straight
 * into templates, `TranslatePipe` imported directly from `@ngx-translate/core` by one component,
 * this token used by exactly one other, and per-label inputs such as the datatable's
 * `actionsLabel`. Going through the token keeps `@ngx-translate/core` an implementation detail of
 * the application rather than a dependency of the library — bridging one to the other is four
 * lines:
 *
 * ```ts
 * { provide: RLB_TRANSLATION_SERVICE, useExisting: TranslateService }
 * ```
 *
 * Impure, like `@ngx-translate`'s own pipe: `instant()` is a lookup whose answer changes when the
 * application switches language, and a pure pipe would keep showing the old one.
 */
@Pipe({
  name: 'rlbTranslate',
  pure: false,
})
export class RlbTranslatePipe implements PipeTransform {
  private translationService = inject(RLB_TRANSLATION_SERVICE, { optional: true });

  transform(key: string | undefined | null, params?: { [key: string]: any }): string {
    if (key === undefined || key === null || key === '') return '';
    if (!this.translationService) return key;
    return this.translationService.instant(key, params) ?? key;
  }
}
