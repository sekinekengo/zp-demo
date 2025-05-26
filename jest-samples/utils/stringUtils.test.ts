import { describe, test, expect } from '@jest/globals';
import {
    reverseString,
    isPalindrome,
    countWords,
    toCamelCase,
    toKebabCase,
    capitalize
} from './stringUtils';

describe('stringUtils', () => {
    describe('reverseString', () => {
        test('通常の文字列を逆順にする', () => {
            expect(reverseString('hello')).toBe('olleh');
            expect(reverseString('world')).toBe('dlrow');
            expect(reverseString('JavaScript')).toBe('tpircSavaJ');
        });

        test('空文字列の場合', () => {
            expect(reverseString('')).toBe('');
        });

        test('一文字の場合', () => {
            expect(reverseString('a')).toBe('a');
        });

        test('数字を含む文字列', () => {
            expect(reverseString('abc123')).toBe('321cba');
        });

        test('特殊文字を含む文字列', () => {
            expect(reverseString('hello!')).toBe('!olleh');
            expect(reverseString('a-b-c')).toBe('c-b-a');
        });
    });

    describe('isPalindrome', () => {
        test('回文の判定（単純なケース）', () => {
            expect(isPalindrome('racecar')).toBe(true);
            expect(isPalindrome('level')).toBe(true);
            expect(isPalindrome('noon')).toBe(true);
        });

        test('回文ではない文字列', () => {
            expect(isPalindrome('hello')).toBe(false);
            expect(isPalindrome('world')).toBe(false);
            expect(isPalindrome('javascript')).toBe(false);
        });

        test('大文字小文字を無視した回文', () => {
            expect(isPalindrome('Racecar')).toBe(true);
            expect(isPalindrome('Level')).toBe(true);
            expect(isPalindrome('MadAm')).toBe(true);
        });

        test('スペースや記号を含む回文', () => {
            expect(isPalindrome('A man a plan a canal Panama')).toBe(true);
            expect(isPalindrome('race a car')).toBe(false);
            expect(isPalindrome('Was it a car or a cat I saw?')).toBe(true);
        });

        test('空文字列と一文字', () => {
            expect(isPalindrome('')).toBe(true);
            expect(isPalindrome('a')).toBe(true);
        });
    });

    describe('countWords', () => {
        test('通常の文章の単語数', () => {
            expect(countWords('hello world')).toBe(2);
            expect(countWords('The quick brown fox')).toBe(4);
            expect(countWords('JavaScript is awesome')).toBe(3);
        });

        test('空文字列と空白のみ', () => {
            expect(countWords('')).toBe(0);
            expect(countWords('   ')).toBe(0);
            expect(countWords('\t\n')).toBe(0);
        });

        test('一つの単語', () => {
            expect(countWords('hello')).toBe(1);
            expect(countWords('  hello  ')).toBe(1);
        });

        test('複数の空白で区切られた単語', () => {
            expect(countWords('hello    world')).toBe(2);
            expect(countWords('  one   two   three  ')).toBe(3);
        });

        test('改行やタブを含む文章', () => {
            expect(countWords('hello\nworld')).toBe(2);
            expect(countWords('one\ttwo\nthree')).toBe(3);
        });
    });

    describe('toCamelCase', () => {
        test('スペース区切りの文字列', () => {
            expect(toCamelCase('hello world')).toBe('helloWorld');
            expect(toCamelCase('the quick brown fox')).toBe('theQuickBrownFox');
        });

        test('ハイフン区切りの文字列', () => {
            expect(toCamelCase('hello-world')).toBe('helloWorld');
            expect(toCamelCase('my-awesome-function')).toBe('myAwesomeFunction');
        });

        test('アンダースコア区切りの文字列', () => {
            expect(toCamelCase('hello_world')).toBe('helloWorld');
            expect(toCamelCase('user_name_field')).toBe('userNameField');
        });

        test('混合区切りの文字列', () => {
            expect(toCamelCase('hello-world_test case')).toBe('helloWorldTestCase');
        });

        test('既にキャメルケースの文字列', () => {
            expect(toCamelCase('helloWorld')).toBe('helloworld');
        });
    });

    describe('toKebabCase', () => {
        test('キャメルケースからケバブケース', () => {
            expect(toKebabCase('helloWorld')).toBe('hello-world');
            expect(toKebabCase('myAwesomeFunction')).toBe('my-awesome-function');
        });

        test('スペース区切りからケバブケース', () => {
            expect(toKebabCase('hello world')).toBe('hello-world');
            expect(toKebabCase('the quick brown fox')).toBe('the-quick-brown-fox');
        });

        test('アンダースコア区切りからケバブケース', () => {
            expect(toKebabCase('hello_world')).toBe('hello-world');
            expect(toKebabCase('user_name_field')).toBe('user-name-field');
        });

        test('既にケバブケースの文字列', () => {
            expect(toKebabCase('hello-world')).toBe('hello-world');
        });

        test('大文字を含む文字列', () => {
            expect(toKebabCase('HelloWorld')).toBe('hello-world');
            expect(toKebabCase('XMLHttpRequest')).toBe('xmlhttp-request');
        });
    });

    describe('capitalize', () => {
        test('通常の文字列の最初を大文字に', () => {
            expect(capitalize('hello')).toBe('Hello');
            expect(capitalize('world')).toBe('World');
            expect(capitalize('javascript')).toBe('Javascript');
        });

        test('既に大文字の文字列', () => {
            expect(capitalize('Hello')).toBe('Hello');
            expect(capitalize('WORLD')).toBe('World');
        });

        test('空文字列と一文字', () => {
            expect(capitalize('')).toBe('');
            expect(capitalize('a')).toBe('A');
            expect(capitalize('A')).toBe('A');
        });

        test('数字で始まる文字列', () => {
            expect(capitalize('123abc')).toBe('123abc');
        });

        test('複数の単語を含む文字列', () => {
            expect(capitalize('hello world')).toBe('Hello world');
            expect(capitalize('HELLO WORLD')).toBe('Hello world');
        });
    });
}); 