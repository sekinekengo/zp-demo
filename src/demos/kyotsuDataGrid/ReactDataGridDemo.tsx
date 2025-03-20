import React, { useState, useCallback, useMemo } from "react";
import { SortColumn, Column, textEditor } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { Product, productData } from "../../data/productData";
import KyotsuDataGrid, { NumberEditor, SelectEditor } from "../../components/KyotsuDataGrid"

// 商品カテゴリーの選択肢
const categories = [
  "",
  "電子機器",
  "アクセサリー",
  "オーディオ",
  "ストレージ",
  "その他",
];

// 商品ステータスの選択肢
const statuses = ["", "在庫あり", "残りわずか", "在庫切れ", "入荷待ち"];

const ReactDataGridAdvancedDemo: React.FC = () => {
  // 状態管理
  const [rows, setRows] = useState<Product[]>(productData);
  // 行番号表示オプション - 常に表示
  const showRowNumber = true;

  // カラム定義
  const columns = useMemo<Column<Product>[]>(
    () => [
      {
        key: "id",
        name: "ID",
        frozen: true,
        minWidth: 80,
        draggable: false,
        resizable: false,
      },
      {
        key: "name",
        name: "商品名",
        frozen: true,
        minWidth: 150,
        draggable: true,
        sortable: true,
        resizable: false,
        renderEditCell: textEditor,
      },
      {
        key: "category",
        name: "カテゴリー",
        minWidth: 120,
        draggable: true,
        sortable: true,
        renderEditCell: (p) => <SelectEditor {...p} options={categories} />,
      },
      {
        key: "price",
        name: "価格",
        minWidth: 120,
        renderCell: ({ row }) => <>{`¥${row.price.toLocaleString()}`}</>,
        draggable: true,
        sortable: true,
        renderEditCell: (p) => <NumberEditor {...p} step="1" />,
      },
      {
        key: "discount",
        name: "割引率",
        minWidth: 100,
        renderCell: ({ row }) => <>{`${row.discount?.toFixed(2) || 0}%`}</>,
        draggable: true,
        sortable: true,
        renderEditCell: (p) => <NumberEditor {...p} step="0.01" />,
      },
      {
        key: "stock",
        name: "在庫数",
        minWidth: 100,
        draggable: true,
        sortable: true,
        renderEditCell: (p) => <NumberEditor {...p} step="1" />,
      },
      {
        key: "rating",
        name: "評価",
        minWidth: 100,
        renderCell: ({ row }) => <>{`${row.rating?.toFixed(1) || 0}`}</>,
        draggable: true,
        sortable: true,
        renderEditCell: (p) => (
          <NumberEditor {...p} step="0.1" min="0" max="5" />
        ),
      },
      {
        key: "status",
        name: "ステータス",
        minWidth: 120,
        draggable: true,
        sortable: true,
        renderEditCell: (p) => <SelectEditor {...p} options={statuses} />,
      },
      {
        key: "lastUpdated",
        name: "最終更新日",
        minWidth: 150,
        draggable: true,
        sortable: true,
        renderEditCell: textEditor,
      },
    ],
    []
  );

  // ソート状態管理
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

  // 列の順序管理
  const [columnsOrder, setColumnsOrder] = useState<readonly number[]>(() =>
    columns.map((_, index) => index)
  );

  // 行データの更新ハンドラ
  const handleRowsChange = (newRows: Product[]) => {
    setRows(newRows);
  };

  // ソート変更ハンドラ
  const onSortColumnsChange = useCallback((sortColumns: SortColumn[]) => {
    setSortColumns(sortColumns.slice(-1));
  }, []);

  // 列の並び替え
  const reorderedColumns = useMemo(() => {
    return columnsOrder.map((index) => columns[index]);
  }, [columnsOrder, columns]);

  // 列の入れ替えハンドラ
  const onColumnsReorder = useCallback(
    (sourceKey: string, targetKey: string) => {
      setColumnsOrder((columnsOrder) => {
        const sourceColumnOrderIndex = columnsOrder.findIndex(
          (index) => columns[index].key === sourceKey
        );
        const targetColumnOrderIndex = columnsOrder.findIndex(
          (index) => columns[index].key === targetKey
        );
        const sourceColumnOrder = columnsOrder[sourceColumnOrderIndex];
        const newColumnsOrder = [...columnsOrder];
        newColumnsOrder.splice(sourceColumnOrderIndex, 1);
        newColumnsOrder.splice(targetColumnOrderIndex, 0, sourceColumnOrder);
        return newColumnsOrder;
      });
    },
    [columns]
  );

  // 新しい空の行を作成する関数
  const createEmptyRow = (): Product => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}/${now.getMonth() + 1
      }/${now.getDate()}`;

    return {
      id: 0, // 後で適切なIDに置き換える
      name: "",
      category: categories[0],
      price: 0,
      stock: 0,
      status: statuses[0],
      lastUpdated: dateStr,
      discount: 0,
      rating: 0,
    };
  };

  return (
    <div
      className="grid-demo-wrapper"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header style={{ padding: "16px", borderBottom: "1px solid #ddd" }}>
        <h2 style={{ margin: 0, color: "#333" }}>
          react-data-grid 高度な機能デモ
        </h2>
      </header>
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          overflow: "hidden",
        }}
      >
        <KyotsuDataGrid
          columns={reorderedColumns}
          rows={rows}
          onRowsChange={handleRowsChange}
          rowKeyGetter={(row) => row.id}
          sortColumns={sortColumns}
          onSortColumnsChange={onSortColumnsChange}
          onColumnsReorder={onColumnsReorder}
          defaultColumnOptions={{
            minWidth: 80,
            resizable: true,
          }}
          contextMenuOptions={{
            copyRow: true,
            pasteRow: true,
            deleteRow: true,
            addRowBelow: true,
            addRowToBottom: true,
          }}
          createEmptyRow={createEmptyRow}
          showRowNumber={showRowNumber}
          useInternalSort={true}
        />

        <div>
          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>実装機能：</p>
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            <li>カラム固定機能（ID、商品名が固定）</li>
            <li>行番号表示機能（チェックボックスでオン/オフ切替可能）</li>
            <li>ソート機能（カラムヘッダーをクリックでソート）</li>
            <li>カラムのドラッグ＆ドロップによる並べ替え</li>
            <li>カラムのリサイズ機能（ID列と商品名列を除く）</li>
            <li>カスタムセルレンダリング（価格表示）</li>
            <li>セル編集機能（ダブルクリックで編集開始）</li>
            <li>文字列・数値・セレクトボックスによる適切な入力方法</li>
            <li>右クリックコンテキストメニュー機能</li>
            <li>行のコピー・ペースト機能</li>
            <li>行の削除機能</li>
            <li>行の挿入機能（下に挿入・最下部に追加）</li>
            <li>列幅の自動調整（Auto）とminWidth設定</li>
          </ul>
        </div>
      </main>

      <style>{`
        /* グリッドのスタイル */
        .fill-grid {
          block-size: 100%;
          min-height: 200px; /* 最小高さを200pxに設定 */
          flex: 1;
        }
        
        /* コンテキストメニューのスタイル */
        .context-menu li:hover {
          background-color: #f0f0f0;
        }

        /* テキストエディタのスタイル */
        .rdg-text-editor {
          appearance: none;
          box-sizing: border-box;
          inline-size: 100%;
          block-size: 100%;
          padding-block: 0;
          padding-inline: 6px;
          border: 2px solid #ccc;
          vertical-align: top;
          color: var(--rdg-color);
          background-color: var(--rdg-background-color);
          font-family: inherit;
          font-size: var(--rdg-font-size);
        }
        
        .rdg-text-editor:focus {
          border-color: var(--rdg-selection-color);
          outline: none;
        }
        
        /* セレクトボックスのスタイル */
        select.rdg-text-editor {
          padding-inline-end: 0;
          appearance: auto;
        }
      `}</style>
    </div>
  );
};

export default ReactDataGridAdvancedDemo;
