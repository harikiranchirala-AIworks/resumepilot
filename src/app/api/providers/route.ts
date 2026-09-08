import { NextResponse } from "next/server";
import { hasAnthropic } from "@/lib/providers/anthropic";
import { hasGemini } from "@/lib/providers/gemini";
import { hasOpenAI } from "@/lib/providers/openai";

export async function GET() {
  return NextResponse.json({
    openai: hasOpenAI(),
    gemini: hasGemini(),
    anthropic: hasAnthropic(),
  });
}
