import { SortColumn } from "react-data-grid";

/**
 * 内部ソート処理を行うユーティリティ関数
 * @param rows 行データの配列
 * @param sortColumns ソート設定
 * @returns ソート後の行データの配列
 */
export function sortRows<R extends object>(
    rows: readonly R[],
    sortColumns: readonly SortColumn[] | undefined
): readonly R[] {
    if (!sortColumns || sortColumns.length === 0) return rows;
    const { columnKey, direction } = sortColumns[0];

    let result = [...rows] as R[];
    const firstRow = rows[0];

    if (!firstRow) return rows;

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

    return direction === "DESC" ? result.reverse() : result;
} 