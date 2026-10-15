/**
 * GitPulse AI — Health Score Algorithm
 *
 * Computes a weighted score across 7 dimensions:
 *   Commit Frequency (25%) | Contributor Diversity (20%) | Issue Health (15%)
 *   PR Culture (15%) | Documentation (10%) | Community (10%) | Maturity (5%)
 */

function clamp(val, min = 0, max = 100) {
  return Math.round(Math.max(min, Math.min(max, val)));
}

export function calculateHealthScore(data) {
  const { repoInfo, commits, contributors, languages, pulls, releases } = data;
  const now = new Date();
  const factors = {};

  // ── 1. Commit Frequency (25%) ──────────────────────────────
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const recentCommits = commits.filter(
    (c) => new Date(c.commit?.author?.date) > thirtyDaysAgo
  );
  const commitRaw = recentCommits.length * 3.3; // ~30 commits in 30d = 100
  factors.commitFrequency = {
    score: clamp(commitRaw),
    weight: 0.25,
    label: 'Commit Frequency',
    detail: `${recentCommits.length} commits in last 30 days`,
    icon: '📝',
  };

  // ── 2. Contributor Diversity (20%) ─────────────────────────
  const totalContributions = contributors.reduce((s, c) => s + (c.contributions || 0), 0) || 1;
  const topPct = ((contributors[0]?.contributions || 0) / totalContributions) * 100;
  const diversityRaw =
    contributors.length <= 1
      ? 25
      : contributors.length <= 2
        ? 45
        : 100 - Math.max(0, topPct - 25) * 0.9;
  factors.contributorDiversity = {
    score: clamp(diversityRaw),
    weight: 0.2,
    label: 'Contributor Diversity',
    detail: `${contributors.length} contributors — top: ${Math.round(topPct)}%`,
    icon: '👥',
  };

  // ── 3. Issue Health (15%) ──────────────────────────────────
  const openIssues = repoInfo?.open_issues_count || 0;
  let issueRaw = 75;
  if (openIssues === 0) issueRaw = 92;
  else if (openIssues < 10) issueRaw = 85;
  else if (openIssues < 50) issueRaw = 70;
  else if (openIssues < 200) issueRaw = 55;
  else issueRaw = 35;
  factors.issueHealth = {
    score: clamp(issueRaw),
    weight: 0.15,
    label: 'Issue Management',
    detail: `${openIssues} open issues tracked`,
    icon: '🐛',
  };

  // ── 4. PR Review Culture (15%) ────────────────────────────
  const closedPRs = pulls.filter((p) => p.state === 'closed');
  const openPRs = pulls.filter((p) => p.state === 'open');
  const prRatio = pulls.length > 0 ? (closedPRs.length / pulls.length) * 100 : 50;
  const prRaw = pulls.length === 0 ? 50 : prRatio * 0.85 + 15;
  factors.prActivity = {
    score: clamp(prRaw),
    weight: 0.15,
    label: 'PR Review Culture',
    detail: `${closedPRs.length} merged · ${openPRs.length} open`,
    icon: '🔀',
  };

  // ── 5. Documentation (10%) ────────────────────────────────
  let docRaw = 20;
  if (repoInfo?.description && repoInfo.description.length > 10) docRaw += 22;
  if (repoInfo?.license) docRaw += 22;
  if (repoInfo?.has_wiki) docRaw += 12;
  if (repoInfo?.has_pages) docRaw += 12;
  if (repoInfo?.topics?.length > 0) docRaw += 12;
  factors.documentation = {
    score: clamp(docRaw),
    weight: 0.1,
    label: 'Documentation',
    detail: [
      repoInfo?.description ? '✓ Description' : '✗ Description',
      repoInfo?.license ? `✓ ${repoInfo.license.spdx_id}` : '✗ License',
      repoInfo?.topics?.length ? `✓ ${repoInfo.topics.length} topics` : '✗ Topics',
    ].join(' · '),
    icon: '📚',
  };

  // ── 6. Community Engagement (10%) ─────────────────────────
  const stars = repoInfo?.stargazers_count || 0;
  const forks = repoInfo?.forks_count || 0;
  const watchers = repoInfo?.subscribers_count || repoInfo?.watchers_count || 0;
  const engagementRaw = Math.log10(stars + forks * 2 + watchers + 1) * 22;
  factors.communityEngagement = {
    score: clamp(engagementRaw),
    weight: 0.1,
    label: 'Community Engagement',
    detail: `⭐ ${stars.toLocaleString()} · 🍴 ${forks.toLocaleString()} · 👁 ${watchers.toLocaleString()}`,
    icon: '⭐',
  };

  // ── 7. Codebase Maturity (5%) ─────────────────────────────
  const langCount = Object.keys(languages).length;
  const ageYears = (now - new Date(repoInfo?.created_at)) / (365.25 * 24 * 60 * 60 * 1000);
  const releaseCount = releases?.length || 0;
  const maturityRaw = langCount * 10 + Math.min(40, ageYears * 8) + releaseCount * 5;
  factors.codebaseMaturity = {
    score: clamp(maturityRaw),
    weight: 0.05,
    label: 'Codebase Maturity',
    detail: `${langCount} languages · ${ageYears.toFixed(1)}y old · ${releaseCount} releases`,
    icon: '🏗️',
  };

  // ── Overall ────────────────────────────────────────────────
  const overall = Object.values(factors).reduce(
    (sum, f) => sum + f.score * f.weight,
    0
  );

  const grade =
    overall >= 90 ? 'A+' :
    overall >= 85 ? 'A'  :
    overall >= 80 ? 'A-' :
    overall >= 75 ? 'B+' :
    overall >= 70 ? 'B'  :
    overall >= 65 ? 'B-' :
    overall >= 60 ? 'C+' :
    overall >= 55 ? 'C'  :
    overall >= 50 ? 'C-' :
    overall >= 40 ? 'D'  : 'F';

  return { overall: Math.round(overall), factors, grade };
}
