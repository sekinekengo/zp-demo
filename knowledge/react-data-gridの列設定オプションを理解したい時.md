# react-data-grid の列設定オプションを理解したい時

react-data-grid では、列の動作や見た目を細かく制御するための様々なオプションが用意されています。このドキュメントでは、ソースコードから読み取れる実装詳細と利用可能なオプションについて説明します。

## 列の基本設定（Column インターフェース）

react-data-grid の列は、`Column`インターフェースで定義されています。ソースコードから抽出した主要なプロパティは以下の通りです：

```typescript
export interface Column<TRow, TSummaryRow = unknown> {
  /** 列の名前。デフォルトではヘッダーセルに表示されます */
  readonly name: string | ReactElement;

  /** 各列を区別するためのユニークなキー */
  readonly key: string;

  /**
   * 列の幅。指定されていない場合、グリッドの幅と他の列の指定された幅に基づいて自動的に決定されます
   * @default 'auto'
   */
  readonly width?: Maybe<number | string>;

  /**
   * 列の最小幅（ピクセル単位）
   * @default '50px'
   */
  readonly minWidth?: Maybe<number>;

  /** 列の最大幅（ピクセル単位） */
  readonly maxWidth?: Maybe<number>;

  /** セルのクラス名 */
  readonly cellClass?: Maybe<string | ((row: TRow) => Maybe<string>)>;

  /** ヘッダーセルのクラス名 */
  readonly headerCellClass?: Maybe<string>;

  /** サマリーセルのクラス名 */
  readonly summaryCellClass?: Maybe<
    string | ((row: TSummaryRow) => Maybe<string>)
  >;

  /** セルの内容をレンダリングするための関数 */
  readonly renderCell?: Maybe<
    (props: RenderCellProps<TRow, TSummaryRow>) => ReactNode
  >;

  /** 列のヘッダーセルの内容をレンダリングするための関数 */
  readonly renderHeaderCell?: Maybe<
    (props: RenderHeaderCellProps<TRow, TSummaryRow>) => ReactNode
  >;

  /** サマリーセルの内容をレンダリングするための関数 */
  readonly renderSummaryCell?: Maybe<
    (props: RenderSummaryCellProps<TSummaryRow, TRow>) => ReactNode
  >;

  /** グループセルの内容をレンダリングするための関数 */
  readonly renderGroupCell?: Maybe<
    (props: RenderGroupCellProps<TRow, TSummaryRow>) => ReactNode
  >;

  /** 編集セルの内容をレンダリングするための関数。設定すると、列は自動的に編集可能になります */
  readonly renderEditCell?: Maybe<
    (props: RenderEditCellProps<TRow, TSummaryRow>) => ReactNode
  >;

  /** セル編集を有効にします。設定されていて、editorプロパティが指定されていない場合、テキスト入力がセルエディタとして使用されます */
  readonly editable?: Maybe<boolean | ((row: TRow) => boolean)>;

  /** 列のセルが複数の列にまたがるかどうかを決定します */
  readonly colSpan?: Maybe<
    (args: ColSpanArgs<TRow, TSummaryRow>) => Maybe<number>
  >;

  /** 列が固定されているかどうかを決定します */
  readonly frozen?: Maybe<boolean>;

  /** 列のリサイズを有効にします */
  readonly resizable?: Maybe<boolean>;

  /** 列のソートを有効にします */
  readonly sortable?: Maybe<boolean>;

  /** 列のドラッグを有効にします */
  readonly draggable?: Maybe<boolean>;

  /** 列が最初にソートされるときに、昇順ではなく降順にソート順を設定します */
  readonly sortDescendingFirst?: Maybe<boolean>;

  /** エディタオプション */
  readonly editorOptions?: Maybe<{
    /**
     * 編集セルに加えてセルの内容をレンダリングします。
     * エディタがグリッドの外部（モーダルなど）でレンダリングされる場合にこのオプションを有効にします。
     * デフォルトでは、編集セルが開いているときにセルの内容はレンダリングされません。
     * @default false
     */
    readonly displayCellContent?: Maybe<boolean>;

    /** @default true */
    readonly commitOnOutsideClick?: Maybe<boolean>;
  }>;
}
```

## デフォルト列オプション（DefaultColumnOptions）

`DataGrid`コンポーネントの`defaultColumnOptions`プロパティを使用して、すべての列に適用されるデフォルト設定を指定できます。設定可能なプロパティは以下の通りです：

```typescript
export type DefaultColumnOptions<R, SR> = Pick<
  Column<R, SR>,
  | "renderCell"
  | "renderHeaderCell"
  | "width"
  | "minWidth"
  | "maxWidth"
  | "resizable"
  | "sortable"
  | "draggable"
>;
```

つまり、以下のプロパティをデフォルト設定として指定できます：

- `renderCell`: セルの内容をレンダリングする関数
- `renderHeaderCell`: ヘッダーセルの内容をレンダリングする関数
- `width`: 列の幅
- `minWidth`: 列の最小幅
- `maxWidth`: 列の最大幅
- `resizable`: 列のリサイズを有効/無効にする
- `sortable`: 列のソートを有効/無効にする
- `draggable`: 列のドラッグを有効/無効にする

## 使用例

```tsx
<DataGrid
  columns={columns}
  rows={rows}
  defaultColumnOptions={{
    minWidth: 100,
    resizable: true,
    sortable: true,
    draggable: true,
  }}
  // 他のプロパティ...
/>
```

## 優先順位と動作

1. 個別の列の設定は、デフォルト設定よりも優先されます
2. デフォルト値が設定されていない場合、react-data-grid の内部デフォルト値が使用されます
   - 例: `minWidth`のデフォルト値は 50px
   - 例: `width`のデフォルト値は'auto'

## 列のリサイズに関する実装詳細

ソースコードから、列のリサイズに関する実装詳細を見ることができます：

```typescript
// HeaderCell.tsxより抜粋
const cellResizable = css`
  @layer rdg.HeaderCell {
    touch-action: none;
  }
`;

const cellResizableClassname = `rdg-cell-resizable ${cellResizable}`;

export const resizeHandleClassname = css`
  @layer rdg.HeaderCell {
    cursor: col-resize;
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;
    inset-block-end: 0;
    inline-size: 10px;
  }
`;
```

リサイズ可能な列には特別な CSS クラスが適用され、右端に幅 10px のリサイズハンドルが表示されます。このハンドルをドラッグすることで列幅を変更できます。

## テストコードから見る動作

テストコードからも、列のリサイズに関する動作を確認できます：

```typescript
// resizable.test.tsxより抜粋
test("cannot not resize or auto resize column when resizable is not specified", () => {
  setup<Row, unknown>({ columns, rows: [] });
  const [col1] = getHeaderCells();
  expect(queryResizeHandle(col1.element())).not.toBeInTheDocument();
});

test("should resize column when dragging the handle", async () => {
  const onColumnResize = vi.fn();
  setup<Row, unknown>({ columns, rows: [], onColumnResize });
  const [, col2] = getHeaderCells();
  const grid = getGrid();
  expect(onColumnResize).not.toHaveBeenCalled();
  await expect
    .element(grid)
    .toHaveStyle({ gridTemplateColumns: "100px 200px" });
  await resize({ column: col2.element(), resizeBy: -50 });
  await expect
    .element(grid)
    .toHaveStyle({ gridTemplateColumns: "100px 150px" });
  expect(onColumnResize).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining(columns[1]),
    150
  );
});
```

これらのテストから、以下のことがわかります：

- `resizable`が指定されていない列にはリサイズハンドルが表示されません
- リサイズハンドルをドラッグすると列幅が変更され、`onColumnResize`イベントが発火します
- 列には`minWidth`と`maxWidth`の制約があり、これらの範囲内でのみリサイズが可能です

## まとめ

react-data-grid では、列の設定を細かく制御するための豊富なオプションが用意されています。特に、`resizable`、`sortable`、`draggable`などのプロパティを使用することで、ユーザーインターフェースの動作を柔軟にカスタマイズできます。また、`defaultColumnOptions`を使用することで、すべての列に共通の設定を一度に適用することができます。
