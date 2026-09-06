import { NextRequest, NextResponse } from "next/server";
import { listResumes, saveResume } from "@/lib/resume-library";

export async function GET() {
  const resumes = await listResumes();
  return NextResponse.json(resumes);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, name, text } = body as { id?: string; name: string; text: string };

  if (!name?.trim() || !text?.trim()) {
    return NextResponse.json(
      { error: "Name and resume text are required." },
      { status: 400 }
    );
  }

  const saved = await saveResume({ id, name: name.trim(), text: text.trim() });
  return NextResponse.json(saved);
}
