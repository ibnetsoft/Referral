import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { getCurrentUser } from "@/lib/auth/current-user";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Referral Signup MVP",
  description: "추천코드 기반 회원가입 임시 웹 MVP",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="ko">
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.28),_transparent_28%),linear-gradient(180deg,_#fffaf1_0%,_#f8fafc_45%,_#eef2ff_100%)]">
          <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
            <Link href="/" className="text-lg font-semibold tracking-[-0.04em] text-slate-950">
              Referral MVP
            </Link>
            <nav className="flex items-center gap-3 text-sm text-slate-700">
              <Link href="/signup" className="rounded-full px-3 py-2 hover:bg-white/70">
                회원가입
              </Link>
              <Link href="/login" className="rounded-full px-3 py-2 hover:bg-white/70">
                로그인
              </Link>
              {user ? (
                <>
                  <Link href="/mypage" className="rounded-full px-3 py-2 hover:bg-white/70">
                    마이페이지
                  </Link>
                  {user.role === "ADMIN" ? (
                    <Link href="/admin" className="rounded-full px-3 py-2 hover:bg-white/70">
                      관리자
                    </Link>
                  ) : null}
                  <form action="/api/auth/logout" method="post">
                    <button className="rounded-full bg-slate-950 px-4 py-2 text-white">
                      로그아웃
                    </button>
                  </form>
                </>
              ) : null}
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
