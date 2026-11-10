import { Pool } from "pg";
import { attachDatabasePool } from "@vercel/functions";

let pool: Pool | null = null;

// One pooled connection (DATABASE_URL is Neon's -pooler endpoint), shared
// across requests. attachDatabasePool lets Vercel Fluid compute close idle
// clients before the instance suspends.
function getPool() {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    pool = new Pool({ connectionString: url, max: 5 });
    attachDatabasePool(pool);
  }
  return pool;
}

// Tagged-template query helper: interpolated values become $1, $2, ... params.
export function sql() {
  const p = getPool();
  return async (strings: TemplateStringsArray, ...values: unknown[]) => {
    const text = strings.reduce((acc, s, i) => acc + `$${i}` + s);
    const res = await p.query(text, values);
    return res.rows;
  };
}

let ready: Promise<unknown> | null = null;

// Creates the table on first use, so there's no separate migration step.
export function ensureSchema() {
  if (!ready) {
    const db = sql();
    ready = db`
      CREATE TABLE IF NOT EXISTS applications (
        id            SERIAL PRIMARY KEY,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
        full_name     TEXT NOT NULL,
        email         TEXT NOT NULL,
        phone         TEXT,
        instagram     TEXT,
        city_state    TEXT NOT NULL,
        age           INT  NOT NULL,
        height        TEXT,
        man_or_boy    TEXT NOT NULL,
        truck         TEXT,
        two_step      TEXT,
        texas_or_bama TEXT,
        outdoors      TEXT[],
        signature_dish TEXT,
        favorite_song TEXT,
        mama_quote    TEXT,
        why_you       TEXT NOT NULL,
        photo_url     TEXT,
        ip            TEXT,
        user_agent    TEXT
      )`.catch((e) => {
      // Don't cache a failure (e.g. a cold-start blip); retry on the next request.
      ready = null;
      throw e;
    });
  }
  return ready;
}

export const FIELDS = [
  "id", "created_at", "full_name", "email", "phone", "instagram", "city_state",
  "age", "height", "man_or_boy", "truck", "two_step", "texas_or_bama",
  "outdoors", "signature_dish", "favorite_song", "mama_quote", "why_you", "photo_url",
] as const;
