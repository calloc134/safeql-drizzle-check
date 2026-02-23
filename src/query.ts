import { sql } from "drizzle-orm";
import * as v from "valibot";
import { db, queryClient } from "./db/client.js";

// ── Valibot schema ─────────────────────────────────────────────
// db.execute のジェネリクスに記述された型定義に対応する
// ランタイムバリデーションスキーマ
const CreatedAtSchema = v.pipe(
  v.union([v.date(), v.pipe(v.string(), v.isoTimestamp())]),
  v.toDate(),
);

const UserSchema = v.object({
  id: v.number(),
  email: v.string(),
  name: v.string(),
  role: v.picklist(["admin", "member"]),
  created_at: CreatedAtSchema,
});

type User = v.InferOutput<typeof UserSchema>;

async function main() {
  // 1) raw SQL（ただし drizzle の sql`` で安全にパラメタライズ）
  const userId = 1;
  const raw = await db.execute<{
    id: number;
    email: string;
    name: string;
    role: "admin" | "member";
    created_at: string;
  }>(sql`select * from users where id = ${userId}`);
  console.log("raw:", raw);

  // 2) valibot でバリデーションし、エンティティに変換
  const users: User[] = raw.map((row) => v.parse(UserSchema, row));
  console.log("validated users:", users);

  // 3) 各フィールドを個別に表示
  for (const user of users) {
    console.log("---");
    console.log(`  id:         ${user.id}`);
    console.log(`  email:      ${user.email}`);
    console.log(`  name:       ${user.name}`);
    console.log(`  role:       ${user.role}`);
    console.log(`  created_at: ${user.created_at.toISOString()}`);
  }
}

main().finally(async () => {
  await queryClient.end({ timeout: 5 });
});
