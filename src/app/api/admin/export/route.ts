import * as XLSX from "xlsx";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { searchAdminUsers } from "@/lib/admin";

export async function GET() {
  await requireAdmin();
  const rows = await searchAdminUsers("username", "");

  const worksheet = XLSX.utils.json_to_sheet(
    rows.map((row) => ({
      번호: row.signupNumber,
      이름: row.fullName,
      핸드폰번호: row.phoneNumber,
      아이디: row.username,
      추천코드: row.referralCode,
      "추천인 아이디": row.recommenderUsername ?? "",
      "추천인 이름": row.recommenderFullName ?? "",
      상품수령: row.productReceived ? "수령" : "미수령",
      "추천인 추천코드": row.recommenderReferralCode ?? "",
      "직접 추천수": row.directReferralCount,
      "전체 하위 조직수": row.totalDescendantCount,
      가입일시: row.createdAt,
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
