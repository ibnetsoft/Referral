import { sql } from "@/lib/db";

export type TreeNode = {
  id: string;
  username: string;
  referralCode: string;
  createdAt: string;
  directReferralCount: number;
  totalDescendantCount: number;
  hasChildren: boolean;
};

export async function getTreeChildren(rootUserId: string) {
  return sql<TreeNode[]>`
    select
      child.id,
      child.username,
      child.referral_code as "referralCode",
      child.created_at as "createdAt",
      (
        select count(*)::int
        from public.users direct_child
        where direct_child.recommender_id = child.id
      ) as "directReferralCount",
      (
        with recursive descendants as (
          select id
          from public.users
          where recommender_id = child.id
          union all
          select nested.id
          from public.users nested
          join descendants on nested.recommender_id = descendants.id
        )
        select count(*)::int
        from descendants
      ) as "totalDescendantCount",
      exists(
        select 1
        from public.users next_child
        where next_child.recommender_id = child.id
      ) as "hasChildren"
    from public.users child
    where child.recommender_id = ${rootUserId}
    order by child.created_at asc
  `;
}

export async function canAccessTreeRoot(ownerUserId: string, targetUserId: string) {
  const [result] = await sql<{ allowed: boolean }[]>`
    with recursive descendants as (
      select id
      from public.users
      where recommender_id = ${ownerUserId}
      union all
      select child.id
      from public.users child
      join descendants on child.recommender_id = descendants.id
    )
    select (
      ${ownerUserId}::uuid = ${targetUserId}::uuid
      or exists(select 1 from descendants where id = ${targetUserId})
    ) as allowed
  `;

  return Boolean(result?.allowed);
}
