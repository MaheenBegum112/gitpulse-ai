<div align="center">

# GitPulse AI 🚀
### AI-Powered GitHub Repository Intelligence & AWS Cloud-Readiness Platform

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_Native_HTTP-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React_19_%2B_Tailwind_v4-blue)](https://react.dev/)
[![MCP Protocol](https://img.shields.io/badge/Protocol-Model_Context_Protocol-purple)](https://modelcontextprotocol.io/)
[![Amazon Bedrock](https://img.shields.io/badge/AI-Amazon_Bedrock-orange)](https://aws.amazon.com/bedrock/)

[Overview](#-overview) • [Problem & Solution](#-problem--solution) • [Uniqueness](#-uniqueness) • [Demo](#-demo) • [Features](#-features) • [Tech Stack & Tools](#️-tech-stack--tools) • [Installation](#-installation) • [Folder Structure](#-folder-structure)

</div>

---

## 📌 Overview

**GitPulse AI** is an advanced, AI-driven GitHub repository intelligence platform that goes far beyond basic commit counts and star metrics. Designed for developers, engineering teams, and open-source maintainers, it evaluates repository health, contributor activity, issue velocity, and codebase maturity to generate actionable insights. By bridging the **Model Context Protocol (MCP)** with **Amazon Bedrock**, GitPulse AI provides automated architectural audits, predictive risk detection, and comprehensive AWS Well-Architected cloud-readiness recommendations.

---
## 🎥 Demo
<a href="https://youtu.be/yu4sEcYKbBg">
  <img width="1920" height="915" alt="Screenshot 2026-10-23 220904" src="https://github.com/user-attachments/assets/015f73bf-664b-4d6b-8e86-664152a71ee4" />
" alt="GitPulse AI Demo" width="100%">
</a>

## 🎯 Problem & Solution

### ❌ The Problem
Evaluating open-source dependencies or assessing a codebase's health usually requires manually skimming through dozens of files, commit histories, issue boards, and contributor graphs. Traditional tools only give raw numbers without contextual engineering insights or cloud migration roadmaps, leaving teams blind to hidden bus-factor risks, code abandonment trends, and architectural bottlenecks.

### ✅ The Solution
GitPulse AI automates the entire repository auditing pipeline. In seconds, it ingests GitHub metadata, computes a multi-pillar 100-point health score, runs predictive risk models, exposes data via an interactive **MCP Inspector (JSON-RPC 2.0)**, and leverages **Amazon Bedrock** to deliver tailored architectural roadmaps and AWS Well-Architected cloud-readiness audits.

---

## 💡 Uniqueness

* **Native Model Context Protocol (MCP) Integration:** Exposes repository tools (`analyze-repo-health`, `get-contributor-stats`, `aws-well-architected-audit`) over a lightweight HTTP/JSON-RPC gateway with a built-in interactive protocol inspector.
* **Dual-Engine AI Analysis:** Combines real-time GitHub REST API data processing with advanced reasoning from **Amazon Bedrock** (Anthropic Claude & Amazon Nova models).
* **AWS Well-Architected Cloud Audit:** Uniquely evaluates codebases across the 5 core AWS pillars (Operational Excellence, Security, Reliability, Performance Efficiency, and Cost Optimization) to recommend optimal cloud deployment architectures.
* **Zero-Bloat Native Architecture:** Built using high-performance Node.js native HTTP routing and a lightning-fast React 19 + Tailwind CSS v4 frontend without heavy framework overhead.

---





[![Live App Deployment](https://img.shields.io/badge/Live_App-Vercel_Deployment-blue?style=for-the-badge&logo=vercel)](https://gitpusle-ai.vercel.app/)


---

## ✨ Features

### 🔍 Repository Intelligence & Health
* **100-Point Health Score Engine:** Multi-factor algorithmic scoring assessing commit velocity, issue resolution, and documentation maturity.
* **Bus-Factor & Contributor Risk:** Analyzes contributor distribution to flag repositories heavily reliant on a single developer.
* **Predictive Risk Detection:** Identifies declining maintenance activity, abandonment signals, and optimal contribution cycles.

### 👥 Collaboration & Comparison
* **Side-by-Side Repo Comparison:** Benchmark two GitHub repositories across health scores, language breakdown, and community momentum.
* **Interactive Analytics Dashboard:** Real-time visual charts powered by clean Tailwind UI components and custom heatmaps.

### ☁️ Cloud & AWS Teams
* **AWS Well-Architected Analysis:** Automated auditing across Operational Excellence, Security, Reliability, Performance, and Cost Optimization.
* **Cloud Architecture Recommendations:** Generates custom deployment roadmaps and infrastructure suggestions using Amazon Bedrock.

### 🔌 AI & MCP Inspector
* **Live JSON-RPC 2.0 Inspector:** Inspect live protocol frames, tool schemas, and raw JSON payloads streaming between client and server.

---

## 🛠️ Tech Stack & Tools

### Frontend
* **React 19** – Modern component architecture
* **Vite** – Lightning-fast build tool and bundler
* **Tailwind CSS v4** – Utility-first responsive styling
* **Recharts** – Data visualization and health graphs

### Backend & Protocol
* **Node.js (Native HTTP)** – Lightweight, zero-dependency server routing
* **Model Context Protocol (MCP)** – Standardized agentic tool protocol
* **JSON-RPC 2.0** – Protocol transport framing

### AI & APIs
* **Amazon Bedrock** – Enterprise foundation models (Anthropic Claude, Amazon Nova)
* **GitHub REST API** – Real-time repository metadata ingestion

---

## 📦 Installation

### Prerequisites
Make sure you have installed on your system:
* **Node.js** (v18+ or v20+)
* **npm**

### 1. Clone the Repository
```bash
git clone https://github.com/MaheenBegum112/gitpusle-ai.git
cd gitpusle-ai
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Setup Backend
Open a new terminal window:
```bash
cd backend
npm install
node server.js
```

---


---

## 📁 Folder Structure

```text
gitpusle-ai/
│
├── frontend/                # React 19 + Vite + Tailwind v4 Frontend
│   ├── public/              # Static assets & favicons
│   ├── src/
│   │   ├── components/      # Reusable UI widgets & MCP Inspector
│   │   ├── pages/           # Home, ReportView, CompareView, BedrockAdvisor
│   │   ├── services/        # API communication handlers
│   │   ├── App.jsx          # Main root component with floating inspector
│   │   └── main.jsx         # Application entry point
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── backend/                 # Node.js Native HTTP Backend & MCP Server
│   ├── src/
│   │   ├── tools/           # MCP tool definitions & handlers
│   │   ├── services/        # GitHub API & Amazon Bedrock integrations
│   │   └── routes/          # JSON-RPC gateway & endpoint routing
│   │
│   ├── server.js            # Main HTTP server entry point
│   ├── package.json
│   └── ...
│
├── README.md                # Project documentation
└── LICENSE                  # MIT Open Source License
---
```
## 📜 License & Acknowledgments

Distributed under the **MIT License**. See the [LICENSE](LICENSE) file for more information.


<p>Built with ❤️ for the Amazon Developer Hackathon 2026</p>

