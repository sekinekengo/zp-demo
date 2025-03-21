import { Column, SortColumn } from "react-data-grid";
import React from "react";

/**
 * IDを持つオブジェクトの型
 */
export interface WithId {
    id: number;
}

/**
 * コンテキストメニューの状態
 */
export interface ContextMenuState {
    rowIdx: number;
    top: number;
    left: number;
}

/**
 * コンテキストメニューの機能オプション
 */
export interface ContextMenuOptions {
    copyRow?: boolean;
    pasteRow?: boolean;
    deleteRow?: boolean;
    addRowBelow?: boolean;
    addRowToBottom?: boolean;
}

/**
 * フィルター状態管理
 */
export interface FilterState {
    /** フィルターが表示されているかどうか */
    showFilters: boolean;
    /** フィルター条件 key: 列のキー, value: フィルター値 */
    filters: Record<string, string>;
}

/**
 * フィルタレンダラープロップス
 */
export interface FilterRendererProps {
    /** 列のキー */
    columnKey: string;
    /** フィルタ値 */
    value: string;
    /** フィルタ変更ハンドラ */
    onChange: (value: string) => void;
}

/**
 * KyotsuDataGridのプロップス
 */
export interface KyotsuDataGridProps<R extends object> {
    /** 必須プロパティ */
    columns: readonly Column<R>[];
    rows: readonly R[];
    rowKeyGetter: (row: R) => React.Key;

    /** 行データ操作 */
    onRowsChange?: (rows: R[]) => void;
    createEmptyRow?: (baseRow?: R) => R;

    /** ソート関連 */
    sortColumns?: readonly SortColumn[];
    onSortColumnsChange?: (sortColumns: SortColumn[]) => void;
    useInternalSort?: boolean;
    clearSelectionOnSort?: boolean;

    /** 列操作 */
    onColumnsReorder?: (sourceKey: string, targetKey: string) => void;
    resizable?: boolean;

    /** 表示設定 */
    showRowNumber?: boolean;
    rowNumberCellRenderer?: (props: { rowIdx: number, row: R }) => React.ReactNode;

    /** 行選択関連 */
    rowSelectable?: boolean;
    initialSelectedRow?: R | null;
    onRowSelected?: (row: R | null) => void;
    onRowClick?: (args: { row: R }) => void;

    /** コンテキストメニュー */
    contextMenuOptions?: ContextMenuOptions;

    /** フィルタリング機能 */
    filterable?: boolean;
    initialFiltersVisible?: boolean;
} 