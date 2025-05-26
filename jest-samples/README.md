# Jest サンプル

このディレクトリには、ES Modules対応のJestテストフレームワークのサンプルコードとテストが含まれています。

## 📁 ディレクトリ構造

```
jest-samples/
├── README.md              # このファイル
├── setup.ts              # Jestセットアップファイル
├── utils/                # ユーティリティ関数とテスト
│   ├── calculator.ts     # 計算機能のサンプル
│   ├── calculator.test.ts # 計算機能のテスト
│   ├── stringUtils.ts    # 文字列操作のサンプル
│   ├── stringUtils.test.ts # 文字列操作のテスト
│   ├── asyncUtils.ts     # 非同期処理のサンプル
│   └── asyncUtils.test.ts # 非同期処理のテスト
└── components/           # 将来のReactコンポーネントテスト用
```

## 🚀 テスト実行方法

### 全てのテストを実行
```bash
npm test
```

### ウォッチモードでテストを実行（ファイル変更時に自動実行）
```bash
npm run test:watch
```

### カバレッジレポート付きでテストを実行
```bash
npm run test:coverage
```

### 特定のテストファイルのみ実行
```bash
# 計算機能のテストのみ
npx jest calculator.test.ts

# 文字列ユーティリティのテストのみ
npx jest stringUtils.test.ts

# 非同期処理のテストのみ
npx jest asyncUtils.test.ts
```

## 📋 サンプル内容

### 1. Calculator (計算機能)
- **ファイル**: `utils/calculator.ts`
- **テスト**: `utils/calculator.test.ts`
- **機能**:
  - 基本的な四則演算（加算、減算、乗算、除算）
  - 平方根計算
  - 階乗計算
  - エラーハンドリング（ゼロ除算、負数の平方根など）

### 2. StringUtils (文字列操作)
- **ファイル**: `utils/stringUtils.ts`
- **テスト**: `utils/stringUtils.test.ts`
- **機能**:
  - 文字列の逆順変換
  - 回文判定
  - 単語数カウント
  - キャメルケース変換
  - ケバブケース変換
  - 文字列の最初の文字を大文字化

### 3. AsyncUtils (非同期処理)
- **ファイル**: `utils/asyncUtils.ts`
- **テスト**: `utils/asyncUtils.test.ts`
- **機能**:
  - 遅延処理
  - 非同期データ取得のシミュレーション
  - 複数の非同期処理の並列実行
  - タイムアウト付きPromise実行
  - リトライ機能付き非同期処理

## 🔧 Jest設定

### 主要な設定項目
- **ES Modules対応**: `extensionsToTreatAsEsm` と `useESM` オプション
- **TypeScript対応**: `ts-jest` プリセット使用
- **テストファイルパターン**: `jest-samples/**/*.test.(ts|tsx|js|jsx)`
- **モジュールマッピング**: `@/*` パスエイリアス対応
- **セットアップファイル**: `setup.ts` で共通設定

### 設定ファイル
- `jest.config.js`: Jest設定ファイル
- `jest-samples/setup.ts`: テスト実行前の共通設定

## 📊 テスト例

### 基本的なテスト
```typescript
test('正の数の加算', () => {
  expect(Calculator.add(2, 3)).toBe(5);
});
```

### 非同期テスト
```typescript
test('非同期データ取得', async () => {
  const userData = await fetchUserData(1);
  expect(userData.id).toBe(1);
});
```

### エラーテスト
```typescript
test('ゼロ除算でエラーが発生', () => {
  expect(() => Calculator.divide(5, 0)).toThrow('Division by zero is not allowed');
});
```

### モック使用テスト
```typescript
test('リトライ機能', async () => {
  const mockFn = jest.fn().mockResolvedValue('success');
  const result = await retryAsync(mockFn, 3, 10);
  expect(mockFn).toHaveBeenCalledTimes(1);
});
```

## 💡 学習ポイント

1. **ES Modules**: `import/export` 構文の使用
2. **TypeScript**: 型安全なテストコード
3. **非同期テスト**: `async/await` とPromiseのテスト
4. **モック**: `jest.fn()` を使った関数のモック化
5. **マッチャー**: 様々な `expect` マッチャーの使用
6. **テスト構造**: `describe` と `test` によるテストの整理
7. **エラーハンドリング**: 例外のテスト方法

## 🎯 期待される結果

全てのテストが正常に実行され、以下のような出力が表示されます：

```
 PASS  jest-samples/utils/calculator.test.ts
 PASS  jest-samples/utils/stringUtils.test.ts  
 PASS  jest-samples/utils/asyncUtils.test.ts

Test Suites: 3 passed, 3 total
Tests:       XX passed, XX total
Snapshots:   0 total
Time:        X.XXXs
``` 