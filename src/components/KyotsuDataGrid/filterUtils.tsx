// JSX構文を使用するためにReactをインポート（React 17以前のバージョンと互換性のため）
import React from 'react';
import { Column } from 'react-data-grid';
import { FilterState } from './types';
import { FILTER_ROW_NUMBER_COLUMN_KEY } from './constants';

/**
 * フィルタ条件で行をフィルタリングする
 */
export function filterRows<R extends object>(
    rows: readonly R[],
    filters: Record<string, string>
): readonly R[] {
    // フィルターがなければ全ての行を返す
    if (!filters || Object.keys(filters).length === 0) {
        return rows;
    }

    // 各フィルター条件に一致する行だけを返す
    return rows.filter(row => {
        // 全てのフィルター条件に一致するかチェック
        return Object.entries(filters).every(([key, filterValue]) => {
            // 行番号列は無視
            if (key === FILTER_ROW_NUMBER_COLUMN_KEY) {
                return true;
            }

            // フィルター条件が空ならマッチとみなす
            if (!filterValue) {
                return true;
            }

            // 列の値を取得
            const value = row[key as keyof R];

            // 値を文字列化して部分一致検索
            // 元の値が存在しない場合は空文字に変換
            const strValue = value?.toString() || '';
            return strValue.toLowerCase().includes(filterValue.toLowerCase());
        });
    });
}

/**
 * フィルタヘッダーを含む列定義を作成する
 */
export function applyFiltersToColumns<R extends object>(
    columns: readonly Column<R>[],
    filterState: FilterState,
    onFilterChange: (columnKey: string, value: string) => void
): readonly Column<R>[] {
    // フィルター表示がOFFの場合はそのまま返す
    if (!filterState.showFilters) {
        return columns;
    }

    // 各列にフィルターヘッダーを追加
    return columns.map(column => {
        const { key } = column;

        // 行番号列の場合はフィルター入力欄を表示しない
        if (key === FILTER_ROW_NUMBER_COLUMN_KEY) {
            return column;
        }

        return {
            ...column,
            renderHeaderCell: (headerProps) => {
                // 元のヘッダーセルコンテンツ（ソート機能など）
                const headerElement = column.renderHeaderCell
                    ? column.renderHeaderCell(headerProps)
                    : (
                        <div className="rdg-header-sort-cell">
                            <span className="rdg-header-sort-name">{column.name}</span>
                        </div>
                    );

                // フィルター入力を追加
                return (
                    <>
                        {headerElement}
                        <div
                            style={{
                                marginTop: '8px',
                                width: '100%',
                                textAlign: 'center',
                                padding: '0 4px'
                            }}
                        >
                            <input
                                style={{
                                    width: '100%',
                                    padding: '6px 8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    height: '28px',
                                    boxSizing: 'border-box'
                                }}
                                value={filterState.filters[key as string] || ''}
                                onChange={(e) => onFilterChange(key as string, e.target.value)}
                                placeholder="フィルター..."
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                            />
                        </div>
                    </>
                );
            }
        };
    });
} 