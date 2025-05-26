# Jest ES Modules対応 完全セットアップガイド

## 目次
1. [背景と概要](#背景と概要)
2. [前提条件](#前提条件)
3. [依存関係のインストール](#依存関係のインストール)
4. [設定ファイルの作成](#設定ファイルの作成)
5. [package.json の設定](#packagejson-の設定)
6. [TypeScript設定（TypeScriptプロジェクトの場合）](#typescript設定typescriptプロジェクトの場合)
7. [動作確認](#動作確認)
8. [トラブルシューティング](#トラブルシューティング)
9. [参考資料](#参考資料)

## 背景と概要

### なぜES Modules対応が必要なのか

**ES Modules（ECMAScript Modules）** は、JavaScript標準の公式モジュールシステムです。従来のCommonJS（`require`/`module.exports`）に代わる現代的なアプローチとして、以下の利点があります：

- **標準仕様**: ECMAScript標準の一部として策定
- **静的解析**: ビルド時にモジュール依存関係を解析可能
- **Tree Shaking**: 未使用コードの除去が効率的
- **ブラウザネイティブ**: モダンブラウザで直接サポート
- **非同期読み込み**: Top-level awaitなどの機能

**Node.js公式サイト**[[2]](#参考資料)によると、Node.js 12.20.0以降でES Modulesが安定サポートされており、`package.json`で`"type": "module"`を指定することで、`.js`ファイルがES Modulesとして扱われます[[8]](#参考資料)。

**Jest公式サイト**[[1]](#参考資料)では、ES Modules対応について以下のように説明されています：
- Jest 28以降でES Modulesサポートが大幅に改善
- `--experimental-vm-modules`フラグが不要になった
- TypeScriptとの組み合わせでも安定動作

### 対象プロジェクト

このガイドは以下のプロジェクトを対象としています：
- ES Modules（`import`/`export`）を使用するプロジェクト
- `package.json`で`"type": "module"`が設定されているプロジェクト
- TypeScriptプロジェクト（オプション）
- Vite、Webpack、その他のモダンビルドツールを使用するプロジェクト

## 前提条件

### 必要なバージョン
- **Node.js**: 16.0.0以上（推奨: 18.0.0以上）
- **npm**: 8.0.0以上（または yarn 1.22.0以上）

### バージョン確認コマンド
```bash
node --version
npm --version
```

### プロジェクトの確認
プロジェクトの`package.json`に以下の設定があることを確認：
```json
{
  "type": "module"
}
```

**重要**: この設定により、Node.jsは`.js`ファイルをES Modulesとして解釈します[[8]](#参考資料)。この設定がないと、`import`/`export`構文でSyntaxErrorが発生します。

## 依存関係のインストール

### 基本パッケージ（JavaScript プロジェクト）
```bash
npm install --save-dev jest @jest/globals
```

### TypeScript プロジェクトの場合
```bash
npm install --save-dev jest @jest/globals @types/jest ts-jest
```

### パッケージの説明
- **jest**: Jestテストフレームワーク本体
- **@jest/globals**: ES Modules環境でのJestグローバル関数（`describe`, `test`, `expect`など）[[1]](#参考資料)
  - ES Modulesでは、グローバル関数が自動的に利用できないため、明示的にインポートが必要
- **@types/jest**: Jest用TypeScript型定義（TypeScriptプロジェクトのみ）
- **ts-jest**: TypeScriptファイルをJestで実行するためのプリセット（TypeScriptプロジェクトのみ）[[3]](#参考資料)

## 設定ファイルの作成

### jest.config.js の作成

プロジェクトルートに`jest.config.js`を作成：

#### JavaScript プロジェクトの場合
```javascript
export default {
  // ES Modules対応の基本設定
  preset: 'default',
  extensionsToTreatAsEsm: ['.js'],
  
  // テストファイルのパターン
  testMatch: [
    '**/*.(test|spec).(js|jsx)'
  ],
  
  // テスト環境
  testEnvironment: 'node',
  
  // カバレッジ設定
  collectCoverageFrom: [
    'src/**/*.(js|jsx)',
    '!src/**/*.d.ts',
  ],
  
  // セットアップファイル（必要に応じて）
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
```

**重要**: この設定は純粋なJavaScriptプロジェクト用です。TypeScriptファイル（`.ts`, `.tsx`）は対象外です。

#### TypeScript プロジェクトの場合
```javascript
export default {
  // TypeScript + ES Modules対応
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  
  // テスト環境
  testEnvironment: 'node',
  
  // ts-jest設定（transform方式）
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.jest.json',
    }],
  },
  
  // テストファイルのパターン
  testMatch: [
    '**/*.(test|spec).(ts|tsx|js|jsx)'
  ],
  
  // カバレッジ設定
  collectCoverageFrom: [
    'src/**/*.(ts|tsx|js|jsx)',
    '!src/**/*.d.ts',
  ],
  
  // ファイル拡張子
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // セットアップファイル（必要に応じて）
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
```

**設定の理由**:
- `preset: 'ts-jest/presets/default-esm'`: TypeScript + ES Modules用の事前設定[[3]](#参考資料)
- `transform`設定: Jest 29以降で推奨される方式。`globals`は非推奨[[7]](#参考資料)
- `useESM: true`: ts-jestでES Modules出力を有効化[[3]](#参考資料)
- `tsconfig: 'tsconfig.jest.json'`: テスト専用のTypeScript設定を使用[[7]](#参考資料)
- `moduleFileExtensions`: Jestがモジュール解決時に認識する拡張子の優先順位[[4]](#参考資料)

### 設定項目の詳細説明

- **preset**: 使用するJestプリセット[[4]](#参考資料)
  - `'default'`: JavaScript用標準プリセット
  - `'ts-jest/presets/default-esm'`: TypeScript + ES Modules用プリセット[[3]](#参考資料)
  - プリセットは複数の設定をまとめたもので、個別設定より優先度が低い

- **extensionsToTreatAsEsm**: ES Modulesとして扱うファイル拡張子[[1]](#参考資料)
  - Jestは通常CommonJSとして解釈するため、ES Modulesファイルを明示的に指定
  - この設定により、`import`/`export`構文が正しく処理される

- **transform**: ファイル変換設定（TypeScriptプロジェクトの場合）[[7]](#参考資料)
  - `ts-jest`でTypeScriptファイルを変換
  - `useESM: true`でES Modules出力を有効化
  - `tsconfig`で専用のTypeScript設定ファイルを指定
  - Jest 29以降、`globals`設定より`transform`が推奨



- **testEnvironment**: テスト実行環境[[4]](#参考資料)
  - `'node'`: Node.js環境（サーバーサイドロジック用）
  - `'jsdom'`: ブラウザ環境（DOM操作が必要な場合）
  - React コンポーネントテストでは`jsdom`を使用

- **moduleFileExtensions**: 認識するファイル拡張子の順序[[4]](#参考資料)
  - Jestがモジュール解決時に試行する拡張子の優先順位
  - 左から順に試行され、最初に見つかったファイルを使用

### オプション設定

以下の設定は、プロジェクトの要件に応じて追加できます：

#### moduleNameMapper（モジュールパス解決）
```javascript
moduleNameMapper: {
  // 拡張子除去（ES Modules + .js拡張子を使用する場合）
  '^(\\.{1,2}/.*)\\.js$': '$1',
  
  // エイリアス設定（@/ パスを使用する場合）
  '^@/(.*)$': '<rootDir>/src/$1',
  
  // CSSファイルのモック（スタイルファイルをインポートする場合）
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
}
```

**使用場面**:
- ES Modulesで`.js`拡張子を明示的に書く場合
- `@/components/Button`のようなエイリアスを使用する場合
- CSSファイルをコンポーネントでインポートする場合

## package.json の設定

### テストスクリプトの追加

`package.json`の`scripts`セクションに以下を追加：

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:verbose": "jest --verbose"
  }
}
```

### 完全な package.json 例

```json
{
  "name": "your-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "@jest/globals": "^29.0.0",
    "@types/jest": "^29.0.0",
    "ts-jest": "^29.0.0"
  }
}
```

## TypeScript設定（TypeScriptプロジェクトの場合）

### tsconfig.json の確認

プロジェクトの`tsconfig.json`で以下の設定を確認：

```json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "target": "ES2020",
    "lib": ["ES2020"],
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "types": ["jest", "node"]
  }
}
```

**設定の理由**[[5]](#参考資料):
- `"module": "ESNext"`: 最新のES Modules構文を使用
- `"moduleResolution": "node"`: Node.js形式のモジュール解決
- `"target": "ES2020"`: ES2020機能（Optional Chaining等）を使用可能
- `"allowSyntheticDefaultImports": true`: default exportがないモジュールでもdefault importを許可
- `"esModuleInterop": true`: CommonJSとES Modulesの相互運用性を向上

### Jest専用 TypeScript設定（オプション）

より細かい制御が必要な場合、`tsconfig.jest.json`を作成：

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "node",
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "allowJs": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "types": ["jest", "node"]
  },
  "include": [
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.ts",
    "**/*.spec.tsx",
    "jest.setup.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

**専用設定の理由**[[5]](#参考資料):
- `"lib": ["ES2020", "DOM"]`: テスト環境でDOM APIも使用可能にする
- `"allowJs": true`: JavaScriptファイルもテスト対象に含める
- `"strict": true`: 厳密な型チェックでテストの品質向上
- `"skipLibCheck": true`: 外部ライブラリの型チェックをスキップして高速化
- `"types": ["jest", "node"]`: Jest固有の型定義を明示的に含める
- `"include"`: テストファイルのみを対象にして処理を最適化

そして`jest.config.js`で参照：

```javascript
export default {
  // ... 他の設定
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.jest.json',
    }],
  },
};
```

## 動作確認

### 1. セットアップファイルの作成（オプション）

`jest.setup.js`（または`jest.setup.ts`）を作成：

```javascript
// Jest グローバル関数のインポート
import { expect } from '@jest/globals';

// カスタムマッチャーの追加（例）
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});
```

### 2. サンプルテストファイルの作成

`src/utils.js`（または`src/utils.ts`）:

```javascript
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export async function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve('data'), 100);
  });
}
```

`src/utils.test.js`（または`src/utils.test.ts`）:

```javascript
import { describe, test, expect } from '@jest/globals';
import { add, multiply, fetchData } from './utils.js';

describe('Utils', () => {
  test('add function', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });

  test('multiply function', () => {
    expect(multiply(3, 4)).toBe(12);
    expect(multiply(0, 5)).toBe(0);
  });

  test('async fetchData function', async () => {
    const data = await fetchData();
    expect(data).toBe('data');
  });
});
```

**重要なポイント**:
- `@jest/globals`からの明示的インポートが必要[[1]](#参考資料)
- ES Modulesでは、グローバル関数が自動的に利用できない
- インポート文で`.js`拡張子を含める（ES Modules仕様）[[6]](#参考資料)

### 3. テストの実行

```bash
# 基本テスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジ付き実行
npm run test:coverage
```

### 4. 期待される出力

成功時の出力例：
```
 PASS  src/utils.test.js
  Utils
    ✓ add function (2 ms)
    ✓ multiply function (1 ms)
    ✓ async fetchData function (101 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.234 s
```

## トラブルシューティング

### よくあるエラーと解決方法

#### 1. `SyntaxError: Cannot use import statement outside a module`

**原因**: ES Modules設定が不完全[[2]](#参考資料)

**解決方法**:
- `package.json`に`"type": "module"`があることを確認[[8]](#参考資料)
- `jest.config.js`で`extensionsToTreatAsEsm`が正しく設定されていることを確認[[1]](#参考資料)
- Node.jsがファイルをCommonJSとして解釈している可能性

#### 2. `TypeError: Jest encountered an unexpected token`

**原因**: TypeScript設定の問題[[3]](#参考資料)

**解決方法**:
- `ts-jest`がインストールされていることを確認
- `jest.config.js`で`preset: 'ts-jest/presets/default-esm'`を使用[[3]](#参考資料)
- `transform`設定で`useESM: true`が設定されていることを確認[[7]](#参考資料)
- `tsconfig.jest.json`が正しく作成されていることを確認
- TypeScriptファイルがJestで正しく変換されていない可能性

#### 3. `Module not found` エラー

**原因**: モジュール解決の問題[[4]](#参考資料)

**解決方法**:
- `moduleNameMapper`設定を確認[[4]](#参考資料)
- インポート文で`.js`拡張子を除去
- 相対パスが正しいことを確認
- ES Modulesでは拡張子が必須だが、テスト環境では`moduleNameMapper`で調整

#### 4. `ReferenceError: describe is not defined`

**原因**: Jest グローバル関数のインポート不足[[1]](#参考資料)

**解決方法**:
```javascript
import { describe, test, expect } from '@jest/globals';
```
ES Modulesでは、グローバル関数が自動的に利用できないため明示的インポートが必要

#### 5. TypeScript型エラー

**原因**: Jest型定義の問題[[5]](#参考資料)

**解決方法**:
- `@types/jest`がインストールされていることを確認
- `tsconfig.json`の`types`配列に`"jest"`を追加[[5]](#参考資料)
- TypeScriptがJest関数の型を認識できていない状態

### デバッグ方法

#### 詳細ログの有効化
```bash
npm test -- --verbose --no-cache
```
`--verbose`: 各テストの詳細結果を表示[[4]](#参考資料)  
`--no-cache`: キャッシュを無効化して設定変更を確実に反映

#### 設定の確認
```bash
npx jest --showConfig
```
Jestが実際に使用している設定を確認[[4]](#参考資料)

#### Node.js ES Modules フラグ（古いバージョンの場合）
```bash
node --experimental-vm-modules node_modules/.bin/jest
```
Node.js 16未満でES Modulesを強制的に有効化[[2]](#参考資料)

## 参考資料

### 公式ドキュメント
1. [Jest公式サイト - ES Modules](https://jestjs.io/docs/ecmascript-modules)
2. [Node.js公式サイト - ES Modules](https://nodejs.org/api/esm.html)
3. [ts-jest公式サイト - ES Modules](https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/)
4. [Jest Configuration Reference](https://jestjs.io/docs/configuration)
5. [TypeScript Handbook - Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
6. [MDN - JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
7. [ts-jest Configuration](https://kulshekhar.github.io/ts-jest/docs/getting-started/options)
8. [Node.js Package.json type field](https://nodejs.org/api/packages.html#type)

### バージョン互換性
- Jest 28+: ES Modules安定サポート
- Node.js 16+: ES Modules完全サポート
- TypeScript 4.5+: ES Modules改善

---

このガイドに従って設定を行うことで、ES Modules対応のJest環境を構築できます。問題が発生した場合は、トラブルシューティングセクションを参照してください。 