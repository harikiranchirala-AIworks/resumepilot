import { NextRequest, NextResponse } from "next/server";
import { compileLatexToPdf } from "@/lib/compile-pdf";

export async function POST(request: NextRequest) {
  try {
    const { latex } = (await request.json()) as { latex?: string };

    if (!latex?.trim()) {
      return NextResponse.json({ error: "LaTeX content is required." }, { status: 400 });
    }

    const pdf = await compileLatexToPdf(latex);

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="tailored-resume.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "PDF compilation failed";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
