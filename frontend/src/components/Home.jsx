import { useState } from 'react';

const FEATURES = [
  {
    icon: '📊',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Analyze Your Repository',
    description:
      'Get a complete health report for any public GitHub repository. GitPulse AI analyzes development activity, contributors, issues, documentation, and more.',
    points: [
      'Repository health score and grade',
      'Commit and contributor analytics',
      'Codebase maturity insights',
    ],
    button: 'Analyze Repository',
    buttonColor: 'text-blue-600',
  },
  {
    icon: '☁️',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'AWS Architecture Audit',
    description:
      'Understand how ready your repository is for production cloud deployment with an AWS-focused architecture and readiness analysis.',
    points: [
      'AWS Well-Architected scorecard',
      'Cloud deployment recommendations',
      'Amazon Bedrock architecture insights',
    ],
    button: 'Explore AWS Audit',
    buttonColor: 'text-purple-600',
  },
  {
    icon: '⚡',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    title: 'MCP-Powered Intelligence',
    description:
      'GitPulse AI uses Model Context Protocol to connect repository data with intelligent analysis and provide actionable engineering insights.',
    points: [
      'Live MCP server telemetry',
      'Repository intelligence pipeline',
      'Interactive AI architecture advisor',
    ],
    button: 'View MCP Tools',
    buttonColor: 'text-emerald-600',
  },
];

export default function Home({
  onAnalyze,
  onOpenMcpInspector,
}) {
  const [repo, setRepo] = useState('');

  const handleAnalyze = () => {
    const value = repo.trim();

    if (!value) return;

    onAnalyze?.(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-xl text-white shadow-md">
              ⚡
            </div>

            <div>
              <div className="text-xl font-extrabold tracking-tight text-blue-600">
                GitPulse AI
              </div>
              <div className="hidden text-[10px] font-medium tracking-widest text-slate-400 sm:block">
                REPOSITORY INTELLIGENCE
              </div>
            </div>
          </button>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <button
              onClick={() =>
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
              className="border-b-2 border-blue-600 py-7 text-sm font-semibold text-blue-600"
            >
              Home
            </button>

            <button
              onClick={() =>
                document
                  .getElementById('features')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="py-7 text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Features
            </button>

            <button
              onClick={() =>
                document
                  .getElementById('how-it-works')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="py-7 text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              How It Works
            </button>

            <button
              onClick={onOpenMcpInspector}
              className="py-7 text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              MCP Inspector
            </button>
          </nav>

          {/* Header button */}
          <button
            onClick={() =>
              document
                .getElementById('analyze')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
          >
            Analyze Repo →
          </button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-white">

        {/* Background decorations */}
        <div className="pointer-events-none absolute left-[-100px] top-[-100px] h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="pointer-events-none absolute right-[-100px] top-20 h-80 w-80 rounded-full bg-purple-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-20">

          <div className="mx-auto max-w-4xl text-center">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700">
              <span>⚡</span>
              AI-POWERED GITHUB REPOSITORY ANALYTICS
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Understand Your
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Repository Better
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              GitPulse AI analyzes GitHub repositories and transforms raw
              development data into meaningful health scores, predictive
              insights, AWS architecture recommendations, and AI-powered
              engineering guidance.
            </p>

            {/* Repository Search */}
            <div
              id="analyze"
              className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                  🔗
                </span>

                <input
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter GitHub repo e.g. facebook/react"
                  className="h-14 w-full rounded-xl border border-slate-300 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!repo.trim()}
                className="h-14 rounded-xl bg-blue-600 px-7 text-sm font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Analyze Repository
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Try: facebook/react · vuejs/core · vercel/next.js · aws/aws-cdk
            </p>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:grid-cols-4">
            <Stat value="8+" label="Health Factors" />
            <Stat value="5" label="AWS Pillars" />
            <Stat value="90" label="Days Analytics" />
            <Stat value="MCP" label="Powered Pipeline" />
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-600">
              What GitPulse AI Does
            </p>

            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Everything you need to understand a repository
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
              From development activity to cloud architecture, get a complete
              picture of your project's health and future readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                onClick={() => {
                  if (feature.title.includes('Analyze')) {
                    document
                      .getElementById('analyze')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  } else if (feature.title.includes('MCP')) {
                    onOpenMcpInspector?.();
                  } else {
                    document
                      .getElementById('how-it-works')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="border-y border-slate-200 bg-slate-50 py-20"
      >
        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-600">
              Simple Workflow
            </p>

            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              From GitHub URL to actionable insights
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">

            <Step
              number="01"
              icon="🔗"
              title="Connect"
              text="Enter any public GitHub repository."
            />

            <Step
              number="02"
              icon="⚡"
              title="MCP Pipeline"
              text="GitPulse retrieves repository data through MCP tools."
            />

            <Step
              number="03"
              icon="🧠"
              title="Analyze"
              text="Health metrics and predictive intelligence are generated."
            />

            <Step
              number="04"
              icon="☁️"
              title="Improve"
              text="Get AWS and Bedrock architecture recommendations."
            />

          </div>
        </div>
      </section>

      {/* ================= ANALYTICS PREVIEW ================= */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-blue-600">
                Repository Intelligence
              </p>

              <h2 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
                Turn repository activity into a clear health score
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                GitPulse AI evaluates multiple signals from your repository
                and presents them in an easy-to-understand dashboard.
              </p>

              <div className="mt-7 space-y-4">

                <Check text="Commit frequency and development momentum" />
                <Check text="Contributor diversity and project dependency" />
                <Check text="Issue and pull request management" />
                <Check text="Documentation and codebase maturity" />
                <Check text="Community engagement and repository activity" />

              </div>

              <button
                onClick={() =>
                  document
                    .getElementById('analyze')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
              >
                Analyze a Repository →
              </button>
            </div>

            {/* Dashboard mockup */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">
                    REPOSITORY HEALTH
                  </div>

                  <div className="mt-1 text-lg font-bold text-slate-900">
                    facebook/react
                  </div>
                </div>

                <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                  Grade A
                </div>
              </div>

              <div className="flex items-center gap-7">

                <div className="relative flex h-40 w-40 shrink-0 items-center justify-center rounded-full border-[12px] border-blue-100">
                  <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-r-blue-600 border-t-blue-500 rotate-45" />

                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-slate-900">
                      92
                    </div>
                    <div className="text-xs text-slate-400">
                      / 100
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-4">

                  <ScoreBar
                    label="Commit Frequency"
                    value={92}
                  />

                  <ScoreBar
                    label="Contributor Diversity"
                    value={88}
                  />

                  <ScoreBar
                    label="Issue Management"
                    value={95}
                  />

                  <ScoreBar
                    label="Documentation"
                    value={86}
                  />

                </div>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3">
                <MiniStat value="2.1k" label="Contributors" />
                <MiniStat value="320k" label="Stars" />
                <MiniStat value="24k" label="Forks" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center text-white">

          <div className="mb-4 text-4xl">⚡</div>

          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to analyze your repository?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
            Enter a public GitHub repository and let GitPulse AI turn your
            repository data into meaningful engineering insights.
          </p>

          <button
            onClick={() =>
              document
                .getElementById('analyze')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
            className="mt-7 rounded-lg bg-white px-7 py-3 text-sm font-bold text-blue-600 shadow-lg transition hover:bg-blue-50"
          >
            Analyze Repository →
          </button>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-7 sm:flex-row">

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm text-white">
              ⚡
            </div>

            <span className="font-bold text-slate-800">
              GitPulse AI
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Powered by Model Context Protocol • Amazon Bedrock Architecture
          </p>

          <button
            onClick={onOpenMcpInspector}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            MCP Inspector →
          </button>

        </div>
      </footer>

    </div>
  );
}


/* ============================================================
   COMPONENTS
============================================================ */

function Stat({ value, label }) {
  return (
    <div className="border-b border-slate-100 p-5 text-center last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div className="text-2xl font-extrabold text-slate-900">
        {value}
      </div>

      <div className="mt-1 text-xs font-medium text-slate-400">
        {label}
      </div>
    </div>
  );
}


function FeatureCard({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  points,
  button,
  buttonColor,
  onClick,
}) {
  return (
    <div className="group flex min-h-[430px] flex-col rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div
        className={`mb-7 flex h-14 w-14 items-center justify-center rounded-xl ${iconBg} text-2xl ${iconColor}`}
      >
        {icon}
      </div>

      <h3 className="text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        {description}
      </p>

      <div className="mt-6 space-y-4">
        {points.map((point) => (
          <div
            key={point}
            className="flex items-start gap-3 text-sm text-slate-600"
          >
            <span className="mt-0.5 font-bold text-emerald-500">
              ✓
            </span>

            <span>{point}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onClick}
        className={`mt-auto pt-7 text-left text-sm font-bold ${buttonColor} transition hover:opacity-70`}
      >
        {button} →
      </button>

    </div>
  );
}


function Step({ number, icon, title, text }) {
  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-7 shadow-sm">

      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-xl">
          {icon}
        </div>

        <span className="font-mono text-xs font-bold text-slate-300">
          {number}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>

    </div>
  );
}


function Check({ text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
        ✓
      </span>

      <span className="text-sm text-slate-600">
        {text}
      </span>
    </div>
  );
}


function ScoreBar({ label, value }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="font-medium text-slate-600">
          {label}
        </span>

        <span className="font-bold text-blue-600">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}


function MiniStat({ value, label }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center">
      <div className="text-sm font-bold text-slate-900">
        {value}
      </div>

      <div className="mt-1 text-[10px] text-slate-400">
        {label}
      </div>
    </div>
  );
}