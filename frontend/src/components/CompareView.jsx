import { useState } from 'react';
import { fetchRepoData } from '../utils/githubApi';
import { calculateHealthScore } from '../utils/healthScore';
import HealthScoreRing from './HealthScoreRing';
import AnimatedBackground from './AnimatedBackground';

/**
 * Side-by-side repository comparison view.
 */
export default function CompareView({ onBack }) {
  const [repoA, setRepoA] = useState('');
  const [repoB, setRepoB] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const parse = (input) => {
    let clean = input.trim().replace(/\/$/, '').replace(/\.git$/, '');
    if (clean.includes('github.com')) {
      const parts = clean.split('/');
      const idx = parts.findIndex((p) => p.toLowerCase() === 'github.com');
      if (idx !== -1 && parts.length > idx + 2) return { owner: parts[idx + 1], repo: parts[idx + 2] };
    }
    if (clean.includes('/')) {
      const [owner, repo] = clean.split('/');
      if (owner && repo) return { owner, repo };
    }
    return null;
  };

  const handleCompare = async () => {
    const a = parse(repoA);
    const b = parse(repoB);
    if (!a || !b) {
      setError('Please enter valid owner/repo for both fields.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const [dataA, dataB] = await Promise.all([
        fetchRepoData(a.owner, a.repo),
        fetchRepoData(b.owner, b.repo),
      ]);
      const scoreA = calculateHealthScore(dataA);
      const scoreB = calculateHealthScore(dataB);
      setResults({
        a: { name: `${a.owner}/${a.repo}`, data: dataA, score: scoreA },
        b: { name: `${b.owner}/${b.repo}`, data: dataB, score: scoreB },
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch one or both repositories.');
    } finally {
      setLoading(false);
    }
  };

  const factorKeys = results
    ? Object.keys(results.a.score.factors)
    : [];

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <AnimatedBackground />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button
            onClick={onBack}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              color: 'var(--text-primary)', padding: '8px 16px',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              fontSize: 13, fontFamily: 'var(--font-sans)',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', margin: 0 }}>
            <span className="gradient-text">Compare</span> Repositories
          </h1>
        </div>

        {/* Input section */}
        <div className="glass-card-static" style={{ padding: 28, marginBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>
                REPOSITORY A
              </label>
              <input
                value={repoA}
                onChange={(e) => setRepoA(e.target.value)}
                placeholder="e.g. facebook/react"
                style={{
                  width: '100%', padding: '12px 16px',
                  fontSize: 14, fontFamily: 'var(--font-sans)',
                  background: 'var(--bg-input)', color: 'var(--text-primary)',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-indigo)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div style={{
              fontSize: 22, fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--accent-violet)',
              padding: '8px 16px',
              background: 'rgba(139,92,246,0.08)',
              borderRadius: 'var(--radius-sm)',
              alignSelf: 'end', marginBottom: 2,
            }}>
              VS
            </div>

            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: 6 }}>
                REPOSITORY B
              </label>
              <input
                value={repoB}
                onChange={(e) => setRepoB(e.target.value)}
                placeholder="e.g. vuejs/core"
                style={{
                  width: '100%', padding: '12px 16px',
                  fontSize: 14, fontFamily: 'var(--font-sans)',
                  background: 'var(--bg-input)', color: 'var(--text-primary)',
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                  outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-indigo)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: 13, marginTop: 12 }}>{error}</p>}

          <button
            onClick={handleCompare}
            disabled={loading || !repoA || !repoB}
            style={{
              marginTop: 20, width: '100%', padding: '14px',
              fontSize: 15, fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              background: loading ? 'var(--bg-tertiary)' : 'var(--accent-gradient)',
              color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)',
              cursor: loading ? 'wait' : 'pointer',
              transition: 'opacity 0.2s ease',
              opacity: (!repoA || !repoB) ? 0.5 : 1,
            }}
          >
            {loading ? '⏳ Analyzing Both Repositories...' : '⚡ Compare Repositories'}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div style={{ animation: 'fadeInUp 0.5s ease' }}>
            {/* Score comparison */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr auto 1fr',
              gap: 24, alignItems: 'center', marginBottom: 32,
            }}>
              {/* Repo A */}
              <div className="glass-card-static" style={{ padding: 28, textAlign: 'center' }}>
                <h3 style={{ fontSize: 16, marginBottom: 16, color: 'var(--accent-cyan)' }}>{results.a.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <HealthScoreRing score={results.a.score.overall} grade={results.a.score.grade} size={160} strokeWidth={8} />
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
                  ⭐ {results.a.data.repoInfo?.stargazers_count?.toLocaleString()} · 🍴 {results.a.data.repoInfo?.forks_count?.toLocaleString()}
                </p>
              </div>

              {/* VS badge */}
              <div style={{
                fontSize: 28, fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                background: 'var(--accent-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'pulse 2s ease-in-out infinite',
              }}>
                VS
              </div>

              {/* Repo B */}
              <div className="glass-card-static" style={{ padding: 28, textAlign: 'center' }}>
                <h3 style={{ fontSize: 16, marginBottom: 16, color: 'var(--accent-cyan)' }}>{results.b.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <HealthScoreRing score={results.b.score.overall} grade={results.b.score.grade} size={160} strokeWidth={8} />
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
                  ⭐ {results.b.data.repoInfo?.stargazers_count?.toLocaleString()} · 🍴 {results.b.data.repoInfo?.forks_count?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Factor-by-factor comparison */}
            <div className="glass-card-static" style={{ padding: 28 }}>
              <h3 style={{ marginBottom: 20, fontSize: 18 }}>Factor-by-Factor Comparison</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {factorKeys.map((key, i) => {
                  const fA = results.a.score.factors[key];
                  const fB = results.b.score.factors[key];
                  const winner = fA.score > fB.score ? 'a' : fB.score > fA.score ? 'b' : 'tie';
                  return (
                    <div
                      key={key}
                      style={{
                        animation: `fadeInUp 0.3s ease ${i * 60}ms both`,
                      }}
                    >
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        marginBottom: 6,
                      }}>
                        <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                          {fA.icon} {fA.label}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {Math.round(fA.weight * 100)}% weight
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {/* A bar */}
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between', marginBottom: 3,
                          }}>
                            <span style={{
                              fontSize: 11, fontFamily: 'var(--font-mono)',
                              color: winner === 'a' ? '#10b981' : 'var(--text-muted)',
                              fontWeight: winner === 'a' ? 700 : 400,
                            }}>
                              {fA.score} {winner === 'a' ? '🏆' : ''}
                            </span>
                          </div>
                          <div style={{ height: 6, borderRadius: 3, background: 'rgba(99,102,241,0.08)' }}>
                            <div style={{
                              height: '100%', borderRadius: 3, width: `${fA.score}%`,
                              background: winner === 'a'
                                ? 'linear-gradient(90deg, #6366f1, #10b981)'
                                : 'var(--accent-indigo)',
                              transition: 'width 0.8s ease',
                            }} />
                          </div>
                        </div>
                        {/* B bar */}
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex', justifyContent: 'flex-end', marginBottom: 3,
                          }}>
                            <span style={{
                              fontSize: 11, fontFamily: 'var(--font-mono)',
                              color: winner === 'b' ? '#10b981' : 'var(--text-muted)',
                              fontWeight: winner === 'b' ? 700 : 400,
                            }}>
                              {winner === 'b' ? '🏆 ' : ''}{fB.score}
                            </span>
                          </div>
                          <div style={{ height: 6, borderRadius: 3, background: 'rgba(99,102,241,0.08)' }}>
                            <div style={{
                              height: '100%', borderRadius: 3, width: `${fB.score}%`,
                              background: winner === 'b'
                                ? 'linear-gradient(90deg, #a855f7, #10b981)'
                                : 'var(--accent-violet)',
                              transition: 'width 0.8s ease',
                              marginLeft: 'auto',
                            }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Overall winner */}
              {results && (
                <div style={{
                  marginTop: 28, padding: '16px 20px',
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                }}>
                  <span style={{ fontSize: 14, color: '#10b981', fontWeight: 600 }}>
                    🏆 Overall Winner:{' '}
                    <span style={{ color: 'var(--text-bright)', fontWeight: 700 }}>
                      {results.a.score.overall > results.b.score.overall
                        ? results.a.name
                        : results.b.score.overall > results.a.score.overall
                          ? results.b.name
                          : "It's a tie!"}
                    </span>
                    {results.a.score.overall !== results.b.score.overall && (
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                        {' '}({Math.abs(results.a.score.overall - results.b.score.overall)} points ahead)
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
