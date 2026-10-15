import { useState, useEffect } from 'react';

/**
 * Horizontal bar chart showing top contributors with animated bars + avatars.
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {top.map((c, i) => {
        const pct = (c.contributions / maxContribs) * 100;
        return (
          <a
            key={c.login}
            href={c.html_url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              textDecoration: 'none', color: 'inherit',
              animation: `fadeInUp 0.4s ease ${i * 60}ms both`,
            }}
          >
            <img
              src={c.avatar_url}
              alt={c.login}
              style={{
                width: 28, height: 28, borderRadius: '50%',
                border: '2px solid var(--border)',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                marginBottom: 4,
              }}>
                <span style={{
                  fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-sans)',
                }}>
                  {c.login}
                </span>
                <span style={{
                  fontSize: 11, color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)', flexShrink: 0,
                  marginLeft: 8,
                }}>
                  {c.contributions}
                </span>
              </div>
              <div style={{
                width: '100%', height: 6, borderRadius: 3,
                background: 'rgba(99,102,241,0.08)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: animated ? `${pct}%` : '0%',
                  borderRadius: 3,
                  background: i === 0
                    ? 'linear-gradient(90deg, #6366f1, #a855f7)'
                    : i < 3
                      ? 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                      : 'var(--accent-indigo)',
                  transition: `width 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms`,
                }} />
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
}
