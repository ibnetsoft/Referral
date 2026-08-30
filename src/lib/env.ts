export const env = {
  appUrl: process.env.APP_URL ?? "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "",
  sessionCookieName: process.env.SESSION_COOKIE_NAME ?? "referral_session",
  sessionTtlDays: Number(process.env.SESSION_TTL_DAYS ?? "14"),
  loginRateLimitWindowMinutes: Number(
    process.env.LOGIN_RATE_LIMIT_WINDOW_MINUTES ?? "10",
  ),
  loginRateLimitMaxAttempts: Number(
    process.env.LOGIN_RATE_LIMIT_MAX_ATTEMPTS ?? "5",
  ),
  kakaoJavascriptKey: process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY ?? "",
  isProduction: process.env.NODE_ENV === "production",
};
