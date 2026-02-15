# Research & Design Decisions

---
**Purpose**: プロフィール管理機能のディスカバリーで得られた知見と設計判断の根拠を記録する。
---

## Summary
- **Feature**: `profile-management`
- **Discovery Scope**: Simple Addition（CRUD）
- **Key Findings**:
  - コードベースはほぼグリーンフィールド状態（スキーマ空、UI コンポーネント未インストール）
  - Drizzle ORM + node-postgres の接続基盤は構築済み
  - shadcn/ui は設定済み（New York スタイル）だがコンポーネント未追加
  - フォームライブラリ（React Hook Form, Zod 等）は未導入

## Research Log

### 既存コードベースのパターン分析
- **Context**: プロフィール管理機能を既存パターンに合わせて設計するため
- **Sources Consulted**: `src/db/index.ts`, `src/app/api/health/route.ts`, `src/app/page.tsx`, `package.json`, `components.json`
- **Findings**:
  - DB 接続: `drizzle(pool, { schema })` でスキーマ付きの `db` インスタンスをエクスポート
  - API ルート: HTTP メソッド名の named export + `NextResponse.json()` パターン
  - ページ: React Server Components デフォルト、Tailwind ユーティリティクラス直接使用
  - shadcn/ui: `components.json` 設定済み、`@/components/ui/` に CLI でインストール可能
- **Implications**: 新規テーブル定義・API ルート・ページは既存パターンに沿って追加可能

### バリデーション手法の検討
- **Context**: 要件 4 で入力バリデーションが求められている。フォームライブラリが未導入のため手法を決める必要がある
- **Sources Consulted**: package.json、Next.js 16 / React 19 公式ドキュメント
- **Findings**:
  - Zod + React Hook Form は定番だが、MVP の5フィールドには過剰
  - HTML5 ネイティブバリデーション（`type="number"`, `min`, `max`, `required`）で基本的な制約は表現可能
  - React 19 の `useActionState` や `useFormStatus` も選択肢だが、API ルートパターンとの整合性を考慮
  - クライアント側で `useState` + 手動バリデーション関数が最もシンプル
- **Implications**: MVP では手動バリデーション + HTML5 属性の組み合わせを採用し、将来的に Zod 導入時にスムーズに移行できる構造とする

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| API Route + Client Form | REST API（GET/POST）+ "use client" フォームコンポーネント | 既存パターンと一貫性あり、関心の分離が明確 | API ルートとクライアントで型定義の重複が発生し得る | 採用: 既存の `/api/health` パターンに合致 |
| Server Actions | Next.js Server Actions でフォーム送信を処理 | クライアントコード最小化、型安全性が高い | 既存の API ルートパターンと不一致 | 見送り: 既存パターンとの一貫性を優先 |

## Design Decisions

### Decision: API Route パターンの採用
- **Context**: フォーム送信の処理方法を決定する必要がある
- **Alternatives Considered**:
  1. API Route（GET/POST）— 既存の `/api/health` と同パターン
  2. Server Actions — Next.js 推奨のモダンパターン
- **Selected Approach**: API Route パターン
- **Rationale**: 既存コードベースに API ルートの前例がある。MVP の単純な CRUD ではどちらでも同等の複雑度であり、一貫性を優先
- **Trade-offs**: Server Actions の型安全性の恩恵は得られないが、API ルートの方がテスト・デバッグが容易
- **Follow-up**: 将来の機能追加時に Server Actions への移行を再検討

### Decision: イミュータブルデータパターンの採用
- **Context**: ユーザーの要望により、DB をイミュータブル（INSERT のみ）で設計する
- **Alternatives Considered**:
  1. Mutable upsert — 1レコードを UPDATE で上書き
  2. Immutable append — 変更のたびに新規 INSERT、最新レコードが現在の状態
- **Selected Approach**: Immutable append パターン
- **Rationale**: データの変更履歴が自動的に保持される。DELETE/UPDATE を排除することでデータ破損リスクが低減する。API は PUT から POST に変更し、セマンティクスを「新規リソース作成」に統一
- **Trade-offs**: レコード数が増加するが、シングルユーザーの手動操作のため実用上問題にならない。最新レコード取得には `ORDER BY created_at DESC LIMIT 1` が必要
- **Follow-up**: `created_at DESC` インデックスを追加して最新レコード取得を最適化

## Risks & Mitigations
- フォームライブラリ未導入のため、バリデーションロジックが分散するリスク → バリデーション関数を1箇所に集約
- shadcn/ui コンポーネント初回インストールが必要 → タスクフェーズで明示的にインストール手順を含める
- シングルユーザー前提のため認証なし → MVP スコープ外だが、将来的な認証追加を見据えた設計にする

## References
- [Drizzle ORM PostgreSQL ドキュメント](https://orm.drizzle.team/docs/get-started/postgresql-new) — スキーマ定義・マイグレーション
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) — API ルートパターン
- [shadcn/ui](https://ui.shadcn.com/) — UI コンポーネント
