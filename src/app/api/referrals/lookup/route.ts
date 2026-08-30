import { NextRequest, NextResponse } from "next/server";
import { normalizeReferralCode } from "@/lib/referral";
import { getUserByReferralCode } from "@/lib/users";

export async function GET(request: NextRequest) {
  const referralCode = normalizeReferralCode(
    request.nextUrl.searchParams.get("code"),
  );

  if (!referralCode) {
    return NextResponse.json({ valid: false });
  }

  const user = await getUserByReferralCode(referralCode);

  return NextResponse.json({
    valid: Boolean(user),
    user: user ?? undefined,
  });
}
