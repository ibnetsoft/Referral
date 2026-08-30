import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { getAdminStats, searchAdminUsers } from "@/lib/admin";
import { ReferralTree } from "@/components/referral-tree";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const stats = await getAdminStats();
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const field = typeof params.field === "string" ? params.field : "username";
  const rootUserId = typeof params.rootUserId === "string" ? params.rootUserId : "";
  const rootUsername = typeof params.rootUsername === "string" ? params.rootUsername : "선택 회원";
  const rows = await searchAdminUsers(field, q);

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-orange-700">
            Admin
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950">
            관리자 Dashboard
          </h1>
        </div>
        <Link
          href="/api/admin/export"
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white hover:bg-orange-500"
        >
          Excel 다운로드
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["전체회원수", stats.totalMembers],
          ["오늘가입", stats.todaySignups],
          ["추천가입수", stats.referralSignups],
          ["추천인 없는 가입수", stats.noRecommenderSignups],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
              {value}
            </p>
          </article>
        ))}
      </div>

      <section className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <form className="grid gap-4 md:grid-cols-[180px_1fr_auto]">
          <select
            name="field"
            defaultValue={field}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
          >
            <option value="username">회원 아이디</option>
            <option value="referral_code">추천코드</option>
            <option value="recommender">추천인</option>
          </select>
          <input
            name="q"
            defaultValue={q}
            placeholder="검색어 입력"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
          />
          <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white">
            검색
          </button>
        </form>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {[
                  "username",
                  "referral_code",
                  "recommender",
                  "direct_referral_count",
                  "total_descendant_count",
                  "created_at",
                  "detail",
                ].map((heading) => (
                  <th key={heading} className="px-4 py-3 font-medium">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-950">{row.username}</td>
                  <td className="px-4 py-3 font-mono text-slate-700">{row.referralCode}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {row.recommenderUsername ?? "없음"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.directReferralCount}</td>
                  <td className="px-4 py-3 text-slate-700">{row.totalDescendantCount}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {new Date(row.createdAt).toLocaleString("ko-KR")}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin?field=${field}&q=${encodeURIComponent(q)}&rootUserId=${row.id}&rootUsername=${encodeURIComponent(row.username)}`}
                      className="text-orange-700 hover:underline"
                    >
                      조직도 보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {rootUserId ? (
        <ReferralTree rootUserId={rootUserId} rootUsername={rootUsername} />
      ) : null}
    </section>
  );
}
