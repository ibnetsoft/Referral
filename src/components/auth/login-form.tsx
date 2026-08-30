type Props = {
  error?: string;
};

export function LoginForm({ error }: Props) {
  return (
    <form
      action="/api/auth/login"
      method="post"
      className="space-y-5 rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-[0_30px_80px_rgba(20,26,30,0.12)] backdrop-blur"
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
          로그인
        </h1>
        <p className="text-sm text-slate-600">
          아이디와 비밀번호로 로그인합니다.
        </p>
      </div>
      {error ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">아이디</span>
        <input
          name="username"
          required
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">비밀번호</span>
        <input
          name="password"
          type="password"
          required
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-orange-500"
      >
        로그인
      </button>
    </form>
  );
}
