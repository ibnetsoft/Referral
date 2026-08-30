import { NextRequest } from "next/server";
import { createUserSession } from "@/lib/auth/session";
import { clearLoginFailures, isLoginBlocked, recordLoginFailure } from "@/lib/auth/rate-limit";
import { verifyPassword } from "@/lib/auth/password";
import { redirectWithQuery, getClientIp } from "@/lib/http";
import { getUserByUsername } from "@/lib/users";
import { loginSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const parsed = loginSchema.safeParse({
    username: String(formData.get("username") ?? ""),
    password: String(formData.get("password") ?? ""),
  });

  if (!parsed.success) {
    return redirectWithQuery(request, "/login", {
      error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
    });
  }

  const ipAddress = getClientIp(request);
  const blocked = await isLoginBlocked({
    username: parsed.data.username,
    ipAddress,
  });

  if (blocked) {
    return redirectWithQuery(request, "/login", {
      error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도하세요.",
    });
  }

  const user = await getUserByUsername(parsed.data.username);
  const valid = user
    ? await verifyPassword(parsed.data.password, user.passwordHash)
    : false;

  if (!user || !valid) {
    await recordLoginFailure({
      username: parsed.data.username,
      ipAddress,
    });

    return redirectWithQuery(request, "/login", {
      error: "아이디 또는 비밀번호가 올바르지 않습니다.",
    });
  }

  await clearLoginFailures({
    username: parsed.data.username,
    ipAddress,
  });
  await createUserSession({
    userId: user.id,
    ipAddress,
    userAgent: request.headers.get("user-agent"),
  });

  return redirectWithQuery(request, "/mypage", {});
}
