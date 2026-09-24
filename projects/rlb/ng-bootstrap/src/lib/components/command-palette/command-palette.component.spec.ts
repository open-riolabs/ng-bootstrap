import { Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommandPaletteComponent } from './command-palette.component';
import { RlbCommand, scoreCommand } from './command';

/**
 * The matcher, on its own.
 *
 * Every character of the query must appear in order — the subsequence rule every palette uses, so
 * `dbs` finds «Dashboard settings». What separates a usable palette from a list that merely
 * filters is the ordering: the thing you meant has to come first.
 */
describe('scoreCommand', () => {
  const command = (label: string, extra: Partial<RlbCommand> = {}): RlbCommand => ({
    id: label,
    label,
    run: () => {},
    ...extra,
  });

  it('matches letters in order, not only whole words', () => {
    expect(scoreCommand(command('Dashboard settings'), 'dbs')).not.toBeNull();
    expect(scoreCommand(command('Dashboard settings'), 'dash')).not.toBeNull();
  });

  it('refuses letters that are not there, or are out of order', () => {
    expect(scoreCommand(command('Dashboard'), 'xyz')).toBeNull();
    expect(scoreCommand(command('Dashboard'), 'hsad')).toBeNull();
  });

  it('puts a match at the start of a word above one buried inside', () => {
    const start = scoreCommand(command('Settings'), 'set')!;
    const buried = scoreCommand(command('Asset manager'), 'set')!;
    expect(start).toBeGreaterThan(buried);
  });

  it('prefers the shorter of two labels that both match', () => {
    const short = scoreCommand(command('New user'), 'new')!;
    const long = scoreCommand(command('New user in the current organisation'), 'new')!;
    expect(short).toBeGreaterThan(long);
  });

  it('also searches the keywords, so an old name still finds the command', () => {
    expect(scoreCommand(command('Sign out', { keywords: ['logout', 'esci'] }), 'logout')).not.toBeNull();
  });

  it('matches everything when nothing has been typed', () => {
    expect(scoreCommand(command('Anything'), '')).toBe(0);
  });
});

@Component({
  imports: [CommandPaletteComponent],
  template: `
    <rlb-command-palette
      [commands]="commands()"
      shortcut="mod+k"
      [recent-count]="2"
      (executed)="executed.push($event.id)"
    />
  `,
})
class HostComponent {
  palette = viewChild.required(CommandPaletteComponent);
  executed: string[] = [];
  ran: string[] = [];

  commands = signal<RlbCommand[]>([
    { id: 'new', label: 'New user', group: 'Users', run: () => this.ran.push('new') },
    { id: 'invite', label: 'Invite user', group: 'Users', run: () => this.ran.push('invite') },
    { id: 'settings', label: 'Dashboard settings', group: 'System', run: () => this.ran.push('settings') },
    { id: 'off', label: 'Disabled thing', disabled: true, run: () => this.ran.push('off') },
  ]);
}

describe('CommandPaletteComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const panel = () => document.querySelector('.rlb-palette');
  const field = () => document.querySelector('.rlb-palette input') as HTMLInputElement;
  const rows = () =>
    Array.from(document.querySelectorAll('.rlb-palette-row')) as HTMLButtonElement[];
  const labels = () => rows().map(r => r.textContent!.trim().split('\n')[0].trim());
  const headings = () =>
    Array.from(document.querySelectorAll('.rlb-palette-list .text-uppercase')).map(h =>
      h.textContent!.trim(),
    );
  const active = () => rows().findIndex(r => r.classList.contains('active'));

  const type = async (text: string) => {
    field().value = text;
    field().dispatchEvent(new Event('input'));
    await settle();
  };

  const key = async (name: string) => {
    field().dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true }));
    await settle();
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(async () => {
    host.palette().close();
    await settle();
    TestBed.resetTestingModule();
  });

  it('renders nothing until it opens', () => {
    expect(panel()).toBeNull();
  });

  it('opens on its shortcut', async () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
    await settle();

    expect(panel()).not.toBeNull();
  });

  it('ignores the key without its modifier', async () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', bubbles: true }));
    await settle();

    expect(panel()).toBeNull();
  });

  it('lists the commands under their group', async () => {
    host.palette().open();
    await settle();

    expect(headings()).toEqual(['Users', 'System']);
    expect(labels()).toContain('New user');
  });

  it('leaves a disabled command out until it is searched for', async () => {
    host.palette().open();
    await settle();
    expect(labels()).not.toContain('Disabled thing');

    await type('disabled');
    expect(labels()).toContain('Disabled thing');
    expect(rows()[0].disabled).toBe(true);
  });

  it('narrows on letters in order, not only on whole words', async () => {
    host.palette().open();
    await settle();

    await type('dbs');
    expect(labels()).toEqual(['Dashboard settings']);
  });

  it('walks the list with the arrows and wraps round', async () => {
    host.palette().open();
    await settle();
    expect(active()).toBe(0);

    await key('ArrowDown');
    expect(active()).toBe(1);

    await key('ArrowUp');
    await key('ArrowUp');
    expect(active()).toBe(rows().length - 1);
  });

  it('runs the highlighted command on Enter and closes', async () => {
    host.palette().open();
    await settle();

    await key('ArrowDown');
    await key('Enter');

    expect(host.ran).toEqual(['invite']);
    expect(host.executed).toEqual(['invite']);
    expect(panel()).toBeNull();
  });

  it('closes on Escape without running anything', async () => {
    host.palette().open();
    await settle();

    await key('Escape');

    expect(host.ran).toEqual([]);
    expect(panel()).toBeNull();
  });

  /** The reason to have used it before: what you reach for is at the top next time. */
  it('puts what was used last at the top, under its own heading', async () => {
    host.palette().open();
    await settle();
    await type('settings');
    await key('Enter');

    host.palette().open();
    await settle();

    expect(headings()[0]).toBe('Recent');
    expect(labels()[0]).toBe('Dashboard settings');
  });

  it('says so when nothing matches', async () => {
    host.palette().open();
    await settle();

    await type('zzzz');

    expect(rows().length).toBe(0);
    expect(document.querySelector('.rlb-palette-list')!.textContent).toContain('Nothing matches');
  });
});
