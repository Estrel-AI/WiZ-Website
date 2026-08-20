## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to the env file you want to use and set your credentials.

3. Start the app:

```bash
npm run dev
```

## Environment Modes

- `local`: use `npm run dev` on your machine. This loads `.env.dev` first, then overrides it with `.env.local`.
- `testing`: use `npm run build:testing` and `npm run start:testing`. This uses `.env.dev`.
- `production`: use `npm run build:production` and `npm run start:production`. This uses `.env`.

### Deployment Commands

```bash
npm run dev
npm run build:testing
npm run start:testing
npm run build:production
npm run start:production
```

## MySQL Setup

This project now includes a lightweight MySQL foundation for Next.js route handlers.

- Connection helper: `src/lib/mysql.ts`
- Health check API: `GET /api/health/database`
- Example schema file: `database/mysql-schema.sql`

### Environment Variables

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=wiiz_website
MYSQL_CONNECTION_LIMIT=10
```

### Test the Connection

Once MySQL is running and your `.env.local` is configured, open:

```text
http://localhost:3000/api/health/database
```

You should get a JSON response with `ok: true`.

### Build More APIs

Import the helper in any server-side route:

```ts
import { queryRows, executeStatement } from "@/src/lib/mysql";
```

Use `queryRows()` for `SELECT` queries and `executeStatement()` for `INSERT`, `UPDATE`, and `DELETE`.
