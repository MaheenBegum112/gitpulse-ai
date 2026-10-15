import { useState, useEffect, useMemo } from 'react';

/**
 * GitHub-style segmented language bar with animated widths and legend.
 */

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', 'C++': '#f34b7d', C: '#555555', 'C#': '#178600',
  Go: '#00ADD8', Rust: '#dea584', Ruby: '#701516', PHP: '#4F5D95',
  Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB', Scala: '#c22d40',
  Shell: '#89e051', HTML: '#e34c26', CSS: '#563d7c', SCSS: '#c6538c',
  Vue: '#41b883', Svelte: '#ff3e00', Lua: '#000080', R: '#198CE7',
  Perl: '#0298c3', Haskell: '#5e5086', Elixir: '#6e4a7e',
  Jupyter: '#DA5B0B', Dockerfile: '#384d54', Makefile: '#427819',
  Nix: '#7e7eff', Zig: '#ec915c', Markdown: '#083fa1',
};

function getColor(lang) {
  return LANG_COLORS[lang] || `hsl(${(lang.charCodeAt(0) * 47) % 360}, 55%, 55%)`;
}

export default function LanguageBreakdown({ languages = {} }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  const entries = useMemo(() => {
    const total = Object.values(languages).reduce((s, v) => s + v, 0) || 1;
    return Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .map(([lang, bytes]) => ({
        lang,
        bytes,
        pct: (bytes / total) * 100,
        color: getColor(lang),
      }));
  }, [languages]);

  if (entries.length === 0) {
    return <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No language data available.</p>;
  }

  return (
    <div>
      {/* Segmented bar */}
      <div style={{
        display: 'flex', height: 10, borderRadius: 5,
        overflow: 'hidden', background: 'rgba(99,102,241,0.06)',
        marginBottom: 16,
      }}>
        {entries.map((e, i) => (
          <div
            key={e.lang}
            title={`${e.lang}: ${e.pct.toFixed(1)}%`}
            style={{
              width: animated ? `${e.pct}%` : '0%',
              background: e.color,
              transition: `width 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 40}ms`,
              minWidth: e.pct > 0.5 ? 3 : 0,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '8px 16px',
      }}>
        {entries.slice(0, 8).map((e) => (
          <div key={e.lang} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 10, height: 10, borderRadius: '50%',
              background: e.color, flexShrink: 0,
              boxShadow: `0 0 6px ${e.color}44`,
            }} />
            <span style={{
              fontSize: 12, color: 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)',
            }}>
              {e.lang}
            </span>
            <span style={{
              fontSize: 11, color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}>
              {e.pct.toFixed(1)}%
            </span>
          </div>
        ))}
        {entries.length > 8 && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            +{entries.length - 8} more
          </span>
        )}
      </div>
    </div>
  );
}
