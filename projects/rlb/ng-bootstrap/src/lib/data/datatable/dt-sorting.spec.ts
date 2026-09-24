import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DataTableCellComponent } from './dt-cell.component';
import { DataTableHeaderComponent } from './dt-header.component';
import { TableDataQuery } from './dt-query';
import { DataTableRowComponent } from './dt-row.component';
import { DataTableComponent } from './dt-table.component';

/**
 * Sorting and filtering, which the header has advertised since the beginning and never done.
 *
 * `sortable` and `filtrable` were inputs no code read, and `TableDataQuery` was exported from the
 * package and referenced nowhere — so a caller reading the types had every reason to believe the
 * table sorted, and none of the behaviour. The table still never reorders anything itself (it does
 * not hold the rows; the caller projects them), so what these cover is the contract: which query
 * comes out, and when.
 */
@Component({
  imports: [
    DataTableComponent,
    DataTableHeaderComponent,
    DataTableRowComponent,
    DataTableCellComponent,
  ],
  template: `
    <rlb-dt-table
      [filter-debounce]="0"
      (data-query)="queries.push($event)"
    >
      <rlb-dt-header
        field="name"
        sortable
        filtrable
        >Nome</rlb-dt-header
      >
      <rlb-dt-header sortable>Senza field</rlb-dt-header>
      @for (person of people(); track person) {
        <rlb-dt-row>
          <rlb-dt-cell>{{ person }}</rlb-dt-cell>
          <rlb-dt-cell>—</rlb-dt-cell>
        </rlb-dt-row>
      }
    </rlb-dt-table>
  `,
})
class HostComponent {
  queries: TableDataQuery[] = [];
  people = signal(['Mario', 'Lucia']);
}

const tick = () => new Promise(resolve => setTimeout(resolve, 10));

describe('The datatable sorts and filters', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const headerCells = () => Array.from(fixture.nativeElement.querySelectorAll('th')) as HTMLElement[];
  const sortButton = (index: number) => headerCells()[index].querySelector('button') as HTMLButtonElement;
  const filterBox = (index: number) => headerCells()[index].querySelector('input') as HTMLInputElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('walks a column through ascending, descending and back to unsorted', async () => {
    sortButton(0).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(host.queries.at(-1)!.sorting).toEqual({ column: 'name', direction: 'asc' });

    sortButton(0).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(host.queries.at(-1)!.sorting).toEqual({ column: 'name', direction: 'desc' });

    sortButton(0).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(host.queries.at(-1)!.sorting).toBeUndefined();
  });

  it('says which way it is sorting, for a screen reader as well as an arrow', async () => {
    expect(headerCells()[0].getAttribute('aria-sort')).toBe('none');

    sortButton(0).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(headerCells()[0].getAttribute('aria-sort')).toBe('ascending');

    sortButton(0).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(headerCells()[0].getAttribute('aria-sort')).toBe('descending');
  });

  it('gives the sort control a name, since it is only an arrow', () => {
    expect(sortButton(0).getAttribute('aria-label')).toBe('Sort');
  });

  it('ignores sortable on a header that never said which column it is', () => {
    expect(headerCells()[1].querySelector('button')).toBeNull();
    expect(headerCells()[1].getAttribute('aria-sort')).toBeNull();
  });

  it('emits what was typed into a filter, once the typing stops', async () => {
    const box = filterBox(0);
    box.value = 'mario';
    box.dispatchEvent(new Event('input'));
    await tick();
    fixture.detectChanges();

    expect(host.queries.at(-1)!.filter).toEqual({ name: 'mario' });
  });

  it('clears a column filter when the box is emptied rather than matching on empty', async () => {
    const box = filterBox(0);
    box.value = 'mario';
    box.dispatchEvent(new Event('input'));
    await tick();
    box.value = '';
    box.dispatchEvent(new Event('input'));
    await tick();
    fixture.detectChanges();

    expect(host.queries.at(-1)!.filter).toEqual({});
  });

  /**
   * The filter box lives in a header, and answering a filter changes the rows. When all four
   * projected blocks shared one effect, new rows tore the headers down with them: the input the
   * user was typing into was replaced after the first keystroke, so it lost focus and the rest of
   * the word went nowhere. Same node before and after is what keeps the caret where it was.
   */
  it('leaves the headers alone when the rows change', async () => {
    const before = headerCells()[0];
    const boxBefore = filterBox(0);

    host.people.set(['Giulia', 'Marco', 'Anna']);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(headerCells()[0]).toBe(before);
    expect(filterBox(0)).toBe(boxBefore);
  });

  it('carries the filter along when the sorting changes, and the other way round', async () => {
    const box = filterBox(0);
    box.value = 'mario';
    box.dispatchEvent(new Event('input'));
    await tick();
    fixture.detectChanges();

    sortButton(0).click();
    fixture.detectChanges();
    await fixture.whenStable();

    const last = host.queries.at(-1)!;
    expect(last.filter).toEqual({ name: 'mario' });
    expect(last.sorting).toEqual({ column: 'name', direction: 'asc' });
    expect(last.pagination!.page).toBe(1);
  });
});
