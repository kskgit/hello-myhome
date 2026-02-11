# Property Evaluator

不動産物件をユーザー定義のルールベースで自動採点する個人用Webアプリ。

## 前提条件

- Node.js 22.x
- pnpm
- Docker

## セットアップ

```bash
# 1. 依存パッケージをインストール
pnpm install

# 2. 環境変数ファイルを作成
cp .env.local.example .env.local

# 3. PostgreSQL を起動
docker compose up -d

# 4. 開発サーバーを起動
pnpm dev
```

## アクセス先

- アプリ: http://localhost:3000
- ヘルスチェック: http://localhost:3000/api/health
