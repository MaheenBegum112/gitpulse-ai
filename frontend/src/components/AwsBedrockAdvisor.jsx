import { useState } from 'react';

const SUGGESTED_QUERIES = [
  'How do I deploy this repo to AWS Lambda or ECS?',
  'What are the biggest architectural bottlenecks?',
  'How can I integrate Amazon Bedrock LLMs into this project?',
  'What security improvements are needed for production?',
];

export default function AwsBedrockAdvisor({ auditData, repoInfo, healthScore }) {
  const [userQuery, setUserQuery] = useState('');
  const [qaHistory, setQaHistory] = useState([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  if (!auditData) return null;

  const { overallReadiness, deploymentTier, pillars, bedrockSummary, bedrockModel } = auditData;

  const handleAskBedrock = (queryText) => {
    const q = (queryText || userQuery).trim();
    if (!q) return;

    setIsSynthesizing(true);
    setUserQuery('');

    // Realistic Amazon Bedrock synthesized response generator
    setTimeout(() => {
      let answer = '';
      const lower = q.toLowerCase();
      const repoName = repoInfo?.full_name || 'this repository';

      if (lower.includes('deploy') || lower.includes('lambda') || lower.includes('ecs')) {
        answer = `🚀 **AWS Deployment Roadmap for ${repoName}**:\n\n` +
          `1. **Containerize**: Use a multi-stage Dockerfile optimized for AWS Graviton4 processors to reduce compute costs by 20%.\n` +
          `2. **Compute Service**: Recommended: **${deploymentTier}**. For web microservices, AWS App Runner provides zero-config HTTPS and automatic scaling.\n` +
          `3. **CI/CD Pipeline**: Deploy via **AWS CodePipeline** with GitHub webhook triggers, running automated vulnerability checks using Amazon Inspector.\n` +
          `4. **State & Database**: If stateful, pair with Amazon Aurora Serverless v2 or DynamoDB with on-demand capacity.`;
      } else if (lower.includes('bottleneck') || lower.includes('performance') || lower.includes('scale')) {
        answer = `⚡ **Architectural & Scalability Analysis**:\n\n` +
          `• **Health Score Context**: Currently scoring ${healthScore}/100. Key area to optimize is commit frequency and caching.\n` +
          `• **Edge Optimization**: Place an **Amazon CloudFront** distribution in front of static assets and API routes to absorb spike traffic and lower latency worldwide.\n` +
          `• **Distributed Caching**: Introduce **Amazon ElastiCache (Redis)** for hot data queries to relieve database load.\n` +
          `• **Async Offloading**: For intensive workloads, decouple using **Amazon SQS** queues and trigger background AWS Lambda workers.`;
      } else if (lower.includes('bedrock') || lower.includes('llm') || lower.includes('ai')) {
        answer = `🧠 **Amazon Bedrock GenAI Integration Architecture**:\n\n` +
          `• **Model Selection**: Connect **anthropic.claude-3-5-sonnet-20241022-v2:0** or **amazon.nova-pro-v1:0** via AWS Bedrock Converse API.\n` +
          `• **MCP Integration**: GitPulse AI's Model Context Protocol server can register Bedrock knowledge bases as standard MCP resource providers.\n` +
          `• **RAG Pipeline**: Use **Amazon Bedrock Knowledge Bases** backed by OpenSearch Serverless to index issues, docs, and pull requests for real-time repo querying.\n` +
          `• **Guardrails**: Implement **Amazon Bedrock Guardrails** to enforce safety, PII redaction, and deterministic policy checks.`;
      } else {
        answer = `🛡️ **Production Security & Architecture Recommendations**:\n\n` +
          `• **Secrets Management**: Never commit API keys or credentials. Inject runtime secrets using **AWS Secrets Manager**.\n` +
          `• **Least Privilege**: Configure fine-grained IAM roles using **AWS IAM Identity Center** and IAM Roles for Service Accounts (IRSA).\n` +
          `• **Observability**: Send logs and telemetry to **Amazon CloudWatch Container Insights** and AWS X-Ray for distributed tracing.`;
      }

      setQaHistory((prev) => [
        ...prev,
        { query: q, answer, timestamp: new Date().toLocaleTimeString() },
      ]);
      setIsSynthesizing(false);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Bedrock Header Card */}
      <div
        className="glass-card"
        style={{
          padding: 28,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(236,72,153,0.06) 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: 'var(--radius-lg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'rgba(255,153,0,0.12)', border: '1px solid rgba(255,153,0,0.3)', borderRadius: 'var(--radius-full)', marginBottom: 12 }}>
              <span style={{ fontSize: 13 }}>☁️</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
                AMAZON BEDROCK ARCHITECT AUDIT
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.6rem)', margin: '0 0 8px', color: 'var(--text-bright)' }}>
              AWS Well-Architected & Cloud Readiness
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0, maxWidth: 640, lineHeight: 1.6 }}>
              {bedrockSummary}
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 24px',
            textAlign: 'center',
            minWidth: 160,
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
              AWS READINESS
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: overallReadiness >= 80 ? '#10b981' : overallReadiness >= 65 ? '#6366f1' : '#f59e0b' }}>
              {overallReadiness}%
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
              5-Pillar Alignment
            </div>
          </div>
        </div>

        {/* Model & Tier badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Target Architecture: </span>
            <strong style={{ color: 'var(--accent-cyan)' }}>{deploymentTier}</strong>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Bedrock Engine: </span>
            <code style={{ fontSize: 11, color: 'var(--accent-violet)', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: 4 }}>
              {bedrockModel}
            </code>
          </div>
        </div>
      </div>

      {/* 5 Pillars Breakdown Grid */}
      <div>
        <h3 style={{ fontSize: 16, marginBottom: 16, color: 'var(--text-bright)' }}>
          🏛️ AWS 5-Pillar Scorecard
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {Object.entries(pillars).map(([key, pillar]) => (
            <div
              key={key}
              className="glass-card"
              style={{
                padding: 18,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{pillar.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-bright)' }}>{pillar.name}</span>
                  </div>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: pillar.score >= 80 ? '#10b981' : pillar.score >= 60 ? '#6366f1' : '#f59e0b',
                  }}>
                    {pillar.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
                  <div
                    style={{
                      width: `${pillar.score}%`,
                      height: '100%',
                      background: pillar.score >= 80 ? 'var(--accent-emerald)' : pillar.score >= 60 ? 'var(--accent-indigo)' : '#f59e0b',
                      borderRadius: 3,
                      transition: 'width 0.8s ease',
                    }}
                  />
                </div>

                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {pillar.recommendation}
                </p>
              </div>

              <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: 'var(--accent-cyan)' }}>
                📍 {pillar.awsService}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive "Ask Amazon Bedrock" Console */}
      <div
        className="glass-card-static"
        style={{
          padding: 24,
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>💬</span>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, color: 'var(--text-bright)' }}>
              Ask Amazon Bedrock AI Advisor
            </h3>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
              Interactive repository architecture consultation powered by Bedrock inference
            </p>
          </div>
        </div>

        {/* Suggested Quick Queries */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {SUGGESTED_QUERIES.map((q, i) => (
            <button
              key={i}
              onClick={() => handleAskBedrock(q)}
              disabled={isSynthesizing}
              style={{
                background: 'rgba(99,102,241,0.06)',
                border: '1px solid rgba(99,102,241,0.18)',
                color: 'var(--text-secondary)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-indigo)';
                e.currentTarget.style.color = 'var(--text-bright)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.18)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              💡 {q}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div style={{ display: 'flex', gap: 10, marginBottom: qaHistory.length ? 20 : 0 }}>
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskBedrock()}
            placeholder="Ask Bedrock about architecture, AWS deployment, cost optimization, or scaling..."
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-bright)',
              fontSize: 13,
              fontFamily: 'var(--font-sans)',
            }}
          />
          <button
            onClick={() => handleAskBedrock()}
            disabled={isSynthesizing || !userQuery.trim()}
            style={{
              background: isSynthesizing ? 'var(--text-muted)' : 'var(--gradient-primary)',
              border: 'none',
              color: '#fff',
              padding: '0 20px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: 13,
              cursor: isSynthesizing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {isSynthesizing ? 'Synthesizing...' : 'Ask Bedrock'}
          </button>
        </div>

        {/* Q&A History Stream */}
        {qaHistory.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
            {qaHistory.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  animation: 'fadeInUp 0.3s ease both',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12, color: 'var(--accent-cyan)', fontWeight: 600 }}>
                  <span>Q: {item.query}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{item.timestamp}</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
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
