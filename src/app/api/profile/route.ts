import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";

interface ProfileInput {
  annualIncome: number;
  savings: number;
  interestRate: number;
  loanTermYears: number;
  downPaymentRatio: number;
}

function toProfileResponse(row: typeof profiles.$inferSelect) {
  return {
    id: row.id,
    annualIncome: row.annualIncome,
    savings: row.savings,
    interestRate: Number(row.interestRate),
    loanTermYears: row.loanTermYears,
    downPaymentRatio: row.downPaymentRatio,
    createdAt: row.createdAt.toISOString(),
  };
}

function validateProfile(data: unknown): {
  valid: true;
  value: ProfileInput;
} | {
  valid: false;
  details: Record<string, string>;
} {
  if (typeof data !== "object" || data === null) {
    return { valid: false, details: { _form: "リクエストボディが不正です" } };
  }

  const body = data as Record<string, unknown>;
  const details: Record<string, string> = {};

  const numericFields: { key: keyof ProfileInput; label: string; min: number; max?: number }[] = [
    { key: "annualIncome", label: "年収", min: 0 },
    { key: "savings", label: "貯蓄額", min: 0 },
    { key: "interestRate", label: "想定金利", min: 0, max: 20 },
    { key: "loanTermYears", label: "返済期間", min: 1, max: 50 },
    { key: "downPaymentRatio", label: "頭金割合", min: 0, max: 100 },
  ];

  for (const field of numericFields) {
    const val = body[field.key];
    if (typeof val !== "number" || !Number.isFinite(val)) {
      details[field.key] = `${field.label}は数値で入力してください`;
      continue;
    }
    if (val < field.min) {
      details[field.key] = `${field.label}は${field.min}以上で入力してください`;
    } else if (field.max !== undefined && val > field.max) {
      details[field.key] = `${field.label}は${field.max}以下で入力してください`;
    }
  }

  if (Object.keys(details).length > 0) {
    return { valid: false, details };
  }

  return {
    valid: true,
    value: {
      annualIncome: body.annualIncome as number,
      savings: body.savings as number,
      interestRate: body.interestRate as number,
      loanTermYears: body.loanTermYears as number,
      downPaymentRatio: body.downPaymentRatio as number,
    },
  };
}

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(profiles)
      .orderBy(desc(profiles.createdAt))
      .limit(1);

    const row = rows[0] ?? null;
    const profile = row ? toProfileResponse(row) : null;

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json(
      { error: "プロフィールの取得に失敗しました" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const result = validateProfile(body);

    if (!result.valid) {
      return NextResponse.json(
        { error: "入力内容に誤りがあります", details: result.details },
        { status: 400 },
      );
    }

    const inserted = await db
      .insert(profiles)
      .values({
        annualIncome: result.value.annualIncome,
        savings: result.value.savings,
        interestRate: String(result.value.interestRate),
        loanTermYears: result.value.loanTermYears,
        downPaymentRatio: result.value.downPaymentRatio,
      })
      .returning();

    return NextResponse.json({ profile: toProfileResponse(inserted[0]) });
  } catch (error) {
    console.error("Failed to save profile:", error);
    return NextResponse.json(
      { error: "プロフィールの保存に失敗しました" },
      { status: 500 },
    );
  }
}
