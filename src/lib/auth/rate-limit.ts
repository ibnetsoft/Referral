import { env } from "@/lib/env";
import { sql } from "@/lib/db";

export async function isLoginBlocked(input: {
  username: string;
  ipAddress?: string | null;
}) {
  const windowMinutes = env.loginRateLimitWindowMinutes;
  const [result] = await sql<{ attempts: number }[]>`
    select count(*)::int as attempts
    from public.login_attempts
    where created_at > now() - (${windowMinutes} * interval '1 minute')
      and (
        username = ${input.username}
        or (${input.ipAddress ?? null}::inet is not null and ip_address = ${input.ipAddress ?? null}::inet)
      )
  `;

  return (result?.attempts ?? 0) >= env.loginRateLimitMaxAttempts;
}

export async function recordLoginFailure(input: {
  username: string;
  ipAddress?: string | null;
}) {
  await sql`
    insert into public.login_attempts (username, ip_address)
    values (${input.username}, ${input.ipAddress ?? null})
  `;
}

export async function clearLoginFailures(input: {
  username: string;
  ipAddress?: string | null;
}) {
  await sql`
    delete from public.login_attempts
    where username = ${input.username}
      or (${input.ipAddress ?? null}::inet is not null and ip_address = ${input.ipAddress ?? null}::inet)
  `;
}
