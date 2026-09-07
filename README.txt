================================================================================
OFFERCRAFT AI (RESUMEPILOT) - COMPREHENSIVE SYSTEM README
Next-Gen AI Career Intelligence Suite, Resume Tailoring & Interview Prep
================================================================================

1. OVERVIEW
--------------------------------------------------------------------------------
OfferCraft AI (ResumePilot) is an enterprise-grade AI career acceleration 
platform designed to turn job applications into offers. It combines multi-model 
LLM intelligence (Gemini 2.5, GPT-4o, Claude 3.5, Cursor SDK, and offline 
heuristics) with ATS-optimized LaTeX typesetting, Google XYZ bullet scoring, 
LinkedIn profile SEO optimization, STAR interview coaching, and full Kanban 
pipeline tracking.

Repository: https://github.com/harikiranchirala-AIworks/resumepilot.git
Branch:     main
Stack:      Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Zustand


2. KEY FEATURES
--------------------------------------------------------------------------------
* 3-Step Guided Workflow:
  - Step 1: Target Role & JD Setup (Archetype selector, URL scraper, keywords)
  - Step 2: Master Candidate Experience Bank (multi-format parser, zero dummy data)
  - Step 3: Interactive AI Tailoring Studio (live A4 sheet, inline AI rewriter)

* 4 ATS-Compliant LaTeX Templates:
  - Tech Standard (Jake's Resume - gold standard for SWE, DevOps, AI/ML)
  - Modern Clean (contemporary typography for startups, design, product)
  - Classic Academic (formal serif for researchers, PhDs, legal, healthcare)
  - Compact Executive (dense 2-column format for Directors & VPs 10+ yrs)

* AI Career Acceleration Suite:
  - ATS Resume Checker (instant Google XYZ impact scoring without a JD)
  - LinkedIn Profile Optimizer (5 high-converting headlines, "About" bio, tags)
  - STAR Interview Practice Studio (role questions, situation/task evaluator)
  - Application Pipeline Tracker (drag-and-drop Kanban, salary & date metrics)
  - OfferCraft Academy (Generative AI engineering learning & interview bible)
  - 1-Click Application Bundle (exports tailored resume, cover letter, prep kit)

* Multi-Model AI Orchestrator:
  - Seamless fallback across Gemini, OpenAI, Claude, Cursor SDK, and offline heuristics.

* Zero Hydration Error Architecture:
  - Protected by top-level SSR mount guards and Zustand localStorage persistence.


3. SYSTEM PREREQUISITES
--------------------------------------------------------------------------------
* Node.js: Version 18.18+ or 20.x+ recommended
* NPM:     Version 9+ or 10+
* OS:      Windows 10/11, macOS, or Linux
* Optional: Local pdflatex (TeX Live / MiKTeX) for native server compilation
* Optional: AI API keys (Google Gemini, OpenAI, Anthropic, Cursor SDK)


4. QUICK START GUIDE
--------------------------------------------------------------------------------
Step 1: Clone Repository
   git clone https://github.com/harikiranchirala-AIworks/resumepilot.git
   cd resumepilot

Step 2: Install Dependencies
   npm install

Step 3: Environment Setup
   Copy the sample environment file:
   cp .env.example .env.local (or 'copy .env.example .env.local' on Windows cmd)

   Configure any preferred API keys in .env.local:
   GEMINI_API_KEY=your_key_here
   OPENAI_API_KEY=your_key_here
   ANTHROPIC_API_KEY=your_key_here
   CURSOR_API_KEY=your_key_here

   Note: The application operates in offline heuristic mode if no keys are provided.

Step 4: Launch Development Server
   npm run dev

   Open your browser at: http://localhost:3000

Step 5: Production Build & Testing
   npm run build
   npm run start


5. PROJECT DIRECTORY STRUCTURE
--------------------------------------------------------------------------------
tailor-resume/
|-- src/
|   |-- app/
|   |   |-- api/                   # Serverless Next.js API route handlers
|   |   |   |-- career-copilot/    # Interactive AI co-pilot chat endpoint
|   |   |   |-- compile-pdf/       # pdflatex compiler endpoint
|   |   |   |-- copilot/           # General assistant endpoint
|   |   |   |-- cover-letter/      # Targeted cover letter generator
|   |   |   |-- generate-resume/   # Core resume tailoring & LaTeX generator
|   |   |   |-- interview-prep/    # STAR interview kit generator
|   |   |   |-- parse-resume/      # Multi-format document parsing engine
|   |   |   |-- providers/         # Live AI provider availability check
|   |   |   |-- resumes/           # Saved resume library REST endpoints
|   |   |   |-- rewrite-bullet/    # Google XYZ formula rewriter
|   |   |-- globals.css            # Tailwind CSS rules & A4 print stylesheets
|   |   |-- layout.tsx             # Root layout with suppressHydrationWarning
|   |   `-- page.tsx               # Main SPA shell with SSR mount guard
|   |-- components/                # Modular React 19 UI components
|   |   |-- AppSidebar.tsx         # Resumatic-style dual-tier sidebar
|   |   |-- DynamicProgressHeader.tsx # 3-step milestone progress bar
|   |   |-- JDTab.tsx              # Step 1: Target role & job description
|   |   |-- ProfileTab.tsx         # Step 2: Experience bank & file uploader
|   |   |-- ResumeTab.tsx          # Step 3: Tailoring studio & LaTeX preview
|   |   |-- GeneralResumeOptimizer.tsx # ATS checker (Google XYZ audit)
|   |   |-- LinkedInOptimizerTab.tsx # LinkedIn SEO & bio optimizer
|   |   |-- InterviewPrepTab.tsx   # STAR interview coach studio
|   |   |-- ApplicationTrackerTab.tsx # Kanban job pipeline tracker
|   |   |-- GenAILearningHubTab.tsx# OfferCraft Academy (GenAI Bible)
|   |   |-- ApplicationBundleModal.tsx # 1-click ZIP bundle generator
|   |   |-- GoogleAuthModal.tsx    # Candidate authentication & cloud sync
|   |   |-- ProUpgradeModal.tsx    # Free trial counter & Pro tier gating
|   |   `-- ...
|   `-- lib/                       # Core utilities and business logic
|       |-- ai-service.ts          # Multi-model LLM router & fallbacks
|       |-- latex.ts               # 4 ATS LaTeX templates & parsers
|       |-- pdf-parser.ts          # 5-tier document parser engine
|       |-- store.ts               # Zustand global state with localStorage
|       |-- archetypes.ts          # 15+ industry role archetype templates
|       `-- utils.ts               # UI helper utilities
|-- public/                        # Static assets, icons, logos
|-- README.md                      # GitHub markdown documentation
|-- README.txt                     # This plain-text quick reference
|-- USAGE_GUIDE.md                 # Complete user walkthrough document
|-- TECHNICAL_DOCUMENTATION.md     # Deep architecture and technical reference
`-- package.json                   # Dependencies and scripts


6. SCRIPTS REFERENCE
--------------------------------------------------------------------------------
* npm run dev       : Starts Next.js development server on port 3000
* npm run build     : Creates optimized production build with type-checking
* npm run start     : Runs the production build server
* npm run lint      : Runs Next.js ESLint validation
* npm run tailor    : Runs CLI resume tailoring script (scripts/tailor-cli.ts)


7. TROUBLESHOOTING & COMMON TIPS
--------------------------------------------------------------------------------
1. Next.js Hydration Warning / Outdated Webpack Error:
   - Ensure you perform a hard refresh with cache bypass: Ctrl + Shift + R 
     or open in an Incognito window.
   - The application is protected by a top-level mount guard in src/app/page.tsx.

2. LaTeX Compilation:
   - Client-side PDF generation works instantly in any modern browser via jsPDF 
     and browser Print-to-PDF without requiring TeX installed locally.
   - If local TeX is installed, ensure 'pdflatex' is added to your system PATH.

3. AI Provider Rate Limits:
   - The system automatically falls back to alternative available providers 
     (Gemini -> OpenAI -> Claude -> Heuristic).

================================================================================
(C) OfferCraft AI / ResumePilot Engineering Team. All Rights Reserved.
================================================================================
