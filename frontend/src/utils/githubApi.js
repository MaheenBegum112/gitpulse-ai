const GITHUB_API = 'https://api.github.com';

async function safeFetch(url) {
  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Fetch comprehensive repository data from GitHub API.
 * All calls are made in parallel for speed.
 * Each endpoint fails gracefully — partial data still produces a report.
 */
export async function fetchRepoData(owner, repo, onLog) {
  onLog?.(`[MCP] Initializing tool pipeline for ${owner}/${repo}...`);
  onLog?.('[MCP] Connecting to GitHub API via secure transport...');

  const [repoInfo, commits, contributors, languages, pulls, releases] = await Promise.all([
    safeFetch(`${GITHUB_API}/repos/${owner}/${repo}`),
    safeFetch(`${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=100`),
    safeFetch(`${GITHUB_API}/repos/${owner}/${repo}/contributors?per_page=50`),
    safeFetch(`${GITHUB_API}/repos/${owner}/${repo}/languages`),
    safeFetch(`${GITHUB_API}/repos/${owner}/${repo}/pulls?state=all&per_page=50&sort=updated`),
    safeFetch(`${GITHUB_API}/repos/${owner}/${repo}/releases?per_page=10`),
  ]);

  if (!repoInfo || repoInfo.message) {
    throw new Error('Repository not found. Make sure it is public and the name is correct.');
  }

  onLog?.(`[MCP] Fetched repository metadata — ⭐ ${repoInfo.stargazers_count} stars`);
  onLog?.(`[MCP] Fetched ${Array.isArray(commits) ? commits.length : 0} commits for analysis...`);
  onLog?.(`[MCP] Fetched ${Array.isArray(contributors) ? contributors.length : 0} contributor profiles...`);
  onLog?.(`[MCP] Fetched ${Object.keys(languages || {}).length} language entries...`);
  onLog?.(`[MCP] Fetched ${Array.isArray(pulls) ? pulls.length : 0} pull requests...`);
  onLog?.(`[MCP] Fetched ${Array.isArray(releases) ? releases.length : 0} releases...`);
  onLog?.('[MCP] All data streams received. Running health analysis engine...');

  return {
    repoInfo,
    commits: Array.isArray(commits) ? commits : [],
    contributors: Array.isArray(contributors) ? contributors : [],
    languages: languages && typeof languages === 'object' && !languages.message ? languages : {},
    pulls: Array.isArray(pulls) ? pulls : [],
    releases: Array.isArray(releases) ? releases : [],
  };
}
