import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { seedTools } from "./tools";

const url = process.env.TURSO_DATABASE_URL || (process.env.VERCEL ? "file:/tmp/nexora.db" : "file:local.db");
const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN || undefined });

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user', plan TEXT NOT NULL DEFAULT 'Starter', created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS tools (id INTEGER PRIMARY KEY AUTOINCREMENT, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, category TEXT NOT NULL, icon TEXT NOT NULL, price REAL NOT NULL, rating REAL NOT NULL DEFAULT 4.5, reviews INTEGER NOT NULL DEFAULT 0, from_color TEXT NOT NULL, to_color TEXT NOT NULL, description TEXT NOT NULL, features TEXT NOT NULL DEFAULT '[]', url TEXT NOT NULL DEFAULT '', active INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, total REAL NOT NULL, status TEXT NOT NULL DEFAULT 'pending', method TEXT NOT NULL, reference TEXT, plan TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL, tool_slug TEXT NOT NULL, name TEXT NOT NULL, price REAL NOT NULL, license_key TEXT);
CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS subscribers (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL);
`;

async function init() {
  await client.executeMultiple(SCHEMA);
  const t = await client.execute("SELECT COUNT(*) FROM tools");
  if (Number(t.rows[0][0]) === 0) {
    for (const s of seedTools) {
      await client.execute({
        sql: "INSERT INTO tools (slug,name,category,icon,price,rating,reviews,from_color,to_color,description,features,url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        args: [s.slug, s.name, s.category, s.icon, s.price, s.rating, s.reviews, s.from, s.to, s.desc, JSON.stringify(s.features), `https://example.com/${s.slug}`],
      });
    }
  }
  // Admin account: if ADMIN_EMAIL + ADMIN_PASSWORD are set, they always control the admin login.
  const envEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const envPass = process.env.ADMIN_PASSWORD || "";
  if (envEmail && envPass) {
    const ex = await client.execute({ sql: "SELECT password_hash FROM users WHERE email=?", args: [envEmail] });
    if (ex.rows.length) {
      const same = bcrypt.compareSync(envPass, String(ex.rows[0][0]));
      await client.execute({ sql: "UPDATE users SET role='admin' WHERE email=?", args: [envEmail] });
      if (!same) await client.execute({ sql: "UPDATE users SET password_hash=? WHERE email=?", args: [bcrypt.hashSync(envPass, 10), envEmail] });
    } else {
      await client.execute({
        sql: "INSERT INTO users (name,email,password_hash,role,plan,created_at) VALUES (?,?,?,?,?,?)",
        args: ["Admin", envEmail, bcrypt.hashSync(envPass, 10), "admin", "Team", new Date().toISOString()],
      });
    }
    // remove the public default admin so nobody can log in with the documented default password
    if (envEmail !== "admin@nexora.test") await client.execute("DELETE FROM users WHERE email='admin@nexora.test' AND role='admin'");
  } else {
    const a = await client.execute("SELECT COUNT(*) FROM users WHERE role='admin'");
    if (Number(a.rows[0][0]) === 0) {
      await client.execute({
        sql: "INSERT OR IGNORE INTO users (name,email,password_hash,role,plan,created_at) VALUES (?,?,?,?,?,?)",
        args: ["Admin", "admin@nexora.test", bcrypt.hashSync("Admin@12345", 10), "admin", "Team", new Date().toISOString()],
      });
    }
  }
}

export async function db() {
  globalThis.__nexoraReady ||= init();
  await globalThis.__nexoraReady;
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
