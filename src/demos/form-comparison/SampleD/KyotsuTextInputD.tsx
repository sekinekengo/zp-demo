import React from 'react';
import { InputAdornment, TextField, Typography, Stack } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface KyotsuTextBoxProps<T extends FieldValues> {
    label: string;
    inputWidth?: string;
    labelWidth?: string;
    maxlength: number;
    type:
    | '0' /**日本語（全角・半角） */
    | '1' /**半角英数カナ記号 */
    | '2' /**数字（コードなど） */
    | '3' /**数値（金額） */
    | '4'/**半角英数（コードなど） */
    alignment?:
    | '0' /**左寄せ */
    | '1' /**右寄せ */
    | '2' /**中央寄せ */
    | '3' /**両端寄せ */
    format?:
    | '0' /**全角 */
    | '1' /**半角 */
    | '2' /**どちらでも */
    inputmode?:
    | '0' /** ON */
    | '1' /** OFF */
    zeropadding?: boolean;
    decimalplace?: number;
    sign?: boolean;
    zerocomplement?: boolean;
    checkdigit?:
    | '0' /**チェックデジットなし */
    | '1' /**通常 */
    | '2' /**歳出 */
    | '3' /**歳入 */
    moneyunit?:
    | '0' /**円(切り上げ) */
    | '1' /**円(切り捨て) */
    | '2' /**円(四捨五入) */
    | '3' /**千円(切り上げかつマイナス切り捨て) */
    | '4' /**千円(四捨五入) */
    | '5' /**千円(切り捨てかつ千円未満切り上げかつマイナス切り上げ) */
    | '6' /**千円(四捨五入かつ千円未満切り上げかつマイナス四捨五入) */
    row?: number;
    column?: number;
    unit?: string;
    readonly?: boolean;
    disabled?: boolean;
    name: Path<T>;
    control: Control<T>;
}

const KyotsuTextInputD = <T extends FieldValues>({
    label,
    inputWidth,
    labelWidth = '100px',
    maxlength,
    type,
    alignment = '0',
    format = '0',
    inputmode = '1',
    zeropadding = false,
    decimalplace,
    sign = false,
    zerocomplement = false,
    checkdigit = '0',
    moneyunit = '0',
    row = 1,
    column,
    unit,
    readonly = false,
    disabled = false,
    name,
    control,
}: KyotsuTextBoxProps<T>) => {
    const isMultiLine = row > 1;
    const isNumber = ['2', '3'].includes(type);

    const getAutoWidth = (): string => {
        if (inputWidth || !maxlength) {
            return inputWidth || '100px';
        }
        let baseWidth: number;
        switch (type) {
            case '0': baseWidth = 14; break;
            case '1': baseWidth = 8; break;
            case '2':
            case '3':
            case '4': baseWidth = 10; break;
            default: baseWidth = 15; break;
        }
        return `${Math.max(baseWidth * maxlength, 50)}px`;
    }

    const autoWidth = getAutoWidth();

    const formatValue = (val: string | number | undefined | null): string => {
        if (val === undefined || val === null) return '';
        if (isNumber) {
            let numVal = typeof val === 'string' ? parseFloat(val) : val;
            if (zerocomplement && numVal === 0) return '';
            if (type === '3') {
                numVal = applyMoneyUnit(numVal);
                return formatMoney(numVal);
            }
            if (zeropadding) {
                return numVal.toString().padStart(maxlength || 0, '0');
            }
            return numVal.toString();
        }
        return val.toString();
    }

    const applyMoneyUnit = (val: number): number => {
        switch (moneyunit) {
            case '0': return Math.ceil(val);
            case '1': return Math.floor(val);
            case '2': return Math.round(val);
            case '3': return Math.ceil(val / 1000) * 1000;
            case '4': return Math.round(val / 1000) * 1000;
            case '5': return val < 0 ? Math.ceil(val / 1000) * 1000 : (val < 1000 ? 1000 : Math.floor(val / 1000) * 1000);
            case '6': return val < 0 ? Math.round(val / 1000) * 1000 : (val < 1000 ? 1000 : Math.round(val / 1000) * 1000);
            default: return val;
        }
    }

    const formatMoney = (val: number): string => {
        return val.toLocaleString('ja-JP', {
            style: 'currency',
            currency: 'JPY',
            minimumFractionDigits: decimalplace || 0,
            maximumFractionDigits: decimalplace || 0,
        }).replace('￥', '');
    }

    const parseValue = (val: string): string | number => {
        if (isNumber) {
            const cleaned = val.replace(/[^\d.-]/g, '');
            return cleaned === '' ? 0 : parseFloat(cleaned);
        }
        return val;
    }

    // バリデーションルール
    const getValidationRules = () => {
        // 入力タイプに応じたバリデーションルールを設定
        switch (type) {
            case '0': // 日本語
                return {
                    validate: (value: string) => {
                        if (format === '0') { // 全角のみ
                            return /^[一-龯ぁ-んァ-ン\s]*$/.test(value) || '全角文字のみ入力可能です';
                        }
                        return true;
                    }
                };
            case '1': // 半角英数カナ記号
                return {
                    validate: (value: string) => {
                        return /^[a-zA-Z0-9ｦ-ﾟ\s]*$/.test(value) || '半角英数カナ記号のみ入力可能です';
                    }
                };
            case '2': // 数字（コードなど）
            case '3': // 数値（金額）
                return {
                    validate: (value: number | string) => {
                        const numValue = typeof value === 'string' ? parseFloat(value) : value;
                        return !isNaN(numValue) || '数値を入力してください';
                    }
                };
            case '4': // 半角英数（コードなど）
                return {
                    validate: (value: string) => {
                        return /^[a-zA-Z0-9\s]*$/.test(value) || '半角英数字のみ入力可能です';
                    }
                };
            default:
                return {};
        }
    };

    // 特定のキー入力を制限
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (type === '1' && !/^[a-zA-Z0-9ｦ-ﾟ]$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
            e.preventDefault();
        } else if (type === '4' && !/^[a-zA-Z0-9]$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
            e.preventDefault();
        }
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={getValidationRules()}
            render={({ field, fieldState }) => (
                <Stack direction="column" spacing={1}>
                    <Stack direction="row" spacing={1} alignItems={isMultiLine ? 'flex-start' : 'center'}>
                        {label !== "" && <Typography variant="body1" sx={{ width: labelWidth }}>{label}</Typography>}
                        <TextField
                            type="text"
                            size="small"
                            sx={{
                                width: autoWidth,
                                '& .MuiOutlinedInput-root': {
                                    padding: isMultiLine ? '0px' : undefined,
                                }
                            }}
                            value={formatValue(field.value)}
                            onChange={(e) => {
                                let newValue = e.target.value;
                                if (type === '1') {
                                    newValue = newValue.replace(/[^a-zA-Z0-9ｦ-ﾟ]/g, '');
                                } else if (type === '4') {
                                    newValue = newValue.replace(/[^a-zA-Z0-9]/g, '');
                                } else if (type === '0' && format === '0') {
                                    newValue = newValue.replace(/[^\u3000-\u9fff\u3040-\u309f\u30a0-\u30ff]/g, '');
                                } else if (type === '2' || type === '3') {
                                    newValue = newValue.replace(/[^\d.-]/g, '');
                                }
                                if (isMultiLine && column) {
                                    const lines = newValue.split('\n');
                                    newValue = lines.map(line => line.slice(0, column)).join('\n');
                                }
                                const parsedValue = parseValue(newValue);
                                field.onChange(parsedValue);
                            }}
                            onKeyDown={handleKeyDown}
                            onBlur={field.onBlur}
                            error={!!fieldState.error}
                            inputProps={{
                                maxLength: isMultiLine ? undefined : maxlength,
                                inputMode: type === '2' || type === '3' ? 'numeric' : 'text',
                                pattern: type === '0' && format === '0' ? '[一-龯ぁ-んァ-ン]' : undefined,
                                readOnly: readonly,
                                style: {
                                    textAlign: alignment === '0' ? 'left' : alignment === '1' ? 'right' : 'center',
                                    cursor: readonly ? 'not-allowed' : 'text',
                                }
                            }}
                            multiline={isMultiLine}
                            rows={isMultiLine ? row : undefined}
                            disabled={disabled}
                            InputProps={{
                                endAdornment: unit ? (
                                    <InputAdornment position="end">{unit}</InputAdornment>
                                ) : null
                            }}
                        />
                    </Stack>
                    {fieldState.error && (
                        <Typography color="error" variant="caption">
                            {fieldState.error.message}
                        </Typography>
                    )}
                </Stack>
            )}
        />
    );
};

export default KyotsuTextInputD; 