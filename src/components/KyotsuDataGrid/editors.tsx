import React from "react";
import { textEditorClassname } from "./styles";

/**
 * 数値入力用のカスタムエディタ
 */
export function NumberEditor<T>({
    row,
    column,
    onRowChange,
    onClose,
    ...props
}: {
    row: T;
    column: { key: string };
    onRowChange: (row: T, commitChanges?: boolean) => void;
    onClose: (commitChanges?: boolean, shouldFocusCell?: boolean) => void;
    [key: string]: unknown;
}) {
    const columnKey = column.key as keyof T;
    const value = row[columnKey] as unknown as number;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value === "" ? 0 : Number(e.target.value);
        onRowChange({ ...row, [columnKey]: newValue } as T);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onClose(true);
        } else if (e.key === "Escape") {
            onClose();
        }
    };

    return (
        <input
            className={textEditorClassname}
            style={{ appearance: "auto" }}
            type="number"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            autoFocus
            {...props}
        />
    );
}

/**
 * セレクトボックス用のカスタムエディタ
 */
export function SelectEditor<T>({
    row,
    column,
    onRowChange,
    options,
}: {
    row: T;
    column: { key: string };
    onRowChange: (row: T, commitChanges?: boolean) => void;
    options: string[];
}) {
    const columnKey = column.key as keyof T;
    const value = row[columnKey] as unknown as string;

    return (
        <select
            autoFocus
            className={textEditorClassname}
            value={value}
            onChange={(e) =>
                onRowChange({ ...row, [columnKey]: e.target.value } as T, true)
            }
        >
            {options.map((option) => (
                <option key={option}>{option}</option>
            ))}
        </select>
    );
} 