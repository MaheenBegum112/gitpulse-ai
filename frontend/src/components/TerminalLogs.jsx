import { useEffect, useRef } from 'react';

/**
 * Stylized terminal log viewer with typewriter entrance and auto-scroll.
 */
export default function TerminalLogs({ logs = [] }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div style={{
      background: 'rgba(2,6,23,0.9)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
    }}>
      {/* Title bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 16px',
        background: 'rgba(15,15,25,0.6)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
          </div>
          <span style={{
            fontSize: 12, color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)', marginLeft: 8,
          }}>
            gitpulse-mcp-server
          </span>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
          color: '#10b981',
          background: 'rgba(16,185,129,0.12)',
          padding: '2px 10px',
          borderRadius: 'var(--radius-full)',
          fontFamily: 'var(--font-mono)',
          animation: 'pulse 2s ease-in-out infinite',
        }}>
          ● LIVE
        </span>
      </div>

      {/* Log lines */}
      <div
        ref={containerRef}
        style={{
          padding: '14px 16px',
          maxHeight: 220,
          overflowY: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          lineHeight: 1.7,
        }}
      >
        {logs.map((log, i) => {
          const isError = log.toLowerCase().includes('error');
          const isSuccess = log.includes('✓') || log.toLowerCase().includes('success') || log.toLowerCase().includes('fetched');
          const isMcp = log.includes('[MCP]');

          let color = 'var(--text-muted)';
          if (isError) color = '#ef4444';
          else if (isSuccess) color = '#10b981';
          else if (isMcp) color = '#22d3ee';

          return (
            <div
              key={i}
              style={{
                color,
                animation: `typewriter 0.25s ease ${i * 120}ms both`,
                display: 'flex',
                gap: 8,
              }}
            >
              <span style={{ color: 'var(--text-muted)', opacity: 0.4, userSelect: 'none' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>{log}</span>
            </div>
          );
        })}

        {/* Blinking cursor */}
        <span style={{
          display: 'inline-block',
          width: 7, height: 14,
          background: '#10b981',
          animation: 'blink 1s step-end infinite',
          marginTop: 4,
          marginLeft: 24,
          borderRadius: 1,
        }} />
      </div>
    </div>
  );
}
