import { NextResponse } from "next/server";

const message = "Résumé persistence is browser-local in the controlled beta.";

export async function GET() {
  return NextResponse.json({ error: message }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ error: message }, { status: 410 });
}
