---
sidebar_position: 4
---

# Git Hook設定

## 概要

Gitコミット時・プッシュ時の品質チェックを自動化し、コードベースの品質を維持するためのフック設定を行います。

## 進捗状況

- **優先度**: 中
- **状況**: ✅ 完了
- **完了日**: 2024年12月
- **担当者**: 実装済み

## 実装済み項目

### 1. lefthook導入・設定
**目標**: Gitフックの管理とコード品質チェックの自動化

**実装内容**:
- [x] lefthookパッケージの導入
- [x] pre-pushフックの設定
- [x] lint実行の自動化

**技術選択**:
- **lefthook**: Git hooksの管理（huskyの代替として採用）
- **Biome**: コード品質・フォーマットチェック

## 実装手順

### 1. lefthookの導入
```bash
# lefthookパッケージの追加
pnpm add -D lefthook
```

### 2. lefthook設定ファイルの作成
`lefthook.yml`を作成し、以下の内容で設定:

```yaml
pre-push:
  parallel: true
  commands:
    lint:
      run: pnpm lint
```

### 3. lefthookの初期化とインストール
```bash
# lefthookの初期化
pnpm lefthook install
```

### 4. 動作確認
- lefthook.ymlをpre-commitに変更して動作確認
- 最終的にpre-pushに戻して本設定として確定

## 現在の設定ファイル構成

```
online-store/
├── lefthook.yml          # lefthook設定ファイル
├── package.json          # lefthookの依存関係定義
└── .git/hooks/           # lefthookによって自動生成されるフック
    └── pre-push          # pre-pushフック（自動生成）
```

### lefthook.yml設定内容
```yaml
pre-push:
  parallel: true
  commands:
    lint:
      run: pnpm lint
```

### package.json依存関係
```json
{
  "devDependencies": {
    "@biomejs/biome": "2.1.2",
    "lefthook": "^1.12.2",
    "turbo": "^2.5.5"
  }
}
```

## 実装完了項目

### ✅ フェーズ1: 基本フック設定（完了）
- [x] lefthookのセットアップ
- [x] pre-pushフックの実装
- [x] lint実行の自動化

## 今後の実装計画

### フェーズ2: コミットメッセージ管理（予定）
- [ ] commitlintの導入
- [ ] commit-msgフックの実装
- [ ] メッセージテンプレート作成

### フェーズ3: 高度なチェック（予定）
- [ ] pre-commitフックの追加実装
- [ ] セキュリティチェック統合
- [ ] テスト実行の自動化

## 実装効果

### 品質向上
- [x] プッシュ時点でのリントエラー早期発見
- [x] 一貫したコードスタイルの維持（Biome使用）
- [x] リモートリポジトリへの不正なコード流入防止

### 開発効率
- [x] CI/CD失敗率の低下（事前チェック実装）
- [x] レビュー品質の向上
- [x] 自動化による手作業削減

### 今後期待される効果
- [ ] コミットメッセージの標準化
- [ ] より詳細な事前チェック
- [ ] 新メンバーのオンボーディング支援

## エスケープハッチ

緊急時のフック無効化方法:
```bash
# 一時的にプッシュ時フックを無効化
git push --no-verify

# lefthookフックを一時的に無効化
LEFTHOOK=0 git push

# lefthook自体を無効化
pnpm lefthook uninstall
```

## 成功指標

### 現在達成済み
- [x] lefthookの正常動作確認
- [x] pre-pushフックでのlint実行
- [x] 設定の文書化完了

### 今後の目標
- [ ] 全開発者のマシンでフックが正常動作
- [ ] コミットメッセージ規約遵守率100%
- [ ] CI/CD初回成功率95%以上 