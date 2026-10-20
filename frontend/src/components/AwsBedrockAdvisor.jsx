import { useState } from 'react';

const SUGGESTED_QUERIES = [
  'How do I deploy this repo to AWS Lambda or ECS?',
  'What are the biggest architectural bottlenecks?',
  'How can I integrate Amazon Bedrock LLMs into this project?',
  'What security improvements are needed for production?',
];

export default function AwsBedrockAdvisor({
  auditData,
  repoInfo,
  healthScore,
}) {
  const [userQuery, setUserQuery] = useState('');
  const [qaHistory, setQaHistory] = useState([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  if (!auditData) return null;

  const {
    overallReadiness,
    deploymentTier,
    pillars,
    bedrockSummary,
    bedrockModel,
  } = auditData;

  const handleAskBedrock = (queryText) => {
    const q = (queryText || userQuery).trim();

    if (!q) return;

    setIsSynthesizing(true);
    setUserQuery('');

    setTimeout(() => {
      let answer = '';
      const lower = q.toLowerCase();
      const repoName =
        repoInfo?.full_name || 'this repository';

      if (
        lower.includes('deploy') ||
        lower.includes('lambda') ||
        lower.includes('ecs')
      ) {
        answer =
          `🚀 **AWS Deployment Roadmap for ${repoName}**:\n\n` +
          `1. **Containerize**: Use a multi-stage Dockerfile optimized for AWS Graviton4 processors to reduce compute costs by 20%.\n` +
          `2. **Compute Service**: Recommended: **${deploymentTier}**. For web microservices, AWS App Runner provides zero-config HTTPS and automatic scaling.\n` +
          `3. **CI/CD Pipeline**: Deploy via **AWS CodePipeline** with GitHub webhook triggers, running automated vulnerability checks using Amazon Inspector.\n` +
          `4. **State & Database**: If stateful, pair with Amazon Aurora Serverless v2 or DynamoDB with on-demand capacity.`;
      } else if (
        lower.includes('bottleneck') ||
        lower.includes('performance') ||
        lower.includes('scale')
      ) {
        answer =
          `⚡ **Architectural & Scalability Analysis**:\n\n` +
          `• **Health Score Context**: Currently scoring ${healthScore}/100. Key area to optimize is commit frequency and caching.\n` +
          `• **Edge Optimization**: Place an **Amazon CloudFront** distribution in front of static assets and API routes to absorb spike traffic and lower latency worldwide.\n` +
          `• **Distributed Caching**: Introduce **Amazon ElastiCache (Redis)** for hot data queries to relieve database load.\n` +
          `• **Async Offloading**: For intensive workloads, decouple using **Amazon SQS** queues and trigger background AWS Lambda workers.`;
      } else if (
        lower.includes('bedrock') ||
        lower.includes('llm') ||
        lower.includes('ai')
      ) {
        answer =
          `🧠 **Amazon Bedrock GenAI Integration Architecture**:\n\n` +
          `• **Model Selection**: Connect **anthropic.claude-3-5-sonnet-20241022-v2:0** or **amazon.nova-pro-v1:0** via AWS Bedrock Converse API.\n` +
          `• **MCP Integration**: GitPulse AI's Model Context Protocol server can register Bedrock knowledge bases as standard MCP resource providers.\n` +
          `• **RAG Pipeline**: Use **Amazon Bedrock Knowledge Bases** backed by OpenSearch Serverless to index issues, docs, and pull requests for real-time repo querying.\n` +
          `• **Guardrails**: Implement **Amazon Bedrock Guardrails** to enforce safety, PII redaction, and deterministic policy checks.`;
      } else {
        answer =
          `🛡️ **Production Security & Architecture Recommendations**:\n\n` +
          `• **Secrets Management**: Never commit API keys or credentials. Inject runtime secrets using **AWS Secrets Manager**.\n` +
          `• **Least Privilege**: Configure fine-grained IAM roles using **AWS IAM Identity Center** and IAM Roles for Service Accounts (IRSA).\n` +
          `• **Observability**: Send logs and telemetry to **Amazon CloudWatch Container Insights** and AWS X-Ray for distributed tracing.`;
      }

      setQaHistory((prev) => [
        ...prev,
        {
          query: q,
          answer,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      setIsSynthesizing(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-7">

      {/* =====================================================
          BEDROCK HEADER
      ====================================================== */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-7 shadow-sm">

        <div className="flex flex-wrap items-start justify-between gap-4">

          <div>
            {/* Badge */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1">
              <span className="text-xs">☁️</span>

              <span className="font-mono text-[11px] font-bold tracking-wider text-amber-700">
                AMAZON BEDROCK ARCHITECT AUDIT
              </span>
            </div>

            {/* Heading */}
            <h2 className="mb-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              AWS Well-Architected & Cloud Readiness
            </h2>

            {/* Description */}
            <p className="max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm">
              {bedrockSummary}
            </p>
          </div>

          {/* AWS Readiness */}
          <div className="min-w-[150px] rounded-xl border border-blue-200 bg-white px-6 py-4 text-center shadow-sm">

            <div className="font-mono text-[11px] tracking-wider text-slate-500">
              AWS READINESS
            </div>

            <div
              className={`my-1 text-3xl font-extrabold sm:text-4xl ${
                overallReadiness >= 80
                  ? 'text-emerald-600'
                  : overallReadiness >= 65
                  ? 'text-blue-600'
                  : 'text-amber-600'
              }`}
            >
              {overallReadiness}%
            </div>

            <div className="text-[11px] text-slate-500">
              5-Pillar Alignment
            </div>

          </div>
        </div>

        {/* Model & Tier */}
        <div className="mt-5 flex flex-wrap gap-4 border-t border-blue-100 pt-4 text-xs text-slate-600">

          <div>
            <span className="text-slate-500">
              Target Architecture:{' '}
            </span>

            <strong className="text-cyan-700">
              {deploymentTier}
            </strong>
          </div>

          <div>
            <span className="text-slate-500">
              Bedrock Engine:{' '}
            </span>

            <code className="rounded bg-blue-50 px-2 py-0.5 font-mono text-[11px] text-purple-700">
              {bedrockModel}
            </code>
          </div>

        </div>
      </div>


      {/* =====================================================
          5 PILLARS
      ====================================================== */}
      <div>

        <h3 className="mb-4 text-base font-bold text-slate-900">
          🏛️ AWS 5-Pillar Scorecard
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">

          {Object.entries(pillars).map(([key, pillar]) => (

            <div
              key={key}
              className="flex flex-col justify-between rounded-xl border border-blue-100 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
            >

              <div>

                <div className="mb-2.5 flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <span className="text-lg">
                      {pillar.icon}
                    </span>

                    <span className="text-sm font-semibold text-slate-800">
                      {pillar.name}
                    </span>

                  </div>

                  <span
                    className={`font-mono text-xs font-bold ${
                      pillar.score >= 80
                        ? 'text-emerald-600'
                        : pillar.score >= 60
                        ? 'text-blue-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {pillar.score}%
                  </span>

                </div>


                {/* Progress bar */}
                <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">

                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      pillar.score >= 80
                        ? 'bg-emerald-500'
                        : pillar.score >= 60
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                    }`}
                    style={{
                      width: `${pillar.score}%`,
                    }}
                  />

                </div>


                {/* Recommendation */}
                <p className="text-xs leading-relaxed text-slate-600">
                  {pillar.recommendation}
                </p>

              </div>


              {/* AWS Service */}
              <div className="mt-3.5 border-t border-slate-100 pt-2.5 font-mono text-[11px] text-cyan-700">
                📍 {pillar.awsService}
              </div>

            </div>

          ))}

        </div>
      </div>


      {/* =====================================================
          ASK BEDROCK
      ====================================================== */}
      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">

        {/* Header */}
        <div className="mb-4 flex items-center gap-2.5">

          <span className="text-xl">
            💬
          </span>

          <div>

            <h3 className="text-sm font-bold text-slate-900 sm:text-base">
              Ask Amazon Bedrock AI Advisor
            </h3>

            <p className="text-xs text-slate-500">
              Interactive repository architecture consultation powered by Bedrock inference
            </p>

          </div>

        </div>


        {/* Suggested Queries */}
        <div className="mb-4 flex flex-wrap gap-2">

          {SUGGESTED_QUERIES.map((q, i) => (

            <button
              key={i}
              onClick={() => handleAskBedrock(q)}
              disabled={isSynthesizing}
              className="cursor-pointer rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs text-blue-700 transition-all hover:border-blue-400 hover:bg-blue-100 hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              💡 {q}
            </button>

          ))}

        </div>


        {/* Input */}
        <div
          className={`flex gap-2.5 ${
            qaHistory.length ? 'mb-5' : ''
          }`}
        >

          <input
            type="text"
            value={userQuery}
            onChange={(e) =>
              setUserQuery(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              handleAskBedrock()
            }
            placeholder="Ask Bedrock about architecture, AWS deployment, cost optimization, or scaling..."
            className="flex-1 rounded-lg border border-blue-200 bg-white px-4 py-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:text-sm"
          />

          <button
            onClick={() => handleAskBedrock()}
            disabled={
              isSynthesizing ||
              !userQuery.trim()
            }
            className="cursor-pointer whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-5 py-3 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:from-blue-600 hover:to-cyan-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            {isSynthesizing
              ? 'Synthesizing...'
              : 'Ask Bedrock'}
          </button>

        </div>


        {/* Q&A History */}
        {qaHistory.length > 0 && (

          <div className="flex flex-col gap-3">

            {qaHistory.map((item, idx) => (

              <div
                key={idx}
                className="rounded-xl border border-blue-100 bg-blue-50/50 p-4"
              >

                <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-blue-700">

                  <span>
                    Q: {item.query}
                  </span>

                  <span className="shrink-0 font-mono font-normal text-slate-400">
                    {item.timestamp}
                  </span>

                </div>

                <div className="whitespace-pre-line text-xs leading-relaxed text-slate-700 sm:text-sm">
                  {item.answer}
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}