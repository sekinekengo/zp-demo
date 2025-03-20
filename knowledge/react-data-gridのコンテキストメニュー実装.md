# react-data-grid のコンテキストメニュー実装

## 概要

react-data-grid では、右クリックコンテキストメニューを実装することで、グリッド上での操作性を向上させることができます。このドキュメントでは、KyotsuDataGrid コンポーネントで実装されているコンテキストメニューの仕組みについて解説します。

## コンテキストメニューの実装方法

### 1. スタイル定義

コンテキストメニューのスタイルは、React.CSSProperties を使用して定義します。

```typescript
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
```

### 2. インターフェース定義

コンテキストメニューの機能オプションとコンテキストメニューの状態を管理するためのインターフェースを定義します。

```typescript
// コンテキストメニューの機能オプション
export interface ContextMenuOptions {
  copyRow?: boolean;
  pasteRow?: boolean;
  deleteRow?: boolean;
  addRowBelow?: boolean;
  addRowToBottom?: boolean;
}

// コンテキストメニューの状態
interface ContextMenuState {
  rowIdx: number;
  top: number;
  left: number;
}
```

### 3. 状態管理

コンテキストメニューの表示状態、位置、ホバー状態などを管理するための状態変数を定義します。

```typescript
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
```

### 4. イベントハンドラ

コンテキストメニューの表示位置の調整や、メニュー外をクリックしたときの閉じる動作を実装するためのイベントハンドラを定義します。

```typescript
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
```

### 5. メニュー項目のアクション

各メニュー項目がクリックされたときのアクションを実装します。

```typescript
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
```

### 6. コンテキストメニューの表示

DataGrid の onCellContextMenu プロパティを使用して、セル上で右クリックしたときにコンテキストメニューを表示します。

```typescript
onCellContextMenu={
  isContextMenuEnabled
    ? ({ row }, event) => {
        event.preventDefault();
        const rowIdx = rows.indexOf(row);
        setContextMenu({
          rowIdx,
          top: event.pageY + 5,
          left: event.pageX + 5,
        });
      }
    : undefined
}
```

### 7. コンテキストメニューのレンダリング

React Portal を使用して、コンテキストメニューをドキュメントの body 要素に直接レンダリングします。

```typescript
{
  contextMenu !== null &&
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
            style={hoveredItem === "copy" ? menuItemHoverStyle : menuItemStyle}
            onMouseEnter={() => setHoveredItem("copy")}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={handleCopyRow}
          >
            行をコピー
          </li>
        )}
        {/* 他のメニュー項目 */}
      </ul>,
      document.body
    );
}
```

## 使用方法

KyotsuDataGrid コンポーネントを使用する際に、contextMenuOptions プロパティを指定することで、コンテキストメニューの機能を有効/無効にすることができます。

```tsx
<KyotsuDataGrid
  columns={reorderedColumns}
  rows={sortedRows}
  onRowsChange={handleRowsChange}
  rowKeyGetter={(row) => row.id}
  sortColumns={sortColumns}
  onSortColumnsChange={onSortColumnsChange}
  onColumnsReorder={onColumnsReorder}
  defaultColumnOptions={{
    minWidth: 80,
    resizable: true,
  }}
  className="fill-grid"
  contextMenuOptions={{
    copyRow: true,
    pasteRow: true,
    deleteRow: true,
    addRowBelow: true,
    addRowToBottom: true,
  }}
  createEmptyRow={createEmptyRow}
/>
```

## 重要なポイント

1. **React Portal**: `createPortal`を使用して、コンテキストメニューを DOM ツリーの別の場所（document.body）にレンダリングしています。これにより、コンテキストメニューがグリッドのコンテナに制限されず、画面上の任意の位置に表示できます。

2. **位置調整**: コンテキストメニューが画面からはみ出さないように、表示位置を自動調整しています。

3. **条件付きレンダリング**: 各メニュー項目は`contextMenuOptions`の設定に基づいて条件付きでレンダリングされます。

4. **ホバー効果**: `onMouseEnter`と`onMouseLeave`イベントを使用して、メニュー項目のホバー効果を実装しています。

5. **クリック外処理**: コンテキストメニュー外をクリックしたときに閉じる処理が実装されています。

6. **スタイル定義**: インラインスタイルを使用して、コンテキストメニューのスタイルを定義しています。
