import crypto from "node:crypto";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { sql } from "@/lib/db";

const COOKIE_MAX_AGE = env.sessionTtlDays * 24 * 60 * 60;

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export async function createUserSession(input: {
  userId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + COOKIE_MAX_AGE * 1000);

  await sql`
    insert into public.user_sessions (
      user_id,
      token_hash,
      expires_at,
      ip_address,
      user_agent
    )
    values (
      ${input.userId},
      ${tokenHash},
      ${expiresAt.toISOString()},
      ${input.ipAddress ?? null},
      ${input.userAgent ?? null}
    )
  `;

  const cookieStore = await cookies();
  cookieStore.set(env.sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.sessionCookieName)?.value;

  if (token) {
    await sql`
      delete from public.user_sessions
      where token_hash = ${hashToken(token)}
    `;
  }

  cookieStore.set(env.sessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProduction,
    path: "/",
    maxAge: 0,
  });
}

export const getSessionTokenHash = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(env.sessionCookieName)?.value;
  return token ? hashToken(token) : null;
};
