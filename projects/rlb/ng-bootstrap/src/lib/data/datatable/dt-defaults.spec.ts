import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideRlbDefaults } from '../../shared/defaults';
import { DataTableActionComponent } from './dt-action.component';
import { DataTableActionsComponent } from './dt-actions.component';
import { DataTableCellComponent } from './dt-cell.component';
import { DataTableHeaderComponent } from './dt-header.component';
import { DataTableRowComponent } from './dt-row.component';
import { DataTableComponent } from './dt-table.component';

/**
 * Saying once what used to be said per element.
 *
 * The word `Actions`, the page size 20 and the list 10/20/50/100 were literals inside the
 * component. A caller could override each of them, but only one table at a time — which in a
 * console with forty tables means writing the same thing forty times and forgetting the
 * forty-first.
 */
@Component({
  imports: [
    DataTableComponent,
    DataTableHeaderComponent,
    DataTableRowComponent,
    DataTableCellComponent,
    DataTableActionsComponent,
    DataTableActionComponent,
  ],
  template: `
    <rlb-dt-table
      [actionsLabel]="ownLabel"
      pagination-mode="pages"
      [total-items]="40"
      [current-page]="1"
    >
      <rlb-dt-header field="name" sortable filtrable>Nome</rlb-dt-header>
      <rlb-dt-row>
        <rlb-dt-cell>Mario</rlb-dt-cell>
        <rlb-dt-actions>
          <rlb-dt-action>Elimina</rlb-dt-action>
        </rlb-dt-actions>
      </rlb-dt-row>
    </rlb-dt-table>
  `,
})
class HostComponent {
  ownLabel: string | undefined = undefined;
}

describe('The datatable takes its words and numbers from the application', () => {
  let fixture: ComponentFixture<HostComponent>;
  let element: HTMLElement;

  const render = (ownLabel?: string) => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        provideRouter([]),
        provideRlbDefaults({
          table: {
            actionsLabel: 'Azioni',
            sortLabel: 'Ordina',
            filterLabel: 'Filtra',
            pageSizes: [5, 25],
          },
        }),
      ],
    });
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.ownLabel = ownLabel;
    element = fixture.nativeElement;
    fixture.detectChanges();
  };

  afterEach(() => TestBed.resetTestingModule());

  const actionsHeader = () => [...element.querySelectorAll('th')].at(-1)?.textContent?.trim();
  const rowMenu = () => element.querySelector('.dropdown button');

  it('uses the application words wherever the element says nothing', () => {
    render();

    expect(actionsHeader()).toBe('Azioni');
    expect(rowMenu()?.getAttribute('aria-label')).toBe('Azioni');
    expect(element.querySelector('th button')?.getAttribute('aria-label')).toBe('Ordina');
    expect(element.querySelector('th input')?.getAttribute('aria-label')).toBe('Filtra');
  });

  it('still lets a single table disagree', () => {
    render('Operazioni');

    expect(actionsHeader()).toBe('Operazioni');
  });

  it('offers the page sizes the application chose, not the built-in four', () => {
    render();

    const sizes = [...element.querySelectorAll('option')].map(o => o.textContent?.trim());
    expect(sizes).toEqual(['5', '25']);
  });
});
