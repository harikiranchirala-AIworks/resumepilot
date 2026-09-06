import { NextRequest, NextResponse } from "next/server";
import { executeCoPilotAction } from "@/lib/ai";
import type { CoPilotRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CoPilotRequest;

    if (!body.selectedText || !body.selectedText.trim()) {
      return NextResponse.json(
        { error: "Selected text is required for AI Co-Pilot optimization." },
        { status: 400 }
      );
    }

    const response = await executeCoPilotAction(body);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Co-Pilot API Error:", error);
    return NextResponse.json(
      { error: "Failed to process Co-Pilot optimization." },
      { status: 500 }
    );
  }
}
