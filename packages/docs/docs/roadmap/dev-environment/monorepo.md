---
sidebar_position: 1
---

# monorepo作成

## 概要

プロジェクト全体のmonorepo構成を構築し、複数のパッケージを効率的に管理できる環境を整備します。

## 進捗状況

- **優先度**: 高
- **状況**: ✅ 完了
- **担当者**: 未定

## 実装内容

### 完了済み項目

#### 1. monorepo基盤構築
- ✅ ルートディレクトリの`package.json`設定
- ✅ `packages/`ディレクトリ構成の設計
- ✅ ワークスペース設定（npm workspaces/yarn workspaces）

#### 2. パッケージ構成
- ✅ `packages/docs/` - ドキュメントサイト
- ✅ パッケージ間の依存関係管理
- ✅ 共通設定ファイルの配置

#### 3. スクリプト統一
- ✅ ルートレベルでの統一スクリプト
- ✅ パッケージ個別スクリプトの設計
- ✅ 開発・ビルド・テストコマンドの標準化

## ディレクトリ構成

```
online-store/
├── packages/
│   ├── docs/           # ドキュメントサイト
│   ├── frontend/       # フロントエンドアプリケーション（予定）
│   ├── backend/        # バックエンドAPI（予定）
│   └── shared/         # 共通ライブラリ（予定）
├── package.json        # ルートパッケージ設定
└── README.md
```

## 技術仕様

### パッケージマネージャー
- **選択**: npm workspaces
- **理由**: Node.js標準、設定がシンプル、依存関係の重複排除

### 設定ファイル
- `package.json` - ワークスペース設定
- `.gitignore` - 各パッケージの無視ファイル設定
- `tsconfig.json` - TypeScript基本設定

## 次のステップ

✅ **完了**: monorepo基盤は構築済み  
➡️ **次**: 各パッケージの詳細実装（frontend、backend、shared） 