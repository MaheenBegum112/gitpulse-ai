import { useMemo } from 'react';

const containerStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: -1,
  overflow: 'hidden',
  pointerEvents: 'none',
};

const orbBase = {
  position: 'absolute',
  borderRadius: '50%',
  opacity: 0.18,
};

const orbs = [
  {
    width: 700, height: 700,
    background: 'radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)',
    top: '-15%', left: '-10%',
    animation: 'float1 25s ease-in-out infinite',
  },
  {
    width: 500, height: 500,
    background: 'radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)',
    top: '50%', right: '-8%',
    animation: 'float2 30s ease-in-out infinite',
  },
  {
    width: 400, height: 400,
    background: 'radial-gradient(circle, rgba(168,85,247,0.3), transparent 70%)',
    bottom: '-5%', left: '30%',
    animation: 'float3 22s ease-in-out infinite',
  },
];

const gridOverlayStyle = {
  position: 'absolute',
  inset: 0,
  backgroundImage: `
    linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)
  `,
  backgroundSize: '60px 60px',
};

const vignetteStyle = {
  position: 'absolute',
  inset: 0,
  background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(6,6,11,0.6) 100%)',
};

export default function AnimatedBackground() {
  const orbElements = useMemo(
    () =>
      orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            ...orbBase,
            width: orb.width,
            height: orb.height,
            background: orb.background,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            animation: orb.animation,
            filter: 'blur(60px)',
          }}
        />
      )),
    []
  );

  return (
    <div style={containerStyle}>
      {orbElements}
      <div style={gridOverlayStyle} />
      <div style={vignetteStyle} />
    </div>
  );
}
