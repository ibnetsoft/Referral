import { NextRequest, NextResponse } from "next/server";

export function redirectWithQuery(
  request: NextRequest,
  pathname: string,
  query: Record<string, string | undefined>,
) {
  const url = new URL(pathname, request.url);

  for (const [key, value] of Object.entries(query)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }

  return NextResponse.redirect(url);
}

export function getClientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}
