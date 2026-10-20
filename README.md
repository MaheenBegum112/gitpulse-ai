# ⚡ GitPulse AI

> AI-powered GitHub repository intelligence platform for health analysis, predictive insights, repository comparison, and AWS cloud-readiness.

## 📌 Overview

GitPulse AI is an AI-powered GitHub repository intelligence platform that goes beyond basic GitHub metrics. It analyzes repository health, contributor activity, issues, pull requests, documentation, and codebase maturity to generate actionable engineering insights.

The platform combines the **Model Context Protocol (MCP)** with **Amazon Bedrock** to provide repository analysis, predictive risk detection, repository comparison, and AWS Well-Architected cloud-readiness recommendations.

---

## 🎥 Demo

[![GitPulse AI Demo](YOUR_THUMBNAIL_URL)](YOUR_YOUTUBE_URL)


---

## 🚀 Features
## FEATURES

### For Repository Developers

- **Repository Health Analysis**
  - Comprehensive 100-point repository health score
  - Analyze commit frequency and development activity
  - Evaluate contributor diversity and bus-factor risk
  - Analyze issue management and pull-request activity
  - Assess documentation quality and repository maturity

- **Contributor & Community Insights**
  - Analyze contributor distribution and activity
  - Identify repositories dependent on a small number of contributors
  - Track stars, forks, watchers, and community engagement
  - Identify repository growth and momentum trends

- **Predictive Risk Detection**
  - Detect potential repository abandonment
  - Identify declining maintenance activity
  - Flag high bus-factor risk
  - Analyze repository momentum and activity trends
  - Identify optimal contributor activity periods

### For Engineering Teams

- **Repository Comparison**
  - Compare two GitHub repositories side-by-side
  - Compare health scores and development activity
  - Compare contributor and community metrics
  - Compare languages and repository maturity
  - Identify strengths and weaknesses between repositories

- **AI-Powered Engineering Insights**
  - Generate actionable repository recommendations
  - Use Amazon Bedrock for AI-powered analysis
  - Ask AI-based architectural and engineering questions
  - Generate contextual recommendations based on repository data

### For Cloud & AWS Teams

- **AWS Well-Architected Analysis**
  - Evaluate repositories across the AWS Well-Architected pillars
  - Analyze Operational Excellence
  - Analyze Security
  - Analyze Reliability
  - Analyze Performance Efficiency
  - Analyze Cost Optimization and Sustainability

- **Cloud Architecture Recommendations**
  - Recommend suitable AWS deployment architectures
  - Provide cloud-readiness insights
  - Identify potential architecture improvements
  - Generate AI-powered AWS recommendations using Amazon Bedrock

### For AI & MCP Integration

- **Model Context Protocol (MCP)**
  - MCP server for repository intelligence
  - Stdio transport for MCP-compatible desktop environments
  - HTTP/JSON-RPC 2.0 gateway
  - Expose repository analysis capabilities as MCP tools
  - Inspect MCP requests and responses through the in-app inspector

- **MCP Repository Tools**
  - `analyze-repo-health` for complete repository analysis
  - `get-repo-languages` for language distribution
  - `get-contributor-stats` for contributor and bus-factor analysis
  - `compare-repos` for repository benchmarking
  - `aws-well-architected-audit` for AWS cloud-readiness analysis

### Reporting & Insights

- **Shareable Reports**
  - Generate repository analysis reports
  - Export analysis results as Markdown
  - Copy executive summaries
  - Share repository health and engineering insights

- **Interactive Analytics Dashboard**
  - Visualize repository health metrics
  - Display contributor activity
  - Show repository activity trends
  - Interactive charts and health indicators
  - Dynamic repository analysis results





---

## 🛠️ Tech Stack

### Frontend

- React 19
- Vite
- JavaScript
- CSS
- Recharts

### Backend

- Node.js
- Express.js
- Model Context Protocol (MCP)
- JSON-RPC 2.0

### AI

- Amazon Bedrock
- Anthropic Claude
- Amazon Nova

### APIs

- GitHub REST API

### Development Tools

- Git
- GitHub
- npm

---

## 📦 Installation

### Prerequisites

Make sure you have installed:

- Node.js 18+ or 20+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/MaheenBegum112/gitpusle-ai.git

cd gitpusle-ai
```
### Install Frontend Dependencies
```bash
cd frontend
npm install
```
### Start the Frontend
```bash
npm run dev
```
### Install Backend Dependencies
```bash
cd backend
npm install
```
### Start the Backend
```bash
npm start
```
### 🔐 Environment Variables

Create a .env file inside the backend directory.
```bash
GITHUB_TOKEN=your_github_token

AWS_ACCESS_KEY_ID=your_aws_access_key

AWS_SECRET_ACCESS_KEY=your_aws_secret_key

AWS_REGION=your_aws_region
```
### PROJECT STRUCTURE
``` bash
gitpusle-ai/
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── tools/
│   │   ├── services/
│   │   ├── routes/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── README.md
└── LICENSE
```
