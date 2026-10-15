/**
 * Skeleton loading placeholder with shimmer animation.
 */

const shimmerBg = `linear-gradient(
  90deg,
  rgba(99,102,241,0.04) 0%,
  rgba(99,102,241,0.1) 50%,
  rgba(99,102,241,0.04) 100%
)`;

function Bar({ width = '100%', height = 16, radius = 8, style = {} }) {
  return (
    <div style={{
      width,
      height,
      borderRadius: radius,
      background: shimmerBg,
      backgroundSize: '400% 100%',
      animation: 'shimmer 1.8s ease-in-out infinite',
      ...style,
    }} />
  );
}

export default function SkeletonLoader() {
  return (
    <div style={{
      maxWidth: 960,
      margin: '0 auto',
      padding: '40px 24px',
      animation: 'fadeIn 0.3s ease',
    }}>
      {/* Header skeleton */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
        <Bar width={120} height={36} />
        <Bar width={200} height={20} />
      </div>

      {/* Score section */}
      <div className="glass-card-static" style={{ padding: 32, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 40 }}>
        <div style={{ width: 180, height: 180, borderRadius: '50%', background: shimmerBg, backgroundSize: '400% 100%', animation: 'shimmer 1.8s ease-in-out infinite', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Bar width="60%" height={24} />
          <Bar width="80%" height={14} />
          <Bar width="45%" height={14} />
          <Bar width="70%" height={14} />
        </div>
      </div>

      {/* Chart cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {[1, 2].map((i) => (
          <div key={i} className="glass-card-static" style={{ padding: 24 }}>
            <Bar width="50%" height={18} style={{ marginBottom: 16 }} />
            <Bar width="100%" height={120} radius={12} />
          </div>
        ))}
      </div>

      {/* Insight cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card-static" style={{ padding: 20 }}>
            <Bar width={32} height={32} radius={8} style={{ marginBottom: 12 }} />
            <Bar width="70%" height={16} style={{ marginBottom: 8 }} />
            <Bar width="100%" height={12} />
            <Bar width="85%" height={12} style={{ marginTop: 4 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
