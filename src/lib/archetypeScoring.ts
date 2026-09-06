export type ArchetypeTrack = 'AI' | 'TPM' | 'ITDM' | 'PM';

export interface KeywordThemeDef {
  theme: string;
  synonyms: string;
  weightTier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  track: ArchetypeTrack;
  weight: number;
}

export interface BulletDef {
  track: string;
  trackId: ArchetypeTrack;
  theme: string;
  bullet: string;
}

export interface ThemeScore {
  theme: string;
  synonyms: string[];
  weightTier: string;
  weight: number;
  matchedSynonyms: string[];
  autoScore: 0 | 1 | 2;
  weightedScore: number;
  notes: string;
  isHit: boolean;
}

export interface TrackScoreResult {
  track: ArchetypeTrack;
  name: string;
  icon: string;
  tagline: string;
  themeScores: ThemeScore[];
  keywordScore: number;
  patternMatch: number;
  companyMatch: number;
  redFlagPenalty: number;
  finalScore: number;
  matchLevel: 'Strong Match' | 'Good Match' | 'Moderate Match' | 'Weak Match';
  matchLevelColor: string;
  topMissingKeywords: Array<{
    rank: number;
    theme: string;
    weight: number;
    boost: string;
    action: string;
  }>;
}

export interface EvaluatedBullet extends BulletDef {
  jdHit: boolean;
  isRecommended: boolean;
}

export interface ArchetypeAnalysisResult {
  tracks: Record<ArchetypeTrack, TrackScoreResult>;
  bestFitTrack: ArchetypeTrack;
  bestFit: TrackScoreResult;
  actionItems: string[];
  top5Edits: string[];
  interviewThemes: string;
  bullets: EvaluatedBullet[];
}

export const TRACK_META: Record<ArchetypeTrack, {
  name: string;
  icon: string;
  tagline: string;
  patternDesc: string;
  companyDesc: string;
  redFlagDesc: string;
}> = {
  "AI": {
    "name": "AI Transformation Manager",
    "icon": "🤖",
    "tagline": "Best for AI/transformation-led roles, GenAI strategy, intelligent automation",
    "patternDesc": "How well does the JD align with AI Transformation role pattern (GenAI, ML roadmaps, modernization)?",
    "companyDesc": "Is the company AI-focused, transformation-led, or consulting-style?",
    "redFlagDesc": "Penalty if JD requires deep hands-on ML/data science engineering"
  },
  "TPM": {
    "name": "Technical Program Manager",
    "icon": "⚙️",
    "tagline": "Best for cross-functional technical delivery, program governance, roadmap execution",
    "patternDesc": "How well does the JD align with TPM responsibility pattern (program delivery, governance)?",
    "companyDesc": "Is the company a product company, GCC, or consulting tech delivery firm?",
    "redFlagDesc": "Penalty if JD is mainly operations/support with no program ownership"
  },
  "ITDM": {
    "name": "IT Delivery Manager",
    "icon": "🛠️",
    "tagline": "Best for service delivery, SLA management, ITIL/ServiceNow operations",
    "patternDesc": "How well does the JD align with IT Delivery / service operations pattern?",
    "companyDesc": "Is the company an IT services, managed services, or ops-heavy enterprise?",
    "redFlagDesc": "Penalty if JD is mainly strategy/innovation/AI vision oriented"
  },
  "PM": {
    "name": "Product Manager",
    "icon": "📦",
    "tagline": "Best for product strategy, roadmapping, feature discovery, GTM, customer metrics",
    "patternDesc": "How well does the JD align with Product Management responsibilities?",
    "companyDesc": "Is the company a product-led SaaS/tech company?",
    "redFlagDesc": "Penalty if JD is heavily technical IC or operations-focused"
  }
};

export const MASTER_KEYWORDS: KeywordThemeDef[] = [
  {
    "theme": "AI transformation",
    "synonyms": "ai transformation|ai-led|ai driven|enterprise ai|ai modernization|ai adoption|ai enablement|ai-first|ai integration",
    "weightTier": "Tier 1",
    "track": "AI",
    "weight": 2
  },
  {
    "theme": "Digital transformation",
    "synonyms": "digital transformation|digital modernization|digitalization|digital change|digital reinvention|business transformation|modernization program",
    "weightTier": "Tier 2",
    "track": "AI",
    "weight": 2
  },
  {
    "theme": "Generative AI GenAI",
    "synonyms": "generative ai|genai|gen-ai|gen ai|llm|llms|large language model|chatgpt|gpt-4|gpt-5|claude|gemini|copilot|foundation model|prompt engineering|rag|retrieval augmented",
    "weightTier": "Tier 1",
    "track": "AI",
    "weight": 2
  },
  {
    "theme": "Intelligent automation",
    "synonyms": "intelligent automation|hyperautomation|rpa|robotic process automation|workflow automation|uipath|blue prism|automation anywhere|process automation",
    "weightTier": "Tier 2",
    "track": "AI",
    "weight": 2
  },
  {
    "theme": "AI strategy",
    "synonyms": "ai adoption|ai strategy|ai roadmap|ai vision|responsible ai|ai governance|ai ethics|ai policy|ai center of excellence|ai coe",
    "weightTier": "Tier 1",
    "track": "AI",
    "weight": 2
  },
  {
    "theme": "Transformation roadmap",
    "synonyms": "transformation roadmap|modernization roadmap|target operating model|strategic roadmap|multi-year roadmap|transformation strategy|program roadmap",
    "weightTier": "Tier 1",
    "track": "AI",
    "weight": 2
  },
  {
    "theme": "Enterprise modernization",
    "synonyms": "enterprise modernization|legacy modernization|platform modernization|application modernization|infrastructure modernization|mainframe modernization|technical debt",
    "weightTier": "Tier 2",
    "track": "AI",
    "weight": 2
  },
  {
    "theme": "Change management AI",
    "synonyms": "change management|organizational change|adoption|change leadership|ocm|prosci|adkar|change adoption|change enablement",
    "weightTier": "Tier 1",
    "track": "AI",
    "weight": 2
  },
  {
    "theme": "Stakeholder governance",
    "synonyms": "stakeholder|executive sponsor|governance|steering committee|c-suite|executive|senior leadership|board level|executive stakeholders",
    "weightTier": "Tier 2",
    "track": "AI",
    "weight": 2
  },
  {
    "theme": "CRM transformation",
    "synonyms": "crm transformation|crm modernization|customer relationship|sales cloud|service cloud|customer experience|cx transformation",
    "weightTier": "Tier 3",
    "track": "AI",
    "weight": 2
  },
  {
    "theme": "Salesforce Siebel ServiceNow",
    "synonyms": "salesforce|siebel|servicenow|sfdc|einstein|dynamics 365|hubspot|marketing cloud",
    "weightTier": "Tier 3",
    "track": "AI",
    "weight": 2
  },
  {
    "theme": "Cloud migration AI",
    "synonyms": "cloud migration|cloud transition|aws|azure|gcp|google cloud|oci|hybrid cloud|multi-cloud|cloud native|cloud transformation",
    "weightTier": "Tier 2",
    "track": "AI",
    "weight": 2
  },
  {
    "theme": "Process optimization",
    "synonyms": "process optimization|process improvement|lean|six sigma|efficiency|process reengineering|process excellence|continuous improvement",
    "weightTier": "Tier 3",
    "track": "AI",
    "weight": 2
  },
  {
    "theme": "Operating model",
    "synonyms": "operating model|target operating model|business transformation|organizational design|tom|future state",
    "weightTier": "Tier 3",
    "track": "AI",
    "weight": 2
  },
  {
    "theme": "Cross functional AI",
    "synonyms": "cross-functional|cross functional|matrixed|global teams|multi-disciplinary|cross-team|cross-org|cross-organizational",
    "weightTier": "Tier 2",
    "track": "AI",
    "weight": 2
  },
  {
    "theme": "Technical program management",
    "synonyms": "technical program manager|tpm|technical program management|technical pm|senior tpm|principal tpm|staff tpm",
    "weightTier": "Tier 1",
    "track": "TPM",
    "weight": 2
  },
  {
    "theme": "Program delivery",
    "synonyms": "program delivery|program management|deliver programs|program execution|program leadership|multi-project|portfolio management",
    "weightTier": "Tier 1",
    "track": "TPM",
    "weight": 2
  },
  {
    "theme": "Roadmap execution",
    "synonyms": "roadmap|delivery roadmap|execution plan|milestones|milestone tracking|quarterly planning|okrs|kpis|deliverables",
    "weightTier": "Tier 1",
    "track": "TPM",
    "weight": 2
  },
  {
    "theme": "Cross functional TPM",
    "synonyms": "cross-functional|cross functional|matrixed|engineering teams|product teams|design teams|multi-team|multi-disciplinary",
    "weightTier": "Tier 2",
    "track": "TPM",
    "weight": 2
  },
  {
    "theme": "Stakeholder management TPM",
    "synonyms": "stakeholder management|executive stakeholders|senior leadership|stakeholders|business partners|stakeholder engagement|influence without authority",
    "weightTier": "Tier 1",
    "track": "TPM",
    "weight": 2
  },
  {
    "theme": "Risk management",
    "synonyms": "risk management|risk mitigation|risk register|risk analysis|risk assessment|raid log|contingency planning|issue management",
    "weightTier": "Tier 2",
    "track": "TPM",
    "weight": 2
  },
  {
    "theme": "Dependency management",
    "synonyms": "dependencies|dependency management|interdependencies|cross-team dependencies|upstream|downstream|blockers|critical path",
    "weightTier": "Tier 2",
    "track": "TPM",
    "weight": 2
  },
  {
    "theme": "Change management TPM",
    "synonyms": "change management|change control|cab|crb|change advisory board|change request|rfc",
    "weightTier": "Tier 2",
    "track": "TPM",
    "weight": 2
  },
  {
    "theme": "Release management TPM",
    "synonyms": "release management|release planning|release governance|release cycles|deployment|go-live|release train|deployment pipeline",
    "weightTier": "Tier 2",
    "track": "TPM",
    "weight": 2
  },
  {
    "theme": "SDLC Agile Waterfall",
    "synonyms": "sdlc|agile|scrum|waterfall|kanban|safe|scaled agile|sprint|backlog|user story|jira|confluence|retrospective|standup",
    "weightTier": "Tier 1",
    "track": "TPM",
    "weight": 2
  },
  {
    "theme": "Enterprise systems",
    "synonyms": "enterprise systems|enterprise platforms|enterprise applications|erp|sap|oracle ebs|workday|peoplesoft",
    "weightTier": "Tier 3",
    "track": "TPM",
    "weight": 2
  },
  {
    "theme": "Cloud migration TPM",
    "synonyms": "cloud migration|cloud transition|aws|azure|gcp|cloud transformation|lift and shift|replatform|refactor",
    "weightTier": "Tier 3",
    "track": "TPM",
    "weight": 2
  },
  {
    "theme": "Datacenter migration",
    "synonyms": "datacenter migration|data center migration|datacenter consolidation|infrastructure migration|dc migration|colocation|on-prem to cloud",
    "weightTier": "Tier 3",
    "track": "TPM",
    "weight": 2
  },
  {
    "theme": "High availability",
    "synonyms": "high availability|reliability|uptime|sre|resilience|fault tolerance|disaster recovery|dr|business continuity|bcp",
    "weightTier": "Tier 3",
    "track": "TPM",
    "weight": 2
  },
  {
    "theme": "Vendor management",
    "synonyms": "vendor management|third-party|third party|supplier management|partner management|outsourcing|sow|statement of work|msa|procurement",
    "weightTier": "Tier 2",
    "track": "TPM",
    "weight": 2
  },
  {
    "theme": "IT delivery management",
    "synonyms": "it delivery|delivery manager|service delivery manager|it delivery management|delivery lead|delivery head|sdm",
    "weightTier": "Tier 1",
    "track": "ITDM",
    "weight": 2
  },
  {
    "theme": "Service delivery",
    "synonyms": "service delivery|service management|managed services|service operations|service ops|managed service provider|msp",
    "weightTier": "Tier 1",
    "track": "ITDM",
    "weight": 2
  },
  {
    "theme": "SLA management",
    "synonyms": "sla|service level|service level agreement|slo|kpi|olap|ola|service level objective|availability sla|response time",
    "weightTier": "Tier 1",
    "track": "ITDM",
    "weight": 2
  },
  {
    "theme": "Incident management",
    "synonyms": "incident management|incident response|major incident|critical incident|mim|p1|p2|sev1|sev-1|war room|incident commander",
    "weightTier": "Tier 1",
    "track": "ITDM",
    "weight": 2
  },
  {
    "theme": "Problem management",
    "synonyms": "problem management|root cause|rca|root cause analysis|known error|kedb|permanent fix|workaround",
    "weightTier": "Tier 2",
    "track": "ITDM",
    "weight": 2
  },
  {
    "theme": "Change management ITDM",
    "synonyms": "change management|change control|cab|crb|change advisory board|change request|rfc|change window",
    "weightTier": "Tier 2",
    "track": "ITDM",
    "weight": 2
  },
  {
    "theme": "Release management ITDM",
    "synonyms": "release management|release planning|deployment|release governance|release train|rollback|release cycle",
    "weightTier": "Tier 2",
    "track": "ITDM",
    "weight": 2
  },
  {
    "theme": "ITIL",
    "synonyms": "itil|itil v4|itil v3|itsm|it service management|service now|servicenow|remedy|bmc",
    "weightTier": "Tier 1",
    "track": "ITDM",
    "weight": 2
  },
  {
    "theme": "ServiceNow ITDM",
    "synonyms": "servicenow|snow|service now|snow developer|snow admin|snow itsm|snow itom",
    "weightTier": "Tier 2",
    "track": "ITDM",
    "weight": 2
  },
  {
    "theme": "Operations management",
    "synonyms": "operations management|it operations|run operations|noc|network operations center|operations leadership|ops manager|head of operations",
    "weightTier": "Tier 2",
    "track": "ITDM",
    "weight": 2
  },
  {
    "theme": "Production support",
    "synonyms": "production support|prod support|application support|l2 support|l3 support|tier 2|tier 3|24x7|on-call|oncall|runbook",
    "weightTier": "Tier 2",
    "track": "ITDM",
    "weight": 2
  },
  {
    "theme": "Uptime availability",
    "synonyms": "availability|uptime|24x7|business continuity|five nines|99.9|99.99|resilience|zero downtime",
    "weightTier": "Tier 2",
    "track": "ITDM",
    "weight": 2
  },
  {
    "theme": "Stakeholder management ITDM",
    "synonyms": "stakeholder management|client management|customer management|business stakeholders|client relationship|customer success",
    "weightTier": "Tier 2",
    "track": "ITDM",
    "weight": 2
  },
  {
    "theme": "Service improvement",
    "synonyms": "service improvement|continual service improvement|csi|process improvement|service optimization|quality improvement",
    "weightTier": "Tier 3",
    "track": "ITDM",
    "weight": 2
  },
  {
    "theme": "CRM support cloud ops",
    "synonyms": "crm support|cloud operations|cloudops|salesforce support|siebel support|application operations|appops|platform ops",
    "weightTier": "Tier 3",
    "track": "ITDM",
    "weight": 2
  },
  {
    "theme": "Product management",
    "synonyms": "product management|product manager|product mgmt|product owner|senior product manager|principal product manager|group product manager",
    "weightTier": "Tier 1",
    "track": "PM",
    "weight": 2
  },
  {
    "theme": "Product strategy",
    "synonyms": "product strategy|product vision|product thesis|product direction|strategic product|product principles|north star metric",
    "weightTier": "Tier 1",
    "track": "PM",
    "weight": 2
  },
  {
    "theme": "Product roadmap",
    "synonyms": "product roadmap|roadmap|feature roadmap|release roadmap|product planning|quarterly roadmap|multi-quarter roadmap",
    "weightTier": "Tier 1",
    "track": "PM",
    "weight": 2
  },
  {
    "theme": "Customer discovery",
    "synonyms": "customer discovery|customer interviews|voice of customer|voc|customer needs|customer feedback|jobs to be done|jtbd|customer insights",
    "weightTier": "Tier 1",
    "track": "PM",
    "weight": 2
  },
  {
    "theme": "User research",
    "synonyms": "user research|ux research|user testing|usability testing|user interviews|user personas|user journey|customer journey",
    "weightTier": "Tier 2",
    "track": "PM",
    "weight": 2
  },
  {
    "theme": "Product analytics",
    "synonyms": "product analytics|amplitude|mixpanel|pendo|heap|fullstory|hotjar|user behavior analytics|funnel analysis|retention analysis|cohort analysis",
    "weightTier": "Tier 1",
    "track": "PM",
    "weight": 2
  },
  {
    "theme": "A/B testing / experimentation",
    "synonyms": "a/b test|a/b testing|ab test|split test|experimentation|experiment|multivariate test|feature flag|optimizely|launchdarkly|statistical significance",
    "weightTier": "Tier 1",
    "track": "PM",
    "weight": 2
  },
  {
    "theme": "Product-market fit",
    "synonyms": "product-market fit|pmf|product market fit|market fit|early adopters|growth loop|activation|engagement metrics|dau|mau",
    "weightTier": "Tier 1",
    "track": "PM",
    "weight": 2
  },
  {
    "theme": "Product launch / GTM",
    "synonyms": "product launch|launch|gtm|go-to-market|go to market|beta launch|ga launch|general availability|launch plan|launch readiness|rollout",
    "weightTier": "Tier 1",
    "track": "PM",
    "weight": 2
  },
  {
    "theme": "Stakeholder management PM",
    "synonyms": "stakeholder management|executive stakeholders|leadership alignment|stakeholder alignment|cross-functional stakeholders|business partners|internal customers",
    "weightTier": "Tier 2",
    "track": "PM",
    "weight": 2
  },
  {
    "theme": "Cross-functional leadership PM",
    "synonyms": "cross-functional|cross functional|xfn|engineering partnership|design partnership|marketing partnership|sales enablement|cross-team|multi-disciplinary",
    "weightTier": "Tier 2",
    "track": "PM",
    "weight": 2
  },
  {
    "theme": "Data-driven decisions",
    "synonyms": "data-driven|data driven|data-informed|metrics-driven|kpi-driven|quantitative|analytics-driven|hypothesis-driven",
    "weightTier": "Tier 2",
    "track": "PM",
    "weight": 2
  },
  {
    "theme": "OKRs / KPIs",
    "synonyms": "okrs|okr|objectives and key results|kpis|kpi|key performance indicator|north star|success metrics|leading indicators|lagging indicators",
    "weightTier": "Tier 2",
    "track": "PM",
    "weight": 2
  },
  {
    "theme": "Agile / Scrum PM",
    "synonyms": "agile|scrum|kanban|sprint|backlog|user story|acceptance criteria|story points|sprint planning|sprint review|retrospective",
    "weightTier": "Tier 3",
    "track": "PM",
    "weight": 2
  },
  {
    "theme": "SaaS / B2B product",
    "synonyms": "saas|b2b|b2c|b2b2c|enterprise software|platform|api product|paas|subscription|freemium|self-serve|plg|product-led growth",
    "weightTier": "Tier 2",
    "track": "PM",
    "weight": 2
  }
];

export const MASTER_BULLETS: BulletDef[] = [
  {
    "track": "🤖 AI",
    "theme": "AI transformation",
    "bullet": "Led enterprise AI transformation across [X] business units — delivered [$XM] in productivity gains and reduced manual effort by [X]% through GenAI-driven workflows.",
    "trackId": "AI"
  },
  {
    "track": "🤖 AI",
    "theme": "Digital transformation",
    "bullet": "Directed digital transformation program spanning [X] applications and [X] users — modernized legacy platforms and achieved [X]% reduction in operational cost within [X] months.",
    "trackId": "AI"
  },
  {
    "track": "🤖 AI",
    "theme": "Generative AI / GenAI",
    "bullet": "Architected GenAI/LLM solution using [OpenAI/Claude/Gemini] with RAG pipeline — reduced content creation time by [X]% and improved customer response accuracy by [X]%.",
    "trackId": "AI"
  },
  {
    "track": "🤖 AI",
    "theme": "Intelligent automation",
    "bullet": "Deployed intelligent automation (RPA + AI) across [X] business processes — automated [X] manual workflows, saving [X] FTE hours annually.",
    "trackId": "AI"
  },
  {
    "track": "🤖 AI",
    "theme": "AI adoption / AI strategy",
    "bullet": "Defined enterprise AI strategy and roadmap in partnership with C-suite — established AI Center of Excellence and governed [X]+ AI initiatives across [X] departments.",
    "trackId": "AI"
  },
  {
    "track": "🤖 AI",
    "theme": "Transformation roadmap",
    "bullet": "Built multi-year transformation roadmap aligning [X] workstreams with target operating model — secured [$XM] budget and achieved [X]% milestone completion on schedule.",
    "trackId": "AI"
  },
  {
    "track": "🤖 AI",
    "theme": "Enterprise modernization",
    "bullet": "Modernized [X] legacy applications to cloud-native architecture — reduced technical debt by [X]% and improved system availability from [X]% to [X]%.",
    "trackId": "AI"
  },
  {
    "track": "🤖 AI",
    "theme": "Change management",
    "bullet": "Led change management for [X] transformation initiatives affecting [X]+ employees — achieved [X]% adoption rate through structured communication, training, and Prosci/ADKAR framework.",
    "trackId": "AI"
  },
  {
    "track": "🤖 AI",
    "theme": "Stakeholder governance",
    "bullet": "Established governance framework with [X] executive steering committees — drove alignment across [X] business units and accelerated decision-making by [X]%.",
    "trackId": "AI"
  },
  {
    "track": "🤖 AI",
    "theme": "CRM transformation",
    "bullet": "Led CRM transformation (Salesforce/Dynamics) for [X] users — consolidated [X] legacy systems, improved sales productivity by [X]%, and boosted customer NPS by [X] points.",
    "trackId": "AI"
  },
  {
    "track": "🤖 AI",
    "theme": "Salesforce / ServiceNow",
    "bullet": "Managed Salesforce/ServiceNow platform delivery across [X] instances — implemented [X] custom apps and achieved [X]% user adoption within [X] months of go-live.",
    "trackId": "AI"
  },
  {
    "track": "🤖 AI",
    "theme": "Cloud migration",
    "bullet": "Led cloud migration of [X] applications to [AWS/Azure/GCP] — reduced infrastructure cost by [X]%, improved deployment velocity [X]×, and completed [X] months ahead of plan.",
    "trackId": "AI"
  },
  {
    "track": "🤖 AI",
    "theme": "Process optimization",
    "bullet": "Optimized [X] core business processes using Lean/Six Sigma — eliminated [X] hours of manual work per week and reduced cycle time by [X]%.",
    "trackId": "AI"
  },
  {
    "track": "🤖 AI",
    "theme": "Operating model transformation",
    "bullet": "Redesigned target operating model for [X] function — restructured [X] teams, clarified [X] roles, and improved throughput by [X]% within [X] quarters.",
    "trackId": "AI"
  },
  {
    "track": "🤖 AI",
    "theme": "Cross-functional leadership",
    "bullet": "Led cross-functional teams of [X]+ across engineering, product, design, and business — delivered [X] initiatives on schedule with [X]% stakeholder satisfaction.",
    "trackId": "AI"
  },
  {
    "track": "⚙️ TPM",
    "theme": "Technical program management",
    "bullet": "Managed [X] concurrent technical programs valued at [$XM] — coordinated [X]+ engineering teams and delivered [X]% on-time milestone completion.",
    "trackId": "TPM"
  },
  {
    "track": "⚙️ TPM",
    "theme": "Program delivery",
    "bullet": "Delivered [X] multi-quarter programs from initiation through launch — met [X]% of scope, budget, and schedule targets across [X] product releases.",
    "trackId": "TPM"
  },
  {
    "track": "⚙️ TPM",
    "theme": "Roadmap execution",
    "bullet": "Owned quarterly roadmap for [X] product areas — defined [X] OKRs, tracked [X] milestones, and delivered [X]% of committed scope per quarter.",
    "trackId": "TPM"
  },
  {
    "track": "⚙️ TPM",
    "theme": "Cross-functional leadership",
    "bullet": "Coordinated [X]+ engineering, product, and design teams across [X] time zones — resolved [X] critical blockers and accelerated delivery by [X] weeks.",
    "trackId": "TPM"
  },
  {
    "track": "⚙️ TPM",
    "theme": "Stakeholder management",
    "bullet": "Managed executive stakeholders including [VPs/Directors] across [X] business units — delivered weekly status readouts and drove alignment on [X] critical decisions.",
    "trackId": "TPM"
  },
  {
    "track": "⚙️ TPM",
    "theme": "Risk management",
    "bullet": "Maintained active RAID log with [X]+ risks/issues per program — mitigated [X] critical risks pre-launch and prevented [X] production incidents.",
    "trackId": "TPM"
  },
  {
    "track": "⚙️ TPM",
    "theme": "Dependency management",
    "bullet": "Tracked [X]+ inter-team dependencies across [X] engineering orgs — proactively unblocked [X] critical-path items and reduced schedule slippage by [X]%.",
    "trackId": "TPM"
  },
  {
    "track": "⚙️ TPM",
    "theme": "Change management (TPM)",
    "bullet": "Chaired Change Advisory Board (CAB) reviewing [X] change requests weekly — approved [X] releases with zero rollback events over [X] months.",
    "trackId": "TPM"
  },
  {
    "track": "⚙️ TPM",
    "theme": "Release management",
    "bullet": "Managed [X] production releases across [X] services — established release train cadence and achieved [X]% deployment success rate.",
    "trackId": "TPM"
  },
  {
    "track": "⚙️ TPM",
    "theme": "SDLC / Agile / Scrum",
    "bullet": "Championed Agile/Scrum practices across [X] teams — facilitated [X] sprints, drove [X]% velocity improvement, and coached [X] Scrum Masters.",
    "trackId": "TPM"
  },
  {
    "track": "⚙️ TPM",
    "theme": "Enterprise systems",
    "bullet": "Managed enterprise platform programs (ERP/SAP/Oracle) impacting [X] users — delivered [X] modules on time and reduced total cost of ownership by [X]%.",
    "trackId": "TPM"
  },
  {
    "track": "⚙️ TPM",
    "theme": "Cloud migration (TPM)",
    "bullet": "Program-managed cloud migration of [X] workloads to [AWS/Azure/GCP] — coordinated [X] teams, retired [X] legacy systems, and cut infra spend by [X]%.",
    "trackId": "TPM"
  },
  {
    "track": "⚙️ TPM",
    "theme": "Datacenter migration",
    "bullet": "Delivered datacenter consolidation of [X] sites into [X] regional hubs — migrated [X] applications with [X] hours planned downtime and zero data loss.",
    "trackId": "TPM"
  },
  {
    "track": "⚙️ TPM",
    "theme": "High availability / SRE",
    "bullet": "Improved platform availability from [X]% to [X]% by partnering with SRE — reduced MTTR by [X]% and achieved 99.9%+ uptime SLA for [X] months running.",
    "trackId": "TPM"
  },
  {
    "track": "⚙️ TPM",
    "theme": "Vendor management",
    "bullet": "Managed [X] strategic vendors with combined [$XM] spend — negotiated SOWs, tracked SLA compliance, and achieved [X]% cost savings on renewal.",
    "trackId": "TPM"
  },
  {
    "track": "🛠️ ITDM",
    "theme": "IT delivery management",
    "bullet": "Led IT delivery for [X] business-critical applications across [X]+ users — met [X]% of SLA targets and reduced production incidents by [X]%.",
    "trackId": "ITDM"
  },
  {
    "track": "🛠️ ITDM",
    "theme": "Service delivery",
    "bullet": "Owned end-to-end service delivery for [X] managed services — achieved [X]% customer satisfaction (CSAT) and reduced tickets by [X]% YoY.",
    "trackId": "ITDM"
  },
  {
    "track": "🛠️ ITDM",
    "theme": "SLA management",
    "bullet": "Governed SLA compliance across [X] services — achieved [X]% adherence to response and resolution SLAs, avoiding [$XK] in service credit penalties.",
    "trackId": "ITDM"
  },
  {
    "track": "🛠️ ITDM",
    "theme": "Incident management",
    "bullet": "Led major-incident (P1/P2) response for [X] critical outages — reduced MTTR from [X] to [X] minutes and drove postmortem/RCA to closure within [X] hours.",
    "trackId": "ITDM"
  },
  {
    "track": "🛠️ ITDM",
    "theme": "Problem management",
    "bullet": "Drove problem management program — identified [X] recurring incidents, delivered [X] permanent fixes, and reduced repeat P1 volume by [X]%.",
    "trackId": "ITDM"
  },
  {
    "track": "🛠️ ITDM",
    "theme": "Change management (ITDM)",
    "bullet": "Chaired weekly CAB for [X] change requests — approved [X] releases with [X]% success rate and zero unplanned rollbacks.",
    "trackId": "ITDM"
  },
  {
    "track": "🛠️ ITDM",
    "theme": "Release management",
    "bullet": "Coordinated [X] production releases per quarter across [X] applications — achieved [X]% first-time success rate and zero SEV1 incidents post-deployment.",
    "trackId": "ITDM"
  },
  {
    "track": "🛠️ ITDM",
    "theme": "ITIL",
    "bullet": "Implemented ITIL v4 practices across [X] service management functions — improved service ticket handling by [X]% and passed [X] ISO 20000/audit reviews.",
    "trackId": "ITDM"
  },
  {
    "track": "🛠️ ITDM",
    "theme": "ServiceNow",
    "bullet": "Led ServiceNow platform implementation/expansion — configured [X] workflows (ITSM/ITOM/ITBM), automated [X] processes, and improved fulfillment speed by [X]%.",
    "trackId": "ITDM"
  },
  {
    "track": "🛠️ ITDM",
    "theme": "Operations management",
    "bullet": "Directed 24×7 IT operations spanning [X] applications and [X]+ users — maintained [X]% availability and led [X]-person operations team.",
    "trackId": "ITDM"
  },
  {
    "track": "🛠️ ITDM",
    "theme": "Production support",
    "bullet": "Ran L2/L3 production support for [X] mission-critical applications — resolved [X]+ tickets/month with [X]% within SLA and [X]% first-call resolution.",
    "trackId": "ITDM"
  },
  {
    "track": "🛠️ ITDM",
    "theme": "Platform availability / uptime",
    "bullet": "Maintained platform availability of [X]% (99.9%+) across [X] services — implemented resilience patterns and reduced unplanned downtime by [X] hours/year.",
    "trackId": "ITDM"
  },
  {
    "track": "🛠️ ITDM",
    "theme": "Stakeholder management (ITDM)",
    "bullet": "Managed executive/client stakeholder relationships across [X] accounts — delivered monthly service reviews and achieved [X]% renewal rate with [X] key accounts.",
    "trackId": "ITDM"
  },
  {
    "track": "🛠️ ITDM",
    "theme": "Service improvement (CSI)",
    "bullet": "Led continual service improvement (CSI) initiatives — identified [X] quick wins, delivered [X]% ticket reduction, and improved MTTR by [X] minutes.",
    "trackId": "ITDM"
  },
  {
    "track": "🛠️ ITDM",
    "theme": "CRM support / cloud operations",
    "bullet": "Managed CloudOps/CRM support for [X] production instances (Salesforce/Siebel) — sustained [X]% platform uptime and reduced escalations by [X]%.",
    "trackId": "ITDM"
  },
  {
    "track": "📦 PM",
    "theme": "Product management",
    "bullet": "Owned end-to-end product lifecycle for [Product/Platform], driving [X]% increase in monthly active users and generating [$XM] in annualized recurring revenue.",
    "trackId": "PM"
  },
  {
    "track": "📦 PM",
    "theme": "Product strategy",
    "bullet": "Defined 3-year product vision and strategic north star metrics across [X] customer segments, aligning [X] executive stakeholders on multi-quarter roadmaps.",
    "trackId": "PM"
  },
  {
    "track": "📦 PM",
    "theme": "Product roadmap",
    "bullet": "Constructed outcome-driven product roadmap balancing tech debt with feature velocity, achieving [X]% on-time milestone delivery across [X] quarterly releases.",
    "trackId": "PM"
  },
  {
    "track": "📦 PM",
    "theme": "Customer discovery",
    "bullet": "Conducted [X]+ customer discovery interviews and synthesized Voice of Customer (VoC) feedback into high-priority backlog epics, boosting NPS by [X] pts.",
    "trackId": "PM"
  },
  {
    "track": "📦 PM",
    "theme": "User research",
    "bullet": "Partnered with UX research to run [X] usability testing cycles, reducing customer onboarding friction and lowering time-to-first-value by [X]%.",
    "trackId": "PM"
  },
  {
    "track": "📦 PM",
    "theme": "Product analytics",
    "bullet": "Built granular product telemetry in [Amplitude/Mixpanel/FullStory], identifying drop-off bottlenecks and improving core conversion funnel by [X]%.",
    "trackId": "PM"
  },
  {
    "track": "📦 PM",
    "theme": "A/B testing / experimentation",
    "bullet": "Designed and executed [X]+ A/B experiments on pricing/packaging and feature activation, delivering a statistically significant [X]% lift in trial-to-paid conversion.",
    "trackId": "PM"
  },
  {
    "track": "📦 PM",
    "theme": "Product-market fit",
    "bullet": "Identified high-growth ICP and accelerated product-market fit (PMF), scaling DAU/MAU ratio from [X]% to [X]% and reducing customer churn by [X]%.",
    "trackId": "PM"
  },
  {
    "track": "📦 PM",
    "theme": "Product launch / GTM",
    "bullet": "Led cross-functional GTM launch for [Feature/Product], training [X] sales/CS reps, acquiring [X]+ beta users in week 1, and exceeding pipeline target by [X]%.",
    "trackId": "PM"
  },
  {
    "track": "📦 PM",
    "theme": "Stakeholder management PM",
    "bullet": "Managed executive alignment across Sales, Marketing, CS, and Engineering, securing buy-in for [X] tier-1 product initiatives.",
    "trackId": "PM"
  },
  {
    "track": "📦 PM",
    "theme": "Cross-functional leadership PM",
    "bullet": "Led squad of [X] engineers, designers, and data analysts in agile cadence; maintained high team morale and improved velocity by [X]%.",
    "trackId": "PM"
  },
  {
    "track": "📦 PM",
    "theme": "Data-driven decisions",
    "bullet": "Established quantitative decision frameworks prioritizing features by expected ROI, customer impact, and engineering feasibility.",
    "trackId": "PM"
  },
  {
    "track": "📦 PM",
    "theme": "OKRs / KPIs",
    "bullet": "Established quarterly product OKRs tied directly to corporate revenue targets, surpassing all [X] key results by an average of [X]%.",
    "trackId": "PM"
  },
  {
    "track": "📦 PM",
    "theme": "Agile / Scrum PM",
    "bullet": "Spearheaded backlog grooming, sprint planning, and user story definitions for [X] squads, decreasing sprint spillover from [X]% to [X]%.",
    "trackId": "PM"
  },
  {
    "track": "📦 PM",
    "theme": "SaaS / B2B product",
    "bullet": "Scaled enterprise B2B SaaS platform serving [X]+ enterprise logos, implementing self-serve PLG motions alongside high-touch enterprise workflows.",
    "trackId": "PM"
  }
];

export interface AdditionalFactors {
  patternMatch?: Partial<Record<ArchetypeTrack, number>>;
  companyMatch?: Partial<Record<ArchetypeTrack, number>>;
  redFlagPenalty?: Partial<Record<ArchetypeTrack, number>>;
}

export function evaluateArchetypes(
  jdText: string,
  factors: AdditionalFactors = {}
): ArchetypeAnalysisResult {
  const normalizedJd = (jdText || '').toLowerCase();
  const trackResults: Partial<Record<ArchetypeTrack, TrackScoreResult>> = {};

  const tracks: ArchetypeTrack[] = ['AI', 'TPM', 'ITDM', 'PM'];

  tracks.forEach(track => {
    const meta = TRACK_META[track];
    const themeDefs = MASTER_KEYWORDS.filter(k => k.track === track);

    const themeScores: ThemeScore[] = themeDefs.map(def => {
      const synonymList = def.synonyms.split('|').map(s => s.trim().toLowerCase()).filter(Boolean);
      const matched = synonymList.filter(syn => {
        // Substring match in lowercased JD
        return normalizedJd.includes(syn);
      });

      let autoScore: 0 | 1 | 2 = 0;
      if (matched.length >= 2) {
        autoScore = 2;
      } else if (matched.length === 1) {
        autoScore = 1;
      }

      const weightedScore = autoScore * def.weight;
      const notes = autoScore === 0 ? 'No keyword match' : autoScore === 1 ? '1 variant matched' : '2+ variants matched';

      return {
        theme: def.theme,
        synonyms: synonymList,
        weightTier: def.weightTier,
        weight: def.weight,
        matchedSynonyms: matched,
        autoScore,
        weightedScore,
        notes,
        isHit: autoScore >= 1
      };
    });

    const keywordScore = themeScores.reduce((acc, curr) => acc + curr.weightedScore, 0);
    const patternMatch = factors.patternMatch?.[track] ?? (track === 'TPM' ? 3 : track === 'AI' ? 1 : track === 'ITDM' ? 1 : 3);
    const companyMatch = factors.companyMatch?.[track] ?? (track === 'AI' ? 4 : track === 'TPM' ? 3 : track === 'ITDM' ? 2 : 1);
    const redFlagPenalty = factors.redFlagPenalty?.[track] ?? 0;

    const finalScore = Math.max(0, keywordScore + patternMatch + companyMatch - redFlagPenalty);

    let matchLevel: 'Strong Match' | 'Good Match' | 'Moderate Match' | 'Weak Match' = 'Weak Match';
    let matchLevelColor = 'text-red-400 bg-red-950/40 border-red-800/50';

    if (finalScore >= 32) {
      matchLevel = 'Strong Match';
      matchLevelColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50';
    } else if (finalScore >= 25) {
      matchLevel = 'Good Match';
      matchLevelColor = 'text-blue-400 bg-blue-950/40 border-blue-800/50';
    } else if (finalScore >= 18) {
      matchLevel = 'Moderate Match';
      matchLevelColor = 'text-amber-400 bg-amber-950/40 border-amber-800/50';
    }

    const missingThemes = themeScores
      .filter(t => t.autoScore === 0)
      .slice(0, 5)
      .map((t, idx) => ({
        rank: idx + 1,
        theme: t.theme,
        weight: t.weight,
        boost: '+4 pts',
        action: `Add a bullet mentioning: ${t.theme}`
      }));

    trackResults[track] = {
      track,
      name: meta.name,
      icon: meta.icon,
      tagline: meta.tagline,
      themeScores,
      keywordScore,
      patternMatch,
      companyMatch,
      redFlagPenalty,
      finalScore,
      matchLevel,
      matchLevelColor,
      topMissingKeywords: missingThemes
    };
  });

  // Find best fit
  let bestFitTrack: ArchetypeTrack = 'TPM';
  let highestScore = -1;
  tracks.forEach(track => {
    const score = trackResults[track]!.finalScore;
    if (score > highestScore) {
      highestScore = score;
      bestFitTrack = track;
    }
  });

  const bestFit = trackResults[bestFitTrack]!;

  // Dynamic bullets matching
  const evaluatedBullets: EvaluatedBullet[] = MASTER_BULLETS.map(b => {
    const trackScore = trackResults[b.trackId];
    const themeScore = trackScore?.themeScores.find(ts => ts.theme.toLowerCase() === b.theme.toLowerCase());
    const jdHit = Boolean(themeScore && themeScore.isHit);
    return {
      ...b,
      jdHit,
      isRecommended: jdHit
    };
  });

  return {
    tracks: trackResults as Record<ArchetypeTrack, TrackScoreResult>,
    bestFitTrack,
    bestFit,
    actionItems: [
      `Best-fit archetype identified: ${bestFit.name} (${bestFit.finalScore}/40 - ${bestFit.matchLevel}).`,
      'Review missing keywords in the scorecard and inject relevant high-impact bullets from the Curated Bullet Bank.',
      'Align professional summary title with the target role archetype.'
    ],
    top5Edits: [
      '1) Mirror the top 5 JD keywords in your LaTeX Professional Summary.',
      '2) Add 1 bullet quantifying impact for each top missing keyword theme.',
      '3) Move best-matching role experience and relevant metrics to the top of the Experience section.',
      '4) Re-title resume header to match JD role title and archetype positioning.',
      '5) Add target domain references and cloud/tool ecosystem keywords in your summary.'
    ],
    interviewThemes: `${bestFit.name} Interview Prep: Align your strongest stories to the top-scoring keywords. Prepare STAR examples for change management, governance, and one role-specific technical delivery theme.`,
    bullets: evaluatedBullets
  };
}
