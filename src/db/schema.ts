import {
  pgTable,
  serial,
  integer,
  numeric,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const profiles = pgTable(
  "profiles",
  {
    id: serial("id").primaryKey(),
    annualIncome: integer("annual_income").notNull(),
    savings: integer("savings").notNull(),
    interestRate: numeric("interest_rate", { precision: 4, scale: 2 }).notNull(),
    loanTermYears: integer("loan_term_years").notNull(),
    downPaymentRatio: integer("down_payment_ratio").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("profiles_created_at_idx").on(table.createdAt.desc())],
);
