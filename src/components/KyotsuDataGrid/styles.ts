import React from "react";

/**
 * テキストエディタのクラス名
 */
export const textEditorClassname = "rdg-text-editor";

/**
 * コンテキストメニューのスタイル
 */
export const contextMenuStyle: React.CSSProperties = {
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

/**
 * メニュー項目の基本スタイル
 */
export const menuItemStyle: React.CSSProperties = {
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "14px",
};

/**
 * メニュー項目のホバー時スタイル
 */
export const menuItemHoverStyle: React.CSSProperties = {
    ...menuItemStyle,
    backgroundColor: "#f0f0f0",
};

/**
 * メニュー項目の無効時スタイル
 */
export const menuItemDisabledStyle: React.CSSProperties = {
    ...menuItemStyle,
    color: "#ccc",
    cursor: "default",
};

/**
 * フィルターセルのスタイル
 */
export const filterCellStyle: React.CSSProperties = {
    padding: '0 4px',
    width: '100%',
    boxSizing: 'border-box',
    marginTop: '8px'
};

/**
 * フィルター入力のスタイル
 */
export const filterInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px 8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '12px',
    height: '28px',
    boxSizing: 'border-box'
};

/**
 * フィルタートグルボタンのスタイル
 */
export const filterToggleButtonStyle: React.CSSProperties = {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    padding: '6px 12px',
    marginBottom: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'all 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

/**
 * フィルタートグルボタンのアクティブ時スタイル
 */
export const filterToggleButtonActiveStyle: React.CSSProperties = {
    ...filterToggleButtonStyle,
    backgroundColor: '#e3f2fd',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#2196f3',
    color: '#2196f3',
    boxShadow: '0 1px 3px rgba(33,150,243,0.3)'
};

/**
 * DataGridのカスタムスタイル生成関数
 */
export function createGridStyles(cellPadding = 8, cellBorderWidth = 2): string {
    return `
    /**
     * セル基本スタイルの上書き
     * デフォルトでrdgのセルにはパディングがあるが、このパディングに子孫要素の背景色が乗らないので無効にする。
     */
    .rdg-cell {
      padding: 0 !important;
    }
    
    /**
     * 行の最初のセル（通常は行番号列）のパディングを削除
     * 行番号セルは内部でカスタム要素を中央配置するため、パディングは不要
     */
    .rdg-row > div:first-child {
      padding: 0 !important;
    }

    /**
     * ヘッダーテキストのパディング
     * ヘッダーのテキスト部分の左側に適切な間隔を確保
     * ソートが無効の場合でもセレクタはこの名前
     */
    .rdg-header-sort-name{
      padding-left: ${cellPadding}px;
    }
    
    /**
     * 行番号列のパディング設定
     * 複数のセレクタを使用して異なる状態でも確実に行番号列のパディングを0に保つ
     * - aria-selected属性: 行の選択状態
     * - aria-colindex="1": 最初の列（通常は行番号列）
     * - data-column-key="__row_number__": 行番号列の特定キー
     */
    [aria-selected="false"][role="row"] [aria-colindex="1"][role="gridcell"],
    [aria-selected="true"][role="row"] [aria-colindex="1"][role="gridcell"],
    [role="row"] > [data-column-key="__row_number__"] {
      padding: 0 !important;
    }
    
    /**
     * 選択された行の背景色をリセット
     * 行全体の背景色ではなく、個別のセル内でのみ選択状態を表示するため
     * renderCellでセル内に背景色付きの要素を配置する設計のため、
     * デフォルトの行全体の背景色変更を無効化
     */
    .rdg-row[aria-selected="true"] {
      background-color: transparent !important;
    }
    
    /**
     * コンテキストメニューの項目ホバー時のスタイル
     * メニュー項目にマウスを乗せた時に背景色を変えて視覚的フィードバックを提供
     */
    .context-menu li:hover {
      background-color: #f0f0f0;
    }

    /**
     * テキストエディタの基本スタイル
     * セル編集時のテキスト入力フィールドのスタイリング
     * 基本的にreact-data-gridの公式実装カスタマイズを模倣
     * - appearance: noneでブラウザデフォルトスタイルを削除
     * - 幅と高さを親コンテナ（セル）に合わせる
     * - パディングと枠線を適切に設定
     * - フォントとカラーをDataGridの変数から継承
     */
    .rdg-text-editor {
      appearance: none;
      box-sizing: border-box;
      inline-size: 100%;  /* 幅を100%に設定（論理プロパティ） */
      block-size: 100%;   /* 高さを100%に設定（論理プロパティ） */
      padding-block: 0;   /* 上下のパディングを0に設定（論理プロパティ） */
      padding-inline: ${cellPadding - cellBorderWidth}px;  /* 左右のパディングを設定（論理プロパティ） */
      border: ${cellBorderWidth}px solid #ccc;
      vertical-align: top;
      color: var(--rdg-color);  /* DataGridの変数からテキスト色を継承 */
      background-color: var(--rdg-background-color);  /* DataGridの変数から背景色を継承 */
      font-family: inherit;
      font-size: var(--rdg-font-size);  /* DataGridの変数からフォントサイズを継承 */
    }
    
    /**
     * セレクトボックス（ドロップダウン）のスタイル
     * テキストエディタをベースにしたセレクトボックス特有の調整
     * - 右側のパディングを0に設定してドロップダウン矢印が適切に表示されるよう調整
     * - appearanceをautoに戻してブラウザのドロップダウン表示を有効化
     */
    select.rdg-text-editor {
      padding-inline-end: 0;  /* 右側（論理方向）のパディングを0に設定 */
      appearance: auto;  /* ブラウザデフォルトの矢印表示を復活 */
    }
  `;
} 