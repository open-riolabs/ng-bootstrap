import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DataTableActionComponent } from './dt-action.component';
import { DataTableActionsComponent } from './dt-actions.component';
import { DataTableCellComponent } from './dt-cell.component';
import { DataTableHeaderComponent } from './dt-header.component';
import { DataTableRowComponent } from './dt-row.component';
import { DataTableComponent } from './dt-table.component';

/**
 * The two pieces of the datatable that used to speak English no matter what the page spoke.
 *
 * The header over the column of row actions was the literal word `Actions` in the template, and the
 * button that opens each row's menu had nothing in it but a three-dots glyph — so a screen reader
 * announced «button» and stopped, identically on every row. Both are inputs now, with the English
 * word as the default, so a caller that says nothing sees exactly what it saw before.
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
    <rlb-dt-table [actionsLabel]="actionsLabel">
      <rlb-dt-header>Nome</rlb-dt-header>
      <rlb-dt-row>
        <rlb-dt-cell>Mario Rossi</rlb-dt-cell>
        <rlb-dt-actions [label]="menuLabel">
          <rlb-dt-action>Elimina</rlb-dt-action>
        </rlb-dt-actions>
      </rlb-dt-row>
    </rlb-dt-table>
  `,
})
class HostComponent {
  actionsLabel = 'Actions';
  menuLabel = 'Actions';
}

describe('The datatable says what its actions are', () => {
  let fixture: ComponentFixture<HostComponent>;
  let element: HTMLElement;

  /**
   * ⚠️ The labels are set **before** the first change detection, not after it.
   *
   * Changed afterwards they trip `ExpressionChangedAfterItHasBeenCheckedError`: the host would have
   * been read once with one value and once with another inside the same pass. It is the test being
   * wrong, not the component — and writing it the other way hides that by making every assertion
   * run against a second render.
   */
  const render = (labels: Partial<HostComponent> = {}) => {
    // ⚠️ The datatable reaches for RouterLink: its rows can be links, so the injector needs a router.
    TestBed.configureTestingModule({ imports: [HostComponent], providers: [provideRouter([])] });
    fixture = TestBed.createComponent(HostComponent);
    Object.assign(fixture.componentInstance, labels);
    element = fixture.nativeElement;
    fixture.detectChanges();
  };

  afterEach(() => TestBed.resetTestingModule());

  const header = () => [...element.querySelectorAll('th')].at(-1)?.textContent?.trim();
  const menuButton = () => element.querySelector('.dropdown button');

  /** Unchanged for a caller that passes nothing: the default is the word that was hard-coded. */
  it('keeps the English words when it is told none', () => {
    render();

    expect(header()).toBe('Actions');
    expect(menuButton()?.getAttribute('aria-label')).toBe('Actions');
  });

  it('says what it is told, in the language of the page around it', () => {
    render({ actionsLabel: 'Azioni', menuLabel: 'Azioni per Mario Rossi' });

    expect(header()).toBe('Azioni');
    expect(menuButton()?.getAttribute('aria-label')).toBe('Azioni per Mario Rossi');
  });
});
