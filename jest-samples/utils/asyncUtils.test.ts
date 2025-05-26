import { describe, test, expect, jest } from '@jest/globals';
import {
    delay,
    fetchUserData,
    fetchMultipleUsers,
    withTimeout,
    retryAsync
} from './asyncUtils';

describe('asyncUtils', () => {
    describe('delay', () => {
        test('指定した時間だけ待機する', async () => {
            const start = Date.now();
            await delay(100);
            const end = Date.now();
            const elapsed = end - start;

            // 100ms前後の誤差を許容
            expect(elapsed).toBeGreaterThanOrEqual(90);
            expect(elapsed).toBeLessThan(150);
        });

        test('0msの遅延', async () => {
            const start = Date.now();
            await delay(0);
            const end = Date.now();
            const elapsed = end - start;

            expect(elapsed).toBeLessThan(10);
        });
    });

    describe('fetchUserData', () => {
        test('有効なユーザーIDでデータを取得', async () => {
            const userData = await fetchUserData(1);

            expect(userData).toEqual({
                id: 1,
                name: 'User 1',
                email: 'user1@example.com'
            });
        });

        test('異なるユーザーIDでデータを取得', async () => {
            const userData = await fetchUserData(42);

            expect(userData).toEqual({
                id: 42,
                name: 'User 42',
                email: 'user42@example.com'
            });
        });

        test('無効なユーザーID（0以下）でエラーが発生', async () => {
            await expect(fetchUserData(0)).rejects.toThrow('Invalid user ID');
            await expect(fetchUserData(-1)).rejects.toThrow('Invalid user ID');
        });

        test('関数が非同期で実行される', async () => {
            const start = Date.now();
            await fetchUserData(1);
            const end = Date.now();
            const elapsed = end - start;

            // delay(100)があるので、最低100ms以上かかる
            expect(elapsed).toBeGreaterThanOrEqual(90);
        });
    });

    describe('fetchMultipleUsers', () => {
        test('複数のユーザーデータを並列取得', async () => {
            const userIds = [1, 2, 3];
            const users = await fetchMultipleUsers(userIds);

            expect(users).toHaveLength(3);
            expect(users[0]).toEqual({
                id: 1,
                name: 'User 1',
                email: 'user1@example.com'
            });
            expect(users[1]).toEqual({
                id: 2,
                name: 'User 2',
                email: 'user2@example.com'
            });
            expect(users[2]).toEqual({
                id: 3,
                name: 'User 3',
                email: 'user3@example.com'
            });
        });

        test('空の配列の場合', async () => {
            const users = await fetchMultipleUsers([]);
            expect(users).toEqual([]);
        });

        test('無効なIDが含まれている場合はエラー', async () => {
            await expect(fetchMultipleUsers([1, 0, 3])).rejects.toThrow('Invalid user ID');
        });

        test('並列実行により時間が短縮される', async () => {
            const start = Date.now();
            await fetchMultipleUsers([1, 2, 3]);
            const end = Date.now();
            const elapsed = end - start;

            // 3つのリクエストが並列実行されるため、300ms（100ms×3）より短い時間で完了
            expect(elapsed).toBeLessThan(200);
            expect(elapsed).toBeGreaterThanOrEqual(90);
        });
    });

    describe('withTimeout', () => {
        test('タイムアウト前に完了する場合', async () => {
            const promise = delay(50).then(() => 'success');
            const result = await withTimeout(promise, 100);

            expect(result).toBe('success');
        });

        test('タイムアウトが発生する場合', async () => {
            const promise = delay(200).then(() => 'success');

            await expect(withTimeout(promise, 100)).rejects.toThrow('Operation timed out');
        });

        test('Promiseが即座に解決される場合', async () => {
            const promise = Promise.resolve('immediate');
            const result = await withTimeout(promise, 100);

            expect(result).toBe('immediate');
        });

        test('Promiseが即座に拒否される場合', async () => {
            const promise = Promise.reject(new Error('immediate error'));

            await expect(withTimeout(promise, 100)).rejects.toThrow('immediate error');
        });
    });

    describe('retryAsync', () => {
        test('最初の試行で成功する場合', async () => {
            const mockFn = jest.fn<() => Promise<string>>().mockResolvedValue('success');

            const result = await retryAsync(mockFn, 3, 10);

            expect(result).toBe('success');
            expect(mockFn).toHaveBeenCalledTimes(1);
        });

        test('2回目の試行で成功する場合', async () => {
            const mockFn = jest.fn<() => Promise<string>>()
                .mockRejectedValueOnce(new Error('first failure'))
                .mockResolvedValue('success');

            const result = await retryAsync(mockFn, 3, 10);

            expect(result).toBe('success');
            expect(mockFn).toHaveBeenCalledTimes(2);
        });

        test('最大リトライ回数に達して失敗する場合', async () => {
            const mockFn = jest.fn<() => Promise<string>>().mockRejectedValue(new Error('persistent failure'));

            await expect(retryAsync(mockFn, 2, 10)).rejects.toThrow('persistent failure');
            expect(mockFn).toHaveBeenCalledTimes(3); // 初回 + 2回のリトライ
        });

        test('リトライ間隔が正しく動作する', async () => {
            const mockFn = jest.fn<() => Promise<string>>()
                .mockRejectedValueOnce(new Error('first failure'))
                .mockResolvedValue('success');

            const start = Date.now();
            await retryAsync(mockFn, 3, 50);
            const end = Date.now();
            const elapsed = end - start;

            // 1回のリトライ遅延（50ms）が含まれる
            expect(elapsed).toBeGreaterThanOrEqual(40);
            expect(elapsed).toBeLessThan(100);
        });

        test('デフォルトパラメータでの動作', async () => {
            const mockFn = jest.fn<() => Promise<string>>().mockRejectedValue(new Error('failure'));

            await expect(retryAsync(mockFn)).rejects.toThrow('failure');
            expect(mockFn).toHaveBeenCalledTimes(4); // 初回 + 3回のリトライ（デフォルト）
        });
    });
}); 