import { cache } from "react";
import { sql } from "@/lib/db";
import { getSessionTokenHash } from "@/lib/auth/session";

export type SessionUser = {
  id: string;
  username: string;
  referralCode: string;
  role: "USER" | "ADMIN";
  createdAt: string;
};

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const tokenHash = await getSessionTokenHash();

  if (!tokenHash) {
    return null;
  }

  const [sessionUser] = await sql<SessionUser[]>`
    select
      u.id,
      u.username,
      u.referral_code as "referralCode",
      u.role,
      u.created_at as "createdAt"
    from public.user_sessions s
    join public.users u on u.id = s.user_id
    where s.token_hash = ${tokenHash}
      and s.expires_at > now()
    limit 1
  `;

  if (!sessionUser) {
    return null;
  }

  await sql`
    update public.user_sessions
    set last_seen_at = now()
    where token_hash = ${tokenHash}
  `;

  return sessionUser;
});
