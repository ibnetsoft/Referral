import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();

  if (user) {
    redirect("/mypage");
  }

  const params = await searchParams;
  const error = typeof params.error === "string" ? decodeURIComponent(params.error) : "";

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-orange-700">
          Login
        </p>
        <h1 className="text-5xl font-semibold tracking-[-0.05em] text-slate-950">
          계정 로그인
        </h1>
        <div className="rounded-[2rem] border border-orange-200 bg-white/80 p-6">
          <p className="text-sm text-slate-500">아직 계정이 없나요?</p>
          <Link href="/signup" className="mt-3 inline-flex text-sm font-medium text-orange-700">
            회원가입으로 이동
          </Link>
        </div>
      </div>
      <LoginForm error={error} />
    </section>
  );
}
