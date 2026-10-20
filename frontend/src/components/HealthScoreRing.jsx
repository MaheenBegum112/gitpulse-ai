import { useState, useEffect, useRef } from 'react';

/**
 * Animated SVG ring that fills to the given score.
 */
export default function HealthScoreRing({
  score = 0,
  grade = '?',
  size = 200,
  strokeWidth = 10,
}) {
  const [displayed, setDisplayed] = useState(0);
  const animRef = useRef(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (displayed / 100) * circumference;

  // Animate score
  useEffect(() => {
    let start = null;
    const duration = 1400;
    const from = 0;
    const to = score;

    function step(ts) {
      if (!start) start = ts;

      const progress = Math.min(
        (ts - start) / duration,
        1
      );

      const eased =
        1 - Math.pow(1 - progress, 3);

      setDisplayed(
        Math.round(from + (to - from) * eased)
      );

      if (progress < 1) {
        animRef.current =
          requestAnimationFrame(step);
      }
    }

    animRef.current =
      requestAnimationFrame(step);

    return () =>
      cancelAnimationFrame(animRef.current);
  }, [score]);

  const getColor = (s) => {
    if (s >= 80) return '#10b981';
    if (s >= 60) return '#f59e0b';
    if (s >= 40) return '#f97316';
    return '#ef4444';
  };

  const color = getColor(score);

  const gradeColors = {
    'A+': '#10b981',
    A: '#10b981',
    'A-': '#34d399',

    'B+': '#f59e0b',
    B: '#f59e0b',
    'B-': '#fbbf24',

    'C+': '#f97316',
    C: '#f97316',
    'C-': '#fb923c',

    D: '#ef4444',
    F: '#ef4444',
  };

  const gradientId = 'scoreGrad';

  return (
    <div
      className="relative flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stopColor={color}
            />

            <stop
              offset="100%"
              stopColor={
                score >= 80
                  ? '#3b82f6'
                  : color
              }
            />
          </linearGradient>

          <filter id="ringGlow">
            <feGaussianBlur
              stdDeviation="3"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />

        {/* Animated Score Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          filter="url(#ringGlow)"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">

        {/* Score */}
        <span
          className="font-extrabold leading-none text-slate-900"
          style={{
            fontSize: size * 0.24,
          }}
        >
          {displayed}
        </span>

        {/* /100 */}
        <span
          className="mt-1 font-mono font-medium text-slate-500"
          style={{
            fontSize: size * 0.09,
          }}
        >
          / 100
        </span>

        {/* Grade */}
        <span
          className="mt-2 rounded-md border px-2.5 py-0.5 font-bold tracking-wider"
          style={{
            fontSize: size * 0.12,
            color:
              gradeColors[grade] || '#3b82f6',
            backgroundColor: '#f8fafc',
            borderColor:
              gradeColors[grade] || '#3b82f6',
          }}
        >
          {grade}
        </span>

      </div>
    </div>
  );
}