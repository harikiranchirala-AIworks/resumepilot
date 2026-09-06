/**
 * Comprehensive LaTeX to Semantic HTML parser for resumes and cover letters.
 * Produces clean, pixel-perfect, ATS-style HTML with typography matching LaTeX output.
 */

export function latexToHtml(latexCode: string, templateId: string = "tech-standard"): string {
  if (!latexCode || !latexCode.trim()) {
    return `<div class="text-slate-400 text-center py-12">No resume content to display.</div>`;
  }

  // 1. Extract body between \begin{document} and \end{document} if present
  let text = latexCode;
  const docStart = text.indexOf("\\begin{document}");
  const docEnd = text.lastIndexOf("\\end{document}");
  if (docStart !== -1 && docEnd !== -1 && docEnd > docStart) {
    text = text.substring(docStart + "\\begin{document}".length, docEnd);
  }

  // 2. Remove comments
  text = text.replace(/(^|[^\\])%.*$/gm, "$1");

  // 3. Normalize newlines
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // 4. Decode LaTeX escaped characters into clean symbols
  text = text
    .replace(/\\&/g, "&amp;")
    .replace(/\\%/g, "%")
    .replace(/\\\$/g, "$")
    .replace(/\\_/g, "_")
    .replace(/\\#/g, "#")
    .replace(/\\textasciitilde\{\}/g, "~")
    .replace(/\\textasciicircum\{\}/g, "^")
    .replace(/\\textbackslash\{\}/g, "\\")
    .replace(/\$\\vert\$/g, "|")
    .replace(/\$\|\$/g, "|")
    .replace(/---/g, "—")
    .replace(/--/g, "–");

  // 5. Transform \href{url}{text}
  text = text.replace(
    /\\href\{([^}]+)\}\{([^}]+)\}/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$2</a>'
  );

  // 6. Handle name / top center headers:
  // e.g. \begin{center} {\LARGE \textbf{Alex Morgan}}\\[4pt] {\small ...} \end{center}
  text = text.replace(
    /\\begin\{center\}([\s\S]*?)\\end\{center\}/g,
    (_, inner) => {
      let cleaned = inner.trim();
      // Handle {\LARGE \textbf{Name}} or \LARGE \textbf{Name}
      cleaned = cleaned.replace(/\{?\\LARGE\s*\\textbf\{([^}]+)\}\}?/gi, '<h1 class="text-2xl font-bold text-slate-900 tracking-tight">$1</h1>');
      cleaned = cleaned.replace(/\{?\\Large\s*\\textbf\{([^}]+)\}\}?/gi, '<h1 class="text-xl font-bold text-slate-900 tracking-tight">$1</h1>');
      cleaned = cleaned.replace(/\{?\\textbf\{([^}]+)\}\}?/gi, '<strong class="font-bold text-slate-900">$1</strong>');
      cleaned = cleaned.replace(/\{?\\small\s*([\s\S]*?)\}?$/gi, '<div class="text-xs text-slate-600 mt-1">$1</div>');
      cleaned = cleaned.replace(/\\\\(\[\d+pt\])?/g, "<br/>");
      cleaned = cleanStrayBracesAndMacros(cleaned);
      return `<div class="text-center pb-3 mb-4 border-b border-slate-200">${cleaned}</div>`;
    }
  );

  // 7. Handle top-level \LARGE \textbf{...} outside center
  text = text.replace(
    /\{?\\LARGE\s*\\textbf\{([^}]+)\}\}?/gi,
    '<h1 class="text-2xl font-bold text-slate-900 tracking-tight mb-1">$1</h1>'
  );

  // 8. Handle \section*{...} or \section{...}
  text = text.replace(
    /\\section\*?\{([^}]+)\}/g,
    (_, title) => {
      const cleanTitle = cleanStrayBracesAndMacros(title).trim();
      return `<h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider pb-1 mt-5 mb-2 border-b-2 border-slate-300 flex items-center justify-between">${cleanTitle}</h2>`;
    }
  );

  // 9. Handle itemize environments: \begin{itemize} ... \end{itemize}
  text = text.replace(
    /\\begin\{itemize\}(?:\[[^\]]*\])?([\s\S]*?)\\end\{itemize\}/g,
    (_, itemsBlock) => {
      // Split by \item
      const rawItems = itemsBlock.split(/\\item\s+/);
      const listItems: string[] = [];

      for (let i = 1; i < rawItems.length; i++) {
        let itemText = rawItems[i].trim();
        // Remove trailing \\ or \vspace
        itemText = itemText.replace(/\\\\(\[\d+pt\])?$/g, "").trim();
        itemText = formatInlineLatex(itemText);
        listItems.push(`<li class="leading-snug text-slate-700">${itemText}</li>`);
      }

      return `<ul class="list-disc ml-5 space-y-1.5 my-2">${listItems.join("\n")}</ul>`;
    }
  );

  // 10. Handle role / company headers:
  // \textbf{Role} \hfill Date\\
  // \textit{Company} \hfill Location
  // Convert lines with \hfill to flex justify-between rows
  const lines = text.split("\n");
  const processedLines: string[] = [];

  for (const line of lines) {
    let trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    // Skip environment tags already parsed
    if (trimmed.startsWith("<ul") || trimmed.startsWith("<li") || trimmed.startsWith("</ul") || trimmed.startsWith("<h") || trimmed.startsWith("<div") || trimmed.startsWith("</div")) {
      processedLines.push(trimmed);
      continue;
    }

    // Check for \hfill
    if (trimmed.includes("\\hfill")) {
      const parts = trimmed.split("\\hfill");
      const left = formatInlineLatex(parts[0].trim());
      const right = formatInlineLatex(parts.slice(1).join(" ").replace(/\\\\(\[\d+pt\])?/g, "").trim());
      processedLines.push(
        `<div class="flex justify-between items-baseline text-xs mt-1.5"><span>${left}</span><span class="text-slate-500 font-medium shrink-0 ml-2">${right}</span></div>`
      );
      continue;
    }

    // General line formatting
    trimmed = formatInlineLatex(trimmed);
    trimmed = trimmed.replace(/\\\\(\[\d+pt\])?/g, "<br/>");
    if (trimmed.trim()) {
      processedLines.push(`<div class="text-xs text-slate-800 my-0.5 leading-relaxed">${trimmed}</div>`);
    }
  }

  let htmlResult = processedLines.join("\n");

  // Final cleanup of stray LaTeX artifacts
  htmlResult = cleanStrayBracesAndMacros(htmlResult);

  // Template-specific styling wrappers
  let containerStyle = "font-sans text-slate-900";
  if (templateId === "classic-academic") {
    containerStyle = "font-serif text-slate-900";
  } else if (templateId === "compact-executive") {
    containerStyle = "font-sans text-slate-900 tracking-tight text-[11.5px]";
  } else if (templateId === "modern-clean") {
    containerStyle = "font-sans text-slate-800";
  }

  return `<div class="resume-document ${containerStyle} max-w-3xl mx-auto p-8 bg-white min-h-[1050px] shadow-sm leading-relaxed">${htmlResult}</div>`;
}

/**
 * Formats inline LaTeX styling like \textbf{...}, \textit{...}, etc.
 */
function formatInlineLatex(text: string): string {
  let result = text;

  // \textbf{...}
  result = result.replace(/\\textbf\{([^}]+)\}/g, '<strong class="font-semibold text-slate-900">$1</strong>');

  // \textit{...} or \emph{...}
  result = result.replace(/\\textit\{([^}]+)\}/g, '<em class="italic text-slate-700">$1</em>');
  result = result.replace(/\\emph\{([^}]+)\}/g, '<em class="italic text-slate-700">$1</em>');

  // \underline{...}
  result = result.replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>');

  // \small ...
  result = result.replace(/\\small\s+/g, "");

  // \vspace{...}
  result = result.replace(/\\vspace\{[^}]*\}/g, "");

  return result;
}

/**
 * Strips remaining unparsed macros and loose braces.
 */
function cleanStrayBracesAndMacros(text: string): string {
  return text
    .replace(/\\vspace\*?\{[^}]*\}/gi, "")
    .replace(/\\setlength\{[^}]*\}\{[^}]*\}/gi, "")
    .replace(/\\titleformat\{[^}]*\}/gi, "")
    .replace(/\\titlespacing\*?\{[^}]*\}\{[^}]*\}\{[^}]*\}\{[^}]*\}/gi, "")
    .replace(/\\pagestyle\{[^}]*\}/gi, "")
    .replace(/\\rule\{[^}]*\}\{[^}]*\}/gi, '<hr class="border-t border-slate-300 my-2"/>')
    .replace(/\\titlerule/gi, "")
    .replace(/\\noindent/gi, "")
    .replace(/\\par/gi, "")
    .replace(/\\medskip/gi, "")
    .replace(/\\bigskip/gi, "")
    .replace(/\\smallskip/gi, "")
    .replace(/\\hfill/gi, " — ")
    .replace(/\[\d+pt\]/gi, "")
    .replace(/^\s*\{\s*$/gm, "")
    .replace(/^\s*\}\s*$/gm, "")
    .replace(/\\\[/g, "")
    .replace(/\\\]/g, "")
    .trim();
}
