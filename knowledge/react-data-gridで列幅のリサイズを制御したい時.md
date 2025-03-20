# react-data-grid で列幅のリサイズを制御したい時

react-data-grid では、列幅のリサイズ機能を細かく制御することができます。特定の列だけリサイズを無効にしたり、すべての列のリサイズをデフォルトで無効にしたりすることが可能です。

## 特定の列のリサイズを無効にする方法

各列の定義で`resizable`プロパティを`false`に設定することで、その列のリサイズを無効にできます。

```tsx
const columns = [
  {
    key: "id",
    name: "ID",
    width: 80,
    resizable: false, // この列はリサイズできない
  },
  {
    key: "name",
    name: "商品名",
    width: 150,
    resizable: false, // この列はリサイズできない
  },
  {
    key: "category",
    name: "カテゴリー",
    width: 120,
    // resizableを指定しない場合はデフォルト設定に従う
  },
  // 他の列...
];
```

## すべての列のリサイズをデフォルトで制御する方法

`DataGrid`コンポーネントの`defaultColumnOptions`プロパティを使用して、すべての列のデフォルト設定を一度に変更できます。

```tsx
<DataGrid
  columns={columns}
  rows={rows}
  defaultColumnOptions={{
    resizable: false, // すべての列でリサイズを無効にする
    width: 120,
  }}
  // 他のプロパティ...
/>
```

## 組み合わせて使用する

デフォルト設定と個別の列の設定を組み合わせることで、より柔軟な制御が可能です。

### 例 1: ほとんどの列でリサイズを有効にし、特定の列だけ無効にする

```tsx
// 列の定義
const columns = [
  {
    key: "id",
    name: "ID",
    frozen: true,
    width: 80,
    draggable: false,
    resizable: false, // リサイズ不可
  },
  // 他の列はデフォルト設定に従う
];

// DataGridコンポーネント
<DataGrid
  columns={columns}
  rows={rows}
  defaultColumnOptions={{
    resizable: true, // デフォルトではリサイズ可能
  }}
/>;
```

### 例 2: ほとんどの列でリサイズを無効にし、特定の列だけ有効にする

```tsx
// 列の定義
const columns = [
  {
    key: "category",
    name: "カテゴリー",
    width: 120,
    resizable: true, // この列はリサイズ可能
  },
  // 他の列はデフォルト設定に従う
];

// DataGridコンポーネント
<DataGrid
  columns={columns}
  rows={rows}
  defaultColumnOptions={{
    resizable: false, // デフォルトではリサイズ不可
  }}
/>;
```

## 優先順位

個別の列の設定は、デフォルト設定よりも優先されます。つまり：

1. 列に明示的に`resizable`が設定されている場合、その値が使用されます
2. 列に`resizable`が設定されていない場合、`defaultColumnOptions.resizable`の値が使用されます
3. どちらも設定されていない場合、デフォルトでは`undefined`となり、リサイズは有効になります

## 実装例

以下は、ID 列と商品名列のリサイズを無効にし、他の列はリサイズ可能にする実装例です：

```tsx
const columns = useMemo<Column<Product>[]>(
  () => [
    {
      key: "id",
      name: "ID",
      frozen: true,
      width: 80,
      draggable: false,
      resizable: false, // リサイズ不可
    },
    {
      key: "name",
      name: "商品名",
      frozen: true,
      editable: true,
      width: 150,
      draggable: true,
      sortable: true,
      resizable: false, // リサイズ不可
    },
    // 他の列...
  ],
  []
);

// DataGridコンポーネント
<DataGrid
  columns={reorderedColumns}
  rows={sortedRows}
  defaultColumnOptions={{
    resizable: true, // デフォルトではリサイズ可能
    width: 120,
  }}
  // 他のプロパティ...
/>;
```

この設定により、ID 列と商品名列はユーザーがリサイズできなくなりますが、他の列は引き続きリサイズ可能です。
