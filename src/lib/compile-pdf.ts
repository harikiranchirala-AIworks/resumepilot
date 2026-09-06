import { execFile } from "child_process";
import { existsSync } from "fs";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const PDFLATEX_CANDIDATES = [
  "pdflatex",
  "pdflatex.exe",
  "C:\\Program Files\\MiKTeX\\miktex\\bin\\x64\\pdflatex.exe",
  "C:\\Program Files (x86)\\MiKTeX\\miktex\\bin\\pdflatex.exe",
  process.env.LOCALAPPDATA
    ? path.join(process.env.LOCALAPPDATA, "Programs/MiKTeX/miktex/bin/x64/pdflatex.exe")
    : "",
].filter(Boolean);

export async function findPdflatex(): Promise<string | null> {
  for (const cmd of PDFLATEX_CANDIDATES) {
    if (path.isAbsolute(cmd)) {
      if (existsSync(cmd)) return cmd;
      continue;
    }
    try {
      await execFileAsync(cmd, ["--version"], { timeout: 8000 });
      return cmd;
    } catch {
      /* try next */
    }
  }
  return null;
}

export async function compileLatexToPdf(latex: string): Promise<Buffer> {
  const pdflatex = await findPdflatex();
  if (!pdflatex) {
    throw new Error(
      "pdflatex not found. Install MiKTeX for server-side PDF, or use in-app preview."
    );
  }

  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "tailor-resume-"));
  const texFile = "resume.tex";

  try {
    await fs.writeFile(path.join(dir, texFile), latex, "utf8");

    await execFileAsync(
      pdflatex,
      ["-interaction=nonstopmode", "-halt-on-error", texFile],
      { cwd: dir, timeout: 90000, windowsHide: true }
    );

    const pdfPath = path.join(dir, "resume.pdf");
    if (!existsSync(pdfPath)) {
      throw new Error("PDF was not produced by pdflatex");
    }

    return await fs.readFile(pdfPath);
  } finally {
    await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}
