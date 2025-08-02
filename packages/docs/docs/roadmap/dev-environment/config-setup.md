---
sidebar_position: 3
---

# 設定整備

## 概要

プロジェクト全体の開発設定を統一し、Node.js、TypeScript、ESLint、フォーマッターの設定を最新の状態に整備します。

## 進捗状況

- **優先度**: 高
- **状況**: 📋 予定
- **予定完了**: 2024年2月
- **担当者**: 未定

## 実装予定項目

### 1. Node.js 24へのupgrade
**目標**: 最新のNode.js LTSバージョンへの移行

**タスク**:
- [ ] Node.js 24.x の動作確認
- [ ] package.json の engines フィールド更新
- [ ] CI/CD環境でのNode.jsバージョン更新
- [ ] 互換性テストの実行

**利点**:
- 最新のJavaScript機能の利用
- パフォーマンス向上
- セキュリティアップデート

### 2. TypeScript 7.0へのupgrade
**目標**: 最新のTypeScript機能の活用

**タスク**:
- [ ] TypeScript 7.0の新機能調査
- [ ] 既存コードの互換性確認
- [ ] 段階的アップグレード計画
- [ ] 型定義の最適化

**新機能**:
- 強化された型推論
- 新しい型機能
- パフォーマンス改善

### 3. tsconfig整備
**目標**: プロジェクト全体のTypeScript設定統一

**タスク**:
- [ ] ルートレベルの基本tsconfig作成
- [ ] パッケージ別のtsconfig設定
- [ ] 継承関係の最適化
- [ ] コンパイルオプションの統一

**設定項目**:
- 厳格な型チェック
- モジュール解決設定
- 出力設定の最適化

### 4. Biome整備
**目標**: 高速なLintingとフォーマッティング環境の構築

**タスク**:
- [ ] monorepoのルートディレクトリでBiome install
- [ ] biome.jsoncの作成（`biome init --jsonc`コマンド）
- [ ] 各package.jsonにBiomeコマンドを追加
- [ ] 動作確認とルール調整

**設定範囲**:
- JavaScript/TypeScript構文チェック
- コードフォーマッティング
- Import文の整理
- 高速なファイル処理

### 5. Turborepo連携設定
**目標**: monorepo全体でのBiome実行環境構築

**タスク**:
- [ ] turbo.jsonにBiomeタスク追加
- [ ] ルートディレクトリでの一括実行設定
- [ ] パッケージ間の依存関係考慮
- [ ] CI/CDでのBiome実行設定

**利点**:
- 高速なLintingとフォーマッティング
- ESLint + Prettierからの統一
- Turborepoとの最適化された連携

## 設定ファイル構成（予定）

```
online-store/
├── tsconfig.json              # ルート TypeScript 設定
├── biome.jsonc                # Biome 設定（JSONC形式）
├── turbo.json                 # Turborepo設定（Biomeタスク含む）
├── apps/
│   ├── docs/
│   │   └── tsconfig.json      # docs固有設定
│   ├── frontend/
│   │   └── tsconfig.json      # フロントエンド設定
│   └── backend/
│       └── tsconfig.json      # バックエンド設定
```

## 実装計画

### フェーズ1
- Node.js 24 への移行
- TypeScript 7.0 への更新

### フェーズ2
- tsconfig.json の整備
- Biome設定の統一

### フェーズ3
- Turborepo設定の追加
- ルートディレクトリでの一括実行設定

## 成功指標

- [ ] 全パッケージでNode.js 24が正常動作
- [ ] TypeScriptコンパイルエラーゼロ
- [ ] Biomeルール違反ゼロ
- [ ] 統一されたコードフォーマット
- [ ] Turborepoでの一括Biome実行成功 