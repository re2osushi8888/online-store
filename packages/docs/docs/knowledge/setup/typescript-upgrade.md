---
sidebar_position: 2
---

# TypeScript バージョンアップ手順

## 概要

このガイドでは、TypeScriptを最新バージョン（7.0系）にアップグレードする手順を説明します。新機能の活用、型安全性の向上、パフォーマンス改善を目的としています。

## 事前準備

### 現在のバージョン確認
```bash
# プロジェクトのTypeScriptバージョン
npx tsc --version

# グローバルインストール版（ある場合）
tsc --version

# package.jsonでの確認
npm list typescript
```

### バックアップとブランチ作成
```bash
# 作業用ブランチを作成
git checkout -b upgrade/typescript-7

# 現在の状態をコミット
git add .
git commit -m "feat: TypeScript upgrade前のバックアップ"
```

## アップグレード手順

### 1. TypeScriptのアップデート

#### メジャーバージョンアップの場合
```bash
# 最新安定版を確認
npm view typescript version

# TypeScriptを最新版にアップデート
npm install --save-dev typescript@latest

# または特定バージョンを指定
npm install --save-dev typescript@5.7.0
```

#### 段階的アップデート（推奨）
```bash
# マイナーバージョンごとに段階的に更新
npm install --save-dev typescript@5.6.0  # 現在 → 5.6
# テスト実行・問題解決
npm install --save-dev typescript@5.7.0  # 5.6 → 5.7
# テスト実行・問題解決
```

### 2. 型定義ファイルの更新

```bash
# @types パッケージの更新
npm update @types/node @types/react @types/react-dom

# または個別更新
npm install --save-dev @types/node@latest
npm install --save-dev @types/react@latest
npm install --save-dev @types/react-dom@latest
```

### 3. tsconfig.json の更新

#### 新機能を活用した設定例
```json
{
  "compilerOptions": {
    "target": "ES2023",           // 新しいECMAScript対応
    "module": "ESNext",
    "moduleResolution": "bundler", // 新しいモジュール解決
    "strict": true,
    "exactOptionalPropertyTypes": true, // より厳密な型チェック
    "noUncheckedIndexedAccess": true,   // インデックスアクセスの安全性
    "noImplicitOverride": true,         // override修飾子の強制
    
    // 新機能
    "verbatimModuleSyntax": true,       // import/export の厳密化
    "allowImportingTsExtensions": true, // .ts 拡張子インポート許可
    "noEmit": true,                     // bundler使用時
    
    // パフォーマンス向上
    "incremental": true,
    "composite": true,                  // プロジェクト参照用
    
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "build"]
}
```

### 4. プロジェクト参照の設定（モノレポの場合）

#### ルートtsconfig.json
```json
{
  "files": [],
  "references": [
    { "path": "./packages/frontend" },
    { "path": "./packages/backend" },
    { "path": "./packages/shared" }
  ]
}
```

#### パッケージ個別のtsconfig.json
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist"
  },
  "references": [
    { "path": "../shared" }
  ]
}
```

## コードの修正

### 1. 型エラーの修正

#### よくある型エラーと対処法
```typescript
// エラー: exactOptionalPropertyTypes が有効な場合
interface User {
  name: string;
  email?: string;
}

// ❌ 以前は可能だったが、エラーになる
const user: User = { name: "John", email: undefined };

// ✅ 修正版
const user: User = { name: "John" };
// または明示的に undefined を許可
interface User {
  name: string;
  email?: string | undefined;
}
```

#### インデックスアクセスの安全化
```typescript
// noUncheckedIndexedAccess: true の場合
const items = ["a", "b", "c"];

// ❌ エラー: 'string | undefined' に 'toUpperCase' は存在しない
const firstUpper = items[0].toUpperCase();

// ✅ 修正版
const firstUpper = items[0]?.toUpperCase() ?? "";
// または
const first = items[0];
if (first) {
  const firstUpper = first.toUpperCase();
}
```

### 2. import/export の修正

#### verbatimModuleSyntax 対応
```typescript
// ❌ 型のみのインポートが曖昧
import { Component } from 'react';
import { UserType } from './types';

// ✅ 明示的な型インポート
import { Component } from 'react';
import type { UserType } from './types';

// ✅ または、型専用インポート構文
import type { ComponentType } from 'react';
import type { UserType } from './types';
```

## ビルド・テストの実行

### 1. TypeScriptコンパイル確認
```bash
# 型チェックのみ実行
npx tsc --noEmit

# 全ファイルの型チェック
npx tsc --noEmit --skipLibCheck false

# プロジェクト参照のビルド（モノレポ）
npx tsc --build
```

### 2. 段階的検証
```bash
# 1. TypeScript型チェック
npm run type-check

# 2. ESLint実行
npm run lint

# 3. テスト実行
npm run test

# 4. ビルドテスト
npm run build
```

## トラブルシューティング

### 型エラーが大量に発生する場合

#### 1. 段階的な strict オプション有効化
```json
{
  "compilerOptions": {
    // 段階1: 基本的な strict
    "strict": false,
    "noImplicitAny": true,
    "strictNullChecks": true,
    
    // 段階2: より厳密に
    // "strictFunctionTypes": true,
    // "strictBindCallApply": true,
    
    // 段階3: 最も厳密
    // "strict": true,
    // "exactOptionalPropertyTypes": true,
    // "noUncheckedIndexedAccess": true
  }
}
```

#### 2. 型定義の一時的な緩和
```typescript
// 緊急対応: any 型の一時使用
// TODO: 適切な型定義に修正
const temporaryFix = data as any;

// より良い対応: unknown 型の使用
const safeFix = data as unknown as ExpectedType;
```

### パフォーマンス問題

```bash
# TypeScriptコンパイラの詳細情報
npx tsc --extendedDiagnostics

# ビルド時間の分析
npx tsc --generateTrace trace
```

### 依存関係の競合
```bash
# 型定義の競合確認
npm ls @types/

# 重複パッケージの確認
npm ls typescript

# クリーンインストール
rm -rf node_modules package-lock.json
npm install
```

## TypeScript 7.0 の新機能

### 型システムの改善
- より高精度な型推論
- 条件型の改良
- テンプレートリテラル型の強化

### 開発体験の向上
- エラーメッセージの改善
- IntelliSenseの強化
- デバッグ情報の充実

### パフォーマンス改善
- コンパイル速度の向上
- メモリ使用量の最適化
- インクリメンタルビルドの改良

## 検証チェックリスト

### 基本チェック
- [ ] TypeScriptバージョンアップ完了
- [ ] `npx tsc --version` で新バージョン表示
- [ ] package.jsonの更新
- [ ] 型定義ファイル（@types/*）の更新

### 設定チェック
- [ ] tsconfig.json の見直し
- [ ] 新機能の設定追加
- [ ] プロジェクト参照の設定（必要に応じて）

### コードチェック
- [ ] `npx tsc --noEmit` でエラーなし
- [ ] ESLintエラーなし
- [ ] 全テスト成功
- [ ] ビルド成功

### チーム共有
- [ ] チームメンバーへの更新通知
- [ ] ドキュメントの更新
- [ ] CI/CD設定の確認

## 関連ドキュメント

- [TypeScript リリースノート](https://www.typescriptlang.org/docs/handbook/release-notes/)
- [TypeScript 設定リファレンス](https://www.typescriptlang.org/tsconfig)
- [マイグレーションガイド](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html) 