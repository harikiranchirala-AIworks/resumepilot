export interface ResumeExportData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experience: {
    role: string;
    company: string;
    period: string;
    location: string;
    bullets: string[];
  }[];
  skills: {
    category: string;
    items: string;
  }[];
}

/**
 * Downloads a Blob directly in the browser
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Exports formatted resume to Microsoft Word (.doc / .docx compatible)
 */
export function exportResumeToWord(data: ResumeExportData, filename: string = "Resume.doc") {
  const expHtml = data.experience
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

  const skillsHtml = data.skills
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
      <title>${data.name} - Resume</title>
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
        @page {
          size: 8.5in 11in;
          margin: 0.7in 0.75in 0.7in 0.75in;
          mso-header-margin: 0.5in;
          mso-footer-margin: 0.5in;
          mso-paper-source: 0;
        }
        body {
          font-family: Calibri, 'Segoe UI', Arial, sans-serif;
          font-size: 10.5pt;
          line-height: 1.45;
          color: #111827;
        }
        h1 {
          font-size: 20pt;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5pt;
          margin: 0 0 2pt 0;
          color: #111827;
        }
        .header-title {
          font-size: 12pt;
          font-weight: bold;
          color: #4f46e5;
          margin: 0 0 4pt 0;
        }
        .contact-line {
          font-size: 9.5pt;
          color: #4b5563;
          margin: 0 0 14pt 0;
        }
        h2.section-header {
          font-size: 11pt;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1pt;
          border-bottom: 1.5pt solid #111827;
          padding-bottom: 2pt;
          margin: 12pt 0 6pt 0;
          color: #111827;
        }
        p.summary-text {
          font-size: 10pt;
          line-height: 1.5;
          color: #1f2937;
          margin: 0 0 10pt 0;
        }
      </style>
    </head>
    <body>
      <div>
        <h1>${data.name}</h1>
        <div class="header-title">${data.title}</div>
        <div class="contact-line">
          ${data.email} &bull; ${data.phone} &bull; ${data.location} &bull; ${data.linkedin}
        </div>

        <h2 class="section-header">Professional Summary</h2>
        <p class="summary-text">${data.summary}</p>

        <h2 class="section-header">Professional Experience & Key Accomplishments</h2>
        ${expHtml}

        <h2 class="section-header">Core Technical Skills & Stack</h2>
        ${skillsHtml}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", wordHtml], {
    type: "application/msword;charset=utf-8",
  });
  downloadBlob(blob, filename.endsWith(".doc") || filename.endsWith(".docx") ? filename : `${filename}.doc`);
}

/**
 * Exports clean ATS-formatted plain text
 */
export function exportResumeToTxt(data: ResumeExportData, filename: string = "Resume.txt") {
  const lines: string[] = [];

  lines.push(data.name.toUpperCase());
  lines.push(data.title);
  lines.push(`${data.email} | ${data.phone} | ${data.location} | ${data.linkedin}`);
  lines.push("");
  lines.push("=".repeat(60));
  lines.push("PROFESSIONAL SUMMARY");
  lines.push("=".repeat(60));
  lines.push(data.summary);
  lines.push("");

  lines.push("=".repeat(60));
  lines.push("EXPERIENCE & KEY ACCOMPLISHMENTS");
  lines.push("=".repeat(60));
  for (const exp of data.experience) {
    lines.push(`${exp.role} - ${exp.company} (${exp.period})`);
    for (const b of exp.bullets) {
      lines.push(`  * ${b}`);
    }
    lines.push("");
  }

  lines.push("=".repeat(60));
  lines.push("CORE TECHNICAL SKILLS");
  lines.push("=".repeat(60));
  for (const s of data.skills) {
    lines.push(`${s.category}: ${s.items}`);
  }

  const content = lines.join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  downloadBlob(blob, filename.endsWith(".txt") ? filename : `${filename}.txt`);
}
