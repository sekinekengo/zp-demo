# react-data-grid のレイアウト構造と最小高さ設定

react-data-grid を使用する際のレイアウト構造と最小高さ設定について、実装方法と効果を説明します。公式デモと同様のレイアウトを実現するための方法と、DataGrid の表示領域を適切に確保するための設定について解説します。

## 公式デモのレイアウト構造

react-data-grid の公式デモでは、以下のような構造でレイアウトが実装されています：

1. **フレックスボックスレイアウト**：全体を`flex`レイアウトで構成し、縦方向に配置
2. **ヘッダー部分**：上部に固定のヘッダーを配置
3. **メインコンテンツ**：`flex: 1`で残りのスペースを占有
4. **DataGrid**：メインコンテンツ内に配置され、`.fill-grid`クラスで高さを制御

## レイアウト実装の基本構造

```tsx
<div
  className="grid-demo-wrapper"
  style={{ height: "100vh", display: "flex", flexDirection: "column" }}
>
  <header style={{ padding: "16px", borderBottom: "1px solid #ddd" }}>
    <h2 style={{ margin: 0, color: "#333" }}>
      react-data-grid デモ（公式デモスタイル）
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
    <DataGrid
      columns={columns}
      rows={rows}
      // その他のプロパティ...
      className="fill-grid"
    />

    {/* 機能説明部分 */}
    <div className="features">{/* 機能リスト */}</div>
  </main>

  <style>{`
    /* DataGridのスタイル */
    .fill-grid {
      block-size: 100%;
      min-height: 200px;
      flex: 1;
    }
  `}</style>
</div>
```

## App.css の制約解除

Vite などのフレームワークを使用している場合、デフォルトのスタイル（App.css）に制約がある場合があります。これらの制約を解除するために、以下のようなコードを使用します：

```tsx
useEffect(() => {
  // 元のスタイルを保存
  const originalRootStyle = document.getElementById("root")?.style.cssText;
  const originalBodyStyle = document.body.style.cssText;

  // スタイルを上書き
  if (document.getElementById("root")) {
    document.getElementById("root")!.style.maxWidth = "none";
    document.getElementById("root")!.style.padding = "0";
    document.getElementById("root")!.style.margin = "0";
    document.getElementById("root")!.style.width = "100%";
    document.getElementById("root")!.style.display = "block";
  }

  document.body.style.display = "block";
  document.body.style.placeItems = "normal";
  document.body.style.margin = "0";
  document.body.style.padding = "0";

  // コンポーネントのアンマウント時に元のスタイルに戻す
  return () => {
    if (document.getElementById("root") && originalRootStyle) {
      document.getElementById("root")!.style.cssText = originalRootStyle;
    }
    if (originalBodyStyle) {
      document.body.style.cssText = originalBodyStyle;
    }
  };
}, []);
```

## DataGrid の最小高さ設定

DataGrid の表示領域を適切に確保するために、最小高さを設定することが重要です。これにより、以下のメリットが得られます：

1. **最小表示領域の確保**：データ量が少ない場合でも適切な表示領域を確保
2. **レイアウトの安定性向上**：ウィンドウサイズ変更時のレイアウト崩れを防止
3. **スクロール動作の改善**：十分な高さが確保されることでスクロール操作が容易に

最小高さの設定は、`.fill-grid`クラスに対して行います：

```css
.fill-grid {
  block-size: 100%;
  min-height: 200px; /* 最小高さを200pxに設定 */
  flex: 1;
}
```

## 実装例：ReactDataGridScrollDemo

以下は、公式デモと同様のレイアウト構造を持つ実装例です：

```tsx
const ReactDataGridScrollDemo: React.FC = () => {
  // 状態管理など省略...

  return (
    <div
      className="grid-demo-wrapper"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header style={{ padding: "16px", borderBottom: "1px solid #ddd" }}>
        <h2 style={{ margin: 0, color: "#333" }}>
          react-data-grid スクロールデモ（公式デモスタイル）
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
        <DataGrid
          columns={columns}
          rows={rows}
          rowKeyGetter={rowKeyGetter}
          // その他のプロパティ...
          className="fill-grid"
        />

        <div
          className="features"
          style={{
            marginTop: "16px",
            backgroundColor: "#f5f5f5",
            padding: "15px",
            borderRadius: "4px",
          }}
        >
          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>実装機能：</p>
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            <li>カラム固定機能（ID、名、姓が固定）</li>
            <li>セル内入力機能（ダブルクリックで編集可能）</li>
            {/* その他の機能リスト */}
          </ul>
        </div>
      </main>

      <style>{`
        /* 公式デモと同様のスタイル */
        .fill-grid {
          block-size: 100%;
          min-height: 200px;
          flex: 1;
        }
        
        /* その他のスタイル */
      `}</style>
    </div>
  );
};
```

## 実装例：ReactDataGridAdvancedDemo

より高度な機能を持つ実装例：

```tsx
const ReactDataGridAdvancedDemo: React.FC = () => {
  // 状態管理など省略...

  return (
    <div
      className="grid-demo-wrapper"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <header style={{ padding: "16px", borderBottom: "1px solid #ddd" }}>
        <h2 style={{ margin: 0, color: "#333" }}>
          react-data-grid 基本機能デモ（公式デモスタイル）
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
        <DataGrid
          columns={reorderedColumns}
          rows={sortedRows}
          onRowsChange={handleRowsChange}
          rowKeyGetter={(row) => row.id}
          sortColumns={sortColumns}
          onSortColumnsChange={onSortColumnsChange}
          onColumnsReorder={onColumnsReorder}
          defaultColumnOptions={{
            resizable: true,
            width: 120,
          }}
          className="fill-grid"
        />

        <div
          className="features"
          style={{
            marginTop: "16px",
            backgroundColor: "#f5f5f5",
            padding: "15px",
            borderRadius: "4px",
          }}
        >
          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>実装機能：</p>
          <ul style={{ paddingLeft: "20px", margin: 0 }}>
            <li>カラム固定機能（ID、商品名が固定）</li>
            <li>セル内入力機能（ダブルクリックで編集可能）</li>
            <li>ソート機能（カラムヘッダーをクリックでソート）</li>
            {/* その他の機能リスト */}
          </ul>
        </div>
      </main>

      <style>{`
        /* 公式デモと同様のスタイル */
        .fill-grid {
          block-size: 100%;
          min-height: 200px;
          flex: 1;
        }
      `}</style>
    </div>
  );
};
```

## まとめ

react-data-grid を使用する際のレイアウト構造と最小高さ設定について説明しました。公式デモと同様のレイアウトを実現するためには、以下のポイントが重要です：

1. **フレックスボックスレイアウト**を使用して全体の構造を構築
2. **App.css の制約を解除**して、全画面表示を可能に
3. **DataGrid に`.fill-grid`クラス**を適用し、適切なスタイルを設定
4. **最小高さ設定**により、表示領域を確保

これらの設定により、レスポンシブで使いやすい DataGrid の実装が可能になります。最小高さの値は、用途に応じて調整することができます。
