import { NextRequest, NextResponse } from "next/server";
import { rewriteBulletPoint } from "@/lib/ai";
import type { AIProvider } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const {
      bulletText,
      jobDescription = "",
      preferredProvider = "auto",
    }: {
      bulletText: string;
      jobDescription?: string;
      preferredProvider?: AIProvider;
    } = await request.json();

    if (!bulletText?.trim()) {
      return NextResponse.json(
        { error: "Bullet text is required." },
        { status: 400 }
      );
    }

    const options = await rewriteBulletPoint(
      bulletText.trim(),
      jobDescription.trim(),
      preferredProvider
    );

    return NextResponse.json({ options });
  } catch (error) {
    console.error("Rewrite bullet error:", error);
    return NextResponse.json(
      { error: "Failed to rewrite bullet." },
      { status: 500 }
    );
  }
}
