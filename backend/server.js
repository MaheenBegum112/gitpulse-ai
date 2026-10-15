import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import http from "node:http";

const GITHUB_API = "https://api.github.com";
const HTTP_PORT = process.env.PORT || 3001;

// ── Helper: fetch with error handling ────────────────────────────
async function ghFetch(path) {
  const res = await axios.get(`${GITHUB_API}${path}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });
  return res.data;
}

function clamp(val, min = 0, max = 100) {
  return Math.round(Math.max(min, Math.min(max, val)));
}

// ── Health Score Algorithm ───────────────────────────────────────
function computeHealthScore({ repoInfo, commits, contributors, languages, pulls, releases }) {
  const now = new Date();
  const factors = {};

  // Commit Frequency (25%)
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const recentCommits = commits.filter(c => new Date(c.commit?.author?.date) > thirtyDaysAgo);
  factors.commitFrequency = { score: clamp(recentCommits.length * 3.3), weight: 0.25, label: "Commit Frequency" };

  // Contributor Diversity (20%)
  const total = contributors.reduce((s, c) => s + (c.contributions || 0), 0) || 1;
  const topPct = ((contributors[0]?.contributions || 0) / total) * 100;
  const divRaw = contributors.length <= 1 ? 25 : contributors.length <= 2 ? 45 : 100 - Math.max(0, topPct - 25) * 0.9;
  factors.contributorDiversity = { score: clamp(divRaw), weight: 0.20, label: "Contributor Diversity" };

  // Issue Health (15%)
  const open = repoInfo?.open_issues_count || 0;
  const issueRaw = open === 0 ? 92 : open < 10 ? 85 : open < 50 ? 70 : open < 200 ? 55 : 35;
  factors.issueHealth = { score: clamp(issueRaw), weight: 0.15, label: "Issue Management" };

  // PR Activity (15%)
  const closedPRs = pulls.filter(p => p.state === "closed");
  const prRatio = pulls.length > 0 ? (closedPRs.length / pulls.length) * 100 : 50;
  factors.prActivity = { score: clamp(pulls.length === 0 ? 50 : prRatio * 0.85 + 15), weight: 0.15, label: "PR Review Culture" };

  // Documentation (10%)
  let docRaw = 20;
  if (repoInfo?.description?.length > 10) docRaw += 22;
  if (repoInfo?.license) docRaw += 22;
  if (repoInfo?.has_wiki) docRaw += 12;
  if (repoInfo?.has_pages) docRaw += 12;
  if (repoInfo?.topics?.length) docRaw += 12;
  factors.documentation = { score: clamp(docRaw), weight: 0.10, label: "Documentation" };

  // Community (10%)
  const stars = repoInfo?.stargazers_count || 0;
  const forks = repoInfo?.forks_count || 0;
  factors.community = { score: clamp(Math.log10(stars + forks * 2 + 1) * 22), weight: 0.10, label: "Community Engagement" };

  // Maturity (5%)
  const langCount = Object.keys(languages).length;
  const ageYears = (now - new Date(repoInfo?.created_at)) / (365.25 * 24 * 60 * 60 * 1000);
  factors.maturity = { score: clamp(langCount * 10 + Math.min(40, ageYears * 8) + (releases?.length || 0) * 5), weight: 0.05, label: "Codebase Maturity" };

  const overall = Math.round(Object.values(factors).reduce((s, f) => s + f.score * f.weight, 0));
  const grade = overall >= 90 ? "A+" : overall >= 85 ? "A" : overall >= 80 ? "A-" : overall >= 75 ? "B+" : overall >= 70 ? "B" : overall >= 65 ? "B-" : overall >= 60 ? "C+" : overall >= 55 ? "C" : overall >= 50 ? "C-" : overall >= 40 ? "D" : "F";

  return { overall, grade, factors };
}

// ── AWS Well-Architected 5-Pillar Audit ───────────────────────────
function computeAwsAudit({ repoInfo, commits, languages, pulls }) {
  let opScore = Math.min(100, 50 + (repoInfo?.has_wiki ? 10 : 0) + (commits.length > 20 ? 20 : 5) + (pulls.length > 5 ? 20 : 5));
  let secScore = Math.min(100, 45 + (repoInfo?.license ? 30 : 0) + (repoInfo?.open_issues_count < 25 ? 25 : 5));
  let relScore = Math.min(100, 45 + (commits.length > 40 ? 30 : 10) + (repoInfo?.forks_count > 10 ? 25 : 5));
  const langKeys = Object.keys(languages).map(l => l.toLowerCase());
  let perfScore = langKeys.includes("rust") || langKeys.includes("go") ? 95 : langKeys.includes("typescript") ? 85 : 75;
  let costScore = langKeys.includes("python") || langKeys.includes("javascript") ? 90 : 80;

  const overall = Math.round((opScore + secScore + relScore + perfScore + costScore) / 5);
  return {
    overallReadiness: overall,
    tier: overall >= 85 ? "AWS Serverless (Lambda + API Gateway)" : overall >= 70 ? "AWS App Runner / ECS Fargate" : "AWS Elastic Beanstalk",
    pillars: {
      operationalExcellence: opScore,
      security: secScore,
      reliability: relScore,
      performanceEfficiency: perfScore,
      costSustainability: costScore,
    },
  };
}

// ══════════════════════════════════════════════════════════════════
// 1. Tool Definitions
// ══════════════════════════════════════════════════════════════════
const TOOLS_DEFINITIONS = [
  {
    name: "analyze-repo-health",
    description: "Perform comprehensive health analysis of a public GitHub repository, computing multi-factor health score and predictive intelligence.",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string", description: "GitHub username or organization (e.g. 'facebook')" },
        repo: { type: "string", description: "Repository name (e.g. 'react')" },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "get-repo-languages",
    description: "Get the language breakdown for a GitHub repository.",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string" },
        repo: { type: "string" },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "get-contributor-stats",
    description: "Get contributor statistics including commit counts and distribution analysis.",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string" },
        repo: { type: "string" },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "compare-repos",
    description: "Compare health scores of two GitHub repositories side by side.",
    inputSchema: {
      type: "object",
      properties: {
        ownerA: { type: "string" },
        repoA: { type: "string" },
        ownerB: { type: "string" },
        repoB: { type: "string" },
      },
      required: ["ownerA", "repoA", "ownerB", "repoB"],
    },
  },
  {
    name: "aws-well-architected-audit",
    description: "Audit repository against AWS Well-Architected 5 Pillars and produce Amazon Bedrock recommendations.",
    inputSchema: {
      type: "object",
      properties: {
        owner: { type: "string" },
        repo: { type: "string" },
      },
      required: ["owner", "repo"],
    },
  },
];

// ══════════════════════════════════════════════════════════════════
// 2. Core Execution Engine
// ══════════════════════════════════════════════════════════════════
async function executeTool(name, args) {
  if (name === "analyze-repo-health") {
    const [repoInfo, commits, contributors, languages, pulls, releases] = await Promise.all([
      ghFetch(`/repos/${args.owner}/${args.repo}`),
      ghFetch(`/repos/${args.owner}/${args.repo}/commits?per_page=100`),
      ghFetch(`/repos/${args.owner}/${args.repo}/contributors?per_page=50`),
      ghFetch(`/repos/${args.owner}/${args.repo}/languages`),
      ghFetch(`/repos/${args.owner}/${args.repo}/pulls?state=all&per_page=50`),
      ghFetch(`/repos/${args.owner}/${args.repo}/releases?per_page=10`).catch(() => []),
    ]);

    const data = { repoInfo, commits, contributors, languages, pulls, releases };
    const score = computeHealthScore(data);

    const report = [
      `═══ GitPulse AI Health Report ═══`,
      `Repository: ${args.owner}/${args.repo}`,
      `Overall Score: ${score.overall}/100 (Grade: ${score.grade})`,
      ``,
      `── Score Breakdown ──`,
      ...Object.values(score.factors).map(f => `  ${f.label}: ${f.score}/100 (${Math.round(f.weight * 100)}% weight)`),
      ``,
      `── Key Metrics ──`,
      `  Stars: ${repoInfo.stargazers_count?.toLocaleString()}`,
      `  Forks: ${repoInfo.forks_count?.toLocaleString()}`,
      `  Open Issues: ${repoInfo.open_issues_count}`,
      `  Contributors: ${contributors.length}`,
      `  Languages: ${Object.keys(languages).join(", ")}`,
      `  License: ${repoInfo.license?.spdx_id || "None"}`,
      `  Last Push: ${repoInfo.pushed_at}`,
    ].join("\n");

    return { content: [{ type: "text", text: report }], score, raw: { stars: repoInfo.stargazers_count, forks: repoInfo.forks_count } };
  }

  if (name === "get-repo-languages") {
    const langs = await ghFetch(`/repos/${args.owner}/${args.repo}/languages`);
    const total = Object.values(langs).reduce((s, v) => s + v, 0) || 1;
    const breakdown = Object.entries(langs)
      .sort((a, b) => b[1] - a[1])
      .map(([lang, bytes]) => `  ${lang}: ${((bytes / total) * 100).toFixed(1)}%`)
      .join("\n");
    return { content: [{ type: "text", text: `Language Breakdown for ${args.owner}/${args.repo}:\n${breakdown}` }] };
  }

  if (name === "get-contributor-stats") {
    const contributors = await ghFetch(`/repos/${args.owner}/${args.repo}/contributors?per_page=20`);
    const total = contributors.reduce((s, c) => s + c.contributions, 0) || 1;
    const lines = contributors.map((c, i) =>
      `  ${i + 1}. ${c.login} — ${c.contributions} commits (${((c.contributions / total) * 100).toFixed(1)}%)`
    );
    return { content: [{ type: "text", text: `Top Contributors for ${args.owner}/${args.repo}:\n${lines.join("\n")}` }] };
  }

  if (name === "compare-repos") {
    const fetchAll = async (o, r) => {
      const [repoInfo, commits, contributors, languages, pulls, releases] = await Promise.all([
        ghFetch(`/repos/${o}/${r}`),
        ghFetch(`/repos/${o}/${r}/commits?per_page=100`),
        ghFetch(`/repos/${o}/${r}/contributors?per_page=50`),
        ghFetch(`/repos/${o}/${r}/languages`),
        ghFetch(`/repos/${o}/${r}/pulls?state=all&per_page=50`),
        ghFetch(`/repos/${o}/${r}/releases?per_page=10`).catch(() => []),
      ]);
      return { repoInfo, commits, contributors, languages, pulls, releases };
    };

    const [dataA, dataB] = await Promise.all([
      fetchAll(args.ownerA, args.repoA),
      fetchAll(args.ownerB, args.repoB),
    ]);

    const scoreA = computeHealthScore(dataA);
    const scoreB = computeHealthScore(dataB);
    const nameA = `${args.ownerA}/${args.repoA}`;
    const nameB = `${args.ownerB}/${args.repoB}`;

    const report = [
      `═══ GitPulse AI — Repository Comparison ═══`,
      ``,
      `${nameA}: ${scoreA.overall}/100 (${scoreA.grade})`,
      `${nameB}: ${scoreB.overall}/100 (${scoreB.grade})`,
      ``,
      `Winner: ${scoreA.overall > scoreB.overall ? nameA : scoreB.overall > scoreA.overall ? nameB : "Tie"} 🏆`,
    ].join("\n");

    return { content: [{ type: "text", text: report }], scoreA, scoreB };
  }

  if (name === "aws-well-architected-audit") {
    const [repoInfo, commits, languages, pulls] = await Promise.all([
      ghFetch(`/repos/${args.owner}/${args.repo}`),
      ghFetch(`/repos/${args.owner}/${args.repo}/commits?per_page=50`),
      ghFetch(`/repos/${args.owner}/${args.repo}/languages`),
      ghFetch(`/repos/${args.owner}/${args.repo}/pulls?state=all&per_page=30`),
    ]);

    const audit = computeAwsAudit({ repoInfo, commits, languages, pulls });
    const text = [
      `═══ Amazon Bedrock / AWS Well-Architected Audit ═══`,
      `Repository: ${args.owner}/${args.repo}`,
      `AWS Cloud Readiness: ${audit.overallReadiness}/100`,
      `Target Topology: ${audit.tier}`,
      `── 5 Pillars ──`,
      `  Operational Excellence: ${audit.pillars.operationalExcellence}%`,
      `  Security: ${audit.pillars.security}%`,
      `  Reliability: ${audit.pillars.reliability}%`,
      `  Performance Efficiency: ${audit.pillars.performanceEfficiency}%`,
      `  Cost & Sustainability: ${audit.pillars.costSustainability}%`,
    ].join("\n");

    return { content: [{ type: "text", text }], audit };
  }

  throw new Error(`Unknown tool: ${name}`);
}

// ══════════════════════════════════════════════════════════════════
// 3. Stdio MCP Server Setup
// ══════════════════════════════════════════════════════════════════
const mcpServer = new Server(
  { name: "gitpulse-mcp-server", version: "2.0.0" },
  { capabilities: { tools: {} } }
);

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS_DEFINITIONS,
}));

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const result = await executeTool(name, args || {});
    return result;
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

// ══════════════════════════════════════════════════════════════════
// 4. HTTP Gateway Server for Frontend & Browser Apps
// ══════════════════════════════════════════════════════════════════
function startHttpGateway() {
  const httpServer = http.createServer(async (req, res) => {
    // Enable CORS for all local dev origins
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "GET" && (url.pathname === "/health" || url.pathname === "/api/health")) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", protocol: "mcp", version: "2.0.0", port: HTTP_PORT }));
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/mcp/tools") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ jsonrpc: "2.0", result: { tools: TOOLS_DEFINITIONS } }));
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/mcp/call") {
      let body = "";
      req.on("data", chunk => { body += chunk; });
      req.on("end", async () => {
        try {
          const parsed = JSON.parse(body || "{}");
          const toolName = parsed.params?.name || parsed.name;
          const toolArgs = parsed.params?.arguments || parsed.arguments || {};
          const result = await executeTool(toolName, toolArgs);

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            jsonrpc: "2.0",
            id: parsed.id || `res_${Date.now()}`,
            result,
          }));
        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({
            jsonrpc: "2.0",
            id: null,
            error: { code: -32603, message: err.message },
          }));
        }
      });
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Endpoint not found" }));
  });

  httpServer.listen(HTTP_PORT, () => {
    // Only log if not in stdio piping mode to avoid breaking stdio JSON-RPC
    if (!process.stdin.isTTY && process.env.MCP_QUIET) return;
    console.error(`[GitPulse AI] MCP HTTP Gateway listening on http://localhost:${HTTP_PORT}`);
  });
}

// ══════════════════════════════════════════════════════════════════
// 5. Initialize Both Transports
// ══════════════════════════════════════════════════════════════════
async function main() {
  // Always start HTTP gateway
  startHttpGateway();

  // Connect stdio transport if invoked as an MCP client subagent
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});