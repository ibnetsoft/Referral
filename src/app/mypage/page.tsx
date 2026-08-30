import { env } from "@/lib/env";
import { requireUser } from "@/lib/auth/guards";
import { getUserSummary } from "@/lib/users";
import { ShareButtons } from "@/components/share-buttons";
import { ReferralTree } from "@/components/referral-tree";

export default async function MyPage() {
  const user = await requireUser();
  const summary = await getUserSummary(user.id);

  if (!summary) {
    return null;
  }

  const referralUrl = `${env.appUrl}/signup?ref=${summary.referralCode}`;

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_20px_70px_rgba(20,26,30,0.08)]">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-orange-700">
            My Page
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-slate-950">
            {summary.username}
          </h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">가입일</p>
              <p className="mt-2 font-medium text-slate-950">
                {new Date(summary.createdAt).toLocaleString("ko-KR")}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">추천인</p>
              <p className="mt-2 font-medium text-slate-950">
                {summary.recommenderUsername ?? "없음"}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">직접 추천회원 수</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {summary.directReferralCount}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">전체 하위 조직회원 수</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {summary.totalDescendantCount}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_20px_70px_rgba(20,26,30,0.08)]">
          <p className="text-sm text-slate-500">내 추천코드</p>
          <p className="mt-2 font-mono text-3xl font-semibold tracking-[0.18em] text-slate-950">
            {summary.referralCode}
          </p>
          <p className="mt-6 text-sm text-slate-500">추천 URL</p>
          <p className="mt-2 break-all rounded-2xl bg-slate-50 p-4 text-sm text-slate-800">
            {referralUrl}
          </p>
          <div className="mt-6">
            <ShareButtons
              referralUrl={referralUrl}
              username={summary.username}
              referralCode={summary.referralCode}
              kakaoJavascriptKey={env.kakaoJavascriptKey}
            />
          </div>
        </div>
      </div>
      <ReferralTree rootUserId={summary.id} rootUsername={summary.username} />
    </section>
  );
}
