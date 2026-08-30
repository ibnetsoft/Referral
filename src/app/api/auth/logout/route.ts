import { NextRequest } from "next/server";
import { clearCurrentSession } from "@/lib/auth/session";
import { redirectWithQuery } from "@/lib/http";

export async function POST(request: NextRequest) {
  await clearCurrentSession();
  return redirectWithQuery(request, "/", {});
}
