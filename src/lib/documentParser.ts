import zlib from "zlib";
import mammoth from "mammoth";
import pdfParse from "pdf-parse-fork";

/**
 * Robust multi-tier document parser supporting PDF, DOCX, DOC, RTF, HTML, TXT, MD, TeX, JSON.
 * Implements multiple resilient fallback mechanisms to ensure text is extracted even from
 * non-standard, compressed, or partially corrupted documents.
 */

export async function parseDocument(buffer: Buffer, filename: string): Promise<string> {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf("."));

  let extracted = "";

  if (ext === ".pdf") {
    extracted = await parsePdf(buffer);
  } else if (ext === ".docx" || ext === ".doc") {
    extracted = await parseDocxOrDoc(buffer);
  } else if (ext === ".rtf") {
    extracted = parseRtf(buffer);
  } else if (ext === ".html" || ext === ".htm") {
    extracted = parseHtml(buffer);
  } else if (ext === ".json") {
    extracted = parseJson(buffer);
  } else {
    // Default plaintext / MD / TeX / etc.
    extracted = parsePlainText(buffer);
  }

  // If extraction yielded very little text, try generic string extraction as last resort
  if (!extracted || extracted.trim().length < 15) {
    const rawFallBack = extractPrintableStrings(buffer);
    if (rawFallBack.length > extracted.length) {
      extracted = rawFallBack;
    }
  }

  return cleanExtractedText(extracted);
}

/**
 * Multi-tier PDF parser:
 * Tier 1: unpdf (modern PDF.js engine)
 * Tier 2: pdf-parse-fork (legacy PDF.js fallback)
 * Tier 3: Low-level zlib stream decompressor + PDF text operator parser (BT ... ET, Tj, TJ)
 * Tier 4: Direct buffer string extraction
 */
export async function parsePdf(buffer: Buffer): Promise<string> {
  // Tier 1: unpdf
  try {
    const { extractText } = await import("unpdf");
    const uint8 = new Uint8Array(buffer);
    const result = await extractText(uint8, { mergePages: true });
    const text = Array.isArray(result.text) ? result.text.join("\n\n") : (result.text || "");
    if (text && text.trim().length >= 20) {
      return text;
    }
  } catch (err) {
    console.warn("[PDF Parser] Tier 1 (unpdf) error:", err);
  }

  // Tier 2: pdf-parse-fork
  try {
    const parsed = await pdfParse(buffer);
    if (parsed.text && parsed.text.trim().length >= 20) {
      return parsed.text;
    }
  } catch (err) {
    console.warn("[PDF Parser] Tier 2 (pdf-parse-fork) error:", err);
  }

  // Tier 3: Low-level stream decompression & PDF text operator extraction
  try {
    const streamText = extractPdfStreamText(buffer);
    if (streamText && streamText.trim().length >= 20) {
      return streamText;
    }
  } catch (err) {
    console.warn("[PDF Parser] Tier 3 (stream extraction) error:", err);
  }

  // Tier 4: Printable ASCII/UTF-8 strings
  const fallbackStrings = extractPrintableStrings(buffer);
  return fallbackStrings;
}

/**
 * Extracts text from PDF streams by locating `stream...endstream` blocks,
 * inflating zlib/FlateDecode contents, and parsing PDF text operators (`Tj`, `TJ`, hex strings).
 */
function extractPdfStreamText(buffer: Buffer): string {
  const textPieces: string[] = [];
  const latin = buffer.toString("latin1");

  // Match streams
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match: RegExpExecArray | null;

  while ((match = streamRegex.exec(latin)) !== null) {
    const rawStream = Buffer.from(match[1], "latin1");
    let decompressed: Buffer | null = null;

    try {
      decompressed = zlib.inflateSync(rawStream);
    } catch {
      try {
        decompressed = zlib.inflateRawSync(rawStream);
      } catch {
        decompressed = rawStream; // might be uncompressed stream
      }
    }

    if (decompressed) {
      const streamContent = decompressed.toString("latin1");

      // Find BT ... ET text blocks
      const btRegex = /BT([\s\S]*?)ET/g;
      let btMatch: RegExpExecArray | null;

      while ((btMatch = btRegex.exec(streamContent)) !== null) {
        const btBlock = btMatch[1];

        // Match (...) Tj, (...)' , (...) "
        const tjRegex = /\(([\s\S]*?)\)\s*(?:Tj|'|")/g;
        let tjMatch: RegExpExecArray | null;
        while ((tjMatch = tjRegex.exec(btBlock)) !== null) {
          const raw = unescapePdfString(tjMatch[1]);
          if (raw.trim()) textPieces.push(raw);
        }

        // Match [...] TJ array
        const arrayTjRegex = /\[([\s\S]*?)\]\s*TJ/g;
        let arrayMatch: RegExpExecArray | null;
        while ((arrayMatch = arrayTjRegex.exec(btBlock)) !== null) {
          const inner = arrayMatch[1];
          const innerStrRegex = /\(([\s\S]*?)\)/g;
          let innerStrMatch: RegExpExecArray | null;
          let combined = "";
          while ((innerStrMatch = innerStrRegex.exec(inner)) !== null) {
            combined += unescapePdfString(innerStrMatch[1]);
          }
          if (combined.trim()) textPieces.push(combined);
        }

        // Match hex strings <48656c6c6f> Tj
        const hexRegex = /<([0-9a-fA-F]+)>\s*Tj/g;
        let hexMatch: RegExpExecArray | null;
        while ((hexMatch = hexRegex.exec(btBlock)) !== null) {
          try {
            const hexText = Buffer.from(hexMatch[1], "hex").toString("utf8");
            if (hexText.trim()) textPieces.push(hexText);
          } catch {
            // ignore malformed hex
          }
        }
      }
    }
  }

  return textPieces.join(" ");
}

/**
 * Unescapes PDF string escape sequences (e.g. \n, \t, octal escapes \050).
 */
function unescapePdfString(str: string): string {
  return str
    .replace(/\\([0-7]{1,3})/g, (_, oct) => {
      try {
        return String.fromCharCode(parseInt(oct, 8));
      } catch {
        return "";
      }
    })
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, " ")
    .replace(/\\f/g, " ")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");
}

/**
 * Multi-tier Word parser:
 * Tier 1: mammoth.extractRawText
 * Tier 2: XML text extraction from word/document.xml (handles zip decompressed streams)
 * Tier 3: Binary string extractor for legacy .doc
 */
export async function parseDocxOrDoc(buffer: Buffer): Promise<string> {
  // Tier 1: mammoth
  try {
    const result = await mammoth.extractRawText({ buffer });
    if (result.value && result.value.trim().length >= 20) {
      return result.value;
    }
  } catch (err) {
    console.warn("[Word Parser] Mammoth error:", err);
  }

  // Tier 2: Extract text from XML nodes in zip
  try {
    const rawString = buffer.toString("binary");
    // Look for XML tags in the buffer if uncompressed or partially unzipped
    const xmlTags = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
    let match: RegExpExecArray | null;
    const pieces: string[] = [];
    while ((match = xmlTags.exec(rawString)) !== null) {
      pieces.push(match[1]);
    }
    if (pieces.length > 5) {
      return pieces.join(" ");
    }
  } catch (err) {
    console.warn("[Word Parser] XML regex error:", err);
  }

  // Tier 3: Fallback printable strings
  return extractPrintableStrings(buffer);
}

/**
 * RTF Parser: Strips RTF control words and groups.
 */
export function parseRtf(buffer: Buffer): string {
  const rtf = buffer.toString("utf8");
  return rtf
    .replace(/\\([a-z]{1,32})(-?\d+)? ?/gi, " ") // remove control words
    .replace(/[{}]/g, "")                         // remove grouping braces
    .replace(/\\'([0-9a-f]{2})/gi, (_, hex) => {
      try {
        return String.fromCharCode(parseInt(hex, 16));
      } catch {
        return "";
      }
    });
}

/**
 * HTML Parser: Strips scripts, styles, and tags.
 */
export function parseHtml(buffer: Buffer): string {
  const html = buffer.toString("utf8");
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

/**
 * JSON Parser: formats JSON cleanly.
 */
export function parseJson(buffer: Buffer): string {
  try {
    const raw = buffer.toString("utf8");
    const obj = JSON.parse(raw);
    if (typeof obj === "string") return obj;
    return JSON.stringify(obj, null, 2);
  } catch {
    return buffer.toString("utf8");
  }
}

/**
 * Plain text / Markdown / TeX.
 */
export function parsePlainText(buffer: Buffer): string {
  return buffer.toString("utf8");
}

/**
 * Fallback: extracts continuous printable ASCII and UTF-8 strings.
 */
function extractPrintableStrings(buffer: Buffer): string {
  const str = buffer.toString("latin1");
  const matches = str.match(/[A-Za-z0-9,.:;?!@#$%&*()_\-+=\[\]{}'"/\s]{4,}/g);
  if (!matches) return "";
  return matches
    .filter((s) => s.trim().length > 3 && /[A-Za-z]/.test(s))
    .join(" ");
}

/**
 * Cleans and normalizes extracted resume text.
 */
function cleanExtractedText(text: string): string {
  return text
    .replace(/\0/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n\s*\n+/g, "\n\n")
    .trim();
}
