# Biome + GritQL カスタムルール設定ガイド

## 概要

BiomeはRust製の高速なJavaScript/TypeScriptツールチェーンで、GritQLを使用してカスタムルールを作成できます。

## Biome設定手順

### 1. インストール

```bash
# モノレポの場合はワークスペースルートに
pnpm add -D @biomejs/biome -w

# 通常のプロジェクトの場合
pnpm add -D @biomejs/biome
```

### 2. 基本設定ファイル（biome.jsonc）

```json
{
  "$schema": "https://biomejs.dev/schemas/2.1.2/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "tab"
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double"
    }
  },
  "plugins": []
}
```

## GritQLとは

GritQLは構造的なコード検索・変換を行うクエリ言語です。

### 特徴
- **構造的マッチング**: 空白や引用符の違いを無視してコードパターンをマッチ
- **変数サポート**: `$variable`でパターンの一部をキャプチャ
- **条件付きマッチング**: `where`句で複雑な条件を指定

### 基本構文

```grit
language js;

`console.log($message)` where {
    $message <: `"Hello World"`,
    register_diagnostic(
        span = $message,
        message = "特定のメッセージが検出されました",
        severity = "error"
    )
}
```

## カスタムルール適用例

### 1. 変数名制限ルール

**ファイル**: `no-abcdefg-variable.grit`

```grit
language js;

or {
    `var $name = $value`,
    `let $name = $value`,
    `const $name = $value`,
    `function $name($args) { $body }`,
    `$obj.$name = $value`,
    `{ $name: $value }`,
    `{ $name }`,
    `($name) => $body`,
    `function($name) { $body }`
} where {
    $name <: "abcdefg",
    register_diagnostic(
        span = $name,
        message = "変数名に 'abcdefg' を使用してはいけません。より意味のある名前を使用してください。",
        severity = "error"
    )
}
```

### 2. 関数内外部変数参照検出ルール

**ファイル**: `no-external-variable-in-function.grit`

```grit
language js;

`function $name($params) { $body }` where {
    $body <: contains `$variable` where {
        // 関数のパラメータに含まれていない変数の使用を検出
        not $params <: contains $variable,
        // 関数内で宣言されていない変数の使用を検出
        not $body <: contains bubble($variable) `var $variable = $_`,
        not $body <: contains bubble($variable) `let $variable = $_`,
        not $body <: contains bubble($variable) `const $variable = $_`,
        // console, グローバル関数などの除外
        not $variable <: or { 
            "console", "window", "document", "process", 
            "global", "require", "module", "exports",
            "setTimeout", "setInterval", "clearTimeout", "clearInterval"
        }
    },
    register_diagnostic(
        span = $variable,
        message = "関数内で外部変数を参照しています。副作用を避けるため、パラメータとして渡すか、関数内で定義してください。",
        severity = "error"
    )
}
```

### 3. Biome設定への統合

```json
{
  "$schema": "https://biomejs.dev/schemas/2.1.2/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "tab"
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "plugins": [
    "./no-abcdefg-variable.grit",
    "./no-external-variable-in-function.grit"
  ]
}
```

## 実行方法

```bash
# 特定ファイルをチェック
pnpm biome check src/index.ts

# 全ファイルをチェック
pnpm biome check .

# 自動修正可能な項目を修正
pnpm biome check --write .
```

## よく使用するGritQLパターン

### 変数キャプチャ
```grit
`$fn($args)` where { $fn <: `console.log` }
```

### 条件分岐
```grit
`$expr` where {
    $expr <: or { `true`, `false` }
}
```

### ネストした条件
```grit
`if ($cond) { $body }` where {
    $cond <: contains `$var`,
    not $body <: contains `$var`
}
```

## 注意点

- GritQLプラグインはBiome 1.6.0以降で利用可能（実験的機能）
- `.grit`拡張子のファイルとして保存
- `language js;`でターゲット言語を指定
- `register_diagnostic()`でエラーメッセージを登録
- パフォーマンスを考慮してパターンを最適化

## 参考リンク

- [Biome公式ドキュメント](https://biomejs.dev/)
- [GritQL言語リファレンス](https://biomejs.dev/ja/reference/gritql/)
- [Biome Linter Plugins](https://biomejs.dev/linter/plugins/) 