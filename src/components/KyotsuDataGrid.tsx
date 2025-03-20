import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import { DataGrid, Column, SortColumn } from "react-data-grid";
import "react-data-grid/lib/styles.css";
import { createPortal } from "react-dom";

// テキストエディタのクラス名（react-data-gridのスタイルに合わせる）
export const textEditorClassname = "rdg-text-editor";

// 数値入力用のカスタムエディタ
// onBlurイベントを防止して入力モードが解除されないようにする
export function NumberEditor<T>({
  row,
  column,
  onRowChange,
  onClose,
  ...props
}: {
  row: T;
  column: { key: string };
  onRowChange: (row: T, commitChanges?: boolean) => void;
  onClose: (commitChanges?: boolean, shouldFocusCell?: boolean) => void;
  [key: string]: unknown;
}) {
  const columnKey = column.key as keyof T;
  const value = row[columnKey] as unknown as number;

  // 数値入力時のハンドラ
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === "" ? 0 : Number(e.target.value);
    onRowChange({ ...row, [columnKey]: newValue } as T);
  };

  // キー入力時のハンドラ
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onClose(true);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <input
      className={textEditorClassname}
      style={{ appearance: "auto" }} // スピナーを表示するためにautoに設定
      type="number"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      autoFocus
      {...props}
    />
  );
}

// セレクトボックス用のカスタムエディタ
export function SelectEditor<T>({
  row,
  column,
  onRowChange,
  options,
}: {
  row: T;
  column: { key: string };
  onRowChange: (row: T, commitChanges?: boolean) => void;
  options: string[];
}) {
  const columnKey = column.key as keyof T;
  const value = row[columnKey] as unknown as string;

  return (
    <select
      autoFocus
      className={textEditorClassname}
      value={value}
      onChange={(e) =>
        onRowChange({ ...row, [columnKey]: e.target.value } as T, true)
      }
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

// コンテキストメニューのスタイル
const contextMenuStyle: React.CSSProperties = {
  position: "absolute",
  backgroundColor: "#ffffff",
  border: "1px solid #ccc",
  boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.3)",
  padding: "8px 0",
  listStyle: "none",
  margin: 0,
  borderRadius: "4px",
  zIndex: 1000,
};

const menuItemStyle: React.CSSProperties = {
  padding: "8px 16px",
  cursor: "pointer",
  fontSize: "14px",
};

const menuItemHoverStyle: React.CSSProperties = {
  ...menuItemStyle,
  backgroundColor: "#f0f0f0",
};

const menuItemDisabledStyle: React.CSSProperties = {
  ...menuItemStyle,
  color: "#ccc",
  cursor: "default",
};

// コンテキストメニューの機能オプション
export interface ContextMenuOptions {
  copyRow?: boolean;
  pasteRow?: boolean;
  deleteRow?: boolean;
  addRowBelow?: boolean;
  addRowToBottom?: boolean;
}

// IDを持つオブジェクトの型
interface WithId {
  id: number;
}

// KyotsuDataGridのプロップス
export interface KyotsuDataGridProps<R extends object> {
  columns: readonly Column<R>[];
  rows: readonly R[];
  onRowsChange?: (rows: R[]) => void;
  rowKeyGetter: (row: R) => React.Key;
  sortColumns?: readonly SortColumn[];
  onSortColumnsChange?: (sortColumns: SortColumn[]) => void;
  onColumnsReorder?: (sourceKey: string, targetKey: string) => void;
  className?: string;
  contextMenuOptions?: ContextMenuOptions;
  createEmptyRow?: (baseRow?: R) => R;
  defaultColumnOptions?: {
    minWidth?: number;
    resizable?: boolean;
  };
  // 行番号表示オプション
  showRowNumber?: boolean;
  // 内部でソートを行うかどうか
  useInternalSort?: boolean;
  // その他のDataGridプロパティ
  [key: string]: unknown;
}

// コンテキストメニューの状態
interface ContextMenuState {
  rowIdx: number;
  top: number;
  left: number;
}

function KyotsuDataGrid<R extends object>({
  columns,
  rows,
  onRowsChange,
  rowKeyGetter,
  sortColumns,
  onSortColumnsChange,
  onColumnsReorder,
  className = "fill-grid",
  contextMenuOptions = {
    copyRow: true,
    pasteRow: true,
    deleteRow: true,
    addRowBelow: true,
    addRowToBottom: true,
  },
  createEmptyRow,
  defaultColumnOptions = {
    minWidth: 80,
    resizable: true,
  },
  showRowNumber = false,
  useInternalSort = false,
  ...rest
}: KyotsuDataGridProps<R>) {
  // コンテキストメニューの状態管理
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [copiedRow, setCopiedRow] = useState<R | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const initialRenderRef = useRef(true);

  // 各列にデフォルト設定を適用
  const processedColumns = React.useMemo(() => {
    // 行番号表示が有効な場合、行番号列を追加
    const finalColumns = [
      ...columns.map((column) => ({
        ...column,
        width: column.width || "auto",
        minWidth: column.minWidth || defaultColumnOptions.minWidth,
        resizable:
          column.resizable !== undefined
            ? column.resizable
            : defaultColumnOptions.resizable,
      })),
    ];

    // 行番号列を先頭に追加
    if (showRowNumber) {
      finalColumns.unshift({
        key: "__row_number__",
        name: "",
        width: 30,
        minWidth: 30,
        frozen: true,
        resizable: false,
        sortable: false,
        draggable: false,

        renderCell: ({ rowIdx }) => (
          <div
            style={{
              textAlign: "center",
              backgroundColor: "var(--rdg-header-background-color)",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {rowIdx + 1}
          </div>
        ),
      });
    }

    return finalColumns;
  }, [columns, defaultColumnOptions, showRowNumber]);

  // コンテキストメニューの外側をクリックしたときに閉じる
  useEffect(() => {
    if (!contextMenu) return;

    function onClick(event: MouseEvent) {
      if (
        event.target instanceof Node &&
        menuRef.current?.contains(event.target)
      ) {
        return;
      }
      setContextMenu(null);
    }

    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("click", onClick);
    };
  }, [contextMenu]);

  // コンテキストメニューの位置を調整する
  useLayoutEffect(() => {
    if (contextMenu === null) {
      setMenuPosition(null);
      initialRenderRef.current = true;
      return;
    }

    // 初期表示時はcontextMenuの位置をそのまま使用
    if (initialRenderRef.current) {
      setMenuPosition({ top: contextMenu.top, left: contextMenu.left });
      initialRenderRef.current = false;
      return;
    }

    // メニューの要素が存在する場合、画面からはみ出さないように調整
    if (menuRef.current) {
      let top = contextMenu.top;
      let left = contextMenu.left;

      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 右側がはみ出す場合
      if (left + menuRect.width > viewportWidth) {
        left = viewportWidth - menuRect.width - 10; // 10pxの余白
      }

      // 下側がはみ出す場合
      if (top + menuRect.height > viewportHeight) {
        top = viewportHeight - menuRect.height - 10; // 10pxの余白
      }

      // 位置が負にならないように調整
      if (left < 0) left = 10;
      if (top < 0) top = 10;

      setMenuPosition({ top, left });
    }
  }, [contextMenu]);

  // 新しい行のIDを生成する関数（IDフィールドがある場合）
  const generateNewId = (): number => {
    if (rows.length === 0) return 1;

    // IDフィールドがある場合
    if ("id" in rows[0]) {
      const ids = rows
        .map((row) => (row as unknown as WithId).id)
        .filter((id) => typeof id === "number");
      return ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }

    return 1;
  };

  // 行のコピー
  const handleCopyRow = () => {
    if (contextMenu === null || !onRowsChange) return;
    setCopiedRow(rows[contextMenu.rowIdx]);
    setContextMenu(null);
  };

  // 行のペースト（上書き）
  const handlePasteRow = () => {
    if (contextMenu === null || copiedRow === null || !onRowsChange) return;
    const newRows = [...rows] as R[];

    // IDフィールドがある場合は保持
    if ("id" in newRows[contextMenu.rowIdx]) {
      const targetId = (newRows[contextMenu.rowIdx] as unknown as WithId).id;
      newRows[contextMenu.rowIdx] = { ...copiedRow, id: targetId } as R;
    } else {
      newRows[contextMenu.rowIdx] = { ...copiedRow } as R;
    }

    onRowsChange(newRows);
    setContextMenu(null);
  };

  // 行の削除
  const handleDeleteRow = () => {
    if (contextMenu === null || !onRowsChange) return;
    const newRows = [...rows] as R[];
    newRows.splice(contextMenu.rowIdx, 1);
    onRowsChange(newRows);
    setContextMenu(null);
  };

  // 行の下に新規行を追加
  const handleAddRowBelow = () => {
    if (contextMenu === null || !onRowsChange || !createEmptyRow) return;
    const newRow = createEmptyRow();

    // IDフィールドがある場合は新しいIDを設定
    if ("id" in newRow) {
      (newRow as unknown as WithId).id = generateNewId();
    }

    const newRows = [...rows] as R[];
    newRows.splice(contextMenu.rowIdx + 1, 0, newRow);
    onRowsChange(newRows);
    setContextMenu(null);
  };

  // 最下部に新規行を追加
  const handleAddRowToBottom = () => {
    if (!onRowsChange || !createEmptyRow) return;
    const newRow = createEmptyRow();

    // IDフィールドがある場合は新しいIDを設定
    if ("id" in newRow) {
      (newRow as unknown as WithId).id = generateNewId();
    }

    onRowsChange([...rows, newRow] as R[]);
    setContextMenu(null);
  };

  // コンテキストメニューが有効かどうか
  const isContextMenuEnabled =
    onRowsChange &&
    (contextMenuOptions.copyRow ||
      contextMenuOptions.pasteRow ||
      contextMenuOptions.deleteRow ||
      (contextMenuOptions.addRowBelow && createEmptyRow) ||
      (contextMenuOptions.addRowToBottom && createEmptyRow));

  // ペースト機能が有効かどうか
  const isPasteEnabled = contextMenuOptions.pasteRow && copiedRow !== null;

  // 内部的にソートされた行データを生成
  const sortedRows = React.useMemo((): readonly R[] => {
    if (!useInternalSort || !sortColumns || sortColumns.length === 0)
      return rows;
    const { columnKey, direction } = sortColumns[0];

    let result = [...rows] as R[];
    const firstRow = rows[0];

    if (firstRow) {
      // 型情報を取得するために最初の行を調べる
      const value = firstRow[columnKey as keyof R];

      if (typeof value === "string") {
        // 文字列型の場合
        result = result.sort((a, b) =>
          String(a[columnKey as keyof R]).localeCompare(
            String(b[columnKey as keyof R])
          )
        );
      } else if (
        typeof value === "number" ||
        value === undefined ||
        value === null
      ) {
        // 数値型の場合（または未定義/nullの場合は0として扱う）
        result = result.sort((a, b) => {
          const aVal = a[columnKey as keyof R] as unknown as
            | number
            | undefined
            | null;
          const bVal = b[columnKey as keyof R] as unknown as
            | number
            | undefined
            | null;
          return (
            (typeof aVal === "number" ? aVal : 0) -
            (typeof bVal === "number" ? bVal : 0)
          );
        });
      } else if (value instanceof Date) {
        // 日付型の場合
        result = result.sort((a, b) => {
          const aDate = a[columnKey as keyof R] as unknown as Date;
          const bDate = b[columnKey as keyof R] as unknown as Date;
          return aDate.getTime() - bDate.getTime();
        });
      }
    }

    return direction === "DESC" ? result.reverse() : result;
  }, [rows, sortColumns, useInternalSort]);

  // 表示するデータ（内部ソートを使う場合はsortedRows、そうでなければrows）
  const displayRows = useInternalSort ? sortedRows : rows;

  return (
    <>
      <DataGrid
        columns={processedColumns}
        rows={displayRows}
        onRowsChange={onRowsChange}
        rowKeyGetter={rowKeyGetter}
        sortColumns={sortColumns}
        onSortColumnsChange={onSortColumnsChange}
        onColumnsReorder={onColumnsReorder}
        className={className}
        onCellContextMenu={
          isContextMenuEnabled
            ? ({ row }, event) => {
              event.preventDefault();
              const rowIdx = displayRows.indexOf(row);
              setContextMenu({
                rowIdx,
                top: event.pageY + 5,
                left: event.pageX + 5,
              });
            }
            : undefined
        }
        {...rest}
      />

      {contextMenu !== null &&
        isContextMenuEnabled &&
        createPortal(
          <ul
            ref={menuRef}
            style={{
              ...contextMenuStyle,
              top: menuPosition?.top ?? 0,
              left: menuPosition?.left ?? 0,
              visibility: menuPosition ? "visible" : "hidden",
            }}
            className="context-menu"
          >
            {contextMenuOptions.copyRow && (
              <li
                style={
                  hoveredItem === "copy" ? menuItemHoverStyle : menuItemStyle
                }
                onMouseEnter={() => setHoveredItem("copy")}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={handleCopyRow}
              >
                行をコピー
              </li>
            )}
            {contextMenuOptions.pasteRow && (
              <li
                style={
                  copiedRow === null
                    ? menuItemDisabledStyle
                    : hoveredItem === "paste"
                      ? menuItemHoverStyle
                      : menuItemStyle
                }
                onMouseEnter={() => isPasteEnabled && setHoveredItem("paste")}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={isPasteEnabled ? handlePasteRow : undefined}
              >
                行をペースト
              </li>
            )}
            {contextMenuOptions.deleteRow && (
              <li
                style={
                  hoveredItem === "delete" ? menuItemHoverStyle : menuItemStyle
                }
                onMouseEnter={() => setHoveredItem("delete")}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={handleDeleteRow}
              >
                行を削除
              </li>
            )}
            {contextMenuOptions.addRowBelow && createEmptyRow && (
              <li
                style={
                  hoveredItem === "addBelow"
                    ? menuItemHoverStyle
                    : menuItemStyle
                }
                onMouseEnter={() => setHoveredItem("addBelow")}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={handleAddRowBelow}
              >
                下に行を挿入
              </li>
            )}
            {contextMenuOptions.addRowToBottom && createEmptyRow && (
              <li
                style={
                  hoveredItem === "addBottom"
                    ? menuItemHoverStyle
                    : menuItemStyle
                }
                onMouseEnter={() => setHoveredItem("addBottom")}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={handleAddRowToBottom}
              >
                最下部に行を追加
              </li>
            )}
          </ul>,
          document.body
        )}

      <style>{`
        /* グリッドのスタイル */
        .fill-grid {
          block-size: 100%;
          min-height: 200px; /* 最小高さを200pxに設定 */
          flex: 1;
          --rdg-header-background-color: #f2f2bb; /* コンポーネント内でのみヘッダーの背景色を上書き */
        }
        
        /* 行番号列のセルのスタイル（renderCellの親要素） */
        .rdg-cell[aria-colindex="1"] {
          padding: 0 !important;
        }
        
        /* 行番号列のセルを特定する別のセレクタ */
        .rdg-row > div:first-child {
          padding: 0 !important;
        }
        
        /* 行番号列のキー名を使用した特定のセレクタ */
        [aria-selected="false"][role="row"] [aria-colindex="1"][role="gridcell"],
        [aria-selected="true"][role="row"] [aria-colindex="1"][role="gridcell"],
        [role="row"] > [data-column-key="__row_number__"] {
          padding: 0 !important;
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
        }
      `}</style>
    </>
  );
}

export default KyotsuDataGrid;
