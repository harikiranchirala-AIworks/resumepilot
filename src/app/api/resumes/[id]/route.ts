import { NextResponse } from "next/server";

export async function DELETE() {
  return NextResponse.json(
    { error: "Résumé persistence is browser-local in the controlled beta." },
    { status: 410 }
  );
}
