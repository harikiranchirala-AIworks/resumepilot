import { NextRequest, NextResponse } from "next/server";
import {
  generateCoverLetter,
  generateInterviewPrep,
  generateTailoredResume,
} from "@/lib/ai";
import type { AIProvider, ProfileInputMode, ResumeTemplateId } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      profileMode,
      profileContent,
      jobDescription,
      preferredProvider = "auto",
      templateId = "tech-standard",
      includeCoverLetter = true,
      includeInterviewPrep = true,
    }: {
      profileMode: ProfileInputMode;
      profileContent: string;
      jobDescription: string;
      preferredProvider?: AIProvider;
      templateId?: ResumeTemplateId;
      includeCoverLetter?: boolean;
      includeInterviewPrep?: boolean;
    } = body;

    if (!profileContent?.trim() || profileContent.trim().length < 3) {
      return NextResponse.json(
        { error: "Profile information is required." },
        { status: 400 }
      );
    }

    if (!jobDescription?.trim() || jobDescription.trim().length < 20) {
      return NextResponse.json(
        { error: "Job description must be at least 20 characters." },
        { status: 400 }
      );
    }

    // Generate tailored resume
    const result = await generateTailoredResume(
      profileContent.trim(),
      jobDescription.trim(),
      profileMode,
      preferredProvider,
      templateId
    );

    // Optionally generate cover letter and interview prep concurrently
    const [coverLetter, interviewPrep] = await Promise.all([
      includeCoverLetter
        ? generateCoverLetter(profileContent.trim(), jobDescription.trim(), preferredProvider)
        : Promise.resolve(undefined),
      includeInterviewPrep
        ? generateInterviewPrep(profileContent.trim(), jobDescription.trim(), preferredProvider)
        : Promise.resolve(undefined),
    ]);

    return NextResponse.json({
      ...result,
      coverLetter,
      interviewPrep,
    });
  } catch (error) {
    console.error("generate-resume error:", error);
    return NextResponse.json(
      { error: "Failed to generate resume. Please try again." },
      { status: 500 }
    );
  }
}

