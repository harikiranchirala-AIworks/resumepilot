# Tailor Resume — AI Resume Tailoring, ATS Optimization & Interview Prep Suite

A modern, full-featured web application that tailors your resume to target job descriptions, optimizes bullet points for ATS compliance using the Google XYZ formula, generates targeted cover letters, creates customized STAR interview preparation kits, and outputs ready-to-compile **LaTeX** and **PDF** documents.

---

## 🌟 Key Features

### 1. 🤖 Multi-Model AI Orchestrator
- **Google Gemini**: Powered by `gemini-2.5-flash` and `gemini-1.5-pro` via `GEMINI_API_KEY`.
- **OpenAI**: Powered by `gpt-4o-mini` and `gpt-4o` via `OPENAI_API_KEY`.
- **Anthropic Claude**: Powered by `claude-3-5-sonnet` via `ANTHROPIC_API_KEY`.
- **Cursor SDK Agent**: Local agent integration via `@cursor/sdk` (`CURSOR_API_KEY`).
- **Offline Heuristic Engine**: Zero-API-key fallback mode that parses candidate profiles, matches JD keywords, and generates clean LaTeX and metrics offline.

### 2. 📄 Multi-Format Document Parser
- **Supported Formats**: PDF, DOCX, DOC, TXT, Markdown, TeX, RTF, HTML, and JSON.
- **Multi-Tier Fallback Pipeline**:
  1. Universal PDF.js engine (`unpdf`).
  2. Legacy PDF parser (`pdf-parse-fork`).
  3. Low-level binary stream decompressor (`zlib` FlateDecode) + PDF text operator extractor (`Tj`, `TJ`, hex strings).
  4. Raw printable ASCII/UTF-8 buffer scanner.
  5. Mammoth + XML node parser for Word documents.

### 3. 🎨 4 ATS-Optimized LaTeX Templates
- **Tech Standard (Jake's Resume)**: The gold standard for Software Engineers, Tech Roles & Product Managers.
- **Modern Clean**: Sleek typography and subtle dividers for Startups, Design & Business.
- **Classic Academic**: Elegant formal serif layout for Academic, Research, Legal & Healthcare roles.
- **Compact Executive**: High-density format engineered for Senior Executives & Directors (10+ years experience).

### 4. ⚡ Live Document Preview & Multi-Format Export
- **Live Preview**: Semantic ATS-compliant HTML viewer with typography matching LaTeX output.
- **PDF Export**:
  - **Instant Download**: High-resolution client-side generation via `jsPDF` + `html2canvas`.
  - **Direct Vector Print**: Browser print dialog (`@media print`) for 100% crisp vector sharpness.
  - **Server-Side Compilation**: Auto-detects local `pdflatex` (MiKTeX/TeX Live) if installed.
- **LaTeX Source Editor**: Real-time dark-mode code editor with 1-click re-compilation and `.tex` export.

### 5. 🔍 Transformation Diff Inspector
- Visual side-by-side comparison showing original resume bullet points alongside AI-tailored bullet points with highlighted changes.

### 6. ✉️ Tailored Cover Letter Suite
- Automatically generates a 1-page customized cover letter matching candidate experience with job posting hooks, complete with editing tools and `.tex` export.

### 7. 🎯 Role-Specific Interview Prep Kit
- Curates 6+ high-yield interview questions (technical, behavioral, and situational) with structured **STAR method** answer blueprints tailored to the specific role.

### 8. ✍️ Google XYZ Bullet Point Optimizer
- Interactive tool to transform raw bullet points into high-impact accomplishments using Google's formula:
  $$\text{Accomplished [X]} \text{ as measured by [Y]}, \text{ by doing [Z]}$$

### 9. 📚 Saved Profile Library
- Save multiple resume versions, switch profiles dynamically, and persist candidate profiles locally.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- (Optional) AI API key from [Google AI Studio](https://aistudio.google.com/), [OpenAI](https://platform.openai.com/), [Anthropic](https://console.anthropic.com/), or [Cursor](https://cursor.com/).

### Installation

1. Clone or navigate to the repository:
```bash
git clone https://github.com/harikiranchirala-AIworks/resumepilot.git
cd resumepilot
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your preferred AI provider keys:
```env
# Google Gemini (Recommended for fast & high-quality generation)
GEMINI_API_KEY=your_gemini_api_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Anthropic Claude
ANTHROPIC_API_KEY=your_anthropic_api_key

# Cursor Agent SDK
CURSOR_API_KEY=your_cursor_api_key
```
*(Note: If no API keys are provided, the application operates in offline heuristic fallback mode seamlessly).*

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ CLI Tailoring Utility

Headless tailoring directly from your terminal:
```bash
npm run tailor -- my-resume.pdf job-posting.txt tailored-output.tex
```

---

## 🏗️ Architecture & Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + PostCSS
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (LocalStorage persistence)
- **PDF Engine**: `unpdf`, `pdf-parse-fork`, `jsPDF`, `html2canvas`, `pdflatex` (optional server)
- **Document Extractors**: `mammoth` (DOCX), stream decompressors
- **TypeScript**: 100% strict type safety

---

## 📄 License

MIT License.
