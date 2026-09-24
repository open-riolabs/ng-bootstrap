import { DOCUMENT } from '@angular/common';
import {
  computed,
  effect,
  inject,
  Injectable,
  InjectionToken,
  PLATFORM_ID,
  Provider,
  provideEnvironmentInitializer,
  EnvironmentProviders,
  signal,
  Signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * `auto` follows the operating system and keeps following it; the other two override it.
 */
export type RlbTheme = 'light' | 'dark' | 'auto';

/**
 * The slice of `Storage` this service uses, so the choice can be kept somewhere other than
 * `localStorage` — on the user's account, in a cookie, in memory during a test.
 */
export interface RlbThemeStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface RlbThemeOptions {
  /** What to show before anything has been stored or chosen. */
  defaultTheme: RlbTheme;
  /**
   * Where to remember the choice between visits. `null` turns persistence off, which is what you
   * want when the application stores the preference on the user's account instead.
   */
  storageKey: string | null;
  /** Which element carries `data-bs-theme`. Bootstrap reads it from any ancestor. */
  target: 'root' | 'body';
  /**
   * Where `storageKey` is written. Left out, the browser's `localStorage` is used when there is
   * one — there is not, in a server render or in some test runners, and then nothing is kept.
   */
  storage?: RlbThemeStorage | null;
}

export const RLB_DEFAULT_THEME_OPTIONS: RlbThemeOptions = {
  defaultTheme: 'auto',
  storageKey: 'rlb-theme',
  target: 'root',
};

export const RLB_THEME_OPTIONS = new InjectionToken<RlbThemeOptions>('RLB_THEME_OPTIONS', {
  providedIn: 'root',
  factory: () => RLB_DEFAULT_THEME_OPTIONS,
});

/**
 * Turns the theme on.
 *
 * It also starts {@link ThemeService} at boot, which is the point: without that, a visitor who
 * chose dark last time sees light until something on the page happens to inject the service.
 *
 * This is deliberately not part of `provideRlbBootstrap()` — an application that has never asked
 * for a theme should not suddenly find `data-bs-theme` written on its `<html>`.
 */
export function provideRlbTheme(
  options: Partial<RlbThemeOptions> = {},
): (Provider | EnvironmentProviders)[] {
  return [
    {
      provide: RLB_THEME_OPTIONS,
      useValue: { ...RLB_DEFAULT_THEME_OPTIONS, ...options } satisfies RlbThemeOptions,
    },
    provideEnvironmentInitializer(() => inject(ThemeService)),
  ];
}

/**
 * Drives Bootstrap 5.3's `data-bs-theme`.
 *
 * Bootstrap has shipped a whole dark mode since 5.3 and this library had no way to reach it: every
 * application that wanted one wrote the same three lines against `document.documentElement`, and
 * got them wrong on the server.
 *
 * Everything here is a signal, so a template can read the current theme without subscribing, and
 * nothing touches the DOM outside the browser.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private options = inject(RLB_THEME_OPTIONS);
  private document = inject(DOCUMENT);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly _theme = signal<RlbTheme>(this.options.defaultTheme);
  private readonly systemPrefersDark = signal(false);

  /** What was asked for, which may be `auto`. */
  readonly theme: Signal<RlbTheme> = this._theme.asReadonly();

  /** What is actually on screen, with `auto` resolved against the operating system. */
  readonly resolved = computed<'light' | 'dark'>(() => {
    const theme = this._theme();
    if (theme !== 'auto') return theme;
    return this.systemPrefersDark() ? 'dark' : 'light';
  });

  readonly isDark = computed(() => this.resolved() === 'dark');

  constructor() {
    if (this.isBrowser) {
      const stored = this.read();
      if (stored) this._theme.set(stored);
      this.watchSystem();
    }

    effect(() => {
      const resolved = this.resolved();
      if (!this.isBrowser) return;
      const target =
        this.options.target === 'body' ? this.document.body : this.document.documentElement;
      target?.setAttribute('data-bs-theme', resolved);
    });
  }

  set(theme: RlbTheme) {
    this._theme.set(theme);
    this.write(theme);
  }

  /**
   * Flips to the opposite of what is currently on screen. From `auto` that means leaving `auto` —
   * asking for the opposite of the system is a choice, not a preference to keep following.
   */
  toggle() {
    this.set(this.resolved() === 'dark' ? 'light' : 'dark');
  }

  private watchSystem() {
    const query = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    if (!query) return;
    this.systemPrefersDark.set(query.matches);
    query.addEventListener('change', event => this.systemPrefersDark.set(event.matches));
  }

  /**
   * Storage throws rather than returning null in a private window with site data blocked, and the
   * theme is never important enough to take the page down with it.
   */
  private read(): RlbTheme | null {
    const key = this.options.storageKey;
    if (!key) return null;
    try {
      const value = this.storage()?.getItem(key);
      return value === 'light' || value === 'dark' || value === 'auto' ? value : null;
    } catch {
      return null;
    }
  }

  private storage(): RlbThemeStorage | null {
    if (this.options.storage !== undefined) return this.options.storage;
    try {
      return this.document.defaultView?.localStorage ?? null;
    } catch {
      return null;
    }
  }

  private write(theme: RlbTheme) {
    const key = this.options.storageKey;
    if (!key || !this.isBrowser) return;
    try {
      this.storage()?.setItem(key, theme);
    } catch {
      // Nothing to do: the choice simply will not survive the visit.
    }
  }
}
