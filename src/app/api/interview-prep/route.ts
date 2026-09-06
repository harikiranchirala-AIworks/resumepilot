import { NextRequest, NextResponse } from "next/server";
import { generateInterviewPrep } from "@/lib/ai";
import type { AIProvider } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const {
      profileContent,
      jobDescription,
      preferredProvider = "auto",
    }: {
      profileContent: string;
      jobDescription: string;
      preferredProvider?: AIProvider;
    } = await request.json();

    if (!profileContent?.trim() || !jobDescription?.trim()) {
      return NextResponse.json(
        { error: "Both profile content and job description are required." },
        { status: 400 }
      );
    }

    const result = await generateInterviewPrep(
      profileContent.trim(),
      jobDescription.trim(),
      preferredProvider
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Interview prep error:", error);
    return NextResponse.json(
      { error: "Failed to generate interview prep." },
      { status: 500 }
    );
  }
}
