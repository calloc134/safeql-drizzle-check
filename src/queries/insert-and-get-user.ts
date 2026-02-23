import { sql } from "drizzle-orm";
import * as v from "valibot";
import { db } from "../db/client.js";
import { type User, UserSchema } from "../schema/user.js";

/** insert に渡すパラメータ */
type InsertUserParams = {
  email: string;
  name: string;
  role?: "admin" | "member";
};

/**
 * トランザクション内でユーザーを INSERT し、直後に SELECT して
 * Valibot でバリデーション済みの User を返す。
 */
export async function insertAndGetUser(
  params: InsertUserParams,
): Promise<User> {
  const { email, name, role = "member" } = params;

  return await db.transaction(async (tx) => {
    // 1) INSERT … RETURNING id
    const inserted = await tx.execute<{ id: number }>(
      sql`insert into users (email, name, role) values (${email}, ${name}, ${role}::user_role) returning id`,
    );

    const newId = inserted[0].id;

    // 2) SELECT で完全な行を取得
    const rows = await tx.execute<{
      id: number;
      email: string;
      name: string;
      role: "admin" | "member";
      created_at: string;
    }>(sql`select * from users where id = ${newId}`);

    // 3) Valibot でバリデーション
    const user = v.parse(UserSchema, rows[0]);
    return user;
  });
}
