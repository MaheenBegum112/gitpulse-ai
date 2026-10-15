import { useMemo } from 'react';

/**
 * GitHub-style contribution heatmap built from commit dates.
 * Groups commits by day and renders a color-intensity grid.
 */
export default function CommitHeatmap({ commits = [] }) {
  const { grid, maxCount, monthLabels } = useMemo(() => {
    const now = new Date();
    const days = 91; // ~13 weeks
    const map = {};

    // Count commits per day
    commits.forEach((c) => {
      const d = new Date(c.commit?.author?.date);
      const key = d.toISOString().split('T')[0];
      map[key] = (map[key] || 0) + 1;
    });

    // Build grid (7 rows = days of week, columns = weeks)
    const cells = [];
    let max = 0;
    const months = [];
    let lastMonth = -1;

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const count = map[key] || 0;
      if (count > max) max = count;

      const month = d.getMonth();
      if (month !== lastMonth) {
        months.push({
          label: d.toLocaleString('en', { month: 'short' }),
          col: Math.floor((days - 1 - i) / 7),
        });
        lastMonth = month;
      }

      cells.push({ date: key, count, day: d.getDay() });
    }

    return { grid: cells, maxCount: max || 1, monthLabels: months };
  }, [commits]);

  const getColor = (count) => {
    if (count === 0) return 'rgba(99,102,241,0.06)';
    const intensity = count / maxCount;
    if (intensity < 0.25) return 'rgba(99,102,241,0.2)';
    if (intensity < 0.5) return 'rgba(99,102,241,0.4)';
    if (intensity < 0.75) return 'rgba(139,92,246,0.6)';
    return 'rgba(168,85,247,0.85)';
  };

  const weeks = Math.ceil(grid.length / 7);

  return (
    <div>
      {/* Month labels */}
      <div style={{ display: 'flex', marginBottom: 4, paddingLeft: 28 }}>
        {Array.from({ length: weeks }).map((_, wi) => {
          const label = monthLabels.find((m) => m.col === wi);
          return (
            <span key={wi} style={{
              width: 14, marginRight: 3,
              fontSize: 10, color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              textAlign: 'center',
            }}>
              {label?.label || ''}
            </span>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: 3 }}>
        {/* Day labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginRight: 4 }}>
          {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
            <span key={i} style={{
              fontSize: 9, color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              height: 11, lineHeight: '11px',
              width: 22, textAlign: 'right',
            }}>
              {d}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateRows: 'repeat(7, 11px)',
          gridAutoFlow: 'column',
          gap: 3,
        }}>
          {grid.map((cell, i) => (
            <div
              key={i}
              title={`${cell.date}: ${cell.count} commit${cell.count !== 1 ? 's' : ''}`}
              style={{
                width: 11,
                height: 11,
                borderRadius: 2,
                background: getColor(cell.count),
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                cursor: 'default',
                animation: `fadeIn 0.3s ease ${i * 3}ms both`,
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.6)';
                e.target.style.boxShadow = '0 0 8px rgba(99,102,241,0.4)';
                e.target.style.zIndex = 10;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
                e.target.style.zIndex = 0;
              }}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4,
        marginTop: 10, paddingLeft: 28,
      }}>
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginRight: 4 }}>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
          <div key={i} style={{
            width: 11, height: 11, borderRadius: 2,
            background: v === 0
              ? 'rgba(99,102,241,0.06)'
              : v < 0.5
                ? `rgba(99,102,241,${0.15 + v * 0.5})`
                : `rgba(139,92,246,${0.3 + v * 0.55})`,
          }} />
        ))}
        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginLeft: 4 }}>More</span>
      </div>
    </div>
  );
}
