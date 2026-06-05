import postgres from "postgres";

let sql: ReturnType<typeof postgres> | null = null;

/**
 * Normalize hosted Postgres URLs for serverless (Supabase pooler, etc.).
 * Transaction pooler on Supabase expects `pgbouncer=true`; SSL is required.
 */
export function resolveDatabaseUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  try {
    const u = new URL(trimmed);
    const host = u.hostname.toLowerCase();
    if (host.includes("pooler.supabase.com")) {
      if (!u.searchParams.has("pgbouncer")) {
        u.searchParams.set("pgbouncer", "true");
      }
    }
    if (
      (host.includes("supabase.com") || host.endsWith("supabase.co")) &&
      !u.searchParams.has("sslmode")
    ) {
      u.searchParams.set("sslmode", "require");
    }
    return u.toString();
  } catch {
    return trimmed;
  }
}

function isSupabaseHost(url: string): boolean {
  return /supabase\.(com|co)/i.test(url);
}

export const SUPABASE_POOLER_USER_HINT =
  "In Supabase → Project Settings → Database, copy the Transaction pooler URI (port 6543). The username must be postgres.<PROJECT_REF>, not postgres alone.";

export function validateSupabasePoolerUrl(url: string): void {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return;
  }
  if (!u.hostname.toLowerCase().includes("pooler.supabase.com")) return;
  if (u.username === "postgres") {
    throw new Error(
      `DATABASE_URL uses the Supabase transaction pooler host but username "postgres". ${SUPABASE_POOLER_USER_HINT}`,
    );
  }
  if (!u.username.startsWith("postgres.")) {
    throw new Error(
      `DATABASE_URL pooler username should be postgres.<PROJECT_REF>. ${SUPABASE_POOLER_USER_HINT}`,
    );
  }
}

export function getDb(): ReturnType<typeof postgres> | null {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) return null;
  if (!sql) {
    const url = resolveDatabaseUrl(raw);
    validateSupabasePoolerUrl(url);
    sql = postgres(url, {
      max: 1,
      prepare: false,
      fetch_types: false,
      connect_timeout: 20,
      ...(isSupabaseHost(url) ? { ssl: "require" as const } : {}),
    });
  }
  return sql;
}

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}
