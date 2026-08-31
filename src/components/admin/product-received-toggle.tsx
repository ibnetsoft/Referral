"use client";

import { useState, useTransition } from "react";

type Props = {
  userId: string;
  initialChecked: boolean;
};

export function ProductReceivedToggle({ userId, initialChecked }: Props) {
  const [checked, setChecked] = useState(initialChecked);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <label className="flex items-center justify-center gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        disabled={isPending}
        onChange={(event) => {
          const nextChecked = event.target.checked;
          setChecked(nextChecked);
          setError("");

          startTransition(async () => {
            const response = await fetch(`/api/admin/users/${userId}/product-received`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                productReceived: nextChecked,
              }),
            });

            if (!response.ok) {
              setChecked(!nextChecked);
              setError("저장 실패");
            }
          });
        }}
        className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-400"
      />
      <span>{checked ? "수령" : "미수령"}</span>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
