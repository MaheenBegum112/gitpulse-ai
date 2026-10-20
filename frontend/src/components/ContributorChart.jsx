import { useState, useEffect } from 'react';

/**
 * Horizontal bar chart showing top contributors.
 */
export default function ContributorChart({ contributors = [] }) {
  const [animated, setAnimated] = useState(false);

  const top = contributors.slice(0, 10);
  const maxContribs = top[0]?.contributions || 1;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (top.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {top.map((c, i) => {
        const pct = (c.contributions / maxContribs) * 100;

        return (
          <a
            key={c.login}
            href={c.html_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            {/* Avatar */}
            <img
              src={c.avatar_url}
              alt={c.login}
              className="h-7 w-7 shrink-0 rounded-full border border-blue-200"
            />

            <div className="min-w-0 flex-1">

              {/* Name + Contributions */}
              <div className="mb-1 flex items-baseline justify-between">
                <span className="truncate text-xs font-semibold text-slate-700">
                  {c.login}
                </span>

                <span className="ml-2 shrink-0 font-mono text-[11px] text-slate-500">
                  {c.contributions}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    i === 0
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      : i < 3
                      ? 'bg-blue-500'
                      : 'bg-blue-400'
                  }`}
                  style={{
                    width: animated ? `${pct}%` : '0%',
                  }}
                />
              </div>

            </div>
          </a>
        );
      })}
    </div>
  );
}