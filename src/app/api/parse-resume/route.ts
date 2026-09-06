import { NextRequest, NextResponse } from "next/server";
import { parseDocument } from "@/lib/documentParser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const filename = file.name || "uploaded_resume.pdf";
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json(
        { error: "Uploaded file is empty (0 bytes). Please upload a valid document." },
        { status: 400 }
      );
    }

    const extractedText = await parseDocument(buffer, filename);

    if (!extractedText || extractedText.length < 15) {
      return NextResponse.json(
        {
          error:
            "Could not extract sufficient text from this file. This document might be an image-only scan without a selectable text layer. Please paste your resume text manually or load a sample profile.",
          name: filename.replace(/\.[^/.]+$/, ""),
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      name: filename.replace(/\.[^/.]+$/, ""),
      text: extractedText,
      characterCount: extractedText.length,
      wordCount: extractedText.split(/\s+/).filter(Boolean).length,
    });
  } catch (error) {
    console.error("parse-resume route error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to parse uploaded file. Please paste your resume text directly into the text editor.",
      },
      { status: 500 }
    );
  }
}
