# Technology Stack

## Architecture

Next.js App Router によるフルスタックWebアプリケーション。React Server Components を基本とし、クライアント状態は最小限に保つ。

## Core Technologies

- **Language**: TypeScript (strict mode)
- **Framework**: Next.js 16 (App Router)
- **Runtime**: Node.js 22.x
- **Package Manager**: pnpm 10.x

## Key Libraries

- **UI**: shadcn/ui (New York スタイル) + Tailwind CSS v4
- **UI Primitives**: Radix UI（アクセシブルなコンポーネント基盤）
- **Icons**: Lucide React
- **CSS Utilities**: clsx + tailwind-merge（`cn()` ヘルパー経由）、class-variance-authority
- **Database**: PostgreSQL 16 + Drizzle ORM
- **DB Driver**: node-postgres (pg)

## Development Standards

### Type Safety
- TypeScript strict mode 有効
- `type` import を活用（`import type { ... }`）

### Code Quality
- ESLint v9（flat config 形式）
- eslint-config-next (core-web-vitals + typescript)

### Testing
- 未導入（今後 Vitest 等の導入を想定）

## Development Environment

### Required Tools
- Node.js 22.x
- pnpm 10.x
- Docker（ローカル PostgreSQL 用）

### Common Commands
```bash
# Dev: pnpm dev
# Build: pnpm build
# Lint: pnpm lint
# DB: docker compose up -d
```

## Key Technical Decisions

- **App Router over Pages Router**: Server Components を活用し、クライアントバンドルを最小化
- **Drizzle over Prisma**: 軽量かつ TypeScript 型推論が優秀
- **shadcn/ui**: npm パッケージ依存ではなくコードコピー方式で柔軟にカスタマイズ可能
- **PostgreSQL**: 構造化された物件データに適したリレーショナルDB
- **Tailwind CSS v4**: oklch カラースペースによるモダンなテーマシステム
- **Vercel デプロイ**: Vercel Postgres を本番DB、ローカルは Docker Compose

---
_Document standards and patterns, not every dependency_
