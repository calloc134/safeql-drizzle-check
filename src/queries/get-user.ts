import { sql } from "drizzle-orm";
import * as v from "valibot";
import { db } from "../db/client.js";
import { type User, UserSchema } from "../schema/user.js";

/**
 * 指定 ID のユーザーを raw SQL で取得し、Valibot でバリデーションして返す。
 */
export async function getUserById(userId: number): Promise<User | undefined> {
  const rows = await db.execute<{
    id: number;
    email: string;
    name: string;
    role: "admin" | "member";
    created_at: string;
  }>(sql`select * from users where id = ${userId}`);

  const users: User[] = rows.map((row) => v.parse(UserSchema, row));
  return users[0];
}
