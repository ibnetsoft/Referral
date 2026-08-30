"use client";

import { useEffect, useState } from "react";

type Props = {
  initialReferralCode: string;
  lockedReferral: boolean;
  initialRecommenderName?: string | null;
  error?: string;
};

type LookupState = {
  loading: boolean;
  username: string | null;
  message: string | null;
};

export function SignupForm({
  initialReferralCode,
  lockedReferral,
  initialRecommenderName,
  error,
}: Props) {
  const [referralCode, setReferralCode] = useState(initialReferralCode);
  const [lookup, setLookup] = useState<LookupState>({
    loading: false,
    username: initialRecommenderName ?? null,
    message: initialRecommenderName ? `${initialRecommenderName} 회원 추천` : null,
  });

  useEffect(() => {
    if (!referralCode || lockedReferral) {
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLookup((current) => ({ ...current, loading: true }));

      try {
        const response = await fetch(
          `/api/referrals/lookup?code=${encodeURIComponent(referralCode)}`,
          { signal: controller.signal },
        );
        const data = (await response.json()) as {
          valid: boolean;
          user?: { username: string };
        };

        setLookup({
          loading: false,
          username: data.user?.username ?? null,
          message: data.valid
            ? `${data.user?.username ?? "-"} 회원 추천`
            : "유효하지 않은 추천코드입니다.",
        });
      } catch {
        setLookup({
          loading: false,
          username: null,
          message: "추천코드 확인에 실패했습니다.",
        });
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [referralCode, lockedReferral]);

  return (
    <form
      action="/api/auth/signup"
      method="post"
      className="space-y-5 rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-[0_30px_80px_rgba(20,26,30,0.12)] backdrop-blur"
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">
          회원가입
        </h1>
        <p className="text-sm text-slate-600">
          추천코드 기반 가입을 지원하는 최소 기능 MVP입니다.
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
          placeholder="4~20자 영문/숫자/_"
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
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">비밀번호 확인</span>
        <input
          name="password_confirm"
          type="password"
          required
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-orange-400"
        />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">추천코드</span>
        <input
          name={lockedReferral ? "locked_referral_code" : "referral_code"}
          value={referralCode}
          onChange={(event) => setReferralCode(event.target.value.toUpperCase())}
          readOnly={lockedReferral}
          placeholder="선택 입력"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 uppercase outline-none transition focus:border-orange-400 read-only:bg-amber-50"
        />
      </label>
      {lookup.message ? (
        <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {lookup.loading ? "추천인 확인 중..." : lookup.message}
        </p>
      ) : null}
      {lockedReferral ? (
        <p className="text-sm text-amber-700">
          추천링크로 접속한 경우 추천코드는 변경할 수 없습니다.
        </p>
      ) : null}
      <button
        type="submit"
        className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-orange-500"
      >
        가입하기
      </button>
    </form>
  );
}
