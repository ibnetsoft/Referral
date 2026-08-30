import { NextRequest } from "next/server";
import { createUserSession } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";
import { sql } from "@/lib/db";
import { normalizeReferralCode, generateUniqueReferralCode } from "@/lib/referral";
import { getUserByReferralCode } from "@/lib/users";
import { redirectWithQuery, getClientIp } from "@/lib/http";
import { signupSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const lockedReferralCode = normalizeReferralCode(
    String(formData.get("locked_referral_code") ?? ""),
  );
  const submittedReferralCode = normalizeReferralCode(
    String(formData.get("referral_code") ?? ""),
  );
  const referralCode = lockedReferralCode || submittedReferralCode;

  const parsed = signupSchema.safeParse({
    username: String(formData.get("username") ?? ""),
    password: String(formData.get("password") ?? ""),
    passwordConfirm: String(formData.get("password_confirm") ?? ""),
    referralCode,
  });

  if (!parsed.success) {
    return redirectWithQuery(request, "/signup", {
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
      ref: lockedReferralCode || undefined,
    });
  }

  const existingUser = await sql<{ id: string }[]>`
    select id
    from public.users
    where username = ${parsed.data.username}
    limit 1
  `;

  if (existingUser.length > 0) {
    return redirectWithQuery(request, "/signup", {
      error: "이미 사용 중인 아이디입니다.",
      ref: lockedReferralCode || undefined,
    });
  }

  const recommender = referralCode
    ? await getUserByReferralCode(referralCode)
    : null;

  if (referralCode && !recommender) {
    return redirectWithQuery(request, "/signup", {
      error: "유효하지 않은 추천코드입니다.",
      ref: lockedReferralCode || undefined,
    });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const newReferralCode = await generateUniqueReferralCode();
  const [createdUser] = await sql<{ id: string }[]>`
    insert into public.users (
      username,
      password_hash,
      referral_code,
      recommender_id
    )
    values (
      ${parsed.data.username},
      ${passwordHash},
      ${newReferralCode},
      ${recommender?.id ?? null}
    )
    returning id
  `;

  await createUserSession({
    userId: createdUser.id,
    ipAddress: getClientIp(request),
    userAgent: request.headers.get("user-agent"),
  });

  return redirectWithQuery(request, "/mypage", {});
}
