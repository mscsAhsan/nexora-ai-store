import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { seedTools, OLD_FICTIONAL_SLUGS } from "./tools";

const url = process.env.TURSO_DATABASE_URL || (process.env.VERCEL ? "file:/tmp/nexavo.db" : "file:local.db");
const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN || undefined });

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user', plan TEXT NOT NULL DEFAULT 'Starter', created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS tools (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, brand TEXT NOT NULL DEFAULT '', category TEXT NOT NULL, icon TEXT NOT NULL, price REAL NOT NULL, rating REAL NOT NULL DEFAULT 4.5, reviews INTEGER NOT NULL DEFAULT 0, from_color TEXT NOT NULL, to_color TEXT NOT NULL, description TEXT NOT NULL, features TEXT NOT NULL DEFAULT '[]', url TEXT NOT NULL DEFAULT '', active INTEGER NOT NULL DEFAULT 1, duration TEXT NOT NULL DEFAULT '', access_type TEXT NOT NULL DEFAULT '', warranty TEXT NOT NULL DEFAULT '', delivery TEXT NOT NULL DEFAULT 'Instant', image TEXT NOT NULL DEFAULT '');
CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, total REAL NOT NULL, status TEXT NOT NULL DEFAULT 'pending', method TEXT NOT NULL, reference TEXT, plan TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL, tool_slug TEXT NOT NULL, name TEXT NOT NULL, price REAL NOT NULL, license_key TEXT);
CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS subscribers (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS webhook_events (id INTEGER PRIMARY KEY AUTOINCREMENT, event_id TEXT UNIQUE, provider TEXT NOT NULL DEFAULT 'safepay', event_type TEXT, tracker TEXT, order_id INTEGER, payload TEXT NOT NULL, received_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS download_tokens (id INTEGER PRIMARY KEY AUTOINCREMENT, token TEXT NOT NULL UNIQUE, order_id INTEGER NOT NULL, tool_slug TEXT NOT NULL, expires_at TEXT NOT NULL, download_count INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now')));
`;



async function init() {
  await client.executeMultiple(SCHEMA);
  // Lightweight migrations for DBs created before Safepay (no ALTER IF NOT EXISTS in libsql).
  for (const [sql] of [
    ["ALTER TABLE orders ADD COLUMN safepay_tracker TEXT"],
    ["ALTER TABLE tools ADD COLUMN file_url TEXT NOT NULL DEFAULT ''"],
    ["ALTER TABLE tools ADD COLUMN brand TEXT NOT NULL DEFAULT ''"],
    ["ALTER TABLE tools ADD COLUMN duration TEXT NOT NULL DEFAULT ''"],
    ["ALTER TABLE tools ADD COLUMN access_type TEXT NOT NULL DEFAULT ''"],
    ["ALTER TABLE tools ADD COLUMN warranty TEXT NOT NULL DEFAULT ''"],
    ["ALTER TABLE tools ADD COLUMN delivery TEXT NOT NULL DEFAULT 'Instant'"],
    ["ALTER TABLE tools ADD COLUMN image TEXT NOT NULL DEFAULT ''"],
  ]) {
    try { await client.execute(sql); } catch { /* column already exists */ }
  }
  // Nexavo catalogue migration (Nov 2026): hide the old fictional tools
  // (never delete them — old orders still reference them) and seed any
  // sample-catalogue tool that is not in the DB yet. Safe to run on every
  // start; INSERT OR IGNORE + the active=0 update make it idempotent.
  try {
    for (const slug of OLD_FICTIONAL_SLUGS) {
      await client.execute({ sql: "UPDATE tools SET active=0 WHERE slug=?", args: [slug] });
    }
    for (const s of seedTools) {
      await client.execute({
        sql: "INSERT INTO tools (slug,name,brand,category,icon,price,rating,reviews,from_color,to_color,description,features,url,duration,access_type,warranty,delivery,image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(slug) DO UPDATE SET name=excluded.name,brand=excluded.brand,category=excluded.category,icon=excluded.icon,price=excluded.price,rating=excluded.rating,reviews=excluded.reviews,from_color=excluded.from_color,to_color=excluded.to_color,description=excluded.description,features=excluded.features,url=excluded.url,duration=excluded.duration,access_type=excluded.access_type,warranty=excluded.warranty,delivery=excluded.delivery,image=excluded.image",
        args: [s.slug, s.name, s.brand || "", s.category, s.icon, s.price, s.rating, s.reviews, s.from, s.to, s.desc, JSON.stringify(s.features), `https://example.com/${s.slug}`, s.duration || "", s.accessType || "", s.warranty || "", s.delivery || "Instant", s.image || ""],
      });
    }
  } catch (e) { console.error("[nexavo] catalogue migration failed:", e?.message || e); }
  const a = await client.execute("SELECT COUNT(*) FROM users WHERE role='admin'");
  if (Number(a.rows[0][0]) === 0) {
    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "Admin@12345", 10);
    await client.execute({
      sql: "INSERT OR IGNORE INTO users (name,email,password_hash,role,plan,created_at) VALUES (?,?,?,?,?,?)",
      args: ["Admin", (process.env.ADMIN_EMAIL || "admin@nexavo.test").toLowerCase(), hash, "admin", "Team", new Date().toISOString()],
    });
  }
}

export async function db() {
  globalThis.__nexavoReady ||= init();
  await globalThis.__nexavoReady;
  return client;
}

const toObjects = (rs) => rs.rows.map((r) => Object.fromEntries(rs.columns.map((c, i) => [c, r[i]])));

export async function q(sql, args = []) {
  const c = await db();
  return toObjects(await c.execute({ sql, args }));
}
export async function run(sql, args = []) {
  const c = await db();
  const rs = await c.execute({ sql, args });
  return { id: Number(rs.lastInsertRowid || 0), changes: rs.rowsAffected };
}
