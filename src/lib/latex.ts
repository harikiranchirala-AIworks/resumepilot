import type { ResumeTemplateId, ResumeTemplateInfo } from "./types";

export const RESUME_TEMPLATES: ResumeTemplateInfo[] = [
  {
    id: "tech-standard",
    name: "Tech Standard (Jake's)",
    description: "Industry-standard single column with crisp dividers and high ATS parse rate.",
    bestFor: "Software Engineers, Tech Roles & Product Managers",
  },
  {
    id: "modern-clean",
    name: "Modern Clean",
    description: "Sleek typography, subtle section rules, and clear visual hierarchy.",
    bestFor: "Business, Marketing, Design & Startups",
  },
  {
    id: "classic-academic",
    name: "Classic Academic",
    description: "Formal serif layout with elegant Roman section headers.",
    bestFor: "Academic, Research, Finance, Legal & Healthcare",
  },
  {
    id: "compact-executive",
    name: "Compact Executive",
    description: "Tight margins and dense structure engineered to fit maximum experience on 1-2 pages.",
    bestFor: "Senior Executives, Directors & 10+ Years Experience",
  },
  {
    id: "creative-bold",
    name: "Creative Bold",
    description: "Bold header banners, vibrant accents, and high-impact visual section divides.",
    bestFor: "Creative Tech, Product Designers & Growth Leads",
  },
];

/** Escape special LaTeX characters in user-provided text */
export function escapeLatex(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/[&%$#_{}]/g, (m) => `\\${m}`)
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

/** Extract body from between \begin{document} and \end{document} */
export function extractLatexBody(fullLatex: string): string {
  if (!fullLatex) return "";
  const docStart = fullLatex.indexOf("\\begin{document}");
  const docEnd = fullLatex.lastIndexOf("\\end{document}");

  if (docStart !== -1 && docEnd !== -1 && docEnd > docStart) {
    return fullLatex.substring(docStart + "\\begin{document}".length, docEnd).trim();
  }
  return fullLatex.trim();
}

/** Preambles for each template style */
function getTemplatePreamble(templateId: ResumeTemplateId = "tech-standard"): string {
  switch (templateId) {
    case "creative-bold":
      return `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=0.6in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage{lmodern}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{hyperref}

\\hypersetup{colorlinks=true, linkcolor=blue, urlcolor=blue}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

\\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{10pt}{4pt}
\\setlist[itemize]{leftmargin=*, nosep, topsep=2pt, itemsep=2.5pt}
`;

    case "modern-clean":
      return `\\documentclass[10.5pt,letterpaper]{article}
\\usepackage[margin=0.65in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage{lmodern}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{hyperref}

\\hypersetup{colorlinks=true, linkcolor=black, urlcolor=blue}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{10pt}{4pt}
\\setlist[itemize]{leftmargin=*, nosep, topsep=2pt, itemsep=2pt}
`;

    case "classic-academic":
      return `\\documentclass[11pt,letterpaper]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage{lmodern}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{hyperref}

\\hypersetup{colorlinks=true, linkcolor=black, urlcolor=blue}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{12pt}{6pt}
\\setlist[itemize]{leftmargin=1.5em, nosep, itemsep=3pt}
`;

    case "compact-executive":
      return `\\documentclass[10pt,letterpaper]{article}
\\usepackage[margin=0.5in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage{lmodern}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{hyperref}

\\hypersetup{colorlinks=true, linkcolor=black, urlcolor=blue}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{0pt}

\\titleformat{\\section}{\\normalsize\\bfseries}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{8pt}{3pt}
\\setlist[itemize]{leftmargin=*, nosep, topsep=1pt, itemsep=1.5pt}
`;

    case "tech-standard":
    default:
      return `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=0.7in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage{lmodern}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{hyperref}

\\hypersetup{colorlinks=true, linkcolor=black, urlcolor=blue}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{11pt}{5pt}
\\setlist[itemize]{leftmargin=*, nosep, topsep=2pt, itemsep=2.5pt}
`;
  }
}

/** ATS-friendly LaTeX resume shell */
export function buildLatexDocument(
  body: string,
  templateId: ResumeTemplateId = "tech-standard"
): string {
  const cleanBody = extractLatexBody(body);
  const preamble = getTemplatePreamble(templateId);

  return `${preamble}
\\begin{document}
${cleanBody}
\\end{document}
`;
}

/** Smart heuristic parser to extract structured information from raw text */
function parseResumeInfo(text: string, defaultName = "Candidate", defaultContact = "candidate@example.com $|$ (555) 019-2834") {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  let name = defaultName;
  let contact = defaultContact;

  // First non-empty line is usually the candidate's name
  if (lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.length < 50 && !firstLine.includes("@") && !firstLine.toLowerCase().startsWith("summary")) {
      name = firstLine;
    }
  }

  // Look for email / phone on top lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line.includes("@") || line.includes("linkedin") || /\d{3}[-\s.]\d{3}/.test(line)) {
      contact = escapeLatex(line).replace(/\|/g, "$|$");
      break;
    }
  }

  return { name: escapeLatex(name), contact };
}

/** Fallback template when AI is unavailable */
export function buildFallbackLatex(
  profileText: string,
  jobDescription: string,
  templateId: ResumeTemplateId = "tech-standard"
): string {
  const { name, contact } = parseResumeInfo(profileText);

  // Extract key skills/phrases from profile & JD
  const jdKeywords = jobDescription
    .split(/[\s,.;:()]+/)
    .filter((w) => w.length > 4 && !/^(about|their|which|these|would|should|could|years|experience|requirements)$/i.test(w))
    .slice(0, 8);

  const keywordsList = jdKeywords.length > 0 ? jdKeywords.map(escapeLatex).join(", ") : "System Architecture, Cloud Infrastructure, Agile Delivery";

  const body = `
\\begin{center}
  {\\LARGE \\textbf{${name}}}\\\\[4pt]
  {\\small ${contact}}
\\end{center}

\\vspace{4pt}

\\section*{Professional Summary}
Results-driven professional with proven expertise in driving technical innovation, cross-functional delivery, and scalable systems. Demonstrated success tailoring solutions to high-impact organizational priorities, optimizing operational efficiency, and aligning technical roadmaps with business goals.

\\section*{Technical \\& Professional Skills}
\\textbf{Core Competencies:} ${keywordsList}\\\\
\\textbf{Tools \\& Platforms:} Git, Cloud Services (AWS/GCP), CI/CD Automation, REST APIs, Microservices\\\\
\\textbf{Leadership \\& Practices:} Technical Program Governance, Agile/Scrum, Code Review, Mentorship

\\section*{Professional Experience}
\\textbf{Senior Lead Specialist / Staff Engineer} \\hfill 2021 -- Present\\\\
\\textit{Enterprise Innovations Inc.} \\hfill San Francisco, CA
\\begin{itemize}
  \\item Spearheaded strategic initiatives that improved operational efficiency by 35\\% through targeted automation and workflow streamlining.
  \\item Architected and delivered high-availability core solutions aligned with enterprise best practices, reducing average response latency by 40\\%.
  \\item Mentored and directed cross-functional team of 8 specialists and engineers, achieving 100\\% on-time milestone delivery across quarterly sprints.
\\end{itemize}

\\vspace{4pt}
\\textbf{Software Systems Specialist} \\hfill 2018 -- 2021\\\\
\\textit{Global Solutions Corp.} \\hfill New York, NY
\\begin{itemize}
  \\item Executed mission-critical enhancements resulting in a 28\\% increase in system reliability and customer satisfaction scores.
  \\item Collaborated closely with product and business stakeholders to translate complex requirements into scalable technical deliverables.
  \\item Standardized documentation and automated regression test suites, decreasing team onboarding time by 50\\%.
\\end{itemize}

\\section*{Education \\& Credentials}
\\textbf{Bachelor of Science in Computer Science / Related Field} \\hfill 2018\\\\
University of Technology \\hfill City, State
`;

  return buildLatexDocument(body, templateId);
}

/** Build LaTeX Cover Letter */
export function buildCoverLetterLatex(
  text: string,
  candidateName = "Candidate Name",
  roleTitle = "Target Role",
  companyName = "Hiring Team"
): string {
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => escapeLatex(p.trim()))
    .filter(Boolean);

  const formattedParagraphs = paragraphs
    .map((p) => `${p}\n\n\\vspace{6pt}`)
    .join("\n");

  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=0.85in]{geometry}
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage{lmodern}
\\usepackage{hyperref}

\\hypersetup{colorlinks=true, linkcolor=black, urlcolor=blue}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{6pt}

\\begin{document}

{\\LARGE \\textbf{${escapeLatex(candidateName)}}}\\\\[4pt]
{\\small Email: candidate@example.com $|$ Phone: (555) 123-4567 $|$ LinkedIn: linkedin.com/in/candidate}

\\vspace{12pt}
\\rule{\\textwidth}{0.4pt}
\\vspace{12pt}

\\textbf{Date:} \\today\\\\[4pt]
\\textbf{To:} Hiring Manager / Search Committee\\\\
\\textbf{Company:} ${escapeLatex(companyName)}\\\\
\\textbf{Re:} Application for ${escapeLatex(roleTitle)}

\\vspace{12pt}

${formattedParagraphs}

Sincerely,\\\\[18pt]
\\textbf{${escapeLatex(candidateName)}}

\\end{document}
`;
}
