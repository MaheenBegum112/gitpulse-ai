import { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('health');

  // =========================================================
  // LOADING STATE
  // =========================================================

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">

        {/* Blue background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-blue-100/70 blur-[130px]" />
          <div className="absolute -bottom-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-100/60 blur-[130px]" />
        </div>

        <div className="relative z-10">
          <div className="mx-auto max-w-5xl px-6 pt-10">

            <button
              onClick={onBack}
              className="mb-6 cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
            >
              ← Back
            </button>

            <div className="mb-8 text-center">

              <div className="inline-flex items-center gap-3 rounded-full border border-blue-200 bg-blue-50 px-6 py-2.5 shadow-sm">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />

                <span className="font-mono text-xs font-medium text-blue-600 sm:text-sm">
                  Analyzing {targetRepo} via MCP & Amazon Bedrock pipeline...
                </span>
              </div>

            </div>
          </div>

          <SkeletonLoader />

          <div className="mx-auto max-w-5xl px-6 pb-12">
            <TerminalLogs logs={logs} />
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // EMPTY STATE
  // =========================================================

  if (!data) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-blue-100/70 blur-[130px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl px-6 py-24 text-center">

          <div className="mb-4 text-5xl">🔍</div>

          <h2 className="mb-3 text-2xl font-bold text-slate-900">
            No Analysis Selected
          </h2>

          <p className="mb-8 text-sm leading-relaxed text-slate-500">
            Select a repository from our popular benchmarks or return home to
            search for any public GitHub project.
          </p>

          <div className="mb-8 flex flex-wrap justify-center gap-2.5">

            {POPULAR_REPOS.map((r) => (
              <button
                key={r.value}
                onClick={() => onAnalyze && onAnalyze(r.value)}
                className="cursor-pointer rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-600 transition-all hover:border-blue-300 hover:bg-blue-100"
              >
                ⚡ {r.label}
              </button>
            ))}

          </div>

          <button
            onClick={onBack}
            className="cursor-pointer rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01]"
          >
            ← Back to Search
          </button>

        </div>
      </div>
    );
  }

  const {
    healthScore,
    grade,
    factors,
    predictions,
    auditData,
    rawData,
  } = data;

  // =========================================================
  // MAIN REPORT
  // =========================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">

      {/* ===================================================== */}
      {/* BLUE BACKGROUND GLOW */}
      {/* ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -top-48 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-blue-100/60 blur-[140px]" />

        <div className="absolute -right-64 top-[35%] h-[500px] w-[500px] rounded-full bg-cyan-100/50 blur-[140px]" />

        <div className="absolute -left-64 bottom-[10%] h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-[140px]" />

      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-16 pt-10">

        {/* ===================================================== */}
        {/* TOP BAR */}
        {/* ===================================================== */}

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">

          <button
            onClick={onBack}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            ← Back to Search
          </button>

          <div className="flex items-center gap-3">

            <button
              onClick={onOpenMcpInspector}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-2 font-mono text-xs font-semibold text-blue-600 shadow-sm transition-all hover:border-blue-400 hover:bg-blue-100 hover:text-blue-700"
            >
              <span>⚡</span>
              MCP Inspector
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

        {/* ===================================================== */}
        {/* REPORT HEADER */}
        {/* ===================================================== */}

        <div className="mb-8">

          <div className="mb-2 flex flex-wrap items-center gap-3">

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">

              <span className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {targetRepo}
              </span>

            </h1>

            <span
              className={`rounded-full border px-3 py-1 font-mono text-xs font-bold ${
                healthScore >= 80
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                  : healthScore >= 60
                  ? 'border-blue-200 bg-blue-50 text-blue-600'
                  : 'border-rose-200 bg-rose-50 text-rose-600'
              }`}
            >
              Grade {grade} ({healthScore}/100)
            </span>

          </div>

          <p className="font-mono text-xs text-slate-400">
            Model Context Protocol Pipeline • Amazon Bedrock Architecture Auditor
          </p>

          {rawData?.repoInfo?.description && (
            <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-slate-500">
              {rawData.repoInfo.description}
            </p>
          )}

        </div>

        {/* ===================================================== */}
        {/* NAVIGATION TABS */}
        {/* ===================================================== */}

        <div className="mb-8 flex gap-2 overflow-x-auto border-b border-blue-100 pb-1">

          {[
            {
              id: 'health',
              label: '📊 Health & Analytics',
            },
            {
              id: 'bedrock',
              label: '☁️ Amazon Bedrock & AWS Audit',
            },
            {
              id: 'logs',
              label: '📟 MCP Server Telemetry',
            },
          ].map((tab) => (

            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer whitespace-nowrap rounded-t-lg px-4 py-2.5 text-xs font-semibold transition-all sm:text-sm ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 bg-blue-50 text-blue-600'
                  : 'text-slate-400 hover:bg-blue-50/50 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>

          ))}

        </div>

        {/* ===================================================== */}
        {/* HEALTH TAB */}
        {/* ===================================================== */}

        {activeTab === 'health' && (
          <div className="flex flex-col gap-6">

            {/* Health Score + Factor Breakdown */}

            <div className="flex flex-wrap items-center gap-8 rounded-2xl border border-blue-100 bg-white p-8 shadow-xl shadow-blue-100/40">

              <HealthScoreRing
                score={healthScore}
                grade={grade}
                size={200}
                strokeWidth={10}
              />

              <div className="min-w-[280px] flex-1">

                <h3 className="mb-4 text-base font-bold text-slate-900 sm:text-lg">
                  Health Score Breakdown
                </h3>

                <div className="flex flex-col gap-3">

                  {factors &&
                    Object.values(factors).map((f) => (

                      <div key={f.label}>

                        <div className="mb-1 flex justify-between text-xs font-medium">

                          <span className="text-slate-700">
                            {f.icon} {f.label}
                          </span>

                          <span
                            className={`font-mono font-bold ${
                              f.score >= 75
                                ? 'text-emerald-500'
                                : f.score >= 50
                                ? 'text-amber-500'
                                : 'text-rose-500'
                            }`}
                          >
                            {f.score}
                          </span>

                        </div>

                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">

                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              f.score >= 75
                                ? 'bg-gradient-to-r from-emerald-400 to-cyan-500'
                                : f.score >= 50
                                ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                                : 'bg-gradient-to-r from-rose-500 to-orange-500'
                            }`}
                            style={{
                              width: `${f.score}%`,
                            }}
                          />

                        </div>

                        <span className="font-mono text-[11px] text-slate-400">
                          {f.detail}
                        </span>

                      </div>

                    ))}

                </div>
              </div>
            </div>

            {/* ================================================= */}
            {/* QUICK STATS */}
            {/* ================================================= */}

            {rawData?.repoInfo && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">

                {[
                  {
                    label: 'Stars',
                    value: rawData.repoInfo.stargazers_count?.toLocaleString(),
                    icon: '⭐',
                  },
                  {
                    label: 'Forks',
                    value: rawData.repoInfo.forks_count?.toLocaleString(),
                    icon: '🍴',
                  },
                  {
                    label: 'Open Issues',
                    value: rawData.repoInfo.open_issues_count?.toLocaleString(),
                    icon: '🐛',
                  },
                  {
                    label: 'Contributors',
                    value: rawData.contributors?.length,
                    icon: '👥',
                  },
                  {
                    label: 'Languages',
                    value: Object.keys(rawData.languages || {}).length,
                    icon: '💻',
                  },
                  {
                    label: 'Releases',
                    value: rawData.releases?.length || 0,
                    icon: '📦',
                  },
                ].map((s) => (

                  <div
                    key={s.label}
                    className="flex flex-col items-center justify-center rounded-xl border border-blue-100 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >

                    <div className="mb-1 text-xl">
                      {s.icon}
                    </div>

                    <div className="text-xl font-bold text-slate-900">
                      {s.value}
                    </div>

                    <div className="font-mono text-[11px] tracking-wider text-slate-400">
                      {s.label}
                    </div>

                  </div>

                ))}

              </div>
            )}

            {/* ================================================= */}
            {/* PREDICTIVE INSIGHTS */}
            {/* ================================================= */}

            {predictions?.length > 0 && (
              <div>

                <h2 className="mb-4 text-lg font-bold text-slate-900">

                  🔮{' '}

                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    Predictive Intelligence
                  </span>

                </h2>

                <InsightCards predictions={predictions} />

              </div>
            )}

            {/* ================================================= */}
            {/* VISUALIZATIONS */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">

                <h3 className="mb-4 text-sm font-bold text-slate-900">
                  📅 Commit Activity (90 days)
                </h3>

                <CommitHeatmap commits={rawData?.commits || []} />

              </div>

              <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">

                <h3 className="mb-4 text-sm font-bold text-slate-900">
                  👥 Top Contributors
                </h3>

                <ContributorChart
                  contributors={rawData?.contributors || []}
                />

              </div>

            </div>

            {/* ================================================= */}
            {/* LANGUAGE BREAKDOWN */}
            {/* ================================================= */}

            <div className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm">

              <h3 className="mb-4 text-sm font-bold text-slate-900">
                💻 Language Breakdown
              </h3>

              <LanguageBreakdown
                languages={rawData?.languages || {}}
              />

            </div>

          </div>
        )}

        {/* ===================================================== */}
        {/* BEDROCK TAB */}
        {/* ===================================================== */}

        {activeTab === 'bedrock' && (
          <AwsBedrockAdvisor
            auditData={auditData}
            repoInfo={rawData?.repoInfo}
            healthScore={healthScore}
          />
        )}

        {/* ===================================================== */}
        {/* MCP LOGS TAB */}
        {/* ===================================================== */}

        {activeTab === 'logs' && (
          <div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

              <h2 className="text-lg font-bold text-slate-900">

                🖥️{' '}

                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Model Context Protocol Live Stream
                </span>

              </h2>

              <button
                onClick={onOpenMcpInspector}
                className="cursor-pointer rounded-lg border border-blue-200 bg-blue-50 px-3.5 py-1.5 font-mono text-xs font-semibold text-blue-600 transition-all hover:border-blue-400 hover:bg-blue-100"
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