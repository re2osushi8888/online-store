---
sidebar_position: 2
---

# TypeScript バージョンアップ手順

## 概要

このガイドでは、TypeScriptを最新バージョンにアップグレードする手順を説明します。従来のTypeScript 5.x系から新しいTypeScript 7.0 (tsgo) への移行も含めて解説します。

## TypeScript 7.0 (tsgo) について

### 概要
TypeScript 7.0では、コンパイラがGoで完全に書き直され、大幅な性能向上を実現しています。

- **最大10倍の高速化**: 型チェックとコンパイル時間の大幅短縮
- **ネイティブコンパイル**: Goによる並列処理とメモリ効率の最適化
- **互換性維持**: 既存のTypeScriptコードとの下位互換性

### パフォーマンス比較実例
| プロジェクト | サイズ（行数） | tsc（従来） | tsgo（新版） | 改善倍率 |
|-------------|----------------|------------|-------------|---------|
| VS Code | 1,505,000 | 77.8s | 7.5s | 10.4x |
| Playwright | 356,000 | 11.1s | 1.1s | 10.1x |
| TypeORM | 270,000 | 17.5s | 1.3s | 13.5x |

## 事前準備

### 現在のバージョン確認
```bash
# プロジェクトのTypeScriptバージョン
npx tsc --version

# TypeScript 7.0 (tsgo) がインストールされているか確認
npx tsgo --version

# package.jsonでの確認
npm list typescript
npm list @typescript/native-preview
```

### バックアップとブランチ作成
```bash
# 作業用ブランチを作成
git checkout -b upgrade/typescript-7

# 現在の状態をコミット
git add .
git commit -m "feat: TypeScript 7.0 upgrade前のバックアップ"
```

## アップグレード手順

### 1. TypeScript 7.0 (tsgo) のインストール

#### TypeScript Native Preview のインストール
```bash
# TypeScript 7.0 Native Previewをインストール
npm install --save-dev @typescript/native-preview

# 従来のTypeScriptも必要（設定ファイル生成用）
npm install --save-dev typescript@latest
```

#### VS Codeの拡張機能設定（オプション）
```bash
# VS Code拡張機能「TypeScript (Native Preview)」をインストール
# または設定で有効化
```

VS Codeの設定:
```json
{
  "typescript.experimental.useTsgo": true
}
```

### 2. 型定義ファイルの更新

```bash
# @types パッケージの更新
npm update @types/node @types/react @types/react-dom

# 最新版への更新
npm install --save-dev @types/node@latest
npm install --save-dev @types/react@latest
npm install --save-dev @types/react-dom@latest
```

### 3. tsconfig.json の設定

#### TypeScript 7.0対応設定
```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "NodeNext",
    "moduleResolution": "bundler",
    "strict": true,
    
    // TypeScript 7.0 新機能
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    
    // 非推奨設定の修正（tsgo対応）
    // "moduleResolution": "node" → "bundler" または "node16"/"nodenext"
    
    // パフォーマンス最適化
    "incremental": true,
    "composite": true,
    
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "build"]
}
```

### 4. package.json スクリプトの更新

```json
{
  "scripts": {
    "type-check": "npx tsgo --noEmit",
    "type-check:watch": "npx tsgo --noEmit --watch",
    "build": "npx tsgo",
    "build:extended": "npx tsgo --extendedDiagnostics",
    
    // 従来版との比較用
    "type-check:legacy": "npx tsc --noEmit",
    "build:legacy": "npx tsc"
  }
}
```

## コードの修正

### 1. モジュール解決の修正

#### 非推奨な`node`モジュール解決からの移行
```typescript
// エラーが発生する場合
Cannot find module 'blah' or its corresponding type declarations.
Module '"module"' has no exported member 'Thing'.
```

**修正方法:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "preserve",
    "moduleResolution": "bundler"
  }
}
```

または:
```json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext"
  }
}
```

### 2. 型エラーの修正

#### exactOptionalPropertyTypes 対応
```typescript
interface User {
  name: string;
  email?: string;
}

// ❌ TypeScript 7.0でエラー
const user: User = { name: "John", email: undefined };

// ✅ 修正版
const user: User = { name: "John" };
// または明示的にundefinedを許可
interface User {
  name: string;
  email?: string | undefined;
}
```

#### noUncheckedIndexedAccess 対応
```typescript
const items = ["a", "b", "c"];

// ❌ エラー: 'string | undefined' に 'toUpperCase' は存在しない
const firstUpper = items[0].toUpperCase();

// ✅ 修正版
const firstUpper = items[0]?.toUpperCase() ?? "";
```

### 3. import/export の修正

#### 型インポートの明示化
```typescript
// ❌ 曖昧なインポート
import { Component } from 'react';
import { UserType } from './types';

// ✅ 明示的な型インポート
import { Component } from 'react';
import type { UserType } from './types';
```

## ビルド・テストの実行

### 1. TypeScript 7.0でのコンパイル確認
```bash
# 型チェックのみ実行（tsgo使用）
npx tsgo --noEmit

# 詳細診断情報付き
npx tsgo --noEmit --extendedDiagnostics

# パフォーマンス比較
time npx tsc --noEmit      # 従来版
time npx tsgo --noEmit     # TypeScript 7.0
```

### 2. 段階的検証
```bash
# 1. TypeScript 7.0型チェック
npm run type-check

# 2. ESLint実行
npm run lint

# 3. テスト実行
npm run test

# 4. ビルドテスト
npm run build
```

## トラブルシューティング

### TypeScript 7.0特有の問題

#### 1. tsgoコマンドが見つからない
```bash
# インストール確認
npm list @typescript/native-preview

# 再インストール
npm install --save-dev @typescript/native-preview@latest
```

#### 2. モジュール解決エラー
```bash
# CommonJSとESModulesの競合
# → tsconfig.jsonでmoduleResolution設定を確認
```

#### 3. VS Code拡張機能の問題
```bash
# 拡張機能の有効化確認
# コマンドパレット: "TypeScript Native Preview: Enable (Experimental)"

# 設定確認
"typescript.experimental.useTsgo": true
```

### パフォーマンス問題
```bash
# TypeScript 7.0詳細情報
npx tsgo --extendedDiagnostics

# メモリ使用量の確認
npx tsgo --generateTrace trace
```

### 既存コードとの互換性
```bash
# 段階的移行: 型チェックのみtsgoを使用
npx tsgo --noEmit

# ビルドは従来のtscを継続使用
npx tsc --build
```

## TypeScript 7.0 の新機能と制限事項

### 新機能
- **大幅なパフォーマンス向上**: 10倍高速な型チェック
- **並列処理**: Goによる効率的なマルチスレッド処理
- **メモリ効率**: 3倍少ないメモリ使用量
- **JSX対応**: React/JSXプロジェクトでの高速化
- **JavaScript対応**: JSDocベースの型チェック

### 現在の制限事項
- `--build`モード: 未対応（個別プロジェクトビルドは可能）
- `--declaration`出力: 未対応
- 一部のエディタ機能: auto-imports、find-all-references等
- downlevelトランスパイル: 制限あり

### 今後の予定
- 2025年後半: 完全機能版のリリース予定
- 言語サーバー機能の完全移植
- プロジェクト参照（`--build`）の対応

## パフォーマンス検証方法

### 実際の速度比較
```bash
# 従来のTypeScript
time npx tsc -p . --noEmit --extendedDiagnostics

# TypeScript 7.0
time npx tsgo -p . --noEmit --extendedDiagnostics
```

### 検証例
```bash
# 小規模プロジェクト例（700行程度）
# tsc: 0.28s → tsgo: 0.026s (10.8倍高速化)
# 型チェック: 0.10s → 0.003s (33.3倍高速化)
# メモリ: 68,645K → 23,733K (2.9倍効率化)
```

## 検証チェックリスト

### 基本チェック
- [ ] @typescript/native-previewインストール完了
- [ ] `npx tsgo --version` で新バージョン表示
- [ ] package.jsonの更新
- [ ] 型定義ファイル（@types/*）の更新

### 設定チェック
- [ ] tsconfig.json の見直し
- [ ] moduleResolution設定の更新
- [ ] 非推奨設定の修正

### コードチェック
- [ ] `npx tsgo --noEmit` でエラーなし
- [ ] ESLintエラーなし
- [ ] 全テスト成功
- [ ] パフォーマンス改善の確認

### エディタ設定
- [ ] VS Code拡張機能の設定
- [ ] 言語サーバーの動作確認
- [ ] 型補完とエラー表示の確認

### チーム共有
- [ ] チームメンバーへの更新通知
- [ ] ドキュメントの更新
- [ ] CI/CD設定の確認（必要に応じて段階的移行）

## 段階的移行戦略

### フェーズ1: 開発環境での検証
```bash
# 開発者個人での動作確認
npm install --save-dev @typescript/native-preview
npx tsgo --noEmit  # 型チェックのみ
```

### フェーズ2: チーム全体での移行
```bash
# package.jsonスクリプトの更新
"type-check": "npx tsgo --noEmit"
```

### フェーズ3: CI/CDでの段階的導入
```yaml
# GitHub Actions例
- name: Type check with tsgo
  run: npx tsgo --noEmit
  continue-on-error: true  # 初期は失敗を許容

- name: Type check with tsc (fallback)
  run: npx tsc --noEmit
```

## 関連ドキュメント

- [TypeScript Native Previews公式発表](https://devblogs.microsoft.com/typescript/announcing-typescript-native-previews/)
- [TypeScript 7.0パフォーマンス詳細](https://devblogs.microsoft.com/typescript/typescript-native-port/)
- [@typescript/native-preview npm](https://www.npmjs.com/package/@typescript/native-preview)
- [VS Code拡張機能](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.native-preview)
- [TypeScript 設定リファレンス](https://www.typescriptlang.org/tsconfig)
- [マイグレーションガイド](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html) 