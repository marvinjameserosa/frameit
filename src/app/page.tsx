"use client";

import { useState, useRef, useEffect, useCallback } from "react";

import { processImage } from "./actions";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

import {
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Settings,
  Copy,
  RefreshCw,
  Check,
  Image as ImageIcon,
} from "lucide-react";

import Header from "@/components/sections/Header";

export default function ImageFrameOverlay() {
  // == STATE MANAGEMENT == //
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(
    null
  );
  const [frameLoaded, setFrameLoaded] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isPinching, setIsPinching] = useState<boolean>(false);
  const [initialPinchDistance, setInitialPinchDistance] = useState<number>(0);
  const [initialScale, setInitialScale] = useState<number>(1);
  const [captionCopied, setCaptionCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // == REFS == //
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // == CONSTANTS == //
  const frameSrc = "/frame.png";

  const colors = {
    bg: "bg-[#07003E]",
    textOnBg: "text-slate-100",
    textMutedOnBg: "text-slate-400",
    panelBg: "bg-slate-900/50 backdrop-blur-sm",
    panelText: "text-slate-100",
    panelBorder: "border-slate-700",
    accent: "bg-pink-600",
    accentHover: "hover:bg-pink-700",
    sliderTrack: "bg-slate-700",
    sliderRange: "bg-pink-600",
  };

  const caption = `🔑𝖀𝖓𝖑𝖔𝖈𝖐() — 𝕱𝖔𝖗𝖌𝖎𝖓𝖌 𝕶𝖊𝖞𝖘 𝕿𝖔𝖜𝖆𝖗𝖉𝖘 𝖙𝖍𝖊 𝕯𝖔𝖔𝖗𝖘 𝖔𝖋 𝖙𝖍𝖊 𝕱𝖚𝖙𝖚𝖗𝖊🔑

Step inside in the realm of doors with Synth, Cody, and Devi! As it is time for Unlock()! 🔓

The yearly flagship event by the 𝐓𝐏𝐆 𝐢𝐬 𝐧𝐨𝐰 𝐡𝐞𝐫𝐞! Now venturing on dimensions we’ve yet to be in before. 🌟 𝐍𝐞𝐰 𝐡𝐨𝐫𝐢𝐳𝐨𝐧𝐬 𝐛𝐮𝐭 𝐬𝐭𝐢𝐥𝐥 𝐭𝐨𝐮𝐜𝐡𝐢𝐧𝐠 𝐭𝐨𝐩𝐢𝐜𝐬 that caters 𝘦𝘷𝘦𝘳𝘺 𝘵𝘦𝘤𝘩 𝘴𝘵𝘶𝘥𝘦𝘯𝘵𝘴, 𝘦𝘯𝘵𝘩𝘶𝘴𝘪𝘢𝘴𝘵𝘴, 𝘢𝘯𝘥 𝘴𝘤𝘩𝘰𝘭𝘢𝘳𝘴!

𝙏𝙝𝙞𝙨 𝙞𝙨 𝙣𝙤𝙩 𝙮𝙤𝙪𝙧 𝙩𝙮𝙥𝙞𝙘𝙖𝙡 𝙥𝙖𝙩𝙘𝙝 𝙣𝙤𝙩𝙚𝙨, 𝙨𝙤 𝙗𝙚𝙩𝙩𝙚𝙧 𝙩𝙖𝙠𝙚 𝙣𝙤𝙩𝙚𝙨 𝙤𝙛 𝙬𝙝𝙖𝙩’𝙨 𝙖𝙗𝙤𝙪𝙩 𝙩𝙤 𝙪𝙣𝙛𝙤𝙡𝙙 𝙤𝙣𝙘𝙚 𝙩𝙝𝙚 𝙙𝙤𝙤𝙧𝙨 𝙤𝙥𝙚𝙣 🚪


Welcome! I am [your name] from the 𝗿𝗲𝗮𝗹𝗺 of [Course and Year and Section or School], geared up and ready for the adventures to unfold at  𝗨𝗻𝗹𝗼𝗰𝗸(): 𝗙𝗼𝗿𝗴𝗶𝗻𝗴 𝗞𝗲𝘆𝘀 𝗧𝗼𝘄𝗮𝗿𝗱𝘀 𝘁𝗵𝗲 𝗗𝗼𝗼𝗿𝘀 𝗼𝗳 𝘁𝗵𝗲 𝗙𝘂𝘁𝘂𝗿𝗲!

The week-long event by 𝐏𝐔𝐏 𝐓𝐡𝐞 𝐏𝐫𝐨𝐠𝐫𝐚𝐦𝐦𝐞𝐫𝐬’ 𝐆𝐮𝐢𝐥𝐝 is built for dreamers, doers, and explorers who are ready to start something new. Whether it’s through learning, creating, or connecting—𝘺𝘰𝘶’𝘭𝘭 𝘥𝘪𝘴𝘤𝘰𝘷𝘦𝘳 𝘵𝘩𝘢𝘵 𝘵𝘩𝘦 𝘧𝘪𝘳𝘴𝘵 𝘥𝘰𝘰𝘳 𝘺𝘰𝘶 𝘰𝘱𝘦𝘯 𝘤𝘢𝘯 𝘭𝘦𝘢𝘥 𝘵𝘰 𝘮𝘢𝘯𝘺 𝘮𝘰𝘳𝘦.✨

The 𝐃𝐨𝐨𝐫 awaits to be opened, happening from 𝐒𝐞𝐩𝐭𝐞𝐦𝐛𝐞𝐫 𝟐𝟖, 𝟐𝟎𝟐𝟓 𝐭𝐨 𝐎𝐜𝐭𝐨𝐛𝐞𝐫 𝟑, 𝟐𝟎𝟐𝟓 𝐯𝐢𝐚 𝐙𝐨𝐨𝐦. Prepare your keys to unlock it!

Learn more about the Happenings, you can read it here on Unlock’s Playbook!
📖https://bit.ly/TheForge-Playbook 

𝗧𝗵𝗲 𝗱𝗼𝗼𝗿 𝗶𝘀 𝘄𝗮𝗶𝘁𝗶𝗻𝗴. 𝗘𝗻𝘁𝗲𝗿 𝗯𝗲𝗹𝗼𝘄:
🔗https://bit.ly/TPGUnlock-Registration 
🔗https://bit.ly/TPGUnlock-Registration 
🔗https://bit.ly/TPGUnlock-Registration 

𝐉𝐨𝐢𝐧 𝐭𝐡𝐞 𝐃𝐏 𝐁𝐥𝐚𝐬𝐭 𝐭𝐡𝐫𝐨𝐮𝐠𝐡 𝐭𝐡𝐢𝐬 𝐥𝐢𝐧𝐤:
🔗https://tpgunlocked.vercel.app/
🔗https://tpgunlocked.vercel.app/
🔗https://tpgunlocked.vercel.app/

Follow us in these links to keep you updated on our latest happenings:
Facebook: https://www.facebook.com/PUPTPG 
Discord: https://discord.gg/6KsKZRUY 

Forge your own key and unlock the first door towards success.🌟

#PUPTheProgrammersGuild
#FindingTheRightKey
#UnlockTPG`;

  // == CORE LOGIC & EFFECTS == //
  const defaultSettings = {
    scale: 1,
    rotation: 0,
    position: { x: 0, y: 0 },
  };

  const resetToDefault = useCallback(() => {
    setScale(defaultSettings.scale);
    setRotation(defaultSettings.rotation);
    setPosition(defaultSettings.position);
  }, []);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = frameSrc;
    img.onload = () => {
      frameRef.current = img;
      setFrameLoaded(true);
    };
    img.onerror = () => {
      console.error("Error loading frame image.");
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (uploadedImage) {
      ctx.save();
      ctx.translate(
        canvas.width / 2 + position.x,
        canvas.height / 2 + position.y
      );
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(
        uploadedImage,
        (-uploadedImage.width * scale) / 2,
        (-uploadedImage.height * scale) / 2,
        uploadedImage.width * scale,
        uploadedImage.height * scale
      );
      ctx.restore();
    }

    if (frameRef.current && frameLoaded) {
      ctx.drawImage(frameRef.current, 0, 0, canvas.width, canvas.height);
    }
  }, [uploadedImage, scale, position, rotation, frameLoaded]);

  // == EVENT HANDLERS == //
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = event.target?.result;
        img.onload = () => {
          setUploadedImage(img);
          resetToDefault();
        };
      };
      reader.readAsDataURL(file);
    }
    if (e.target) e.target.value = "";
  };
  const logToServer = (level, message, data = {}) => {
    fetch("/api/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ level, message, data }),
    }).catch((error) => {
      // This console.error is for the client's browser console
      console.error("Failed to send log to server:", error);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onMouseDown = (e) => {
    if (!uploadedImage) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const onMouseUpOrLeave = () => setIsDragging(false);

  const getTouchDistance = (touches) => {
    const [touch1, touch2] = [touches[0], touches[1]];
    return Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
  };

  const onTouchStart = (e) => {
    if (!uploadedImage) return;
    e.preventDefault();
    const touches = e.touches;
    if (touches.length === 2) {
      setIsPinching(true);
      setInitialPinchDistance(getTouchDistance(touches));
      setInitialScale(scale);
    } else if (touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: touches[0].clientX - position.x,
        y: touches[0].clientY - position.y,
      });
    }
  };
  const onTouchMove = (e) => {
    if (!uploadedImage) return;
    e.preventDefault();
    const touches = e.touches;
    if (isPinching && touches.length === 2) {
      const currentDistance = getTouchDistance(touches);
      const newScale = initialScale * (currentDistance / initialPinchDistance);
      setScale(Math.max(0.1, Math.min(newScale, 10)));
    } else if (isDragging && touches.length === 1) {
      setPosition({
        x: touches[0].clientX - dragStart.x,
        y: touches[0].clientY - dragStart.y,
      });
    }
  };
  const onTouchEnd = () => {
    setIsDragging(false);
    setIsPinching(false);
  };

  const copyCaption = () => {
    navigator.clipboard.writeText(caption).then(() => {
      setCaptionCopied(true);
      setTimeout(() => setCaptionCopied(false), 2000);
    });
  };

  const downloadImage = async () => {
    console.log("Download function started."); // <-- DEBUG
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found.");
      logToServer("error", "Canvas element not found.");
      return;
    }

    setIsDownloading(true);

    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isFacebookApp = /FBAN|FBAV/i.test(ua);

    console.log("User Agent:", ua); // <-- DEBUG
    console.log("Is Facebook App?:", isFacebookApp); // <-- DEBUG

    if (isFacebookApp) {
      // --- SERVER-SIDE METHOD FOR IN-APP BROWSERS ---
      console.log("Facebook browser detected. Executing server-side logic."); // <-- DEBUG
      logToServer(
        "info",
        "Facebook browser detected. Using server-side download method."
      );
      try {
        const dataUrl = canvas.toDataURL("image/png", 1.0);

        console.log("Sending image data to /api/create-image..."); // <-- DEBUG
        const response = await fetch("/api/create-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: dataUrl }),
        });

        const result = await response.json();

        if (!response.ok) {
          console.error("Server responded with an error:", result); // <-- DEBUG
          throw new Error(result.error || "Server responded with an error.");
        }

        const { url } = result as { url: string };
        console.log("Received image URL from server:", url); // <-- DEBUG

        // Extract just the filename from the URL (e.g., "framed-image-123.png")
        const filename = url.split("/").pop();

        if (!filename) {
          throw new Error(
            "Could not extract filename from the server response."
          );
        }

        // Construct the new URL that points to our download-forcing API route
        const downloadUrl = `/api/download-image?file=${filename}`;

        console.log("Redirecting to download-forcing URL:", downloadUrl); // <-- DEBUG
        logToServer("info", `Redirecting user to download URL: ${downloadUrl}`);

        // Redirect to the new API route to trigger the download prompt
        window.open(downloadUrl, "_blank");

        // Redirect to trigger download
        window.location.href = url;
      } catch (error: unknown) {
        console.error("Full error object:", error); // <-- DEBUG
        logToServer("error", "Server-side image creation failed.", {
          error: error instanceof Error ? error.message : String(error),
        });
        alert(
          "There was an error creating your image for download. Please try again."
        );
        setIsDownloading(false); // Ensure loading stops on error
      }
    } else {
      // --- STANDARD BLOB METHOD FOR MODERN BROWSERS ---
      console.log("Standard browser detected. Using blob download method."); // <-- DEBUG
      logToServer(
        "info",
        "Standard browser detected. Initiating Blob + Link download."
      );
      try {
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, "image/png", 1.0);
        });

        if (!blob) {
          throw new Error("Failed to create blob from canvas.");
        }
        logToServer("info", "Blob created successfully.", {
          size: blob.size,
          type: blob.type,
        });

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = "framed-image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(blobUrl), 500);
      } catch (error: unknown) {
        logToServer(
          "error",
          "An error occurred during standard Blob/Link download.",
          {
            error: error instanceof Error ? error.message : String(error),
          }
        );
      } finally {
        setIsDownloading(false);
      }
    }
  };

  // == RENDER METHOD == //
  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center ${colors.bg} ${colors.textOnBg} font-sans p-4 sm:p-6 md:p-8`}
    >
      <div className="w-full max-w-6xl mx-auto">
        <Header textMutedOnBg={colors.textMutedOnBg} />

        <main
          className={`grid gap-8 xl:gap-12 items-start ${
            uploadedImage
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1 justify-items-center"
          }`}
        >
          <div className="flex flex-col items-center gap-4 w-full max-w-lg">
            <div className="relative w-full aspect-square shadow-2xl rounded-lg bg-black/30">
              <canvas
                ref={canvasRef}
                width={1080}
                height={1080}
                className={`w-full h-full rounded-lg ${
                  uploadedImage
                    ? "cursor-grab active:cursor-grabbing"
                    : "cursor-default"
                }`}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUpOrLeave}
                onMouseLeave={onMouseUpOrLeave}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              />
              {!uploadedImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <ImageIcon className="w-16 h-16 text-white/50 mb-4" />
                  <Button
                    size="lg"
                    className={`${colors.accent} ${colors.accentHover} text-white font-bold shadow-lg`}
                    onClick={triggerFileInput}
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Image
                  </Button>
                </div>
              )}
            </div>
            {uploadedImage && (
              <Button
                size="lg"
                className={`w-full ${colors.accent} ${colors.accentHover} text-white font-bold shadow-lg text-base`}
                onClick={downloadImage}
                disabled={isDownloading} // Disable button when downloading
              >
                {isDownloading ? (
                  <>
                    {/* Using RefreshCw for a spinning loading icon */}
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Download Your Image
                  </>
                )}
              </Button>
            )}
          </div>

          {uploadedImage && (
            <div className="flex flex-col gap-8">
              <Card
                className={`${colors.panelBg} ${colors.panelText} shadow-lg border ${colors.panelBorder}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Settings className="mr-3 h-6 w-6" />
                    Customize Your Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="scale" className="font-medium">
                      Scale (Zoom)
                    </label>
                    <div className="flex items-center gap-3">
                      <ZoomOut className="h-5 w-5 text-slate-400" />
                      <Slider
                        id="scale"
                        value={[scale]}
                        min={0.1}
                        max={10}
                        step={0.1}
                        onValueChange={(val) => setScale(val[0])}
                      />
                      <ZoomIn className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="rotation" className="font-medium">
                      Rotation
                    </label>
                    <div className="flex items-center gap-3">
                      <RotateCcw className="h-5 w-5 text-slate-400" />
                      <Slider
                        id="rotation"
                        value={[rotation]}
                        min={0}
                        max={360}
                        step={1}
                        onValueChange={(val) => setRotation(val[0])}
                      />
                      <RotateCw className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <Button
                      variant="outline"
                      onClick={resetToDefault}
                      className="bg-slate-700 hover:bg-slate-600 border-slate-600"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                    <Button
                      variant="outline"
                      onClick={triggerFileInput}
                      className="bg-slate-700 hover:bg-slate-600 border-slate-600"
                    >
                      <Upload className="mr-2 h-4 w-4" /> Change Image
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`${colors.panelBg} ${colors.panelText} shadow-lg border ${colors.panelBorder}`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Copy className="mr-3 h-6 w-6" />
                    Event Caption
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="text-sm whitespace-pre-wrap overflow-y-auto max-h-60 p-3 bg-slate-800/60 rounded-md border border-slate-700">
                      {caption}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 h-8 w-8 text-slate-400 hover:bg-slate-700"
                      onClick={copyCaption}
                    >
                      {captionCopied ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
      <input
        ref={fileInputRef}
        id="image-upload-input"
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleImageUpload}
      />
    </div>
  );
}
