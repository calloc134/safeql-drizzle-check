import type { User } from "./schema/user.js";
import { queryClient } from "./db/client.js";
import { getUserById } from "./queries/get-user.js";
import { insertAndGetUser } from "./queries/insert-and-get-user.js";

// ── helpers ────────────────────────────────────────────────────
function printUser(user: User): void {
  console.log("---");
  console.log(`  id:         ${user.id}`);
  console.log(`  email:      ${user.email}`);
  console.log(`  name:       ${user.name}`);
  console.log(`  role:       ${user.role}`);
  console.log(`  created_at: ${user.created_at.toISOString()}`);
}

// ── main ───────────────────────────────────────────────────────
async function main() {
  // 1) db.execute — 既存ユーザーを取得
  console.log("=== getUserById ===");
  const user = await getUserById(1);
  if (user) {
    printUser(user);
  } else {
    console.log("User with id=1 not found");
  }

  // 2) tx.execute — トランザクションで INSERT + SELECT
  console.log("\n=== insertAndGetUser (transaction) ===");
  const newUser = await insertAndGetUser({
    email: `charlie+${Date.now()}@example.com`,
    name: "Charlie",
    role: "member",
  });
  printUser(newUser);
}

main().finally(async () => {
  await queryClient.end({ timeout: 5 });
});
