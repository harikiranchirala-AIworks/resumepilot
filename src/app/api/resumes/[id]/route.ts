import { NextResponse } from "next/server";
import { deleteResume } from "@/lib/resume-library";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteResume(id);
  return NextResponse.json({ ok: true });
}
