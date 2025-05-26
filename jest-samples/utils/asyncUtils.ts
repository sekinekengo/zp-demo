/**
 * 非同期処理のユーティリティ関数群
 */

/**
 * 指定した時間だけ待機する
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 非同期でデータを取得するシミュレーション
 */
export async function fetchUserData(userId: number): Promise<{ id: number; name: string; email: string }> {
    await delay(100); // API呼び出しのシミュレーション

    if (userId <= 0) {
        throw new Error('Invalid user ID');
    }

    return {
        id: userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`
    };
}

/**
 * 複数のPromiseを並列実行し、すべて完了するまで待機
 */
export async function fetchMultipleUsers(userIds: number[]): Promise<Array<{ id: number; name: string; email: string }>> {
    const promises = userIds.map(id => fetchUserData(id));
    return Promise.all(promises);
}

/**
 * タイムアウト付きでPromiseを実行
 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
        )
    ]);
}

/**
 * リトライ機能付きの非同期関数
 */
export async function retryAsync<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
): Promise<T> {
    let lastError: Error;

    for (let i = 0; i <= maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (i < maxRetries) {
                await delay(delayMs);
            }
        }
    }

    throw lastError!;
} 