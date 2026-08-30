import crypto from "node:crypto";
import { sql } from "@/lib/db";

const REFERRAL_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const randomReferralCode = (length = 8) =>
  Array.from(crypto.randomBytes(length))
    .map((byte) => REFERRAL_ALPHABET[byte % REFERRAL_ALPHABET.length])
    .join("")
    .slice(0, length);

export const normalizeReferralCode = (value?: string | null) =>
  value?.trim().toUpperCase() ?? "";

export async function generateUniqueReferralCode() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const referralCode = randomReferralCode(8);
    const [existing] = await sql<{ id: string }[]>`
      select id
      from public.users
      where referral_code = ${referralCode}
      limit 1
    `;

    if (!existing) {
      return referralCode;
    }
  }

  throw new Error("Failed to generate unique referral code.");
}
