/**
 * 基本的な計算機能を提供するユーティリティクラス
 */
export class Calculator {
    /**
     * 二つの数値を加算する
     */
    static add(a: number, b: number): number {
        return a + b;
    }

    /**
     * 二つの数値を減算する
     */
    static subtract(a: number, b: number): number {
        return a - b;
    }

    /**
     * 二つの数値を乗算する
     */
    static multiply(a: number, b: number): number {
        return a * b;
    }

    /**
     * 二つの数値を除算する
     * @throws {Error} ゼロ除算の場合
     */
    static divide(a: number, b: number): number {
        if (b === 0) {
            throw new Error('Division by zero is not allowed');
        }
        return a / b;
    }

    /**
     * 数値の平方根を計算する
     * @throws {Error} 負の数の場合
     */
    static sqrt(n: number): number {
        if (n < 0) {
            throw new Error('Cannot calculate square root of negative number');
        }
        return Math.sqrt(n);
    }

    /**
     * 数値の階乗を計算する
     * @throws {Error} 負の数の場合
     */
    static factorial(n: number): number {
        if (n < 0) {
            throw new Error('Cannot calculate factorial of negative number');
        }
        if (n === 0 || n === 1) {
            return 1;
        }
        return n * Calculator.factorial(n - 1);
    }
} 