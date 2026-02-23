import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import safeql from "@ts-safeql/eslint-plugin/config";
import dotenv from "dotenv";

dotenv.config();

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,

  // 型情報を使う設定は TS ファイルに限定（設定ファイル等で projectService エラーを出さない）
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  safeql.configs.connections({
    databaseUrl:
      process.env.DATABASE_URL ?? "postgres://user:pass@localhost:5432/dbname",
    targets: [{ wrapper: "db.execute" }],
  }),
);
