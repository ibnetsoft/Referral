import { sql } from "@/lib/db";

export type ReferralLookup = {
  id: string;
  username: string;
  referralCode: string;
};

export type UserSummary = {
  id: string;
  username: string;
  createdAt: string;
  referralCode: string;
  recommenderId: string | null;
  recommenderUsername: string | null;
  recommenderReferralCode: string | null;
  directReferralCount: number;
  totalDescendantCount: number;
};

export async function getUserByUsername(username: string) {
  const [user] = await sql<
    {
      id: string;
      username: string;
      passwordHash: string;
      referralCode: string;
      role: "USER" | "ADMIN";
    }[]
  >`
    select
      id,
      username,
      password_hash as "passwordHash",
      referral_code as "referralCode",
      role
    from public.users
    where username = ${username}
    limit 1
  `;

  return user ?? null;
}

export async function getUserByReferralCode(referralCode: string) {
  const [user] = await sql<ReferralLookup[]>`
    select
      id,
      username,
      referral_code as "referralCode"
    from public.users
    where referral_code = ${referralCode}
    limit 1
  `;

  return user ?? null;
}

export async function getUserSummary(userId: string) {
  const [summary] = await sql<UserSummary[]>`
    with recursive descendants as (
      select id
      from public.users
      where recommender_id = ${userId}
      union all
      select child.id
      from public.users child
      join descendants parent on child.recommender_id = parent.id
    )
    select
      u.id,
      u.username,
      u.created_at as "createdAt",
      u.referral_code as "referralCode",
      u.recommender_id as "recommenderId",
      recommender.username as "recommenderUsername",
      recommender.referral_code as "recommenderReferralCode",
      (
        select count(*)::int
        from public.users direct_child
        where direct_child.recommender_id = u.id
      ) as "directReferralCount",
      (
        select count(*)::int
        from descendants
      ) as "totalDescendantCount"
    from public.users u
    left join public.users recommender on recommender.id = u.recommender_id
    where u.id = ${userId}
    limit 1
  `;

  return summary ?? null;
}
