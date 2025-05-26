/**
 * 文字列操作のユーティリティ関数群
 */

/**
 * 文字列を逆順にする
 */
export function reverseString(str: string): string {
    return str.split('').reverse().join('');
}

/**
 * 文字列が回文かどうかを判定する
 */
export function isPalindrome(str: string): boolean {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === reverseString(cleaned);
}

/**
 * 文字列の単語数をカウントする
 */
export function countWords(str: string): number {
    if (!str.trim()) {
        return 0;
    }
    return str.trim().split(/\s+/).length;
}

/**
 * 文字列をキャメルケースに変換する
 */
export function toCamelCase(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}

/**
 * 文字列をケバブケースに変換する
 */
export function toKebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

/**
 * 文字列の最初の文字を大文字にする
 */
export function capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
} 