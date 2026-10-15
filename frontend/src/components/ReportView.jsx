import { useState } from 'react';
import AnimatedBackground from './AnimatedBackground';
import HealthScoreRing from './HealthScoreRing';
import CommitHeatmap from './CommitHeatmap';
import ContributorChart from './ContributorChart';
import LanguageBreakdown from './LanguageBreakdown';
import InsightCards from './InsightCards';
import TerminalLogs from './TerminalLogs';
import ExportButton from './ExportButton';
import SkeletonLoader from './SkeletonLoader';
import AwsBedrockAdvisor from './AwsBedrockAdvisor';

const POPULAR_REPOS = [
  { label: 'React', value: 'facebook/react' },
  { label: 'Vue', value: 'vuejs/core' },
  { label: 'Next.js', value: 'vercel/next.js' },
  { label: 'AWS CDK', value: 'aws/aws-cdk' },
];

export default function ReportView({
  targetRepo,
  data,
  loading,
  logs,
  onBack,
  onAnalyze,
  onOpenMcpInspector,
}) {
  const [activeTab, setActiveTab] = useState('health'); // 'health' | 'bedrock' | 'logs'

  // Loading State
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <AnimatedBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Loading header */}
          <div style={{ maxWidth: 1040, margin: '0 auto', padding: '40px 24px 0' }}>
            <button
              onClick={onBack}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: 13,
                fontFamily: 'var(--font-sans)',
                marginBottom: 24,
              }}
            >
              ← Back
            </button>

            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 24px',
                  background: 'rgba(99,102,241,0.06)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    border: '2px solid var(--accent-indigo)',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                <span
                  style={{
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  Analyzing {targetRepo} via MCP & Amazon Bedrock pipeline...
                </span>
              </div>
            </div>
          </div>

          <SkeletonLoader />

          {/* Show terminal logs during loading */}
          <div style={{ maxWidth: 1040, margin: '0 auto', padding: '0 24px 40px' }}>
            <TerminalLogs logs={logs} />
          </div>
        </div>
      </div>
    );
  }

  // Graceful Empty State (e.g. direct load or no repo selected)
  if (!data) {
    return (
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <AnimatedBackground />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 680,
            margin: '0 auto',
            padding: '80px 24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <h2 style={{ fontSize: 24, marginBottom: 12, color: 'var(--text-bright)' }}>
            No Analysis Selected
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
            Select a repository from our popular benchmarks or return home to search for any public GitHub project.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
            {POPULAR_REPOS.map((r) => (
              <button
                key={r.value}
                onClick={() => onAnalyze && onAnalyze(r.value)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-bright)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  fontSize: 13,
                  transition: 'border-color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-indigo)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                ⚡ {r.label}
              </button>
            ))}
          </div>

          <button
            onClick={onBack}
            style={{
              background: 'var(--gradient-primary)',
              border: 'none',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ← Back to Search
          </button>
        </div>
      </div>
    );
  }

  const { healthScore, grade, factors, predictions, auditData, rawData } = data;

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <AnimatedBackground />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1040,
          margin: '0 auto',
          padding: '40px 24px 60px',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
            flexWrap: 'wrap',
            gap: 12,
            animation: 'fadeInUp 0.4s ease both',
          }}
        >
          <button
            onClick={onBack}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: 13,
              fontFamily: 'var(--font-sans)',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            ← Back to Search
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={onOpenMcpInspector}
              style={{
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.25)',
                color: 'var(--accent-indigo)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>⚡</span> MCP Inspector
            </button>

            <ExportButton
              repoName={targetRepo}
              healthScore={healthScore}
              grade={grade}
              factors={factors}
              predictions={predictions}
              repoInfo={rawData?.repoInfo}
            />
          </div>
        </div>

        {/* Report header */}
        <div
          style={{
            marginBottom: 28,
            animation: 'fadeInUp 0.4s ease 0.1s both',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
            <h1 style={{ margin: 0 }}>
              <span className="gradient-text">{targetRepo}</span>
            </h1>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                background: healthScore >= 80 ? 'rgba(16,185,129,0.12)' : healthScore >= 60 ? 'rgba(99,102,241,0.12)' : 'rgba(239,68,68,0.12)',
                color: healthScore >= 80 ? '#10b981' : healthScore >= 60 ? '#818cf8' : '#ef4444',
                border: `1px solid ${healthScore >= 80 ? '#10b981' : healthScore >= 60 ? '#818cf8' : '#ef4444'}40`,
              }}
            >
              Grade {grade} ({healthScore}/100)
            </span>
          </div>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 13,
              fontFamily: 'var(--font-mono)',
              margin: '4px 0 0',
            }}
          >
            Model Context Protocol Pipeline • Amazon Bedrock Architecture Auditor
          </p>
          {rawData?.repoInfo?.description && (
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: 14,
                marginTop: 10,
                maxWidth: 720,
                lineHeight: 1.5,
              }}
            >
              {rawData.repoInfo.description}
            </p>
          )}
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 28,
            borderBottom: '1px solid var(--border)',
            paddingBottom: 4,
          }}
        >
          {[
            { id: 'health', label: '📊 Health & Analytics', icon: '📊' },
            { id: 'bedrock', label: '☁️ Amazon Bedrock & AWS Audit', icon: '☁️' },
            { id: 'logs', label: '📟 MCP Server Telemetry', icon: '📟' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                background: activeTab === tab.id ? 'rgba(99,102,241,0.12)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent-indigo)' : '2px solid transparent',
                borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                color: activeTab === tab.id ? 'var(--text-bright)' : 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: HEALTH & ANALYTICS ─────────────────────── */}
        {activeTab === 'health' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Health Score + Factor Breakdown */}
            <div
              className="glass-card-static"
              style={{
                padding: 32,
                display: 'flex',
                gap: 40,
                alignItems: 'center',
                flexWrap: 'wrap',
                animation: 'fadeInUp 0.4s ease both',
              }}
            >
              <HealthScoreRing score={healthScore} grade={grade} size={200} strokeWidth={10} />

              <div style={{ flex: 1, minWidth: 280 }}>
                <h3 style={{ marginBottom: 16, fontSize: 18 }}>Health Score Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {factors &&
                    Object.values(factors).map((f, i) => (
                      <div key={f.label} style={{ animation: `fadeInUp 0.3s ease ${i * 40}ms both` }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: 4,
                          }}
                        >
                          <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                            {f.icon} {f.label}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              fontFamily: 'var(--font-mono)',
                              color: f.score >= 75 ? '#10b981' : f.score >= 50 ? '#f59e0b' : '#ef4444',
                              fontWeight: 600,
                            }}
                          >
                            {f.score}
                          </span>
                        </div>
                        <div
                          style={{
                            height: 5,
                            borderRadius: 3,
                            background: 'rgba(99,102,241,0.08)',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              borderRadius: 3,
                              width: `${f.score}%`,
                              background:
                                f.score >= 75
                                  ? 'linear-gradient(90deg, #10b981, #6366f1)'
                                  : f.score >= 50
                                  ? 'linear-gradient(90deg, #f59e0b, #f97316)'
                                  : 'linear-gradient(90deg, #ef4444, #f97316)',
                              transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: 11,
                            color: 'var(--text-muted)',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {f.detail}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            {rawData?.repoInfo && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: 12,
                }}
              >
                {[
                  { label: 'Stars', value: rawData.repoInfo.stargazers_count?.toLocaleString(), icon: '⭐' },
                  { label: 'Forks', value: rawData.repoInfo.forks_count?.toLocaleString(), icon: '🍴' },
                  { label: 'Open Issues', value: rawData.repoInfo.open_issues_count?.toLocaleString(), icon: '🐛' },
                  { label: 'Contributors', value: rawData.contributors?.length, icon: '👥' },
                  { label: 'Languages', value: Object.keys(rawData.languages || {}).length, icon: '💻' },
                  { label: 'Releases', value: rawData.releases?.length || 0, icon: '📦' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="glass-card-static"
                    style={{ padding: '16px 18px', textAlign: 'center' }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--text-bright)',
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Predictive Insights */}
            {predictions?.length > 0 && (
              <div>
                <h2 style={{ marginBottom: 16, fontSize: 18 }}>
                  🔮 <span className="gradient-text">Predictive Intelligence</span>
                </h2>
                <InsightCards predictions={predictions} />
              </div>
            )}

            {/* Visualizations Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                gap: 20,
              }}
            >
              {/* Commit Heatmap */}
              <div className="glass-card-static" style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 16, fontSize: 16 }}>📅 Commit Activity (90 days)</h3>
                <CommitHeatmap commits={rawData?.commits || []} />
              </div>

              {/* Contributors */}
              <div className="glass-card-static" style={{ padding: 24 }}>
                <h3 style={{ marginBottom: 16, fontSize: 16 }}>👥 Top Contributors</h3>
                <ContributorChart contributors={rawData?.contributors || []} />
              </div>
            </div>

            {/* Language Breakdown */}
            <div className="glass-card-static" style={{ padding: 24 }}>
              <h3 style={{ marginBottom: 16, fontSize: 16 }}>💻 Language Breakdown</h3>
              <LanguageBreakdown languages={rawData?.languages || {}} />
            </div>
          </div>
        )}

        {/* ── TAB 2: AMAZON BEDROCK & AWS AUDIT ─────────────── */}
        {activeTab === 'bedrock' && (
          <AwsBedrockAdvisor
            auditData={auditData}
            repoInfo={rawData?.repoInfo}
            healthScore={healthScore}
          />
        )}

        {/* ── TAB 3: MCP PROTOCOL STREAM ────────────────────── */}
        {activeTab === 'logs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 18 }}>
                🖥️ <span className="gradient-text">Model Context Protocol Live Stream</span>
              </h2>
              <button
                onClick={onOpenMcpInspector}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  color: 'var(--accent-indigo)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Inspect Tools & JSON-RPC Frames →
              </button>
            </div>
            <TerminalLogs logs={logs} />
          </div>
        )}
      </div>
    </div>
  );
}