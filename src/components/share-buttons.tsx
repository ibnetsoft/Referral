"use client";

import { useState } from "react";

type Props = {
  referralUrl: string;
};

export function ShareButtons({ referralUrl }: Props) {
  const [copied, setCopied] = useState(false);

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
    </div>
  );
}
