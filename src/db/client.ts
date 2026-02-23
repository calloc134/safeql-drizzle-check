import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// 必要なら { prepare: false } を検討（環境依存の事情がある場合）
export const queryClient = postgres(process.env.DATABASE_URL!, {
  max: 10,
  // prepare: false,
});

export const db = drizzle({ client: queryClient });
