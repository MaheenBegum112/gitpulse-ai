import { useState } from 'react';
import AnimatedBackground from './AnimatedBackground';

const POPULAR_REPOS = [
  { label: 'React', value: 'facebook/react' },
  { label: 'Vue', value: 'vuejs/core' },
  { label: 'Next.js', value: 'vercel/next.js' },
  { label: 'AWS CDK', value: 'aws/aws-cdk' },
  { label: 'Rust', value: 'rust-lang/rust' },
  { label: 'VS Code', value: 'microsoft/vscode' },
];

const FEATURE_CARDS = [
  {
    icon: '🧠',
    title: 'Multi-Factor Health Engine',
    desc: '7-factor weighted algorithm analyzing commit cadence, issue resolution, PR velocity & bus factor.',
  },
  {
    icon: '☁️',
    title: 'Amazon Bedrock Architecture Audit',
    desc: 'AWS Well-Architected 5 Pillars review with automated serverless & container cloud deployment roadmaps.',
  },
  {
    icon: '🔮',
    title: 'Predictive Intelligence',
    desc: 'AI-driven abandonment risk detection, maintainer fatigue indicators, and contribution momentum scoring.',
  },
  {
    icon: '⚡',
    title: 'Model Context Protocol (MCP)',
    desc: 'Native JSON-RPC 2.0 tool execution complying with the Anthropic & Linux Foundation MCP standard.',
  },
];

export default function HomeView({ onAnalyze, history, onQuickSearch, onCompare, onOpenMcpInspector }) {
  const [inputVal, setInputVal] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onAnalyze(inputVal);
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <AnimatedBackground />

      {/* Top Navbar */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 1100,
          margin: '0 auto',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>⚡</span>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em', color: 'var(--text-bright)' }}>
            GitPulse <span style={{ color: 'var(--accent-indigo)' }}>AI</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onCompare}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-indigo)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            🆚 Compare Repos
          </button>

          <button
            onClick={onOpenMcpInspector}
            style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.25)',
              color: 'var(--accent-indigo)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>⚡</span> MCP Inspector
          </button>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 840,
          margin: '0 auto',
          padding: '30px 24px 80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Amazon Hackathon & MCP Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            background: 'rgba(255,153,0,0.08)',
            border: '1px solid rgba(255,153,0,0.25)',
            borderRadius: 'var(--radius-full)',
            marginBottom: 20,
            animation: 'fadeInUp 0.5s ease both',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#f59e0b',
              animation: 'dotPulse 2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#f59e0b',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.05em',
            }}
          >
            AMAZON BEDROCK & MODEL CONTEXT PROTOCOL (MCP)
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            textAlign: 'center',
            marginBottom: 16,
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            letterSpacing: '-0.03em',
            animation: 'fadeInUp 0.6s ease 0.1s both',
          }}
        >
          Intelligent Codebase Intelligence <br />
          <span className="gradient-text">& Cloud Architecture</span>
        </h1>

        <p
          style={{
            textAlign: 'center',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-secondary)',
            maxWidth: 620,
            lineHeight: 1.6,
            marginBottom: 36,
            animation: 'fadeInUp 0.6s ease 0.2s both',
          }}
        >
          Instant multi-factor repository health scoring, predictive maintenance risk detection, and{' '}
          <strong style={{ color: 'var(--text-bright)' }}>AWS Well-Architected Cloud Readiness</strong> audits powered by Amazon Bedrock & Model Context Protocol.
        </p>

        {/* Search form */}
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            maxWidth: 680,
            animation: 'fadeInUp 0.6s ease 0.3s both',
          }}
        >
          <div
            style={{
              position: 'relative',
              background: focused ? 'var(--bg-card-hover)' : 'var(--bg-card)',
              border: `1px solid ${focused ? 'var(--accent-indigo)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: '6px',
              transition: 'all 0.3s ease',
              boxShadow: focused ? 'var(--shadow-glow-strong)' : 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div
                style={{
                  padding: '12px 14px',
                  color: 'var(--text-muted)',
                  fontSize: 18,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                🔍
              </div>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Paste GitHub URL or type owner/repo (e.g. facebook/react)"
                style={{
                  flex: 1,
                  padding: '14px 8px',
                  fontSize: 15,
                  fontFamily: 'var(--font-sans)',
                  background: 'transparent',
                  color: 'var(--text-bright)',
                  border: 'none',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  background: 'var(--gradient-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Analyze Repo
              </button>
            </div>
          </div>
        </form>

        {/* Popular repos */}
        <div
          style={{
            marginTop: 24,
            animation: 'fadeInUp 0.6s ease 0.4s both',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
              marginRight: 10,
            }}
          >
            POPULAR BENCHMARKS:
          </span>
          <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
            {POPULAR_REPOS.map((r) => (
              <button
                key={r.value}
                onClick={() => onAnalyze(r.value)}
                style={{
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: 'var(--font-sans)',
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-indigo)';
                  e.currentTarget.style.color = 'var(--accent-indigo)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent searches */}
        {history.length > 0 && (
          <div
            style={{
              marginTop: 20,
              animation: 'fadeIn 0.4s ease both',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                marginRight: 8,
              }}
            >
              RECENT:
            </span>
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6 }}>
              {history.map((item) => (
                <button
                  key={item}
                  onClick={() => onQuickSearch(item)}
                  style={{
                    padding: '4px 10px',
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    background: 'rgba(139,92,246,0.06)',
                    border: '1px solid rgba(139,92,246,0.15)',
                    color: 'var(--accent-violet)',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
            marginTop: 64,
            width: '100%',
            animation: 'fadeInUp 0.6s ease 0.5s both',
          }}
        >
          {FEATURE_CARDS.map((card, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                padding: 22,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ fontSize: 24 }}>{card.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-bright)' }}>{card.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{card.desc}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p
          style={{
            marginTop: 56,
            fontSize: 11,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            textAlign: 'center',
          }}
        >
          GitPulse AI • Amazon Developer Hackathon 2026 • Model Context Protocol SDK • React + Vite
        </p>
      </div>
    </div>
  );
}