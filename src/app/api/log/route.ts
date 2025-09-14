// src/app/api/log/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { level, message, data } = await req.json();
    const timestamp = new Date().toISOString();

    // Log to the Next.js server console
    console.log(
      `[${timestamp}] [${level.toUpperCase()}] - ${message}`,
      data || ""
    );

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Error in logging endpoint:", error);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
