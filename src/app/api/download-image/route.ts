// File: app/api/download-image/route.ts

import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 1. Get the filename from the URL's query parameters
  const searchParams = request.nextUrl.searchParams;
  const filename = searchParams.get("file");

  if (!filename) {
    return NextResponse.json(
      { error: "Filename is required." },
      { status: 400 }
    );
  }

  // 2. Security: Sanitize the filename to prevent directory traversal attacks.
  // path.basename() will strip out any directory paths (like ../)
  const sanitizedFilename = path.basename(filename);

  // 3. Construct the full path to the image in the public/downloads directory
  const filePath = path.join(
    process.cwd(),
    "public",
    "downloads",
    sanitizedFilename
  );

  try {
    // 4. Read the file from the disk into a buffer
    const imageBuffer = await fs.readFile(filePath);

    // 5. Create a response with the image buffer
    const response = new NextResponse(imageBuffer);

    // 6. Set the headers to force a download
    response.headers.set("Content-Type", "image/png");
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="${sanitizedFilename}"`
    );

    return response;
  } catch (error) {
    // This will happen if the file doesn't exist
    console.error("Error reading file for download:", error);
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }
}
