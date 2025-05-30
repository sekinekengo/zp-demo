import { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createFileRoute } from '@tanstack/react-router';

import { DataGrid, textEditor } from '../../src';
import type { Column, RenderRowProps } from '../../src';
import { DraggableRowRenderer } from '../components';
import { useDirection } from '../directionContext';

export const Route = createFileRoute('/RowsReordering')({
  component: RowsReordering
});

interface Row {
  id: number;
  task: string;
  complete: number;
  priority: string;
  issueType: string;
}

function createRows(): readonly Row[] {
  const rows: Row[] = [];

  for (let i = 1; i < 500; i++) {
    rows.push({
      id: i,
      task: `Task ${i}`,
      complete: Math.min(100, Math.round(Math.random() * 110)),
      priority: ['Critical', 'High', 'Medium', 'Low'][Math.round(Math.random() * 3)],
      issueType: ['Bug', 'Improvement', 'Epic', 'Story'][Math.round(Math.random() * 3)]
    });
  }

  return rows;
}

const columns: readonly Column<Row>[] = [
  {
    key: 'id',
    name: 'ID',
    width: 80
  },
  {
    key: 'task',
    name: 'Title',
    renderEditCell: textEditor
  },
  {
    key: 'priority',
    name: 'Priority'
  },
  {
    key: 'issueType',
    name: 'Issue Type'
  },
  {
    key: 'complete',
    name: '% Complete'
  }
];

function RowsReordering() {
  const direction = useDirection();
  const [rows, setRows] = useState(createRows);

  const renderRow = useCallback((key: React.Key, props: RenderRowProps<Row>) => {
    function onRowReorder(fromIndex: number, toIndex: number) {
      setRows((rows) => {
        const newRows = [...rows];
        newRows.splice(toIndex, 0, newRows.splice(fromIndex, 1)[0]);
        return newRows;
      });
    }

    return <DraggableRowRenderer key={key} {...props} onRowReorder={onRowReorder} />;
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <DataGrid
        columns={columns}
        rows={rows}
        onRowsChange={setRows}
        renderers={{ renderRow }}
        direction={direction}
      />
    </DndProvider>
  );
}
