"use client";

import { useEffect, useState } from "react";

type Props = {
  referralUrl: string;
  username: string;
  referralCode: string;
  kakaoJavascriptKey: string;
};

export function ShareButtons({
  referralUrl,
  username,
  referralCode,
  kakaoJavascriptKey,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [kakaoReady, setKakaoReady] = useState(false);

  useEffect(() => {
    if (!kakaoJavascriptKey) {
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://developers.kakao.com/sdk/js/kakao.js"]',
    );

    if (existing) {
      const kakao = window.Kakao;
      if (kakao && !kakao.isInitialized()) {
        kakao.init(kakaoJavascriptKey);
      }
      setKakaoReady(Boolean(window.Kakao));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      const kakao = window.Kakao;
      if (kakao && !kakao.isInitialized()) {
        kakao.init(kakaoJavascriptKey);
      }
      setKakaoReady(Boolean(window.Kakao));
    };

    document.body.appendChild(script);
  }, [kakaoJavascriptKey]);

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={async () => {
          await navigator.clipboard.writeText(referralUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-500"
      >
        {copied ? "복사됨" : "링크복사"}
      </button>
      <button
        type="button"
        disabled={!kakaoReady}
        onClick={() => {
          window.Kakao?.Share.sendDefault({
            objectType: "feed",
            content: {
              title: `${username}님의 추천 링크`,
              description: `추천코드 ${referralCode}로 가입하세요.`,
              imageUrl: `${window.location.origin}/next.svg`,
              link: {
                mobileWebUrl: referralUrl,
                webUrl: referralUrl,
              },
            },
            buttons: [
              {
                title: "회원가입 하러가기",
                link: {
                  mobileWebUrl: referralUrl,
                  webUrl: referralUrl,
                },
              },
            ],
          });
        }}
        className="rounded-full bg-[#FEE500] px-4 py-2 text-sm font-medium text-slate-950 transition enabled:hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        카카오톡 공유
      </button>
    </div>
  );
}
