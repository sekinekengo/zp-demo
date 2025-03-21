import React from "react";
import { Column } from "react-data-grid";

/**
 * 列を処理してDataGrid用に整形する
 * @param columns 元の列定義
 * @param resizable リサイズ可能かどうか
 * @param rowSelectable 行選択可能かどうか
 * @param selectedRowKey 選択行のキー
 * @param handleRowSelect 行選択ハンドラ
 * @param rowKeyGetter 行キー取得関数
 * @returns 処理後の列
 */
export function processColumns<R extends object>(
    columns: readonly Column<R>[],
    resizable: boolean,
    rowSelectable: boolean,
    selectedRowKey: React.Key | null,
    handleRowSelect: (row: R) => void,
    rowKeyGetter: (row: R) => React.Key
): Column<R>[] {
    return columns.map((column) => {
        const baseColumn = {
            ...column,
            width: column.width || "auto",
            minWidth: column.minWidth,
            resizable: column.resizable !== undefined ? column.resizable : resizable,
        };

        // 行選択機能が有効で、自前のrenderCellが定義されていない場合は自動で選択スタイルを適用
        if (rowSelectable && !column.renderCell) {
            return {
                ...baseColumn,
                renderCell: ({ row, column }: { row: R; column: Column<R> }) => {
                    const value = row[column.key as keyof R];
                    const isSelected = rowKeyGetter(row) === selectedRowKey;

                    return (
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                padding: "0 8px",
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                backgroundColor: isSelected ? "#e3f2fd" : "transparent",
                            }}
                            onClick={() => handleRowSelect(row)}
                        >
                            {String(value)}
                        </div>
                    );
                },
            };
        }

        return baseColumn;
    });
}

/**
 * 行番号列を生成する
 * @param showRowNumber 行番号表示するかどうか
 * @param rowSelectable 行選択可能かどうか
 * @param internalSelectedRow 選択行
 * @param rowKeyGetter 行キー取得関数
 * @param selectedRowKey 選択行のキー
 * @param handleRowSelect 行選択ハンドラ
 * @param rowNumberCellRenderer カスタム行番号レンダラー
 * @returns 行番号列
 */
export function createRowNumberColumn<R extends object>(
    showRowNumber: boolean,
    rowSelectable: boolean,
    internalSelectedRow: R | null,
    rowKeyGetter: (row: R) => React.Key,
    selectedRowKey: React.Key | null,
    handleRowSelect: (row: R) => void,
    rowNumberCellRenderer?: (props: { rowIdx: number; row: R }) => React.ReactNode
): Column<R> | null {
    if (!showRowNumber) return null;

    return {
        key: "__row_number__",
        name: "",
        width: 30,
        minWidth: 30,
        frozen: true,
        resizable: false,
        sortable: false,
        draggable: false,
        renderCell: ({ rowIdx, row }: { rowIdx: number; row: R }) => {
            if (rowNumberCellRenderer) {
                return rowNumberCellRenderer({ rowIdx, row });
            }

            const isSelected =
                rowSelectable && internalSelectedRow && rowKeyGetter(row) === selectedRowKey;

            return (
                <div
                    style={{
                        textAlign: "center",
                        backgroundColor: isSelected
                            ? "#e3f2fd"
                            : "var(--rdg-header-background-color)",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: rowSelectable ? "pointer" : "default",
                    }}
                    onClick={() => rowSelectable && handleRowSelect(row)}
                >
                    {rowIdx + 1}
                </div>
            );
        },
    };
} 