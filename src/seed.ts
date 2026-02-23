import { db, queryClient } from "./db/client.js";
import { posts, users } from "./db/schema.js";

async function main() {
  const [alice] = await db
    .insert(users)
    .values({
      email: "alice@example.com",
      name: "Alice",
      role: "admin",
    })
    .returning({ id: users.id });

  const [bob] = await db
    .insert(users)
    .values({
      email: "bob@example.com",
      name: "Bob",
      role: "member",
    })
    .returning({ id: users.id });

  await db.insert(posts).values([
    {
      userId: alice.id,
      title: "Hello Drizzle",
      body: "Drizzle ORM + postgres.js",
      tags: ["drizzle", "typescript"],
    },
    {
      userId: bob.id,
      title: "SQL operator examples",
      body: "Using sql`` inside queries",
      tags: ["sql", "postgres"],
    },
  ]);
}

main()
  .then(() => console.log("Seed done"))
  .finally(async () => {
    await queryClient.end({ timeout: 5 });
  });
