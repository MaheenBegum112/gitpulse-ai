/**
 * GitPulse AI — Predictive Insights Engine
 *
 * Generates actionable predictions from raw GitHub data:
 *   Abandonment Risk · Bus Factor · Momentum · Best Time · Community Potential
 */

export function generatePredictions(data) {
  const { repoInfo, commits, contributors, pulls } = data;
  const predictions = [];
  const now = new Date();

  // ── Abandonment Risk ───────────────────────────────────────
  const lastPush = new Date(repoInfo?.pushed_at);
  const daysSince = (now - lastPush) / (1000 * 60 * 60 * 24);

  if (daysSince > 365) {
    predictions.push({
      type: 'danger', icon: '💀',
      title: 'Likely Abandoned',
      description: `No pushes in ${Math.round(daysSince)} days. This project appears unmaintained.`,
    });
  } else if (daysSince > 180) {
    predictions.push({
      type: 'danger', icon: '⚠️',
      title: 'High Abandonment Risk',
      description: `No commits in ${Math.round(daysSince)} days. The repository may be abandoned.`,
    });
  } else if (daysSince > 60) {
    predictions.push({
      type: 'warning', icon: '⏳',
      title: 'Declining Activity',
      description: `Last push was ${Math.round(daysSince)} days ago. Activity is noticeably slowing.`,
    });
  } else {
    predictions.push({
      type: 'positive', icon: '🟢',
      title: 'Active Development',
      description: `Last push ${Math.round(daysSince)} day${Math.round(daysSince) !== 1 ? 's' : ''} ago. Repository is actively maintained.`,
    });
  }

  // ── Bus Factor ─────────────────────────────────────────────
  if (contributors.length > 0) {
    const total = contributors.reduce((s, c) => s + c.contributions, 0);
    const topPct = (contributors[0].contributions / total) * 100;

    if (contributors.length === 1) {
      predictions.push({
        type: 'danger', icon: '🚌',
        title: 'Single Maintainer Risk',
        description: `Only 1 contributor found. If ${contributors[0].login} becomes unavailable, the project has zero redundancy.`,
      });
    } else if (topPct > 80) {
      predictions.push({
        type: 'danger', icon: '🚌',
        title: 'Critical Bus Factor',
        description: `${contributors[0].login} has made ${Math.round(topPct)}% of all contributions. Extreme concentration risk.`,
      });
    } else if (topPct > 60) {
      predictions.push({
        type: 'warning', icon: '🚌',
        title: 'Low Bus Factor',
        description: `Top contributor owns ${Math.round(topPct)}% of work. The project would benefit from more diverse ownership.`,
      });
    } else {
      predictions.push({
        type: 'positive', icon: '✅',
        title: 'Healthy Contributor Distribution',
        description: `Work is well-distributed across ${contributors.length} contributors. Low single-point-of-failure risk.`,
      });
    }
  }

  // ── Momentum Analysis ──────────────────────────────────────
  const twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);
  const fourWeeksAgo = new Date(now - 28 * 24 * 60 * 60 * 1000);
  const recentCount = commits.filter(
    (c) => new Date(c.commit?.author?.date) > twoWeeksAgo
  ).length;
  const olderCount = commits.filter((c) => {
    const d = new Date(c.commit?.author?.date);
    return d > fourWeeksAgo && d <= twoWeeksAgo;
  }).length;

  if (recentCount > olderCount * 1.5 && recentCount > 3) {
    const pct = olderCount > 0 ? Math.round((recentCount / olderCount) * 100) : '∞';
    predictions.push({
      type: 'positive', icon: '📈',
      title: 'Accelerating Momentum',
      description: `Commit velocity up ${pct}% vs previous 2 weeks. Development is ramping up.`,
    });
  } else if (olderCount > 3 && recentCount < olderCount * 0.5) {
    predictions.push({
      type: 'warning', icon: '📉',
      title: 'Decelerating Momentum',
      description: `Commit rate dropped significantly in the last 2 weeks. Team may be shifting focus.`,
    });
  } else if (recentCount > 0) {
    predictions.push({
      type: 'positive', icon: '📊',
      title: 'Steady Momentum',
      description: `Commit rate is consistent. Development pace is sustainable and predictable.`,
    });
  }

  // ── Best Time to Contribute ────────────────────────────────
  if (commits.length > 5) {
    const hourCounts = {};
    commits.forEach((c) => {
      const h = new Date(c.commit?.author?.date).getUTCHours();
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    });
    const sorted = Object.entries(hourCounts).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      const peakHour = parseInt(sorted[0][0]);
      const period = peakHour >= 12 ? 'PM' : 'AM';
      const display = peakHour > 12 ? peakHour - 12 : peakHour === 0 ? 12 : peakHour;
      predictions.push({
        type: 'insight', icon: '🕐',
        title: 'Peak Activity Window',
        description: `Most commits land around ${display}:00 ${period} UTC. Submit PRs during this window for faster reviews.`,
      });
    }
  }

  // ── PR Velocity ────────────────────────────────────────────
  if (pulls.length > 5) {
    const merged = pulls.filter((p) => p.merged_at);
    if (merged.length > 0) {
      const avgDays = merged.reduce((sum, p) => {
        const created = new Date(p.created_at);
        const closed = new Date(p.merged_at);
        return sum + (closed - created) / (1000 * 60 * 60 * 24);
      }, 0) / merged.length;

      if (avgDays < 1) {
        predictions.push({
          type: 'positive', icon: '⚡',
          title: 'Lightning-Fast PR Reviews',
          description: `Average merge time under 24 hours. This team has an excellent code review culture.`,
        });
      } else if (avgDays < 7) {
        predictions.push({
          type: 'positive', icon: '🔄',
          title: 'Healthy PR Pipeline',
          description: `PRs are merged in ~${Math.round(avgDays)} days on average. Responsive review process.`,
        });
      } else {
        predictions.push({
          type: 'warning', icon: '🐌',
          title: 'Slow PR Reviews',
          description: `Average merge time is ${Math.round(avgDays)} days. PRs may be getting stuck in review.`,
        });
      }
    }
  }

  // ── Community Potential ────────────────────────────────────
  const stars = repoInfo?.stargazers_count || 0;
  const forks = repoInfo?.forks_count || 0;
  if (stars > 10 && forks > stars * 0.25) {
    predictions.push({
      type: 'positive', icon: '🌱',
      title: 'High Community Interest',
      description: `Fork-to-star ratio (${Math.round((forks / stars) * 100)}%) indicates strong interest in contributing and extending this project.`,
    });
  }

  return predictions;
}
