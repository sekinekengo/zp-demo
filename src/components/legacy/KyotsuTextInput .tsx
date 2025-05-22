import React, { useState, useEffect } from 'react'
import { InputAdornment, TextField, Typography, Stack } from '@mui/material';

interface KyotsuTextBoxProps {
    label: string;
    inputWidth?: string;
    labelWidth?: string;
    value: string | number;
    onChange?: (value: string | number) => void;
    maxlength: number;
    /**
     * 書式パターン
     * @default '0'
     */
    type:
    | '0' /**日本語（全角・半角） */
    | '1' /**半角英数カナ記号 */
    | '2' /**数字（コードなど） */
    | '3' /**数値（金額） */
    | '4'/**半角英数（コードなど） */

    /**
     * テキスト配置の指定
     * @default '0'
     */
    alignment?:
    | '0' /**左寄せ */
    | '1' /**右寄せ */
    | '2' /**中央寄せ */
    | '3' /**両端寄せ */

    /**
     * 入力可能な文字列の指定
     * @default '0'
     */
    format?:
    | '0' /**全角 */
    | '1' /**半角 */
    | '2' /**どちらでも */

    /**
     * IME互換モード
     * @default '1'
     */
    inputmode?:
    | '0' /** ON */
    | '1' /** OFF */

    /** ゼロパディング */
    zeropadding?: boolean;
    /** 小数点以下桁数 */
    decimalplace?: number;
    /** 符号有無 */
    sign?: boolean;

    /** ゼロ補完 */
    zerocomplement?: boolean;

    checkdigit?:
    | '0' /**チェックデジットなし */
    | '1' /**通常 */
    | '2' /**歳出 */
    | '3' /**歳入 */

    /** 丸めモード */
    moneyunit?:
    | '0' /**円(切り上げ) */
    | '1' /**円(切り捨て) */
    | '2' /**円(四捨五入) */
    | '3' /**千円(切り上げかつマイナス切り捨て) */
    | '4' /**千円(四捨五入) */
    | '5' /**千円(切り捨てかつ千円未満切り上げかつマイナス切り上げ) */
    | '6' /**千円(四捨五入かつ千円未満切り上げかつマイナス四捨五入) */

    /** 行数 */
    row?: number;
    /** 1行あたりの文字数 */
    column?: number;
    /** 単位 */
    unit?: string;
    /** 読み取り専用かどうか */
    readonly?: boolean;
    /** 無効化されているかどうか */
    disabled?: boolean;
}

const KyotsuTextInput: React.FC<KyotsuTextBoxProps> = ({
    label,
    inputWidth,
    labelWidth='100px',
    value: initialValue,
    onChange,
    maxlength,
    type,
    alignment='0',
    format='0',
    inputmode='1',
    zeropadding=false,
    decimalplace,
    sign=false,
    zerocomplement=false,
    checkdigit='0',
    moneyunit='0',
    row=1,
    column,
    unit,
    readonly=false,
    disabled=false,
}) => {

    const [internValue, setInternValue] = useState<string | number>(initialValue);
    const isMultiLine = row > 1;
    const isNumber = ['2', '3'].includes(type);

    // 入力欄の幅を自動設定する関数
    const getAutoWidth = (): string => {
        if (inputWidth || !maxlength) {
            return inputWidth || '100px';
        }
        let baseWidth: number;
        switch (type) {
            case '0': // 日本語（全角・半角）
                baseWidth = 14;
                break;
            case '1': // 半角英数カナ記号
                baseWidth = 8;
                break;
            case '2': // 数字（コードなど）
            case '3': // 数値（金額）
            case '4': // 半角英数（コードなど）
                baseWidth = 10;
                break;
            default:
                baseWidth = 15;
                break;
        }
        return `${Math.max(baseWidth * maxlength, 50)}px`;// 最小幅50px
    }

    const autoWidth = getAutoWidth();

    useEffect(() => {
        setInternValue(initialValue);
    }, [initialValue]);

    const formatValue = (val: string | number | undefined | null): string => {
        if (val === undefined || val === null) {
            return '';
        }
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
            default:
                return val;
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
            const cleaned = val.replace(/[^\d.-]/g, '');// 数字とマイナス符号のみ許可
            return cleaned === '' ? 0 : parseFloat(cleaned);
        }
        return val;
    }

    const getInputMode = () => {
        switch (type) {
            case '0': return 'text';
            case '1': return 'text';
            case '2': return 'numeric';
            case '3': return 'numeric';
            case '4': return 'text';
            default: return 'text';
        }
    }

    const getInputPattern = () => {
        switch (type) {
            case '0': return format === '0' ? '[一-龯ぁ-んァ-ン]' : undefined;
            case '1': return '[a-zA-Z0-9ｦ-°]';
            case '2':
            case '3': return '[0-9]';
            case '4': return '[a-zA-Z0-9]';
            default: return undefined;
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        // タイプ1の場合、半角英数字とカタカナのみを許可
        if (type === '1') {
            newValue = newValue.replace(/[^a-zA-Z0-9ｦ-ﾟ]/g, '');
        }

        if (isMultiLine && column) {
            const lines = newValue.split('\n');
            newValue = lines.map(line => line.slice(0, column)).join('\n');
        }

        const parsedValue = parseValue(newValue);
        setInternValue(parsedValue);
        onChange?.(parsedValue);
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (type === '1' && e.key.match(/[a-zA-Z0-9ｦ-ﾟ]/)) {
            e.preventDefault();
        }
    }

    return (
        <Stack direction="row" spacing={1} alignItems={isMultiLine ? 'flex-start' : 'center'}>
            {label !== "" && <Typography variant="body1" sx={{ width: labelWidth }}>{label}</Typography>}
            <TextField
                type={"text"}
                size="small"
                sx={{
                    width: autoWidth,
                    '& .MuiOutlinedInput-root': {
                        padding: isMultiLine ? '0px' : undefined,
                    }
                }}
                value={formatValue(internValue)}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                inputProps={{
                    maxLength: isMultiLine ? undefined : maxlength,
                    inputMode: getInputMode(),
                    pattern: getInputPattern(),
                    readOnly: readonly,
                    style: {
                        textAlign: alignment === '0' ? 'left' : alignment === '1' ? 'right' : 'center',
                        imeMode: inputmode === '0' ? 'active' : 'inactive',
                        cursor: readonly ? 'not-allowed' : 'text',
                    },
                    endAdornment: unit && (
                        <InputAdornment position="end" sx={{ marginLeft: '0px' }}>{unit}</InputAdornment>
                    )
                }}
                multiline={isMultiLine}
                rows={isMultiLine ? row : undefined}
                disabled={disabled}
            />
        </Stack>
    )
};

export default KyotsuTextInput;
