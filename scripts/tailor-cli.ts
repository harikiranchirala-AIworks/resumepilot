/**
 * Headless resume tailoring via Cursor SDK (Agent.prompt one-shot).
 *
 * Usage:
 *   npm run tailor -- resume.txt job-description.txt [output.tex]
 *
 * Requires CURSOR_API_KEY in the environment or .env.local.
 */
import fs from "fs";
import path from "path";
import { CursorAgentError } from "@cursor/sdk";
import { generateWithCursorSdk, hasCursorSdk } from "../src/lib/cursor-agent";

async function main() {
  const [, , profilePath, jdPath, outPath = "tailored-resume.tex"] = process.argv;

  if (!profilePath || !jdPath) {
    console.error(
      "Usage: npm run tailor -- <resume.txt> <job-description.txt> [output.tex]"
    );
    process.exit(1);
  }

  if (!hasCursorSdk()) {
    console.error(
      "Set CURSOR_API_KEY (Cursor Dashboard → Integrations). See .env.example."
    );
    process.exit(1);
  }

  const profileText = fs.readFileSync(path.resolve(profilePath), "utf8");
  const jobDescription = fs.readFileSync(path.resolve(jdPath), "utf8");

  try {
    const result = await generateWithCursorSdk(
      profileText,
      jobDescription,
      "resumeText"
    );
    fs.writeFileSync(path.resolve(outPath), result.resume.latex, "utf8");

    console.log(`Wrote ${outPath}`);
    console.log(`Match score: ${result.match.overallScore}/100`);
    console.log(`ATS score:   ${result.ats.score}/100`);
    console.log(`Summary:     ${result.resume.summary}`);
  } catch (err) {
    if (err instanceof CursorAgentError) {
      console.error(
        `Startup failed: ${err.message} (retryable=${err.isRetryable})`
      );
      process.exit(1);
    }
    console.error(err instanceof Error ? err.message : err);
    process.exit(2);
  }
}

main();
