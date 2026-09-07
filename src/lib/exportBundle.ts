import JSZip from "jszip";
import { downloadBlob, ResumeExportData } from "./exportDocx";

export interface ApplicationBundleData {
  candidateName: string;
  roleTitle: string;
  companyName: string;
  resumeData: ResumeExportData;
  coverLetterText: string;
  interviewPrep?: {
    questions: {
      question: string;
      category: string;
      suggestedStarResponse?: {
        situation: string;
        task: string;
        action: string;
        result: string;
      };
      tip: string;
    }[];
    keyTalkingPoints?: string[];
  };
}

export async function generateApplicationBundleZip(data: ApplicationBundleData): Promise<Blob> {
  const zip = new JSZip();
  const folderName = `${data.companyName.replace(/[^a-zA-Z0-9]/g, "_")}_Application_Packet`;
  const folder = zip.folder(folderName) || zip;

  // 1. Resume in Word (.doc) format
  const expHtml = data.resumeData.experience
    .map(
      (exp) => `
      <div style="margin-bottom: 14pt;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 3pt;">
          <tr>
            <td style="font-size: 11pt; font-weight: bold; color: #111827; text-align: left;">
              ${exp.role} &mdash; <span style="font-weight: normal; color: #374151;">${exp.company}</span>
            </td>
            <td style="font-size: 10pt; font-weight: bold; color: #4b5563; text-align: right;">
              ${exp.period} ${exp.location ? `| ${exp.location}` : ""}
            </td>
          </tr>
        </table>
        <ul style="margin: 0; padding-left: 18pt;">
          ${exp.bullets
            .map(
              (b) => `
            <li style="font-size: 10pt; line-height: 1.45; color: #1f2937; margin-bottom: 3.5pt;">
              ${b}
            </li>`
            )
            .join("")}
        </ul>
      </div>
    `
    )
    .join("");

  const skillsHtml = data.resumeData.skills
    .map(
      (s) => `
      <p style="font-size: 10pt; line-height: 1.4; margin: 2pt 0; color: #1f2937;">
        <strong>${s.category}:</strong> ${s.items}
      </p>
    `
    )
    .join("");

  const wordHtml = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${data.candidateName} - Resume</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page { size: 8.5in 11in; margin: 0.7in 0.75in; }
        body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 10.5pt; line-height: 1.45; color: #111827; }
        h1 { font-size: 20pt; font-weight: bold; text-transform: uppercase; margin: 0 0 2pt 0; }
        .header-title { font-size: 12pt; font-weight: bold; color: #4f46e5; margin: 0 0 4pt 0; }
        .contact-line { font-size: 9.5pt; color: #4b5563; margin: 0 0 14pt 0; }
        h2.section-header { font-size: 11pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1pt; border-bottom: 1.5pt solid #111827; padding-bottom: 2pt; margin: 12pt 0 6pt 0; }
        p.summary-text { font-size: 10pt; line-height: 1.5; color: #1f2937; margin: 0 0 10pt 0; }
      </style>
    </head>
    <body>
      <div>
        <h1>${data.candidateName}</h1>
        <div class="header-title">${data.roleTitle}</div>
        <div class="contact-line">
          ${data.resumeData.email} &bull; ${data.resumeData.phone} &bull; ${data.resumeData.location} &bull; ${data.resumeData.linkedin}
        </div>
        <h2 class="section-header">Professional Summary</h2>
        <p class="summary-text">${data.resumeData.summary}</p>
        <h2 class="section-header">Professional Experience & Key Accomplishments</h2>
        ${expHtml}
        <h2 class="section-header">Core Technical Skills & Stack</h2>
        ${skillsHtml}
      </div>
    </body>
    </html>
  `;
  folder.file("01_Tailored_Resume.doc", wordHtml);

  // 2. Resume ATS Plain Text
  const resumeTxt = [
    data.candidateName.toUpperCase(),
    data.roleTitle,
    `${data.resumeData.email} | ${data.resumeData.phone} | ${data.resumeData.location} | ${data.resumeData.linkedin}`,
    "",
    "=".repeat(60),
    "PROFESSIONAL SUMMARY",
    "=".repeat(60),
    data.resumeData.summary,
    "",
    "=".repeat(60),
    "EXPERIENCE & ACCOMPLISHMENTS",
    "=".repeat(60),
    ...data.resumeData.experience.flatMap((exp) => [
      `${exp.role} - ${exp.company} (${exp.period})`,
      ...exp.bullets.map((b) => `  * ${b}`),
      "",
    ]),
    "=".repeat(60),
    "CORE TECHNICAL SKILLS",
    "=".repeat(60),
    ...data.resumeData.skills.map((s) => `${s.category}: ${s.items}`),
  ].join("\n");
  folder.file("01_Tailored_Resume_ATS.txt", resumeTxt);

  // 3. Tailored Cover Letter Word
  const coverLetterHtml = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>Cover Letter - ${data.candidateName}</title>
      <style>
        @page { size: 8.5in 11in; margin: 1in; }
        body { font-family: Calibri, 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.6; color: #111827; }
        h1 { font-size: 18pt; font-weight: bold; margin: 0 0 4pt 0; text-transform: uppercase; }
        .meta { font-size: 10pt; color: #4b5563; margin-bottom: 20pt; }
        .content { margin-top: 14pt; }
      </style>
    </head>
    <body>
      <h1>${data.candidateName}</h1>
      <div class="meta">
        ${data.resumeData.email} &bull; ${data.resumeData.phone} &bull; ${data.resumeData.location}
      </div>
      <p style="margin-bottom: 12pt;">
        <strong>Date:</strong> ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}<br>
        <strong>Company:</strong> ${data.companyName}<br>
        <strong>Position:</strong> ${data.roleTitle}
      </p>
      <div class="content">
        ${data.coverLetterText
          .split("\n\n")
          .map((p) => `<p style="margin-bottom: 12pt;">${p.replace(/\n/g, "<br>")}</p>`)
          .join("")}
      </div>
    </body>
    </html>
  `;
  folder.file("02_Tailored_Cover_Letter.doc", coverLetterHtml);

  // 4. STAR Interview Prep Sheet
  const interviewQuestions = data.interviewPrep?.questions || [
    {
      question: "Describe a high-stakes cloud architecture migration you led under strict uptime SLAs.",
      category: "Technical & Systems Architecture",
      suggestedStarResponse: {
        situation: "Legacy monolith suffered from high latency and scaling bottlenecks under 10M+ daily requests.",
        task: "Architect decoupled serverless microservices with 99.99% availability and zero downtime migration.",
        action: "Designed canary deployments, automated circuit breakers, and orchestrated Kafka streaming pipelines.",
        result: "Reduced p99 latency by 68% and cut annual infrastructure costs by $180,000.",
      },
      tip: "Emphasize cross-functional alignment and business ROI over raw technical details.",
    },
    {
      question: "Tell me about a time you resolved a major stakeholder disagreement regarding technical debt.",
      category: "Leadership & Stakeholder Alignment",
      suggestedStarResponse: {
        situation: "Product leadership wanted to ship 3 new features, but our API layer was at risk of cascading failure.",
        task: "Quantify technical debt risk and align engineering roadmap with product release milestones.",
        action: "Created an impact matrix translating downtime risk into projected revenue loss ($75k/hour).",
        result: "Agreed on a blended 70/30 roadmap allocation, successfully refactoring the API while shipping on time.",
      },
      tip: "Always frame technical decisions in financial impact and user trust.",
    },
  ];

  const interviewCheatSheet = [
    `# STAR INTERVIEW PREPARATION CHEAT SHEET`,
    `Target Role: ${data.roleTitle} | Company: ${data.companyName}`,
    `Candidate: ${data.candidateName} | Date: ${new Date().toLocaleDateString()}`,
    `================================================================================`,
    ``,
    `## CORE TALKING POINTS (YOUR UNFAIR ADVANTAGES):`,
    `1. Proven architectural leadership scaling distributed systems to millions of daily requests.`,
    `2. Direct business ROI mindset: quantified track record of slashing enterprise cloud bills ($180k+).`,
    `3. Cross-functional bridge: successfully aligning product OKRs with robust engineering guardrails.`,
    ``,
    `================================================================================`,
    `## PREDICTED INTERVIEW QUESTIONS & MODEL STAR RESPONSES:`,
    `================================================================================`,
    ``,
    ...interviewQuestions.map((q, idx) => [
      `QUESTION ${idx + 1} [${q.category.toUpperCase()}]:`,
      `"${q.question}"`,
      ``,
      `MODEL STAR FRAMEWORK:`,
      `  • Situation: ${q.suggestedStarResponse?.situation || "Context of the challenge"}`,
      `  • Task:      ${q.suggestedStarResponse?.task || "Core objective and responsibility"}`,
      `  • Action:    ${q.suggestedStarResponse?.action || "Key initiatives and leadership demonstrated"}`,
      `  • Result:    ${q.suggestedStarResponse?.result || "Measurable business outcome and metrics"}`,
      ``,
      `COACH'S TIP: ${q.tip}`,
      `-`.repeat(80),
      ``,
    ]).flat(),
  ].join("\n");
  folder.file("03_STAR_Interview_CheatSheet.txt", interviewCheatSheet);

  // 5. Recruiter & Hiring Manager Outreach InMails
  const outreachTemplates = [
    `RECRUITER & HIRING MANAGER OUTREACH SCRIPTS`,
    `Role: ${data.roleTitle} at ${data.companyName}`,
    `================================================================================`,
    ``,
    `TEMPLATE 1: LinkedIn InMail to Hiring Manager / Engineering Director`,
    `Subject: ${data.roleTitle} opening @ ${data.companyName} - Quick question`,
    ``,
    `Hi [Hiring Manager Name],`,
    ``,
    `I saw that your team at ${data.companyName} is hiring a ${data.roleTitle}. With 7+ years designing high-throughput cloud microservices and slashing infrastructure costs (most recently by $180k at my current role), I've been following ${data.companyName}'s work in scaling modern platforms.`,
    ``,
    `I've submitted my application through your careers portal, but wanted to reach out directly to express my genuine enthusiasm. Would you be open to a brief 10-minute chat next week to see if my background aligns with your team's upcoming roadmap?`,
    ``,
    `Best regards,`,
    `${data.candidateName}`,
    `${data.resumeData.linkedin}`,
    ``,
    `================================================================================`,
    `TEMPLATE 2: Cold Email to Internal Talent Partner / Recruiter`,
    `Subject: Application for ${data.roleTitle} (Ref: ${data.candidateName})`,
    ``,
    `Hi [Recruiter Name],`,
    ``,
    `I hope your week is going well! I recently applied for the ${data.roleTitle} position at ${data.companyName}.`,
    ``,
    `My background combines deep cloud architecture with proven business impact—improving system throughput by 42% and reducing p99 latency across 12M daily requests. I'd love to connect and learn more about what ${data.companyName} looks for in this hire.`,
    ``,
    `I have attached my tailored resume for your review. Thanks for your time!`,
    ``,
    `Warmly,`,
    `${data.candidateName}`,
    `${data.resumeData.phone} | ${data.resumeData.email}`,
    ``,
    `================================================================================`,
    `TEMPLATE 3: Warm Employee Referral Request`,
    `Hi [Contact Name],`,
    ``,
    `Hope all is well! I noticed an exciting ${data.roleTitle} opening on your team at ${data.companyName}. Given our shared connection / your great experience there, I would love to ask you a couple of quick questions about the culture and engineering direction.`,
    ``,
    `If you think there might be a mutual fit, I'd be honored if you'd consider submitting an internal referral on my behalf. Happy to send over my portfolio and tailored resume whenever convenient!`,
    ``,
    `Cheers,`,
    `${data.candidateName}`,
  ].join("\n");
  folder.file("04_Recruiter_Outreach_InMail.txt", outreachTemplates);

  // 6. Application Strategy & Follow-up Checklist
  const strategyChecklist = [
    `APPLICATION & INTERVIEW EXECUTION CHECKLIST`,
    `================================================================================`,
    `1. APPLICATION SUBMISSION:`,
    `   [ ] Submit '01_Tailored_Resume.doc' or vector PDF to the portal.`,
    `   [ ] Upload '02_Tailored_Cover_Letter.doc' as an attached supporting document.`,
    `   [ ] Confirm all contact URLs (LinkedIn, GitHub, Portfolio) are active.`,
    ``,
    `2. OUTREACH TIMELINE:`,
    `   [ ] Day 0 (Today): Submit application through portal.`,
    `   [ ] Day 1: Send Template 1 (LinkedIn InMail) to the Hiring Manager.`,
    `   [ ] Day 3: Send Template 2 to the lead Recruiter if no response yet.`,
    `   [ ] Day 7: Polite follow-up email re-affirming strong interest.`,
    ``,
    `3. INTERVIEW READINESS:`,
    `   [ ] Review '03_STAR_Interview_CheatSheet.txt' before each phone screen.`,
    `   [ ] Practice your 30-second elevator pitch out loud 3 times.`,
    `   [ ] Have 2 questions prepared for the interviewer regarding engineering roadmap.`,
    ``,
    `Generated by ResumePilot AI Suite — Good luck with your application!`,
  ].join("\n");
  folder.file("README_Application_Strategy.txt", strategyChecklist);

  // Generate the zip blob
  return await zip.generateAsync({ type: "blob" });
}

export async function downloadApplicationBundle(data: ApplicationBundleData) {
  const blob = await generateApplicationBundleZip(data);
  const filename = `${data.candidateName.replace(/[^a-zA-Z0-9]/g, "_")}_${data.companyName.replace(/[^a-zA-Z0-9]/g, "_")}_Packet.zip`;
  downloadBlob(blob, filename);
}
