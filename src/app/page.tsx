import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <section className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl flex-col justify-center px-6 pb-16 pt-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="inline-flex rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-orange-700">
            P1-P6 MVP Scope
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-7xl">
              추천코드로 가입하고,
              <br />
              조직을 바로 추적합니다.
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white hover:bg-orange-500"
            >
              회원가입 시작
            </Link>
            <Link
              href={user ? "/mypage" : "/login"}
              className="rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-medium text-slate-800 hover:border-orange-300 hover:bg-orange-50"
            >
              {user ? "마이페이지 이동" : "로그인"}
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["회원가입", "추천코드 선택 입력 또는 URL `?ref=` 자동 고정"],
            ["마이페이지", "내 추천코드, 링크복사, 카카오 공유, 추천 조직도"],
            ["관리자", "전체회원수, 오늘가입, 추천가입, 검색, 트리 조회"],
            ["Excel", "전체회원목록을 xlsx로 다운로드"],
          ].map(([title, description]) => (
            <article
              key={title}
              className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(20,26,30,0.09)]"
            >
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-orange-700">
                Module
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
