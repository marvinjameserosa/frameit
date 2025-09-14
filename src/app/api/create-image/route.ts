// File: app/api/create-image/route.ts

import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

// Define the expected structure of the request body for type safety
interface RequestBody {
  image?: string;
}

export async function POST(request: Request) {
  try {
    // 1. Get the image data from the request body
    const body: RequestBody = await request.json();
    const { image } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "Image data is missing or invalid in the request." },
        { status: 400 }
      );
    }

    // 2. Sanitize the base64 string
    // The data URL looks like "data:image/png;base64,iVBORw0KGgo...", we only want the part after the comma.
    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    // 3. Create a unique filename to avoid overwriting files
    const filename = `framed-image-${Date.now()}.png`;

    // 4. Define the full path to save the image in the public/downloads directory
    // process.cwd() gives the root directory of your project
    const imagePath = path.join(process.cwd(), "public", "downloads", filename);

    // 5. Write the file to the server's filesystem
    // We provide the path, the base64 data, and specify the encoding.
    await fs.writeFile(imagePath, base64Data, "base64");

    // 6. Construct the public URL for the newly created image
    const imageUrl = `/downloads/${filename}`;

    // 7. Send the public URL back to the client
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    // Log the actual error to the server console for debugging
    console.error("Error creating image:", error);

    // Return a generic error message to the client
    return NextResponse.json(
      { error: "Failed to create image on the server." },
      { status: 500 }
    );
  }
}
