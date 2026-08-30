"use client";

import { useEffect, useState } from "react";

type TreeNode = {
  id: string;
  username: string;
  referralCode: string;
  createdAt: string;
  directReferralCount: number;
  totalDescendantCount: number;
  hasChildren: boolean;
};

function TreeBranch({ node }: { node: TreeNode }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState<TreeNode[] | null>(null);

  const loadChildren = async () => {
    if (!node.hasChildren || children) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/tree?rootUserId=${node.id}`);
      const data = (await response.json()) as { children: TreeNode[] };
      setChildren(data.children);
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <button
          type="button"
          disabled={!node.hasChildren}
          onClick={async () => {
            const nextExpanded = !expanded;
            setExpanded(nextExpanded);
            if (nextExpanded) {
              await loadChildren();
            }
          }}
          className="min-w-7 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 disabled:opacity-50"
        >
          {node.hasChildren ? (expanded ? "-" : "+") : "·"}
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-950">{node.username}</p>
          <p className="text-sm text-slate-500">
            {node.referralCode} · 직접 {node.directReferralCount}명 · 전체{" "}
            {node.totalDescendantCount}명
          </p>
        </div>
      </div>
      {expanded ? (
        <div className="ml-5 border-l border-dashed border-slate-300 pl-5">
          {loading ? <p className="text-sm text-slate-500">불러오는 중...</p> : null}
          {children?.length ? (
            <ul className="space-y-3">
              {children.map((child) => (
                <TreeBranch key={child.id} node={child} />
              ))}
            </ul>
          ) : null}
          {!loading && children?.length === 0 ? (
            <p className="text-sm text-slate-500">하위 조직이 없습니다.</p>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

export function ReferralTree({
  rootUserId,
  rootUsername,
}: {
  rootUserId: string;
  rootUsername: string;
}) {
  const [children, setChildren] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const response = await fetch(`/api/tree?rootUserId=${rootUserId}`);
      const data = (await response.json()) as { children: TreeNode[] };
      setChildren(data.children);
      setLoading(false);
    };

    void load();
  }, [rootUserId]);

  return (
    <section className="space-y-4 rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
      <div>
        <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">
          추천계보 Tree
        </h2>
        <p className="text-sm text-slate-500">{rootUsername} 기준 하위 조직</p>
      </div>
      <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
        루트: {rootUsername}
      </div>
      {loading ? <p className="text-sm text-slate-500">트리를 불러오는 중...</p> : null}
      {!loading && children.length === 0 ? (
        <p className="text-sm text-slate-500">직접 추천한 회원이 없습니다.</p>
      ) : null}
      <ul className="space-y-3">
        {children.map((child) => (
          <TreeBranch key={child.id} node={child} />
        ))}
      </ul>
    </section>
  );
}
