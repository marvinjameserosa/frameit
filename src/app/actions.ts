"use server";

import sharp from "sharp";

interface ProcessImageResult {
  success: boolean;
  image?: string;
  error?: string;
}

export async function processImage(
  formData: FormData
): Promise<ProcessImageResult> {
  console.log("Server Action: 'processImage' started.");

  try {
    // 1. Retrieve data from FormData
    const uploadedImage = formData.get("image") as File | null;
    const frameFile = formData.get("frame") as File | null;
    const scale = parseFloat(formData.get("scale") as string);
    const rotation = parseInt(formData.get("rotation") as string);
    const position = JSON.parse(formData.get("position") as string) as {
      x: number;
      y: number;
    };

    if (!uploadedImage || !frameFile) {
      console.error("Server Action Error: Missing image or frame file.");
      return {
        success: false,
        error: "Server Error: Missing image or frame file.",
      };
    }
    console.log(
      `Server Action: Received image '${uploadedImage.name}', frame '${frameFile.name}'`
    );
    console.log(
      `Server Action: Params: scale=${scale}, rotation=${rotation}, position=${JSON.stringify(
        position
      )}`
    );

    // 2. Convert Files to Buffers
    const uploadedImageBuffer = Buffer.from(await uploadedImage.arrayBuffer());
    const frameBuffer = Buffer.from(await frameFile.arrayBuffer());
    console.log("Server Action: Buffers created successfully.");

    // 3. Process the uploaded image
    let processedImage: Buffer;
    try {
      const uploadedImageMetadata = await sharp(uploadedImageBuffer).metadata();
      processedImage = await sharp(uploadedImageBuffer)
        .rotate(rotation)
        .resize(Math.round(uploadedImageMetadata.width! * scale))
        .toBuffer();
      console.log("Server Action: User image processed (rotated and resized).");
    } catch (processingError) {
      console.error(
        "Server Action Error: Sharp failed during rotate/resize.",
        processingError
      );
      return {
        success: false,
        error: "Server Error: Failed to process the uploaded image.",
      };
    }

    // 4. Composite the processed image onto the frame
    let finalImage: Buffer;
    try {
      const processedImageMetadata = await sharp(processedImage).metadata();
      finalImage = await sharp(frameBuffer)
        .composite([
          {
            input: processedImage,
            left: Math.round(
              1080 / 2 + position.x - processedImageMetadata.width! / 2
            ),
            top: Math.round(
              1080 / 2 + position.y - processedImageMetadata.height! / 2
            ),
          },
        ])
        .png()
        .toBuffer();
      console.log("Server Action: Image composited successfully.");
    } catch (compositeError) {
      console.error(
        "Server Action Error: Sharp failed during composite operation.",
        compositeError
      );
      return {
        success: false,
        error: "Server Error: Failed to overlay image onto the frame.",
      };
    }

    console.log("Server Action: 'processImage' completed successfully.");
    return { success: true, image: finalImage.toString("base64") };
  } catch (error) {
    console.error(
      "Server Action Error: A critical unhandled error occurred.",
      error
    );
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown server error occurred.";
    return { success: false, error: `Server Error: ${errorMessage}` };
  }
}
