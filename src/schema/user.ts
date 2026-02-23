import * as v from "valibot";

// ── Valibot schema ─────────────────────────────────────────────
// db.execute / tx.execute のジェネリクスに記述された型定義に対応する
// ランタイムバリデーションスキーマ

const CreatedAtSchema = v.pipe(
  v.union([v.date(), v.pipe(v.string(), v.isoTimestamp())]),
  v.toDate(),
);

export const UserSchema = v.object({
  id: v.number(),
  email: v.string(),
  name: v.string(),
  role: v.picklist(["admin", "member"]),
  created_at: CreatedAtSchema,
});

export type User = v.InferOutput<typeof UserSchema>;
