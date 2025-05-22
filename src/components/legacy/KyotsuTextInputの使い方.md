# KyotsuTextInput コンポーネント

共通テキスト入力コンポーネント。様々な入力タイプと書式に対応した高機能なテキスト入力フィールドを提供します。

## 基本的な使用方法

```tsx
import KyotsuTextInput from './KyotsuTextInput';

// 基本的な使用例
<KyotsuTextInput
  label="入力項目"
  value={value}
  onChange={handleChange}
  type="0"
  maxlength={20}
/>
```

## 必須プロパティ

| プロパティ名 | 型 | 説明 |
|------------|------|------|
| `label` | string | 入力フィールドのラベル |
| `value` | string \| number | 入力値 |
| `onChange` | (value: string \| number) => void | 値が変更された時のコールバック関数 |
| `maxlength` | number | 最大入力文字数 |
| `type` | string | 入力タイプ（詳細は下記） |

## 入力タイプ（type）

| 値 | 説明 | 使用例 |
|----|------|--------|
| `'0'` | 日本語（全角・半角） | 名前、住所など |
| `'1'` | 半角英数カナ記号 | ユーザーID、パスワードなど |
| `'2'` | 数字（コードなど） | 商品コード、社員番号など |
| `'3'` | 数値（金額） | 金額、数量など |
| `'4'` | 半角英数（コードなど） | 商品コード、システムコードなど |

## オプションプロパティ

### テキスト配置（alignment）
| 値 | 説明 |
|----|------|
| `'0'` | 左寄せ（デフォルト） |
| `'1'` | 右寄せ |
| `'2'` | 中央寄せ |
| `'3'` | 両端寄せ |

### 入力形式（format）
| 値 | 説明 |
|----|------|
| `'0'` | 全角（デフォルト） |
| `'1'` | 半角 |
| `'2'` | どちらでも |

### IME互換モード（inputmode）
| 値 | 説明 |
|----|------|
| `'0'` | ON |
| `'1'` | OFF（デフォルト） |

### 数値関連オプション
| プロパティ名 | 型 | 説明 |
|------------|------|------|
| `zeropadding` | boolean | ゼロパディング（デフォルト: false） |
| `decimalplace` | number | 小数点以下桁数 |
| `sign` | boolean | 符号有無（デフォルト: false） |
| `zerocomplement` | boolean | ゼロ補完（デフォルト: false） |
| `moneyunit` | string | 丸めモード（詳細は下記） |

### 丸めモード（moneyunit）
| 値 | 説明 |
|----|------|
| `'0'` | 円(切り上げ) |
| `'1'` | 円(切り捨て) |
| `'2'` | 円(四捨五入) |
| `'3'` | 千円(切り上げかつマイナス切り捨て) |
| `'4'` | 千円(四捨五入) |
| `'5'` | 千円(切り捨てかつ千円未満切り上げかつマイナス切り上げ) |
| `'6'` | 千円(四捨五入かつ千円未満切り上げかつマイナス四捨五入) |

### その他のオプション
| プロパティ名 | 型 | 説明 |
|------------|------|------|
| `inputWidth` | string | 入力欄の幅 |
| `labelWidth` | string | ラベルの幅（デフォルト: '100px'） |
| `row` | number | 行数（デフォルト: 1） |
| `column` | number | 1行あたりの文字数 |
| `unit` | string | 単位（例: '円'） |
| `readonly` | boolean | 読み取り専用（デフォルト: false） |
| `disabled` | boolean | 無効化（デフォルト: false） |

## 使用例

### 日本語入力（全角）
```tsx
<KyotsuTextInput
  label="名前"
  value={name}
  onChange={setName}
  type="0"
  maxlength={20}
  format="0"
  inputmode="0"
/>
```

### 金額入力
```tsx
<KyotsuTextInput
  label="金額"
  value={amount}
  onChange={setAmount}
  type="3"
  maxlength={10}
  moneyunit="2"
  decimalplace={0}
  unit="円"
/>
```

### コード入力（半角英数）
```tsx
<KyotsuTextInput
  label="商品コード"
  value={code}
  onChange={setCode}
  type="4"
  maxlength={8}
  format="1"
/>
```

## 注意事項

1. 数値入力（type="2"または"3"）の場合、`onChange`の戻り値は`number`型になります。
2. その他の入力タイプでは、`onChange`の戻り値は`string`型になります。
3. `maxlength`は必須プロパティです。適切な値を設定してください。
4. 金額入力時は`moneyunit`と`decimalplace`の組み合わせに注意してください。 