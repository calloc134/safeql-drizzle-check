import { sql } from "drizzle-orm";
import { db, queryClient } from "./db/client.js";

async function main() {
  // 1) raw SQL（ただし drizzle の sql`` で安全にパラメタライズ）
  const userId = 1;
  const raw = await db.execute<{
    id: number;
    email: string;
    name: string;
    role: "admin" | "member";
    created_at: Date;
  }>(sql`select * from users where id = ${userId}`);
  console.log("raw:", raw);
}

main().finally(async () => {
  await queryClient.end({ timeout: 5 });
});
