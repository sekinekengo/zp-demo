import { FieldValues } from "react-hook-form";

// 全角日本語のバリデーション
export const validateJapanese = (value: string) => {
    return /^[一-龯ぁ-んァ-ン\s]*$/.test(value) || '全角文字のみ入力してください';
};

// 数値範囲のバリデーション
export const validateNumber = (value: number) => {
    return (value >= 0 && value <= 9999999) || '0～9,999,999の範囲で入力してください';
};

// 英数字のバリデーション
export const validateAlphaNumeric = (value: string) => {
    return /^[a-zA-Z0-9]*$/.test(value) || '半角英数字のみ入力してください';
};

// メールアドレスのバリデーション
export const validateEmail = (value: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || 'メールアドレスの形式が正しくありません';
};

// 郵便番号のバリデーション
export const validateZipCode = (value: string) => {
    return /^\d{3}-?\d{4}$/.test(value) || '郵便番号の形式が正しくありません';
};

// 電話番号のバリデーション
export const validatePhoneNumber = (value: string) => {
    return /^0\d{1,4}-?\d{1,4}-?\d{4}$/.test(value) || '電話番号の形式が正しくありません';
};

// バリデーションルールを作成するカスタムフック（SampleD用）
export const getValidationRules = (type: string) => {
    switch (type) {
        case '0': // 日本語
            return {
                validate: validateJapanese
            };
        case '1': // 数値
            return {
                validate: validateNumber
            };
        case '2': // 英数字
            return {
                validate: validateAlphaNumeric
            };
        case '3': // メールアドレス
            return {
                validate: validateEmail
            };
        case '4': // 郵便番号
            return {
                validate: validateZipCode
            };
        case '5': // 電話番号
            return {
                validate: validatePhoneNumber
            };
        default:
            return {};
    }
}; 