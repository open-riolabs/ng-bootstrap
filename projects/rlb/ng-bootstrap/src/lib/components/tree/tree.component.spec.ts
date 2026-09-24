import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { flattenTree, idsMatching, RlbTreeNode, subtreeIds } from './tree-node';
import { TreeComponent } from './tree.component';

const NODES: RlbTreeNode[] = [
  {
    id: 'hardware',
    label: 'Hardware',
    children: [
      {
        id: 'peripherals',
        label: 'Peripherals',
        children: [
          { id: 'keyboards', label: 'Keyboards' },
          { id: 'monitors', label: 'Monitors' },
        ],
      },
    ],
  },
  {
    id: 'software',
    label: 'Software',
    children: [{ id: 'licences', label: 'Licences' }],
  },
];

@Component({
  imports: [TreeComponent],
  template: `
    <rlb-tree
      [nodes]="nodes()"
      [checkboxes]="checkboxes()"
      [branch-selectable]="branchSelectable()"
      [filter]="filter()"
      [expanded]="expanded()"
      (expandedChange)="expanded.set($event)"
      [selected]="selected()"
      (selectedChange)="selected.set($event)"
    />
  `,
})
class TreeHost {
  nodes = signal<RlbTreeNode[]>(NODES);
  checkboxes = signal(false);
  branchSelectable = signal(true);
  filter = signal('');
  expanded = signal<string[]>([]);
  selected = signal<string[]>([]);
}

describe('tree-node helpers', () => {
  it('flattens parents before their children', () => {
    expect(flattenTree(NODES).map(node => node.id)).toEqual([
      'hardware',
      'peripherals',
      'keyboards',
      'monitors',
      'software',
      'licences',
    ]);
  });

  it('takes a node and everything under it', () => {
    expect(subtreeIds(NODES[0])).toEqual(['hardware', 'peripherals', 'keyboards', 'monitors']);
  });

  /** A hit inside a closed branch is a hit nobody finds, so the path down to it comes back too. */
  it('reports the branches leading to a match as well as the match', () => {
    const { hits, open } = idsMatching(NODES, node => node.label === 'Monitors');

    expect([...hits].sort()).toEqual(['hardware', 'monitors', 'peripherals']);
    expect([...open].sort()).toEqual(['hardware', 'peripherals']);
    expect(open.has('monitors')).toBe(false);
  });
});

describe('TreeComponent', () => {
  let fixture: ComponentFixture<TreeHost>;
  let host: TreeHost;
  let element: HTMLElement;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const labels = () =>
    Array.from(element.querySelectorAll('li[role="treeitem"]')).map(item =>
      item.querySelector('button.flex-grow-1')!.textContent!.trim(),
    );

  const rowFor = (label: string) =>
    Array.from(element.querySelectorAll('li[role="treeitem"]')).find(
      item => item.querySelector('button.flex-grow-1')!.textContent!.trim() === label,
    ) as HTMLElement;

  const labelButton = (label: string) =>
    rowFor(label).querySelector('button.flex-grow-1') as HTMLButtonElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [TreeHost] });
    fixture = TestBed.createComponent(TreeHost);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await settle();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('draws only the roots until a branch is opened', async () => {
    expect(labels()).toEqual(['Hardware', 'Software']);

    host.expanded.set(['hardware']);
    await settle();

    expect(labels()).toEqual(['Hardware', 'Peripherals', 'Software']);
  });

  it('opens a branch when its label is clicked, the way the twisty does', async () => {
    labelButton('Hardware').click();
    await settle();

    expect(host.expanded()).toEqual(['hardware']);
    expect(labels()).toContain('Peripherals');
  });

  /** A category tree whose headings are not answers. */
  it('does not select a branch when branch-selectable is off', async () => {
    host.branchSelectable.set(false);
    await settle();

    labelButton('Hardware').click();
    await settle();

    expect(host.selected()).toEqual([]);
    expect(host.expanded()).toEqual(['hardware']);

    labelButton('Peripherals').click();
    await settle();
    labelButton('Keyboards').click();
    await settle();

    expect(host.selected()).toEqual(['keyboards']);
  });

  it('shows the matches and opens the branches above them', async () => {
    host.filter.set('monitor');
    await settle();

    // Nothing was expanded by hand: the search opened the path on its own.
    expect(host.expanded()).toEqual([]);
    expect(labels()).toEqual(['Hardware', 'Peripherals', 'Monitors']);
  });

  it('says so when a search matches nothing', async () => {
    host.filter.set('nothing here');
    await settle();

    expect(labels()).toEqual([]);
    expect(element.textContent).toContain('Nothing here');
  });

  describe('checkboxes', () => {
    beforeEach(async () => {
      host.checkboxes.set(true);
      host.expanded.set(['hardware', 'peripherals', 'software']);
      await settle();
    });

    const boxFor = (label: string) =>
      rowFor(label).querySelector('input[type="checkbox"]') as HTMLInputElement;

    it('ticks everything under a branch', async () => {
      boxFor('Peripherals').click();
      await settle();

      // Hardware comes along because Peripherals is its only child: a branch is in exactly
      // when all of it is, otherwise the tree would draw «all» and report «some».
      expect(host.selected().sort()).toEqual(['hardware', 'keyboards', 'monitors', 'peripherals']);
    });

    /** A half-ticked branch drawn as unticked is how «apply to all» quietly does the wrong thing. */
    it('draws a partly ticked branch as indeterminate, not as unticked', async () => {
      boxFor('Keyboards').click();
      await settle();

      expect(rowFor('Peripherals').getAttribute('aria-checked')).toBe('mixed');
      expect(boxFor('Peripherals').indeterminate).toBe(true);
      expect(boxFor('Peripherals').checked).toBe(false);

      boxFor('Monitors').click();
      await settle();

      expect(host.selected()).toContain('peripherals');
      expect(rowFor('Peripherals').getAttribute('aria-checked')).toBe('true');
      expect(boxFor('Peripherals').checked).toBe(true);
      expect(boxFor('Peripherals').indeterminate).toBe(false);
    });

    it('unticks a whole subtree at once', async () => {
      boxFor('Peripherals').click();
      await settle();
      boxFor('Peripherals').click();
      await settle();

      expect(host.selected()).toEqual([]);
    });
  });

  it('reports the level of each row so a screen reader can say how deep it is', async () => {
    host.expanded.set(['hardware', 'peripherals']);
    await settle();

    expect(rowFor('Hardware').getAttribute('aria-level')).toBe('1');
    expect(rowFor('Peripherals').getAttribute('aria-level')).toBe('2');
    expect(rowFor('Keyboards').getAttribute('aria-level')).toBe('3');
  });
});
