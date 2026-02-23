# safeql-drizzle-check

**SafeQL** と **Drizzle ORM** を併用し、生のSQLクエリの静的型検査（Lint）と、**Valibot** によるランタイムバリデーションを組み合わせたサンプルプロジェクトです。

Drizzle のクエリビルダーの恩恵を受けつつ、柔軟な生の SQL を安全に記述・実行するためのベストプラクティスを実装しています。

## 🚀 技術スタック

- **[Drizzle ORM](https://orm.drizzle.team/)** / **Drizzle Kit**: スキーマ定義、マイグレーション、クエリ実行
- **[SafeQL](https://safeql.dev/)**: ESLint プラグインによる生 SQL クエリ（PostgreSQL）の静的型チェック
- **[Valibot](https://valibot.dev/)**: DBから取得したデータのランタイムバリデーションとパース
- **[PostgreSQL](https://www.postgresql.org/)** (`postgres.js`): データベースとクライアント
- **TypeScript**: 開発言語
- **pnpm**: パッケージマネージャー

## ✨ プロジェクトの特徴

1. **`db.execute` / `tx.execute` の型安全化**
   `eslint.config.ts` にて SafeQL の対象（`wrapper: { regex: "(db|tx)\\.execute" }`）を設定し、Drizzle の `db.execute(sql\`...\`)`やトランザクション内の`tx.execute(sql\`...\`)` で記述した SQL の構文・戻り値の型を Lint時に検証します。
2. **Valibot を用いた境界での型変換**
   DB から取得した生のレコード（例: 日付が文字列として返ってくる場合など）を Valibot でバリデーションしつつ適切な JavaScript の型（`Date` 型など）にパースして安全にアプリケーション内で利用します。

## 🛠️ セットアップと実行

### 1. パッケージのインストール

```bash
pnpm install
```

### 2. 環境変数の設定

プロジェクトルートに `.env` ファイルを作成し、接続先の PostgreSQL データベースURLを設定してください。

```env
# .env
DATABASE_URL="postgres://user:pass@localhost:5432/dbname"
```

### 3. データベースの起動

Docker を利用してローカルにDBを立ち上げるスクリプトが用意されています（※別途 `docker-compose.yml` が必要です。またはご自身でローカルの PostgreSQL を起動してください）。

```bash
pnpm db:up
```

### 4. マイグレーションの実行

Drizzle Kit を使用して、`src/db/schema.ts` の定義をデータベースに反映（同期）させます。

```bash
pnpm db:push
```

### 5. シードデータの投入

動作確認用の初期データ（ユーザーと投稿）を投入します。

```bash
pnpm seed
```

### 6. メイン処理の実行

定義した生SQLクエリ（SELECT や トランザクションを用いた INSERT & SELECT）を実行し、コンソールに結果を出力します。

```bash
pnpm query
```

## 🔍 SafeQL（Lint）の動作確認

以下のコマンドを実行すると、ESLint（SafeQL）が起動し、実際のデータベースのスキーマとコード上の生SQLの整合性をチェックします。

```bash
pnpm eslint .
```

> **💡 Tips:**
> `src/queries/get-user.ts` などの `db.execute<{ ... }>(sql\`...\`)` のジェネリクス型を意図的に間違えた状態で ESLint を実行すると、SafeQL が型の不一致を検知してエラーを出力するのを確認できます。

## 📁 プロジェクト構成

```text
.
├── eslint.config.ts         # SafeQL の設定（db.execute / tx.execute の対象化など）
├── src/
│   ├── db/
│   │   ├── client.ts        # DBクライアントの初期化
│   │   └── schema.ts        # Drizzle ORM のテーブル定義
│   ├── queries/
│   │   ├── get-user.ts            # SafeQL の恩恵を受ける単体 SELECT クエリ
│   │   └── insert-and-get-user.ts # トランザクション (tx) を用いたクエリ
│   ├── schema/
│   │   └── user.ts          # Valibot によるバリデーションスキーマ・型定義
│   ├── main.ts              # 実行用のメインスクリプト
│   └── seed.ts              # 初期データ投入用スクリプト
└── package.json
```
