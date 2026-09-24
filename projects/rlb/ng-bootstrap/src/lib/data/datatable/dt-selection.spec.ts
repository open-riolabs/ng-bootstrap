import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DataTableActionComponent } from './dt-action.component';
import { DataTableActionsComponent } from './dt-actions.component';
import { DataTableBulkActionsComponent } from './dt-bulk-actions.component';
import { DataTableCellComponent } from './dt-cell.component';
import { DataTableHeaderComponent } from './dt-header.component';
import { DataTableRowComponent } from './dt-row.component';
import { DataTableComponent } from './dt-table.component';

/**
 * Ticking rows, hiding columns, and getting the thing back out as a file.
 *
 * All three run against a table that does not hold its own rows: what it knows is what the caller
 * projected into it. So a row says what it *is* through `row-key`, a cell is matched to its column
 * by position, and the export reads back the table that is actually on screen.
 */
@Component({
  imports: [
    DataTableComponent,
    DataTableHeaderComponent,
    DataTableRowComponent,
    DataTableCellComponent,
    DataTableActionsComponent,
    DataTableActionComponent,
    DataTableBulkActionsComponent,
  ],
  template: `
    <rlb-dt-table
      selectable
      export-mode="emit"
      show-export
      show-columns
      [(selection)]="selected"
      [(hiddenColumns)]="hidden"
      (export-csv)="exported = $event"
    >
      <rlb-dt-header field="name" hideable label="Nome">Nome</rlb-dt-header>
      <rlb-dt-header field="email" hideable label="Email">Email</rlb-dt-header>

      <rlb-dt-bulk-actions>
        <button type="button">Elimina</button>
      </rlb-dt-bulk-actions>

      @for (person of people(); track person.id) {
        <rlb-dt-row [row-key]="person.id">
          <rlb-dt-cell>{{ person.name }}</rlb-dt-cell>
          <rlb-dt-cell>{{ person.email }}</rlb-dt-cell>
          <rlb-dt-actions>
            <rlb-dt-action>Elimina</rlb-dt-action>
          </rlb-dt-actions>
        </rlb-dt-row>
      }
      <!-- A row that never said what it is: the column is there, the tick box is not. -->
      <rlb-dt-row>
        <rlb-dt-cell>Anonimo</rlb-dt-cell>
        <rlb-dt-cell>—</rlb-dt-cell>
      </rlb-dt-row>
    </rlb-dt-table>
  `,
})
class HostComponent {
  people = signal([
    { id: 1, name: 'Mario', email: 'mario@example.com' },
    { id: 2, name: 'Lucia', email: 'lucia@example.com' },
  ]);
  selected: unknown[] = [];
  hidden: string[] = [];
  exported: string[][] = [];
}

describe('The datatable selects, hides and exports', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let element: HTMLElement;

  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const headerCells = () => Array.from(element.querySelectorAll('thead th')) as HTMLElement[];
  const bodyRows = () => Array.from(element.querySelectorAll('tbody tr')) as HTMLElement[];
  const rowTicks = () =>
    bodyRows().map(row => row.querySelector('input[type=checkbox]') as HTMLInputElement | null);
  const selectAll = () =>
    headerCells()[0].querySelector('input[type=checkbox]') as HTMLInputElement;
  /**
   * Hiding is driven through the column menu rather than by writing to the host field: a two-way
   * binding written between checks trips NG0100, and this is the path a user actually takes.
   */
  const columnToggle = (index: number) =>
    Array.from(
      element.querySelectorAll('.dropdown-menu input[type=checkbox]'),
    )[index] as HTMLInputElement;
  const exportButton = () =>
    element.querySelector('[aria-label="Export CSV"]') as HTMLButtonElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    element = fixture.nativeElement;
    await settle();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('gives a tick box only to the rows that said what they are', () => {
    const ticks = rowTicks();
    expect(ticks.length).toBe(3);
    expect(ticks[0]).not.toBeNull();
    expect(ticks[1]).not.toBeNull();
    expect(ticks[2]).toBeNull();
  });

  it('puts the row key into the selection, not the row', async () => {
    rowTicks()[0]!.click();
    await settle();

    expect(host.selected).toEqual([1]);
  });

  it('takes every row on the page when the header is ticked, and only those', async () => {
    selectAll().click();
    await settle();

    // The keyless row cannot be taken, so two of the three.
    expect(host.selected).toEqual([1, 2]);

    selectAll().click();
    await settle();
    expect(host.selected).toEqual([]);
  });

  it('shows the header tick box as partial while only some rows are taken', async () => {
    rowTicks()[0]!.click();
    await settle();

    expect(selectAll().indeterminate).toBe(true);
    expect(selectAll().checked).toBe(false);
  });

  it('swaps the toolbar for the bulk actions while rows are taken', async () => {
    expect(element.textContent).not.toContain('2 selected');

    selectAll().click();
    await settle();

    expect(element.textContent).toContain('2 selected');
  });

  it('removes a hidden column from the head and from every row, not merely from sight', async () => {
    expect(headerCells().length).toBe(4); // tick box + 2 columns + actions
    expect(bodyRows()[0].querySelectorAll('td').length).toBe(4);

    columnToggle(1).click();
    await settle();

    expect(host.hidden).toEqual(['email']);
    expect(headerCells().length).toBe(3);
    expect(headerCells().some(th => th.textContent?.includes('Email'))).toBe(false);
    expect(bodyRows()[0].querySelectorAll('td').length).toBe(3);
    expect(bodyRows()[0].textContent).not.toContain('mario@example.com');
  });

  it('exports what is on screen, without the tick boxes and without the actions', async () => {
    exportButton().click();
    await settle();

    expect(host.exported[0]).toEqual(['Nome', 'Email']);
    expect(host.exported[1]).toEqual(['Mario', 'mario@example.com']);
    expect(host.exported.length).toBe(4); // heading + three rows
  });

  it('leaves a hidden column out of the export too', async () => {
    columnToggle(1).click();
    await settle();

    exportButton().click();
    await settle();

    expect(host.exported[0]).toEqual(['Nome']);
    expect(host.exported[1]).toEqual(['Mario']);
  });
});
