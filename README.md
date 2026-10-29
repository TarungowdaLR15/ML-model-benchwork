<img width="1917" height="847" alt="image" src="https://github.com/user-attachments/assets/d2d7ad58-d9cc-4b5a-aa92-ebfc287cb553" /># 🧪 ML Model Benchmark Lab

> **An agentic, 3-section dashboard for benchmarking 100 frontier AI models across 33 providers — streaming reasoning, live tool calls, and confidence-weighted recommendations.**

<p align="center">
  <a href="https://snazzy-lebkuchen-41b59e.netlify.app/"><img src="https://img.shields.io/badge/🚀_LIVE_DEMO-snazzy--lebkuchen--41b59e.netlify.app-6366f1?style=for-the-badge" alt="Live Demo" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" /></a>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white" />
  <img alt="Netlify" src="https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=flat-square&logo=netlify&logoColor=white" />
</p>

---

## 🌐 Live Demo

**👉 [https://snazzy-lebkuchen-41b59e.netlify.app/](https://snazzy-lebkuchen-41b59e.netlify.app/)**

> ⚡ **Try it now:** Open the link, scroll down through the 3 sections. The dashboard works out-of-the-box with **simulated data** — no backend setup required!

---

## 📸 Screenshots

### 1. The Hero Section

 <img width="1917" height="847" alt="Screenshot 2026-10-29 232317" src="https://github.com/user-attachments/assets/bb7a5735-8d48-4c22-8584-61a75e757e91" />



### 2. The Model Pool
*Searchable grid of 100 models across 33 providers. Supports `/` keyboard shortcut and search history.*
<img width="1917" height="770" alt="Screenshot 2026-10-29 232258" src="https://github.com/user-attachments/assets/5c30af5d-62ae-4bfd-9cd2-58b8306664e3" />


### 3. Live Results & Agent Console
*Watch the agent stream its reasoning, execute tool calls, and generate confidence-weighted recommendations with animated metrics.*
<img width="1917" height="833" alt="Screenshot 2026-10-29 232410" src="https://github.com/user-attachments/assets/66bf2cf9-e1f1-42eb-8c67-cd2dd73bec5e" />



---

## ✨ Why This Project?

Traditional benchmark dashboards make you:
- ❌ Manually pick models from a dropdown
- ❌ Wait for a spinner with zero feedback
- ❌ Read a flat table of numbers

**ML Model Benchmark Lab** flips that:
- ✅ **Agentic pipeline** — the AI agent *plans*, *executes*, *evaluates*, and *recommends* out loud.
- ✅ **Streaming console** — watch reasoning tokens appear live.
- ✅ **Tool call cards** — see every API call (e.g., `plan_analyzer`, `mock_benchmark`) with duration and result.
- ✅ **100 models · 33 providers** — from OpenAI to Upstage, all in one searchable grid.
- ✅ **Graceful offline** — if the backend is down, realistic simulated results are generated automatically.

---

## 🎬 The 3-Section Experience

| Section | What Happens |
|---|---|
| **1️⃣ Hero** | Video background · animated headline · live stats (`100 models · 33 providers`) |
| **2️⃣ Model Pool** | 100 model cards · search with history · "Auto-select 9" smart lineup · `Scroll ↓` to continue |
| **3️⃣ Results** | Agent auto-fires on scroll · console streams plan → tools → decision · metrics count up · winner glows gold |

Full-screen **scroll-snap** layout — each section locks to the viewport like a deck of cards.

---

## 🤖 The Agent Loop
┌──────────────────────────────────────────────────────────────┐
│ 1. PLAN ──► "Analyzing request: benchmark 4 models" │
│ 📊 plan_analyzer (380ms) │
│ │
│ 2. SELECT ──► "Preparing suite for GPT-6 Astra, ..." │
│ 🧱 suite_builder (480ms) │
│ │
│ 3. EXECUTE ──► ⚡ mock_benchmark (896ms) │
│ └─ 4 results collected │
│ │
│ 4. EVALUATE ──► "Computing weighted scores..." │
│ 📈 score_analyzer (320ms) │
│ └─ Best: GPT-6 Luna (81.9) │
│ │
│ 5. RECOMMEND ──► ★ "GPT-6 Luna leads at 81.6% accuracy..."│
│ Confidence: 74% │
└──────────────────────────────────────────────────────────────┘

Every step is **visible**, **timed**, and **replayable** via the **↻ Rerun** button.

---

## 🏆 Scoring Formula

Overall score is a **weighted composite** of 4 dimensions:

| Metric | Weight | Rationale |
|---|---|---|
| 🎯 **Accuracy** | **70%** | The dominant factor — a slow model with bad answers is useless |
| ⚡ **Latency** | **10%** | Sub-second response matters for interactive apps |
| 🚀 **Throughput** | **10%** | Requests/sec matters for batch pipelines |
| 💰 **Cost / 1k** | **10%** | Cheaper is better, but only a tiebreaker |

Confidence is derived from the **margin between the top 2 models** — a decisive lead gets high confidence (up to 97%), a close race gets modest confidence (down to 55%).

---

## 🧠 Model Coverage — 100 Models · 33 Providers

Includes the latest flagships from:
- **OpenAI** (GPT-6 Astra, GPT-6.1 Sol, o3)
- **Anthropic** (Claude Fable 5.1, Claude Opus 5.5)
- **Google** (Gemini 4 Argon, Gemini 3.8 Flash)
- **Meta** (Muse Wonder Full, Llama 4 Maverick)
- **Mistral** (Mistral Large 4, Codestral)
- **xAI** (Grok 4.7)
- **DeepSeek** (V4.1 Pro, R1)
- **Alibaba** (Qwen 3.6 Plus, Qwen 3 Max)
- **Moonshot** (Kimi K3.1 Pro)
- *...and 24 more providers.*

Every model carries a **context window**, **color-coded provider**, and **realistic baseline** for accuracy / latency / throughput / cost.

---

## 🔍 Search That Remembers

- **Live filter** — matches name, provider, or ID
- **History** — last **8 searches** persist via `localStorage`
- **`/` shortcut** — jump to search from anywhere
- **Enter to save** — adds the query to history
- **Clear all** — one click to forget everything

---

## 🧰 Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Frontend** | React 18 + Vite 5 | Instant HMR, tiny bundle (~175 KB → 55 KB gzipped) |
| **Styling** | Vanilla CSS | Zero dependencies, full control over animations |
| **State** | React hooks + `localStorage` | No Redux needed for a single-view app |
| **Animation** | CSS `@keyframes` + `requestAnimationFrame` | GPU-accelerated, no libraries |
| **Backend** | FastAPI + Uvicorn | Async, auto-docs at `/docs`, type-safe with Pydantic |
| **Deployment** | Netlify | Free tier, zero config, instant CDN |

---

## 🚀 Quick Start

### Prerequisites
```bash
node --version   # 20+
python --version # 3.11+

1.clone
git clone https://github.com/YOUR-USERNAME/ml-model-benchmark-lab.git
cd ml-model-benchmark-lab
2.backend
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
3.frontend
cd frontend
npm install
npm run dev
📡 API Reference
GET /health
json
{
  "status": "ok",
  "service": "ml-benchmark-api",
  "version": "1.0.0"
}

ml-model-benchmark-lab/
├── 📄 README.md
├── 📄 LICENSE
├── 📄 .gitignore
│
├── 📁 backend/
│   ├── 🐍 main.py                     ← FastAPI app (100 model baselines)
│   ├── 📋 requirements.txt
│   └── 🧪 test_main.py                ← pytest suite
│
└── 📁 frontend/
    ├── 📄 package.json
    ├── 📄 vite.config.js
    └── 📁 src/
        ├── ⚛️ main.jsx
        ├── ⚛️ App.jsx                 ← Dashboard + 100 models
        └── 🎨 styles.css              ← Dark theme + animations

🛠 Adding a New Model
Frontend — add one line to the MODELS array in frontend/src/App.jsx:

js
{
  id: 'your-model-id',
  name: 'Your Model Name',
  provider: 'Provider',
  color: '#hex',
  accuracy: 90,
  latency: 200,
  throughput: 3000,
  cost: 1.00,
  ctx: '128K',
}
Backend — add the baseline to BASELINES in backend/main.py:

python
"your-model-id": (90.0, 200, 3000, 1.00),
That's it — no other wiring needed.

📜 License
MIT © 2026 Tarun Gowda L R

<p align="center"> <b>⭐ Star this repo if it saved you time ⭐</b><br /> <sub>Built with ❤️ and way too much ☕</sub> </p> ```
