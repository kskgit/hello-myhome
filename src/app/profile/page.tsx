import { desc } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const rows = await db
    .select()
    .from(profiles)
    .orderBy(desc(profiles.createdAt))
    .limit(1);

  const row = rows[0] ?? null;

  const initialData = row
    ? {
        id: row.id,
        annualIncome: row.annualIncome,
        savings: row.savings,
        interestRate: Number(row.interestRate),
        loanTermYears: row.loanTermYears,
        downPaymentRatio: row.downPaymentRatio,
        createdAt: row.createdAt.toISOString(),
      }
    : null;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <ProfileForm initialData={initialData} />
    </div>
  );
}
