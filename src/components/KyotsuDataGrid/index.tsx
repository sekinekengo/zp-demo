import React, { useCallback, useEffect, useState } from 'react';
import { DataGrid, SortColumn } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { KyotsuDataGridProps, ContextMenuState, FilterState } from './types';
import { createGridStyles } from './styles';
import ContextMenu from './ContextMenu';
import { sortRows } from './sortUtils';
import { processColumns, createRowNumberColumn } from './columnUtils';
import { NumberEditor } from './editors';
import { SelectEditor } from './editors';
import { addRowBelow, addRowToBottom, copyRow, deleteRow, pasteRow } from './rowUtils';
import FilterToggleButton from './FilterToggleButton';
import { filterRows, applyFiltersToColumns } from './filterUtils';

/**
 * 共通データグリッドコンポーネント
 */
function KyotsuDataGrid<R extends object>({
    // 必須プロパティ
    columns,
    rows,
    rowKeyGetter,

    // 行データ操作
    onRowsChange,
    createEmptyRow,

    // ソート関連
    sortColumns,
    onSortColumnsChange,
    useInternalSort = false,
    clearSelectionOnSort = true,

    // 列操作
    onColumnsReorder,
    resizable = true,

    // 表示設定
    showRowNumber = false,
    rowNumberCellRenderer,

    // 行選択関連
    rowSelectable = false,
    initialSelectedRow = null,
    onRowSelected,
    onRowClick,

    // コンテキストメニュー
    contextMenuOptions = {
        copyRow: true,
        pasteRow: true,
        deleteRow: true,
        addRowBelow: true,
        addRowToBottom: true,
    },

    // フィルタリング機能
    filterable = true,
    initialFiltersVisible = false,

    // その他のプロパティ
    ...rest
}: KyotsuDataGridProps<R>) {
    // ===== 状態管理 =====

    // コンテキストメニューの状態
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

    const [copiedRow, setCopiedRow] = useState<R | null>(null);

    // 選択行の状態
    const [internalSelectedRow, setInternalSelectedRow] = useState<R | null>(initialSelectedRow);

    // フィルタリング状態
    const [filterState, setFilterState] = useState<FilterState>({
        showFilters: initialFiltersVisible,
        filters: {}
    });

    // ===== 計算値 =====

    // 選択行のキー
    const selectedRowKey = internalSelectedRow ? rowKeyGetter(internalSelectedRow) : null;

    // コンテキストメニューの有効状態
    const isContextMenuEnabled =
        onRowsChange &&
        (contextMenuOptions.copyRow ||
            contextMenuOptions.pasteRow ||
            contextMenuOptions.deleteRow ||
            (contextMenuOptions.addRowBelow && createEmptyRow) ||
            (contextMenuOptions.addRowToBottom && createEmptyRow));

    // ===== 行選択関連の処理 =====

    // 行選択ハンドラー
    const handleRowSelect = useCallback((row: R) => {
        // 同じ行がクリックされた場合は選択解除
        if (internalSelectedRow && rowKeyGetter(row) === selectedRowKey) {
            setInternalSelectedRow(null);
        } else {
            setInternalSelectedRow(row);
        }
    }, [internalSelectedRow, selectedRowKey, rowKeyGetter]);

    // 行クリック時のハンドラ
    const handleRowClick = useCallback(
        (args: { row: R }) => {
            if (rowSelectable) {
                handleRowSelect(args.row);
            }
            if (onRowClick) {
                onRowClick(args);
            }
        },
        [rowSelectable, handleRowSelect, onRowClick]
    );

    // 選択行変更時のコールバック
    useEffect(() => {
        if (onRowSelected) {
            onRowSelected(internalSelectedRow);
        }
    }, [internalSelectedRow, onRowSelected]);

    // ===== ソート関連の処理 =====

    // ソート変更ハンドラ
    const handleSortColumnsChange = useCallback(
        (newSortColumns: SortColumn[]) => {
            if (onSortColumnsChange) {
                onSortColumnsChange(newSortColumns);
            }
            if (clearSelectionOnSort && rowSelectable && internalSelectedRow) {
                setInternalSelectedRow(null);
            }
        },
        [onSortColumnsChange, clearSelectionOnSort, rowSelectable, internalSelectedRow]
    );

    // 内部ソート処理
    const sortedRows = React.useMemo((): readonly R[] => {
        if (!useInternalSort || !sortColumns || sortColumns.length === 0)
            return rows;

        return sortRows(rows, sortColumns);
    }, [rows, sortColumns, useInternalSort]);

    // ===== フィルタリング関連の処理 =====

    // フィルタトグルハンドラ
    const handleFilterToggle = useCallback(() => {
        setFilterState(prev => ({
            ...prev,
            showFilters: !prev.showFilters
        }));
    }, []);

    // フィルタ変更ハンドラ
    const handleFilterChange = useCallback((columnKey: string, value: string) => {
        setFilterState(prev => ({
            ...prev,
            filters: {
                ...prev.filters,
                [columnKey]: value
            }
        }));
    }, []);

    // フィルタ適用後の行
    const filteredRows = React.useMemo((): readonly R[] => {
        const rowsToFilter = useInternalSort ? sortedRows : rows;
        if (!filterable || Object.keys(filterState.filters).length === 0) {
            return rowsToFilter;
        }
        return filterRows(rowsToFilter, filterState.filters);
    }, [filterable, filterState.filters, useInternalSort, sortedRows, rows]);

    // 表示用行データ
    const displayRows = filteredRows;

    // ===== 列処理 =====

    // 元の列処理関数
    const baseProcessedColumns = React.useMemo(() => {
        // 通常の列を処理
        const processedBaseColumns = processColumns(
            columns,
            resizable,
            rowSelectable,
            selectedRowKey,
            handleRowSelect,
            rowKeyGetter
        );

        // 行番号列を先頭に追加
        if (showRowNumber) {
            const rowNumberColumn = createRowNumberColumn(
                showRowNumber,
                rowSelectable,
                internalSelectedRow,
                rowKeyGetter,
                selectedRowKey,
                handleRowSelect,
                rowNumberCellRenderer
            );

            if (rowNumberColumn) {
                return [rowNumberColumn, ...processedBaseColumns];
            }
        }

        return processedBaseColumns;
    }, [
        columns,
        resizable,
        showRowNumber,
        rowSelectable,
        selectedRowKey,
        handleRowSelect,
        rowNumberCellRenderer,
        internalSelectedRow,
        rowKeyGetter
    ]);

    // フィルタを適用した最終的な列
    const processedColumns = React.useMemo(() => {
        if (!filterable) return baseProcessedColumns;

        return applyFiltersToColumns(
            baseProcessedColumns,
            filterState,
            handleFilterChange
        );
    }, [baseProcessedColumns, filterable, filterState, handleFilterChange]);

    // ===== 行操作関連の処理 =====

    // コンテキストメニューハンドラ
    const handleCopyRow = useCallback(() => {
        if (contextMenu === null || !onRowsChange) return;
        setCopiedRow(copyRow(rows, contextMenu.rowIdx));
        setContextMenu(null);
    }, [contextMenu, rows, onRowsChange]);

    const handlePasteRow = useCallback(() => {
        if (contextMenu === null || copiedRow === null || !onRowsChange) return;
        const newRows = pasteRow(rows, contextMenu.rowIdx, copiedRow);
        onRowsChange(newRows);
        setContextMenu(null);
    }, [contextMenu, rows, copiedRow, onRowsChange]);

    const handleDeleteRow = useCallback(() => {
        if (contextMenu === null || !onRowsChange) return;
        const newRows = deleteRow(rows, contextMenu.rowIdx);
        onRowsChange(newRows);
        setContextMenu(null);
    }, [contextMenu, rows, onRowsChange]);

    const handleAddRowBelow = useCallback(() => {
        if (contextMenu === null || !onRowsChange || !createEmptyRow) return;
        const newRows = addRowBelow(rows, contextMenu.rowIdx, createEmptyRow);
        onRowsChange(newRows);
        setContextMenu(null);
    }, [contextMenu, rows, onRowsChange, createEmptyRow]);

    const handleAddRowToBottom = useCallback(() => {
        if (!onRowsChange || !createEmptyRow) return;
        const newRows = addRowToBottom(rows, createEmptyRow);
        onRowsChange(newRows);
        setContextMenu(null);
    }, [rows, onRowsChange, createEmptyRow]);

    // ===== DataGridプロパティの設定 =====

    // DataGridの全プロパティを統合
    const dataGridProps = {
        ...rest,
        columns: processedColumns,
        rows: displayRows,
        onRowsChange,
        rowKeyGetter,
        sortColumns,
        onSortColumnsChange: clearSelectionOnSort ? handleSortColumnsChange : onSortColumnsChange,
        onColumnsReorder,
        headerRowHeight: filterState.showFilters ? 70 : undefined,
        style: {
            blockSize: '100%',
            minHeight: '200px',
            flex: 1,
            '--rdg-header-background-color': '#f2f2bb',
        } as React.CSSProperties,
        onCellContextMenu: isContextMenuEnabled
            ? ({ row }: { row: R }, event: React.MouseEvent) => {
                event.preventDefault();
                const rowIdx = displayRows.indexOf(row);
                setContextMenu({
                    rowIdx,
                    top: event.pageY + 5,
                    left: event.pageX + 5,
                });
            }
            : undefined,
        className: rowSelectable ? 'row-selectable-grid' : '',
    };

    // ===== コンテキストメニューのオプション設定 =====
    const contextMenuProps = {
        contextMenu,
        setContextMenu,
        contextMenuOptions,
        copiedRow,
        onCopyRow: handleCopyRow,
        onPasteRow: handlePasteRow,
        onDeleteRow: handleDeleteRow,
        onAddRowBelow: handleAddRowBelow,
        onAddRowToBottom: handleAddRowToBottom,
        hasCreateEmptyRow: !!createEmptyRow
    };

    // ===== 行選択機能が有効な場合のレンダリング =====
    if (rowSelectable || onRowClick) {
        // DataGridの行クリックハンドラをセット
        const dataGridPropsWithRowHandlers = dataGridProps as typeof dataGridProps & {
            onRow?: (row: R) => { onClick: () => void };
            onRowClick?: typeof handleRowClick;
        };

        // react-data-gridのバージョンによって異なるプロパティを使用
        const hasOnRow = 'onRow' in DataGrid;
        const hasOnRowClick = 'onRowClick' in DataGrid;

        if (hasOnRow) {
            dataGridPropsWithRowHandlers.onRow = (row: R) => ({
                onClick: () => handleRowClick({ row }),
            });
        } else if (hasOnRowClick) {
            dataGridPropsWithRowHandlers.onRowClick = handleRowClick;
        }

        return (
            <>
                {filterable && (
                    <FilterToggleButton
                        showFilters={filterState.showFilters}
                        onClick={handleFilterToggle}
                    />
                )}
                <DataGrid {...dataGridPropsWithRowHandlers} />
                {isContextMenuEnabled && <ContextMenu {...contextMenuProps} />}
                <style>{createGridStyles()}</style>
            </>
        );
    }

    // ===== 行選択機能が無効な場合のレンダリング =====
    return (
        <>
            {filterable && (
                <FilterToggleButton
                    showFilters={filterState.showFilters}
                    onClick={handleFilterToggle}
                />
            )}
            <DataGrid {...dataGridProps} />
            {isContextMenuEnabled && <ContextMenu {...contextMenuProps} />}
            <style>{createGridStyles()}</style>
        </>
    );
}

export default KyotsuDataGrid;
export { NumberEditor, SelectEditor }; 