import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccessTreeRoot, getTreeChildren } from "@/lib/tree";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rootUserId = request.nextUrl.searchParams.get("rootUserId");

  if (!rootUserId) {
    return NextResponse.json({ children: [] });
  }

  if (user.role !== "ADMIN") {
    const allowed = await canAccessTreeRoot(user.id, rootUserId);

    if (!allowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const children = await getTreeChildren(rootUserId);
  return NextResponse.json({ children });
}
