import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { searchAdminUsers } from "@/lib/admin";

export async function GET() {
  await requireAdmin();
  const rows = await searchAdminUsers("username", "");

  const worksheet = XLSX.utils.json_to_sheet(
    rows.map((row, index) => ({
      index: index + 1,
      username: row.username,
      referral_code: row.referralCode,
      recommender_username: row.recommenderUsername ?? "",
      recommender_referral_code: row.recommenderReferralCode ?? "",
      direct_referral_count: row.directReferralCount,
      total_descendant_count: row.totalDescendantCount,
      created_at: row.createdAt,
    })),
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "members");
  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="referral-members.xlsx"',
    },
  });
}
