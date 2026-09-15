import { provideZonelessChangeDetection } from '@angular/core';

/**
 * Providers for the library's test environment. The library is consumed by zoneless
 * apps and never depends on zone.js, so its tests run zoneless as well.
 */
export default [provideZonelessChangeDetection()];
