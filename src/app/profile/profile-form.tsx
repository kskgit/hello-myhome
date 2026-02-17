"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProfileData {
  id: number;
  annualIncome: number;
  savings: number;
  interestRate: number;
  loanTermYears: number;
  downPaymentRatio: number;
  createdAt: string;
}

interface ProfileInput {
  annualIncome: string;
  savings: string;
  interestRate: string;
  loanTermYears: string;
  downPaymentRatio: string;
}

interface FieldConfig {
  key: keyof ProfileInput;
  label: string;
  unit: string;
  min: number;
  max?: number;
  step?: string;
}

const FIELDS: FieldConfig[] = [
  { key: "annualIncome", label: "年収", unit: "万円", min: 0 },
  { key: "savings", label: "貯蓄額", unit: "万円", min: 0 },
  { key: "interestRate", label: "想定金利", unit: "%", min: 0, max: 20, step: "0.01" },
  { key: "loanTermYears", label: "返済期間", unit: "年", min: 1, max: 50 },
  { key: "downPaymentRatio", label: "頭金割合", unit: "%", min: 0, max: 100 },
];

function toFormValues(data: ProfileData | null): ProfileInput {
  if (!data) {
    return {
      annualIncome: "",
      savings: "",
      interestRate: "",
      loanTermYears: "",
      downPaymentRatio: "",
    };
  }
  return {
    annualIncome: String(data.annualIncome),
    savings: String(data.savings),
    interestRate: String(data.interestRate),
    loanTermYears: String(data.loanTermYears),
    downPaymentRatio: String(data.downPaymentRatio),
  };
}

function validateField(field: FieldConfig, value: string): string | undefined {
  if (value === "") {
    return `${field.label}を入力してください`;
  }
  const num = Number(value);
  if (!Number.isFinite(num)) {
    return `${field.label}は数値で入力してください`;
  }
  if (num < field.min) {
    return `${field.label}は${field.min}以上で入力してください`;
  }
  if (field.max !== undefined && num > field.max) {
    return `${field.label}は${field.max}以下で入力してください`;
  }
  return undefined;
}

function validateAll(values: ProfileInput): Partial<Record<keyof ProfileInput, string>> {
  const errors: Partial<Record<keyof ProfileInput, string>> = {};
  for (const field of FIELDS) {
    const error = validateField(field, values[field.key]);
    if (error) {
      errors[field.key] = error;
    }
  }
  return errors;
}

export function ProfileForm({ initialData }: { initialData: ProfileData | null }) {
  const [values, setValues] = useState<ProfileInput>(() => toFormValues(initialData));
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileInput, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<"idle" | "success" | "error">("idle");

  const hasErrors = Object.keys(errors).length > 0;
  const isEmpty = Object.values(values).every((v) => v === "");

  function handleChange(key: keyof ProfileInput, value: string) {
    const newValues = { ...values, [key]: value };
    setValues(newValues);

    const field = FIELDS.find((f) => f.key === key)!;
    const error = validateField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (error) {
        next[key] = error;
      } else {
        delete next[key];
      }
      return next;
    });

    if (submitResult !== "idle") {
      setSubmitResult("idle");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const allErrors = validateAll(values);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitResult("idle");

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          annualIncome: Number(values.annualIncome),
          savings: Number(values.savings),
          interestRate: Number(values.interestRate),
          loanTermYears: Number(values.loanTermYears),
          downPaymentRatio: Number(values.downPaymentRatio),
        }),
      });

      if (!res.ok) {
        setSubmitResult("error");
        return;
      }

      setSubmitResult("success");
      setTimeout(() => setSubmitResult("idle"), 3000);
    } catch {
      setSubmitResult("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>プロフィール管理</CardTitle>
        <CardDescription>
          {initialData
            ? "財務情報を確認・変更できます"
            : "物件評価に使用する財務情報を登録してください"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {FIELDS.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>
                {field.label}（{field.unit}）
              </Label>
              <Input
                id={field.key}
                type="number"
                min={field.min}
                max={field.max}
                step={field.step ?? "1"}
                value={values[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                aria-invalid={!!errors[field.key]}
                placeholder={`${field.label}を入力`}
              />
              {errors[field.key] && (
                <p className="text-destructive text-sm">{errors[field.key]}</p>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-2">
          <Button
            type="submit"
            disabled={hasErrors || isEmpty || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
          {submitResult === "success" && (
            <p className="text-sm text-center text-green-600">保存しました</p>
          )}
          {submitResult === "error" && (
            <p className="text-destructive text-sm text-center">保存に失敗しました</p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
