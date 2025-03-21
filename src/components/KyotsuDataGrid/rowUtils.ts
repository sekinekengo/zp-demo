import { WithId } from "./types";

/**
 * 新しい行のID生成
 * @param rows 現在の行データの配列
 * @returns 新しい行のID
 */
export function generateNewId<R extends object>(rows: readonly R[]): number {
    if (rows.length === 0) return 1;

    if ("id" in rows[0]) {
        const ids = rows
            .map((row) => (row as unknown as WithId).id)
            .filter((id) => typeof id === "number");
        return ids.length > 0 ? Math.max(...ids) + 1 : 1;
    }

    return 1;
}

/**
 * 行のコピー処理関数
 * @param rows 現在の行データの配列
 * @param rowIdx コピー対象の行インデックス
 * @returns コピーされた行データ
 */
export function copyRow<R extends object>(rows: readonly R[], rowIdx: number): R | null {
    if (rowIdx < 0 || rowIdx >= rows.length) return null;
    return rows[rowIdx];
}

/**
 * 行のペースト処理関数
 * @param rows 現在の行データの配列
 * @param rowIdx ペースト先の行インデックス
 * @param copiedRow ペースト元の行データ
 * @returns 更新後の行データの配列
 */
export function pasteRow<R extends object>(
    rows: readonly R[],
    rowIdx: number,
    copiedRow: R
): R[] {
    if (rowIdx < 0 || rowIdx >= rows.length || !copiedRow) return [...rows] as R[];

    const newRows = [...rows] as R[];

    // IDフィールドがある場合は保持
    if ("id" in newRows[rowIdx]) {
        const targetId = (newRows[rowIdx] as unknown as WithId).id;
        newRows[rowIdx] = { ...copiedRow, id: targetId } as R;
    } else {
        newRows[rowIdx] = { ...copiedRow } as R;
    }

    return newRows;
}

/**
 * 行の削除処理関数
 * @param rows 現在の行データの配列
 * @param rowIdx 削除対象の行インデックス
 * @returns 更新後の行データの配列
 */
export function deleteRow<R extends object>(rows: readonly R[], rowIdx: number): R[] {
    if (rowIdx < 0 || rowIdx >= rows.length) return [...rows] as R[];

    const newRows = [...rows] as R[];
    newRows.splice(rowIdx, 1);
    return newRows;
}

/**
 * 行の下に新規行を追加する処理関数
 * @param rows 現在の行データの配列
 * @param rowIdx 追加位置の行インデックス
 * @param createEmptyRow 空の行を生成する関数
 * @returns 更新後の行データの配列
 */
export function addRowBelow<R extends object>(
    rows: readonly R[],
    rowIdx: number,
    createEmptyRow: (baseRow?: R) => R
): R[] {
    if (rowIdx < 0 || rowIdx >= rows.length) return [...rows] as R[];

    const newRow = createEmptyRow();

    // IDフィールドがある場合は新しいIDを設定
    if ("id" in newRow) {
        (newRow as unknown as WithId).id = generateNewId(rows);
    }

    const newRows = [...rows] as R[];
    newRows.splice(rowIdx + 1, 0, newRow);
    return newRows;
}

/**
 * 最下部に新規行を追加する処理関数
 * @param rows 現在の行データの配列
 * @param createEmptyRow 空の行を生成する関数
 * @returns 更新後の行データの配列
 */
export function addRowToBottom<R extends object>(
    rows: readonly R[],
    createEmptyRow: (baseRow?: R) => R
): R[] {
    const newRow = createEmptyRow();

    // IDフィールドがある場合は新しいIDを設定
    if ("id" in newRow) {
        (newRow as unknown as WithId).id = generateNewId(rows);
    }

    return [...rows, newRow] as R[];
} 