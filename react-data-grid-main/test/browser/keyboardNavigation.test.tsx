import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DataGrid, SelectColumn } from '../../src';
import type { Column } from '../../src';
import {
  getCellsAtRowIndexOld,
  getSelectedCellOld,
  scrollGrid,
  setupOld,
  validateCellPositionOld
} from './utils';

type Row = undefined;

const rows: readonly Row[] = new Array(100);
const topSummaryRows: readonly Row[] = [undefined];
const bottomSummaryRows: readonly Row[] = [undefined, undefined];

const columns = [
  SelectColumn,
  { key: 'col2', name: 'col2' },
  { key: 'col3', name: 'col3' },
  { key: 'col4', name: 'col4' },
  { key: 'col5', name: 'col5' },
  { key: 'col6', name: 'col6' },
  { key: 'col7', name: 'col7' }
] as const satisfies Column<Row, Row>[];

test('keyboard navigation', async () => {
  setupOld({ columns, rows, topSummaryRows, bottomSummaryRows });

  // no initial selection
  expect(getSelectedCellOld()).not.toBeInTheDocument();

  // tab into the grid
  await userEvent.tab();
  validateCellPositionOld(0, 0);

  // tab to the next cell
  await userEvent.tab();
  validateCellPositionOld(1, 0);

  // tab back to the previous cell
  await userEvent.tab({ shift: true });
  validateCellPositionOld(0, 0);

  // arrow navigation
  await userEvent.keyboard('{arrowdown}');
  validateCellPositionOld(0, 1);
  await userEvent.keyboard('{arrowright}');
  validateCellPositionOld(1, 1);
  await userEvent.keyboard('{arrowdown}');
  validateCellPositionOld(1, 2);
  await userEvent.keyboard('{arrowleft}');
  validateCellPositionOld(0, 2);
  await userEvent.keyboard('{arrowup}');
  validateCellPositionOld(0, 1);
  await userEvent.keyboard('{arrowup}');
  validateCellPositionOld(0, 0);

  // page {up,down}
  await userEvent.keyboard('{PageDown}');
  validateCellPositionOld(0, 26);
  await userEvent.keyboard('{PageDown}');
  validateCellPositionOld(0, 52);
  await userEvent.keyboard('{PageUp}');
  validateCellPositionOld(0, 26);

  // home/end navigation
  await userEvent.keyboard('{end}');
  validateCellPositionOld(6, 26);
  await userEvent.keyboard('{home}');
  validateCellPositionOld(0, 26);
  await userEvent.keyboard('{Control>}{end}');
  validateCellPositionOld(6, 103);
  await userEvent.keyboard('{arrowdown}');
  validateCellPositionOld(6, 103);
  await userEvent.keyboard('{arrowright}');
  validateCellPositionOld(6, 103);
  await userEvent.keyboard('{end}');
  validateCellPositionOld(6, 103);
  await userEvent.keyboard('{Control>}{end}');
  validateCellPositionOld(6, 103);
  await userEvent.keyboard('{PageDown}');
  validateCellPositionOld(6, 103);
  await userEvent.keyboard('{Control>}{home}');
  validateCellPositionOld(0, 0);
  await userEvent.keyboard('{home}');
  validateCellPositionOld(0, 0);
  await userEvent.keyboard('{Control>}{home}');
  validateCellPositionOld(0, 0);
  await userEvent.keyboard('{PageUp}');
  validateCellPositionOld(0, 0);

  // tab at the end of a row selects the first cell on the next row
  await userEvent.keyboard('{end}');
  await userEvent.tab();
  validateCellPositionOld(0, 1);

  // shift tab should select the last cell of the previous row
  await userEvent.tab({ shift: true });
  validateCellPositionOld(6, 0);
});

test('arrow and tab navigation', async () => {
  setupOld({ columns, rows, bottomSummaryRows });

  // pressing arrowleft on the leftmost cell does nothing
  await userEvent.tab();
  await userEvent.keyboard('{arrowdown}');
  validateCellPositionOld(0, 1);
  await userEvent.keyboard('{arrowleft}');
  validateCellPositionOld(0, 1);

  // pressing arrowright on the rightmost cell does nothing
  await userEvent.keyboard('{end}');
  validateCellPositionOld(6, 1);
  await userEvent.keyboard('{arrowright}');
  validateCellPositionOld(6, 1);

  // pressing tab on the rightmost cell navigates to the leftmost cell on the next row
  await userEvent.tab();
  validateCellPositionOld(0, 2);

  // pressing shift+tab on the leftmost cell navigates to the rightmost cell on the previous row
  await userEvent.tab({ shift: true });
  validateCellPositionOld(6, 1);
});

test('grid enter/exit', async () => {
  setupOld({ columns, rows: new Array(5), bottomSummaryRows });

  // no initial selection
  expect(getSelectedCellOld()).not.toBeInTheDocument();

  // tab into the grid
  await userEvent.tab();
  validateCellPositionOld(0, 0);

  // shift+tab tabs out of the grid if we are at the first cell
  await userEvent.tab({ shift: true });
  expect(document.body).toHaveFocus();

  await userEvent.tab();
  validateCellPositionOld(0, 0);

  await userEvent.keyboard('{arrowdown}{arrowdown}');
  validateCellPositionOld(0, 2);

  // tab should select the last selected cell
  // click outside the grid
  await userEvent.click(document.body);
  await userEvent.tab();
  await userEvent.keyboard('{arrowdown}');
  validateCellPositionOld(0, 3);

  // shift+tab should select the last selected cell
  await userEvent.click(document.body);
  await userEvent.tab({ shift: true });
  await userEvent.keyboard('{arrowup}');
  validateCellPositionOld(0, 2);

  // tab tabs out of the grid if we are at the last cell
  await userEvent.keyboard('{Control>}{end}');
  await userEvent.tab();
  expect(document.body).toHaveFocus();
});

test('navigation with focusable cell renderer', async () => {
  setupOld({ columns, rows: new Array(1), bottomSummaryRows });
  await userEvent.tab();
  await userEvent.keyboard('{arrowdown}');
  validateCellPositionOld(0, 1);

  // cell should not set tabIndex to 0 if it contains a focusable cell renderer
  expect(getSelectedCellOld()).toHaveAttribute('tabIndex', '-1');
  const checkbox = getSelectedCellOld()!.querySelector('input');
  expect(checkbox).toHaveFocus();
  expect(checkbox).toHaveAttribute('tabIndex', '0');

  await userEvent.tab();
  validateCellPositionOld(1, 1);
  // cell should set tabIndex to 0 if it does not have focusable cell renderer
  expect(getSelectedCellOld()).toHaveAttribute('tabIndex', '0');
});

test('navigation when header and summary rows have focusable elements', async () => {
  const columns: readonly Column<Row, Row>[] = [
    {
      key: 'col2',
      name: 'col2',
      renderHeaderCell(p) {
        return <input id="header-filter1" tabIndex={p.tabIndex} />;
      },
      renderSummaryCell(p) {
        return <input id="summary-1" tabIndex={p.tabIndex} />;
      }
    },
    {
      key: 'col3',
      name: 'col3',
      renderHeaderCell(p) {
        return <input id="header-filter2" tabIndex={p.tabIndex} />;
      },
      renderSummaryCell(p) {
        return <input id="summary-2" tabIndex={p.tabIndex} />;
      }
    }
  ];

  setupOld({ columns, rows: new Array(2), bottomSummaryRows });
  await userEvent.tab();

  // should set focus on the header filter
  expect(document.getElementById('header-filter1')).toHaveFocus();

  await userEvent.tab();
  expect(document.getElementById('header-filter2')).toHaveFocus();

  await userEvent.tab();
  validateCellPositionOld(0, 1);

  await userEvent.tab({ shift: true });
  expect(document.getElementById('header-filter2')).toHaveFocus();

  await userEvent.tab({ shift: true });
  expect(document.getElementById('header-filter1')).toHaveFocus();

  await userEvent.tab();
  await userEvent.tab();
  await userEvent.keyboard('{Control>}{end}{arrowup}{arrowup}');
  validateCellPositionOld(1, 2);

  await userEvent.tab();
  expect(document.getElementById('summary-1')).toHaveFocus();

  await userEvent.tab();
  expect(document.getElementById('summary-2')).toHaveFocus();

  await userEvent.tab({ shift: true });
  await userEvent.tab({ shift: true });
  validateCellPositionOld(1, 2);
  expect(getSelectedCellOld()).toHaveFocus();
});

test('navigation when selected cell not in the viewport', async () => {
  const columns: Column<Row, Row>[] = [SelectColumn];
  for (let i = 0; i < 99; i++) {
    columns.push({ key: `col${i}`, name: `col${i}`, frozen: i < 5 });
  }
  setupOld({ columns, rows, bottomSummaryRows });
  await userEvent.tab();
  validateCellPositionOld(0, 0);

  await userEvent.keyboard('{Control>}{end}{arrowup}{arrowup}');
  validateCellPositionOld(99, 100);
  expect(getCellsAtRowIndexOld(100)).not.toHaveLength(1);

  await scrollGrid({ scrollTop: 0 });
  expect(getCellsAtRowIndexOld(99)).toHaveLength(1);
  await userEvent.keyboard('{arrowup}');
  validateCellPositionOld(99, 99);
  expect(getCellsAtRowIndexOld(99)).not.toHaveLength(1);

  await scrollGrid({ scrollLeft: 0 });
  await userEvent.keyboard('{arrowdown}');
  validateCellPositionOld(99, 100);

  await userEvent.keyboard(
    '{home}{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}{arrowright}'
  );
  validateCellPositionOld(7, 100);
  await scrollGrid({ scrollLeft: 2000 });
  await userEvent.keyboard('{arrowleft}');
  validateCellPositionOld(6, 100);
});

test('reset selected cell when column is removed', async () => {
  const columns: readonly Column<Row>[] = [
    { key: '1', name: '1' },
    { key: '2', name: '2' }
  ];
  const rows = [undefined, undefined];

  function Test({ columns }: { columns: readonly Column<Row>[] }) {
    return <DataGrid columns={columns} rows={rows} />;
  }

  const { rerender } = render(<Test columns={columns} />);

  await userEvent.tab();
  await userEvent.keyboard('{arrowdown}{arrowright}');
  validateCellPositionOld(1, 1);

  rerender(<Test columns={[columns[0]]} />);

  expect(getSelectedCellOld()).not.toBeInTheDocument();
});

test('reset selected cell when row is removed', async () => {
  const columns: readonly Column<Row>[] = [
    { key: '1', name: '1' },
    { key: '2', name: '2' }
  ];
  const rows = [undefined, undefined];

  function Test({ rows }: { rows: readonly undefined[] }) {
    return <DataGrid columns={columns} rows={rows} />;
  }

  const { rerender } = render(<Test rows={rows} />);

  await userEvent.tab();
  await userEvent.keyboard('{arrowdown}{arrowdown}{arrowright}');
  validateCellPositionOld(1, 2);

  rerender(<Test rows={[rows[0]]} />);

  expect(getSelectedCellOld()).not.toBeInTheDocument();
});

test('should not change the left and right arrow behavior for right to left languages', async () => {
  setupOld({ rows, columns, direction: 'rtl' });
  await userEvent.tab();
  validateCellPositionOld(0, 0);
  await userEvent.tab();
  validateCellPositionOld(1, 0);
  await userEvent.keyboard('{arrowright}');
  validateCellPositionOld(0, 0);
  await userEvent.keyboard('{arrowright}');
  validateCellPositionOld(0, 0);
  await userEvent.keyboard('{arrowleft}');
  validateCellPositionOld(1, 0);
  await userEvent.keyboard('{arrowleft}');
  validateCellPositionOld(2, 0);
});
