// eslint.config.mjs
// @ts-check

import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import safeql from "@ts-safeql/eslint-plugin/config";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  safeql.configs.connections({
    // 例: 環境変数で渡す（推奨）
    databaseUrl:
      process.env.DATABASE_URL ?? "postgres://user:pass@localhost:5432/dbname",

    // drizzle-orm の `sql` タグを検査対象にする
    targets: [{ wrapper: "db.execute" }],
  }),
);
