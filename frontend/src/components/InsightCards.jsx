/**
 * Predictive insight cards with color-coded borders and entrance animations.
 */

const typeStyles = {
  danger: {
    border: 'rgba(239,68,68,0.3)',
    bg: 'rgba(239,68,68,0.05)',
    badge: '#ef4444',
    badgeBg: 'rgba(239,68,68,0.15)',
    label: 'HIGH RISK',
  },
  warning: {
    border: 'rgba(245,158,11,0.3)',
    bg: 'rgba(245,158,11,0.05)',
    badge: '#f59e0b',
    badgeBg: 'rgba(245,158,11,0.15)',
    label: 'ATTENTION',
  },
  positive: {
    border: 'rgba(16,185,129,0.3)',
    bg: 'rgba(16,185,129,0.05)',
    badge: '#10b981',
    badgeBg: 'rgba(16,185,129,0.15)',
    label: 'HEALTHY',
  },
  insight: {
    border: 'rgba(59,130,246,0.3)',
    bg: 'rgba(59,130,246,0.05)',
    badge: '#3b82f6',
    badgeBg: 'rgba(59,130,246,0.15)',
    label: 'INSIGHT',
  },
};

export default function InsightCards({ predictions = [] }) {
  if (predictions.length === 0) return null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 16,
    }}>
      {predictions.map((p, i) => {
        const style = typeStyles[p.type] || typeStyles.insight;
        return (
          <div
            key={i}
            style={{
              background: style.bg,
              border: `1px solid ${style.border}`,
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              animation: `fadeInUp 0.4s ease ${i * 80}ms both`,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${style.border}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 12,
            }}>
              <span style={{ fontSize: 26 }}>{p.icon}</span>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.1em',
                color: style.badge,
                background: style.badgeBg,
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--font-mono)',
              }}>
                {style.label}
              </span>
            </div>
            <h4 style={{
              fontSize: 15, fontWeight: 600,
              color: 'var(--text-bright)',
              margin: '0 0 6px 0',
              fontFamily: 'var(--font-heading)',
            }}>
              {p.title}
            </h4>
            <p style={{
              fontSize: 13, lineHeight: 1.5,
              color: 'var(--text-secondary)',
              margin: 0,
            }}>
              {p.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
