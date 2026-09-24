import { Component, inject } from '@angular/core';
import { ThemeService } from '@open-rlb/ng-bootstrap';

import { SHARED_IMPORTS } from '../../../shared-imports';
import { DOCS_IMPORTS, DocApiRow } from '../../../shared/docs';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  imports: [SHARED_IMPORTS, DOCS_IMPORTS],
})
export class ThemeComponent {
  /** The same service the toggle drives, read here to show what it exposes. */
  readonly themeService = inject(ThemeService);

  setupExample = `import { provideRlbBootstrap, provideRlbTheme } from '@open-rlb/ng-bootstrap';

bootstrapApplication(AppComponent, {
  providers: [
    provideRlbBootstrap(),
    provideRlbTheme(),
  ],
});`;

  optionsExample = `provideRlbTheme({
  // What to show before anything has been chosen. 'auto' follows the operating system.
  defaultTheme: 'auto',
  // Where the choice is remembered. null turns persistence off.
  storageKey: 'rlb-theme',
  // Which element carries data-bs-theme: the <html> element, or <body>.
  target: 'root',
})`;

  toggleExample = `<rlb-theme-toggle />`;

  twoStateExample = `<rlb-theme-toggle [modes]="['light', 'dark']" show-label />`;

  styledExample = `<rlb-theme-toggle color="primary" size="sm" />
<rlb-theme-toggle color="dark" [outline]="false" />`;

  serviceExample = `import { ThemeService } from '@open-rlb/ng-bootstrap';

export class SettingsComponent {
  private theme = inject(ThemeService);

  // What was asked for — may be 'auto'.
  readonly asked = this.theme.theme;
  // What is on screen — 'auto' already resolved against the operating system.
  readonly showing = this.theme.resolved;
  readonly isDark = this.theme.isDark;

  useDark() { this.theme.set('dark'); }
  flip() { this.theme.toggle(); }
}`;

  storageExample = `// Keep the preference on the user's account instead of in the browser.
provideRlbTheme({
  storage: {
    getItem: () => accountSettings.theme ?? null,
    setItem: (_key, value) => accountSettings.save({ theme: value }),
  },
})`;

  toggleApi: DocApiRow[] = [
    { name: 'modes', type: "RlbTheme[]", default: "['light', 'dark', 'auto']", description: 'The themes the button walks through, in order. Drop auto for a plain light/dark switch.', kind: 'Input' },
    { name: 'color', type: 'Color | undefined', default: "'secondary'", description: 'Bootstrap colour of the button.', kind: 'Input' },
    { name: 'size', type: 'Size | undefined', default: "'md'", description: 'Button size.', kind: 'Input' },
    { name: 'outline', type: 'boolean', default: 'true', description: 'Render as an outline button.', kind: 'Input' },
    { name: 'show-label', type: 'boolean', default: 'false', description: 'Show the name of the current theme beside the icon.', kind: 'Input' },
    { name: 'lightLabel', type: 'string', default: "'Light'", description: 'Word for the light theme, used as the accessible name and as the visible label.', kind: 'Input' },
    { name: 'darkLabel', type: 'string', default: "'Dark'", description: 'Word for the dark theme.', kind: 'Input' },
    { name: 'autoLabel', type: 'string', default: "'System'", description: 'Word for the theme that follows the operating system.', kind: 'Input' },
    { name: 'theme', type: 'Signal<RlbTheme>', description: 'The theme currently asked for, read from the service.', kind: 'Method' },
    { name: 'next()', type: 'void', description: 'Advance to the next theme in modes. Called by the button itself.', kind: 'Method' },
  ];

  serviceApi: DocApiRow[] = [
    { name: 'theme', type: 'Signal<RlbTheme>', description: "What was asked for. May be 'auto'.", kind: 'Method' },
    { name: 'resolved', type: "Signal<'light' | 'dark'>", description: "What is actually on screen, with 'auto' resolved against prefers-color-scheme. This is what is written to data-bs-theme.", kind: 'Method' },
    { name: 'isDark', type: 'Signal<boolean>', description: 'Shorthand for resolved() === "dark".', kind: 'Method' },
    { name: 'set(theme)', type: 'void', description: 'Choose a theme and remember it.', kind: 'Method' },
    { name: 'toggle()', type: 'void', description: "Flip to the opposite of what is on screen. From 'auto' this leaves 'auto', because asking for the opposite of the system is a choice rather than a preference to keep following.", kind: 'Method' },
  ];

  optionsApi: DocApiRow[] = [
    { name: 'defaultTheme', type: "RlbTheme", default: "'auto'", description: 'What to show before anything has been stored or chosen.', kind: 'Input' },
    { name: 'storageKey', type: 'string | null', default: "'rlb-theme'", description: 'Key the choice is written under. null turns persistence off.', kind: 'Input' },
    { name: 'target', type: "'root' | 'body'", default: "'root'", description: 'Which element carries data-bs-theme. Bootstrap reads it from any ancestor.', kind: 'Input' },
    { name: 'storage', type: 'RlbThemeStorage | null | undefined', default: 'undefined', description: "Where storageKey is written. Left out, the browser's localStorage is used when there is one. Provide your own to keep the preference on the user's account.", kind: 'Input' },
  ];
}
