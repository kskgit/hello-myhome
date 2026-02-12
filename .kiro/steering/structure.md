# Project Structure

## Organization Philosophy

Next.js App Router の規約に従いつつ、機能レイヤーごとにディレクトリを分離。`src/` をソースルートとし、パスエイリアス `@/` で参照する。

## Directory Patterns

### App Router (`src/app/`)
**Purpose**: ページ、レイアウト、API ルート
**Convention**: ディレクトリベースルーティング。`page.tsx`（ページ）、`layout.tsx`（レイアウト）、`route.ts`（API）

### API Routes (`src/app/api/`)
**Purpose**: バックエンド API エンドポイント
**Convention**: HTTP メソッド名の関数をエクスポート（`GET`, `POST` 等）、`NextResponse.json()` でレスポンス

### Database Layer (`src/db/`)
**Purpose**: DB クライアントとスキーマ定義
**Convention**: `index.ts`（接続プール）、`schema.ts`（Drizzle スキーマ）

### Shared Utilities (`src/lib/`)
**Purpose**: 横断的なユーティリティ関数
**Example**: `cn()` クラス名マージ関数

### Static Assets (`public/`)
**Purpose**: 静的ファイル（画像、フォント等）

### Documentation (`docs/`)
**Purpose**: PRD 等のプロジェクトドキュメント

### Specifications (`.kiro/specs/`)
**Purpose**: Spec-Driven Development の仕様管理

## Naming Conventions

- **React コンポーネント/ページ**: PascalCase（`page.tsx`, `layout.tsx` は Next.js 規約）
- **非コンポーネント TS**: camelCase（`utils.ts`, `route.ts`）
- **設定ファイル**: kebab-case（`eslint.config.mjs`, `docker-compose.yml`）
- **関数**: camelCase（`cn()`, `GET()`）

## Import Organization

```typescript
// 外部パッケージ
import { clsx } from "clsx"
import type { Metadata } from "next"

// パスエイリアス（src/ 以下）
import { cn } from "@/lib/utils"

// 相対インポート（同一ディレクトリ内）
import "./globals.css"
```

**Path Aliases**:
- `@/*` → `./src/*`

## Code Organization Principles

- React Server Components をデフォルトとし、`"use client"` は必要な場合のみ
- ページコンポーネントは default export
- ユーティリティは named export
- DB スキーマは `src/db/schema.ts` に集約
- コンポーネントは shadcn/ui 規約に従い `src/components/ui/` に配置予定

---
_Document patterns, not file trees. New files following patterns shouldn't require updates_
