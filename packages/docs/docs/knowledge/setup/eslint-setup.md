# ESLint セットアップガイド

## ESLintのFlat Configについて

ESLint v9から標準となったFlat Config（フラット設定）は、従来の`.eslintrc`形式に代わる新しい設定形式です。

### 主な特徴
- **ファイル形式**: `eslint.config.js`、`eslint.config.mjs`、`eslint.config.cjs`
- **設定構造**: 配列ベースの設定で、より直感的で理解しやすい
- **拡張性**: プラグインや設定の組み合わせが簡単
- **TypeScript対応**: TypeScript-ESLintとの統合が改善

### 基本構文
```javascript
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // グローバルな無視設定
  {
    name: "ignore-globally",
    ignores: ["**/node_modules", "**/.turbo", "**/dist"],
  },
  // 推奨設定の適用
  ...tseslint.configs.recommended,
  // カスタム設定
  {
    name: "custom-config",
    files: ["src/**/*.ts"],
    rules: {
      // ルール設定
    },
  }
);
```

## Experimental Configuration File Resolution

ESLint v9で実験的機能として導入された設定ファイル検索の新しい方法です。

### 従来の動作
- カレントワーキングディレクトリから設定ファイルを検索
- モノレポ環境では適切な設定ファイルが見つからない場合がある

### 新しい動作（v10で標準化予定）
- リントするファイルのディレクトリから設定ファイルを検索開始
- 親ディレクトリを順次遡って`eslint.config.js`を探索
- モノレポの各サブディレクトリで独自の設定ファイルを使用可能

### 使用方法
```bash
# コマンドライン
npx eslint --flag v10_config_lookup_from_file .

# package.jsonのscripts
"lint": "eslint --flag v10_config_lookup_from_file"
```

### メリット
- **モノレポ対応**: 各パッケージで異なる設定を適用可能
- **設定の局所化**: プロジェクト構造に応じた柔軟な設定管理
- **保守性向上**: 設定ファイルとソースコードの関係が明確

## tseslintの使い方と説明

TypeScript-ESLint v8で導入された新しい設定方法で、TypeScriptプロジェクトでのESLint設定を簡素化します。

### インストール
```bash
npm install --save-dev typescript-eslint eslint
```

### 基本設定
```javascript
import tseslint from "typescript-eslint";

export default tseslint.config(
  // TypeScript推奨設定
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // TypeScript固有のルール
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "warn",
    },
  }
);
```

### 主要機能
- **型チェック統合**: TypeScriptの型情報を活用したルール
- **推奨設定**: `recommended`、`strict`、`stylistic`などのプリセット
- **パフォーマンス最適化**: TypeScriptパーサーの効率的な利用

### 設定例（モノレポ対応）
```javascript
export default tseslint.config(
  {
    name: "apps/api",
    files: ["apps/api/src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./apps/api/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-restricted-syntax": [
        "error",
        {
          "selector": "VariableDeclarator[id.name='abcdefg']",
          "message": "変数名 'abcdefg' は使用できません。"
        }
      ],
    },
  }
);
```

### ベストプラクティス
- プロジェクトごとに`tsconfig.json`を指定
- 適切な`files`パターンでスコープを限定
- パフォーマンスを考慮してルールを選択
