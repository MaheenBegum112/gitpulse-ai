import { useState, useEffect, useRef } from 'react';

/**
 * Animated SVG ring that fills to the given score with color transitions.
 */
export default function HealthScoreRing({ score = 0, grade = '?', size = 200, strokeWidth = 10 }) {
  const [displayed, setDisplayed] = useState(0);
  const animRef = useRef(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayed / 100) * circumference;

  // Animate the number counting up
  useEffect(() => {
    let start = null;
    const duration = 1400;
    const from = 0;
    const to = score;

    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplayed(Math.round(from + (to - from) * eased));
      if (progress < 1) animRef.current = requestAnimationFrame(step);
    }

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [score]);

  const getColor = (s) => {
    if (s >= 80) return '#10b981';
    if (s >= 60) return '#f59e0b';
    if (s >= 40) return '#f97316';
    return '#ef4444';
  };

  const getGradientId = 'scoreGrad';
  const color = getColor(score);

  const gradeColors = {
    'A+': '#10b981', A: '#10b981', 'A-': '#34d399',
    'B+': '#f59e0b', B: '#f59e0b', 'B-': '#fbbf24',
    'C+': '#f97316', C: '#f97316', 'C-': '#fb923c',
    D: '#ef4444', F: '#ef4444',
  };

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id={getGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={score >= 80 ? '#6366f1' : color} />
          </linearGradient>
          <filter id="ringGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="rgba(99,102,241,0.08)"
          strokeWidth={strokeWidth}
        />

        {/* Animated fill ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={`url(#${getGradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#ringGlow)"
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>

      {/* Center content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: size * 0.24,
          fontWeight: 700,
          color: 'var(--text-bright)',
          lineHeight: 1,
        }}>
          {displayed}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: size * 0.09,
          color: 'var(--text-muted)',
          marginTop: 2,
        }}>
          / 100
        </span>
        <span style={{
          marginTop: 6,
          fontFamily: 'var(--font-heading)',
          fontSize: size * 0.13,
          fontWeight: 700,
          color: gradeColors[grade] || 'var(--text-secondary)',
          background: 'rgba(0,0,0,0.3)',
          padding: '2px 10px',
          borderRadius: 'var(--radius-sm)',
          letterSpacing: '0.05em',
        }}>
          {grade}
        </span>
      </div>
    </div>
  );
}
