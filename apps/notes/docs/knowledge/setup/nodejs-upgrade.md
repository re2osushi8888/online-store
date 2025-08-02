---
sidebar_position: 1
---

# Node.js 24 アップグレード手順

## 概要

このガイドでは、Node.js 24 LTSへのアップグレード手順を説明します。新機能の活用とセキュリティアップデートを受けるため、最新のLTSバージョンを使用することを推奨します。

## 前提条件

- 現在のNode.jsバージョンの確認
- プロジェクトの依存関係の互換性確認
- バックアップの作成

## インストール方法

### 1. Node Version Manager (NVM) 使用【推奨】

#### NVMのインストール
```bash
# NVMをインストール（未インストールの場合）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# シェルを再起動またはソースを再読み込み
source ~/.bashrc
# または
source ~/.zshrc
```

#### Node.js 24のインストール
```bash
# 利用可能なNode.jsバージョンを確認
nvm list-remote --lts

# Node.js 24 LTSをインストール
nvm install 24

# Node.js 24をデフォルトに設定
nvm use 24
nvm alias default 24

# バージョン確認
node --version
npm --version
```

### 2. 公式インストーラー使用

1. [Node.js公式サイト](https://nodejs.org/)にアクセス
2. "LTS"版をダウンロード（推奨）
3. インストーラーを実行
4. インストール完了後、バージョン確認

```bash
node --version  # v24.x.x が表示されることを確認
```

### 3. パッケージマネージャー使用

#### Ubuntu/Debian
```bash
# NodeSourceリポジトリを追加
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -

# Node.js 24をインストール
sudo apt-get install -y nodejs
```

#### macOS (Homebrew)
```bash
# Homebrewでインストール
brew install node@24

# パスを通す
echo 'export PATH="/opt/homebrew/opt/node@24/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## プロジェクトでの設定更新

### package.json の engines フィールド更新

```json
{
  "engines": {
    "node": ">=24.0.0",
    "npm": ">=10.0.0"
  }
}
```

### CI/CD環境の更新

#### GitHub Actions
```yaml
# .github/workflows/ci.yml
jobs:
  test:
    strategy:
      matrix:
        node-version: [24]  # 24のみまたは [22, 24]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
```

#### Docker
```dockerfile
# Dockerfile
FROM node:24-alpine

# または特定バージョン指定
FROM node:24.1.0-alpine
```

## 互換性チェック

### 1. 依存関係の確認
```bash
# 古い依存関係をチェック
npm outdated

# セキュリティ脆弱性チェック
npm audit

# 自動修正（可能な場合）
npm audit fix
```

### 2. テスト実行
```bash
# 全テストを実行して互換性確認
npm run test

# ビルドテスト
npm run build
```

### 3. 段階的移行（大規模プロジェクト）

1. **開発環境で先行テスト**
2. **ステージング環境での検証**
3. **本番環境への段階的適用**

## よくある問題と解決策

### Node.js バージョンが切り替わらない
```bash
# NVMでのトラブルシューティング
nvm current              # 現在のバージョン確認
nvm use system          # システムのNode.jsに切り替え
nvm use 24              # Node.js 24に戻す

# シェル設定の確認
echo $PATH | tr ':' '\n' | grep node
```

### npm のバージョン不整合
```bash
# npm を最新に更新
npm install -g npm@latest

# または特定バージョンにインストール
npm install -g npm@10
```

### ネイティブモジュールのリビルド
```bash
# node_modules を削除して再インストール
rm -rf node_modules package-lock.json
npm install

# または、ネイティブモジュールのみリビルド
npm rebuild
```

## Node.js 24 の新機能

### パフォーマンス改善
- V8エンジンの最新版
- メモリ使用量の最適化
- 起動時間の短縮

### 新しいAPI
- 改良されたTest Runner
- 強化されたWeb Streams API
- 新しいBuffer API

### セキュリティ強化
- OpenSSL 3.x系列
- 改良されたPermission Model
- セキュリティパッチの継続的適用

## 検証チェックリスト

- [ ] Node.js 24のインストール完了
- [ ] `node --version` で v24.x.x 表示
- [ ] `npm --version` で v10.x.x 以上表示
- [ ] プロジェクトの `npm install` 成功
- [ ] `npm run test` 全テスト成功
- [ ] `npm run build` ビルド成功
- [ ] package.json の engines フィールド更新
- [ ] CI/CD設定の更新
- [ ] チームメンバーへの更新通知

## 関連ドキュメント

- [Node.js 公式リリースノート](https://nodejs.org/en/blog/release/)
- [Node.js 24 変更点](https://nodejs.org/docs/latest-v24.x/api/)
- [NVM 使用ガイド](https://github.com/nvm-sh/nvm#usage) 