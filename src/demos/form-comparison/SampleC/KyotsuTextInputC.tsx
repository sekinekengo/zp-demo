import React, { forwardRef, useState, useEffect } from "react";
import { TextField, Stack } from "@mui/material";

export interface KyotsuTextInputCProps {
    label?: string;
    value?: string;
    name?: string;
    type?: string;
    maxLength?: number;
    required?: boolean;
    error?: boolean;
    helperText?: string;
    onChange?: (value: any) => void;
    onBlur?: (...args: any[]) => void;
    placeholder?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    size?: "small" | "medium";
    margin?: "none" | "dense" | "normal";
}

const KyotsuTextInputC = forwardRef<HTMLInputElement, KyotsuTextInputCProps>(
    (
        {
            label,
            value: initialValue = "",
            name,
            onChange,
            onBlur,
            error,
            helperText,
            ...props
        },
        ref
    ) => {
        const [internalValue, setInternalValue] = useState(initialValue);

        // 外部からの値変更を内部状態に反映
        useEffect(() => {
            if (initialValue !== undefined) {
                setInternalValue(initialValue);
            }
        }, [initialValue]);

        // 変更ハンドラー
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setInternalValue(newValue);

            // 外部のonChangeハンドラー(registerから渡される)を呼び出す
            if (onChange) {
                onChange(newValue);
            }
        };

        return (
            <Stack spacing={0.5}>
                <TextField
                    name={name}
                    label={label}
                    value={internalValue}
                    onChange={handleChange}
                    onBlur={onBlur}
                    error={error}
                    helperText={helperText}
                    inputRef={ref}
                    variant="outlined"
                    size="small"
                    margin="none"
                    fullWidth
                    {...props}
                />
            </Stack>
        );
    }
);

KyotsuTextInputC.displayName = "KyotsuTextInputC";

export default KyotsuTextInputC; 