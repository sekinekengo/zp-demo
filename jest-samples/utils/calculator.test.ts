import { describe, test, expect } from '@jest/globals';
import { Calculator } from './calculator';

describe('Calculator', () => {
    describe('add', () => {
        test('正の数の加算', () => {
            expect(Calculator.add(2, 3)).toBe(5);
            expect(Calculator.add(10, 15)).toBe(25);
        });

        test('負の数の加算', () => {
            expect(Calculator.add(-2, -3)).toBe(-5);
            expect(Calculator.add(-10, 5)).toBe(-5);
        });

        test('ゼロとの加算', () => {
            expect(Calculator.add(0, 5)).toBe(5);
            expect(Calculator.add(5, 0)).toBe(5);
            expect(Calculator.add(0, 0)).toBe(0);
        });

        test('小数点の加算', () => {
            expect(Calculator.add(0.1, 0.2)).toBeCloseTo(0.3);
            expect(Calculator.add(1.5, 2.5)).toBe(4);
        });
    });

    describe('subtract', () => {
        test('正の数の減算', () => {
            expect(Calculator.subtract(5, 3)).toBe(2);
            expect(Calculator.subtract(10, 15)).toBe(-5);
        });

        test('負の数の減算', () => {
            expect(Calculator.subtract(-2, -3)).toBe(1);
            expect(Calculator.subtract(-10, 5)).toBe(-15);
        });

        test('ゼロとの減算', () => {
            expect(Calculator.subtract(5, 0)).toBe(5);
            expect(Calculator.subtract(0, 5)).toBe(-5);
        });
    });

    describe('multiply', () => {
        test('正の数の乗算', () => {
            expect(Calculator.multiply(2, 3)).toBe(6);
            expect(Calculator.multiply(4, 5)).toBe(20);
        });

        test('負の数の乗算', () => {
            expect(Calculator.multiply(-2, 3)).toBe(-6);
            expect(Calculator.multiply(-2, -3)).toBe(6);
        });

        test('ゼロとの乗算', () => {
            expect(Calculator.multiply(5, 0)).toBe(0);
            expect(Calculator.multiply(0, 5)).toBe(0);
        });
    });

    describe('divide', () => {
        test('正の数の除算', () => {
            expect(Calculator.divide(6, 2)).toBe(3);
            expect(Calculator.divide(15, 3)).toBe(5);
        });

        test('負の数の除算', () => {
            expect(Calculator.divide(-6, 2)).toBe(-3);
            expect(Calculator.divide(-6, -2)).toBe(3);
        });

        test('小数点の除算', () => {
            expect(Calculator.divide(1, 3)).toBeCloseTo(0.333333);
            expect(Calculator.divide(7, 2)).toBe(3.5);
        });

        test('ゼロ除算でエラーが発生', () => {
            expect(() => Calculator.divide(5, 0)).toThrow('Division by zero is not allowed');
            expect(() => Calculator.divide(-5, 0)).toThrow('Division by zero is not allowed');
        });
    });

    describe('sqrt', () => {
        test('正の数の平方根', () => {
            expect(Calculator.sqrt(4)).toBe(2);
            expect(Calculator.sqrt(9)).toBe(3);
            expect(Calculator.sqrt(16)).toBe(4);
        });

        test('ゼロの平方根', () => {
            expect(Calculator.sqrt(0)).toBe(0);
        });

        test('小数点の平方根', () => {
            expect(Calculator.sqrt(2)).toBeCloseTo(1.414213);
            expect(Calculator.sqrt(0.25)).toBe(0.5);
        });

        test('負の数の平方根でエラーが発生', () => {
            expect(() => Calculator.sqrt(-1)).toThrow('Cannot calculate square root of negative number');
            expect(() => Calculator.sqrt(-4)).toThrow('Cannot calculate square root of negative number');
        });
    });

    describe('factorial', () => {
        test('正の整数の階乗', () => {
            expect(Calculator.factorial(0)).toBe(1);
            expect(Calculator.factorial(1)).toBe(1);
            expect(Calculator.factorial(3)).toBe(6);
            expect(Calculator.factorial(4)).toBe(24);
            expect(Calculator.factorial(5)).toBe(120);
        });

        test('負の数の階乗でエラーが発生', () => {
            expect(() => Calculator.factorial(-1)).toThrow('Cannot calculate factorial of negative number');
            expect(() => Calculator.factorial(-5)).toThrow('Cannot calculate factorial of negative number');
        });
    });
}); 