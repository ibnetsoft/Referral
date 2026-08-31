import { sql } from "@/lib/db";

export type AdminStats = {
  totalMembers: number;
  todaySignups: number;
  referralSignups: number;
  noRecommenderSignups: number;
};

export type AdminUserRow = {
  signupNumber: number;
  id: string;
  fullName: string;
  phoneNumber: string;
  username: string;
  referralCode: string;
  recommenderUsername: string | null;
  recommenderFullName: string | null;
  recommenderReferralCode: string | null;
  directReferralCount: number;
  totalDescendantCount: number;
  createdAt: string;
};

export async function getAdminStats() {
  const [stats] = await sql<AdminStats[]>`
    select
      count(*)::int as "totalMembers",
      count(*) filter (where created_at >= date_trunc('day', now()))::int as "todaySignups",
      count(*) filter (where recommender_id is not null)::int as "referralSignups",
      count(*) filter (where recommender_id is null)::int as "noRecommenderSignups"
    from public.users
  `;

  return stats;
}

export async function searchAdminUsers(field: string, q: string) {
  const term = `%${q}%`;

  if (!q) {
    return sql<AdminUserRow[]>`
      select
        row_number() over (order by u.created_at asc, u.id asc)::int as "signupNumber",
        u.id,
        u.full_name as "fullName",
        u.phone_number as "phoneNumber",
        u.username,
        u.referral_code as "referralCode",
        recommender.username as "recommenderUsername",
        recommender.full_name as "recommenderFullName",
        recommender.referral_code as "recommenderReferralCode",
        (
          select count(*)::int
          from public.users direct_child
          where direct_child.recommender_id = u.id
        ) as "directReferralCount",
        (
          with recursive descendants as (
            select id
            from public.users
            where recommender_id = u.id
            union all
            select nested.id
            from public.users nested
            join descendants on nested.recommender_id = descendants.id
          )
          select count(*)::int
          from descendants
        ) as "totalDescendantCount",
        u.created_at as "createdAt"
      from public.users u
      left join public.users recommender on recommender.id = u.recommender_id
      order by u.created_at desc
      limit 200
    `;
  }

  if (field === "username") {
    return sql<AdminUserRow[]>`
      select
        row_number() over (order by u.created_at asc, u.id asc)::int as "signupNumber",
        u.id,
        u.full_name as "fullName",
        u.phone_number as "phoneNumber",
        u.username,
        u.referral_code as "referralCode",
        recommender.username as "recommenderUsername",
        recommender.full_name as "recommenderFullName",
        recommender.referral_code as "recommenderReferralCode",
        (
          select count(*)::int from public.users direct_child where direct_child.recommender_id = u.id
        ) as "directReferralCount",
        (
          with recursive descendants as (
            select id from public.users where recommender_id = u.id
            union all
            select nested.id from public.users nested join descendants on nested.recommender_id = descendants.id
          )
          select count(*)::int from descendants
        ) as "totalDescendantCount",
        u.created_at as "createdAt"
      from public.users u
      left join public.users recommender on recommender.id = u.recommender_id
      where u.username ilike ${term}
      order by u.created_at desc
      limit 200
    `;
  }

  if (field === "referral_code") {
    return sql<AdminUserRow[]>`
      select
        row_number() over (order by u.created_at asc, u.id asc)::int as "signupNumber",
        u.id,
        u.full_name as "fullName",
        u.phone_number as "phoneNumber",
        u.username,
        u.referral_code as "referralCode",
        recommender.username as "recommenderUsername",
        recommender.full_name as "recommenderFullName",
        recommender.referral_code as "recommenderReferralCode",
        (
          select count(*)::int from public.users direct_child where direct_child.recommender_id = u.id
        ) as "directReferralCount",
        (
          with recursive descendants as (
            select id from public.users where recommender_id = u.id
            union all
            select nested.id from public.users nested join descendants on nested.recommender_id = descendants.id
          )
          select count(*)::int from descendants
        ) as "totalDescendantCount",
        u.created_at as "createdAt"
      from public.users u
      left join public.users recommender on recommender.id = u.recommender_id
      where u.referral_code ilike ${term}
      order by u.created_at desc
      limit 200
    `;
  }

  return sql<AdminUserRow[]>`
    select
      row_number() over (order by u.created_at asc, u.id asc)::int as "signupNumber",
      u.id,
      u.full_name as "fullName",
      u.phone_number as "phoneNumber",
      u.username,
      u.referral_code as "referralCode",
      recommender.username as "recommenderUsername",
      recommender.full_name as "recommenderFullName",
      recommender.referral_code as "recommenderReferralCode",
      (
        select count(*)::int from public.users direct_child where direct_child.recommender_id = u.id
      ) as "directReferralCount",
      (
        with recursive descendants as (
          select id from public.users where recommender_id = u.id
          union all
          select nested.id from public.users nested join descendants on nested.recommender_id = descendants.id
        )
        select count(*)::int from descendants
      ) as "totalDescendantCount",
      u.created_at as "createdAt"
    from public.users u
    left join public.users recommender on recommender.id = u.recommender_id
    where recommender.username ilike ${term}
    order by u.created_at desc
    limit 200
  `;
}
