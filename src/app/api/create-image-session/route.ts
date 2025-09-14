// src/app/api/create-image-session/route.ts
import { promises as fs } from "fs";
import path from "path";
import os from "os"; // We'll use the OS's temporary directory
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const base64Data = body.image.replace(/^data:image\/png;base64,/, "");

    // Generate a secure, unique filename
    const filename = `frameit-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}.png`;

    // The path will be in the OS's temp folder (e.g., /tmp on Linux, C:\Users\...\AppData\Local\Temp on Windows)
    const tempDirPath = os.tmpdir();
    const imagePath = path.join(tempDirPath, filename);

    // Save the file to the temporary directory
    await fs.writeFile(imagePath, base64Data, "base64");

    // Return the unique filename so the client can request the download
    return NextResponse.json({ success: true, filename: filename });
  } catch (error) {
    console.error("Error creating image session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to prepare image for download." },
      { status: 500 }
    );
  }
}
