import { TestBed } from '@angular/core/testing';
import { provideRlbTheme, RLB_THEME_OPTIONS, RlbThemeStorage, ThemeService } from './theme.service';

/**
 * What ends up on `data-bs-theme`, which is the only thing Bootstrap reads.
 *
 * The library had no answer for dark mode at all: every application that wanted one wrote its own
 * three lines against `document.documentElement` — and wrote them on the server too, where there
 * is no document.
 */
describe('ThemeService', () => {
  const KEY = 'rlb-theme-test';

  /**
   * The test runner has no `localStorage` at all, so persistence is exercised against a fake —
   * which is the same seam an application uses when it keeps the preference on the user's account.
   */
  const fakeStorage = (): RlbThemeStorage & { map: Map<string, string> } => {
    const map = new Map<string, string>();
    return {
      map,
      getItem: (key: string) => map.get(key) ?? null,
      setItem: (key: string, value: string) => void map.set(key, value),
    };
  };

  const attribute = () => document.documentElement.getAttribute('data-bs-theme');

  const make = (options: Parameters<typeof provideRlbTheme>[0] = {}) => {
    TestBed.configureTestingModule({ providers: [provideRlbTheme({ storageKey: KEY, ...options })] });
    const service = TestBed.inject(ThemeService);
    TestBed.tick();
    return service;
  };

  beforeEach(() => {
    document.documentElement.removeAttribute('data-bs-theme');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    document.documentElement.removeAttribute('data-bs-theme');
  });

  it('writes the resolved theme onto the document', () => {
    const service = make({ defaultTheme: 'dark' });

    expect(service.resolved()).toBe('dark');
    expect(attribute()).toBe('dark');
  });

  it('resolves auto against the operating system rather than leaving it on the element', () => {
    const service = make({ defaultTheme: 'auto' });

    expect(service.theme()).toBe('auto');
    // Whatever the machine running the test prefers, `auto` is never what Bootstrap is told.
    expect(['light', 'dark']).toContain(service.resolved());
    expect(attribute()).toBe(service.resolved());
  });

  it('leaves auto behind when toggled, because asking for the opposite is a choice', () => {
    const service = make({ defaultTheme: 'auto' });
    const wasShowing = service.resolved();

    service.toggle();
    TestBed.tick();

    expect(service.theme()).toBe(wasShowing === 'dark' ? 'light' : 'dark');
    expect(service.theme()).not.toBe('auto');
  });

  it('remembers the choice for the next visit', () => {
    const storage = fakeStorage();

    make({ defaultTheme: 'light', storage }).set('dark');
    expect(storage.map.get(KEY)).toBe('dark');

    TestBed.resetTestingModule();
    expect(make({ defaultTheme: 'light', storage }).theme()).toBe('dark');
  });

  it('stores nothing when the application keeps the preference itself', () => {
    const storage = fakeStorage();

    make({ defaultTheme: 'light', storageKey: null, storage }).set('dark');

    expect(storage.map.size).toBe(0);
  });

  it('survives a browser that refuses storage, rather than taking the page down', () => {
    const angry: RlbThemeStorage = {
      getItem: () => {
        throw new Error('site data blocked');
      },
      setItem: () => {
        throw new Error('site data blocked');
      },
    };

    const service = make({ defaultTheme: 'light', storage: angry });
    expect(() => service.set('dark')).not.toThrow();
    expect(service.resolved()).toBe('dark');
  });

  it('is configured through the token, so an application can replace the options wholesale', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: RLB_THEME_OPTIONS, useValue: { defaultTheme: 'dark', storageKey: null, target: 'body' } }],
    });
    TestBed.inject(ThemeService);
    TestBed.tick();

    expect(document.body.getAttribute('data-bs-theme')).toBe('dark');
    document.body.removeAttribute('data-bs-theme');
  });
});
