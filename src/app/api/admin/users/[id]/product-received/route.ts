import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { sql } from "@/lib/db";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, context: Context) {
  await requireAdmin();

  const { id } = await context.params;
  const body = (await request.json()) as {
    productReceived?: boolean;
  };

  if (typeof body.productReceived !== "boolean") {
    return NextResponse.json(
      {
        message: "상품수령 값이 올바르지 않습니다.",
      },
      { status: 400 },
    );
  }

  const [updated] = await sql<{ id: string }[]>`
    update public.users
    set product_received = ${body.productReceived}
    where id = ${id}
    returning id
  `;

  if (!updated) {
    return NextResponse.json(
      {
        message: "회원을 찾을 수 없습니다.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
  });
}
