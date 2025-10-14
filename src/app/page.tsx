"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Download, Copy, Check } from "lucide-react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Dropzone from "@/components/dropzone";
import Editor from "@/components/editor";
import Canvas from "@/components/canvas";

export default function ImageFrameOverlay() {
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(
    null
  );
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
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const caption = `🦸‍♂️ 𝐒𝐏𝐀𝐑𝐊𝐘, 𝐋𝐄𝐓'𝐒 𝐆𝐎 𝐒𝐔𝐏𝐄𝐑!⚡
I’m [name] and I am ready to create, connect, and and make the greatest impact! 💥

Let's light up this school year💡one line of code 🟡, one idea 🔵, and one spark at a time ⚪. Ready to serve with 𝙋assion, 𝙋urpose, and 𝙋eople 〰️ always the Sparky Way. 🦸

🗣️ 𝗦𝗜𝗚𝗡 𝗨𝗣 𝗢𝗥 𝗦𝗢𝗔𝗥 𝗔𝗪𝗔𝗬!🚀
Hep-hep sa lahat ng hindi pa nakakapag-apply 🫵 be a hero, join our SUPER TEAM, and light up the sky! ⚡
🔗 https://forms.gle/tcdJUtSBozvCxntHA
🔗 https://forms.gle/tcdJUtSBozvCxntHA
🔗 https://forms.gle/tcdJUtSBozvCxntHA

⏰ Apply until October 19

🗣️ 𝙎𝙥𝙖𝙧𝙠𝙮’𝙨 𝙘𝙖𝙡𝙡𝙞𝙣𝙜… grab your DP frame below and soar high! 
🔗 https://gdgmembership.vercel.app/
🔗 https://gdgmembership.vercel.app/
🔗 https://gdgmembership.vercel.app/

✍🏽 Spiel by 𝘑𝘢𝘥𝘦 𝘚𝘩𝘢𝘯𝘢 & 𝘎𝘪𝘢𝘯𝘯𝘦 𝘋𝘢𝘴𝘤𝘰
🎨 Mascot by 𝘊𝘺𝘳𝘶𝘻 𝘈𝘳𝘤𝘢𝘯
🖼️ Frame by 𝘋𝘢𝘺𝘯𝘦 𝘔𝘦𝘯𝘥𝘰𝘻𝘢`;
  const [captionCopied, setCaptionCopied] = useState<boolean>(false);
  const [scaleInputValue, setScaleInputValue] = useState<string>("1");
  const [rotationInputValue, setRotationInputValue] = useState<string>("0");
  const [scaleError, setScaleError] = useState<string>("");
  const [rotationError, setRotationError] = useState<string>("");
  const [uploadError, setUploadError] = useState<string>("");

  const [initialDistance, setInitialDistance] = useState<number>(0);
  const [initialScale, setInitialScale] = useState<number>(1);
  const [isPinching, setIsPinching] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameSrc = "frame.png";

  const resetToDefault = useCallback(() => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setScaleInputValue("1");
    setRotationInputValue("0");
    setScaleError("");
    setRotationError("");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const preventDefaultTouchAction = (e: TouchEvent) => {
      if (e.target === canvas && (isDragging || isPinching)) {
        e.preventDefault();
      }
    };
    document.addEventListener("touchmove", preventDefaultTouchAction, {
      passive: false,
    });
    return () => {
      document.removeEventListener("touchmove", preventDefaultTouchAction);
    };
  }, [isDragging, isPinching]);

  const loadImageFromFile = (file: File) => {
    if (!file) return;
    if (!file.type.match("image.*")) {
      setUploadError("Please select a valid image file.");
      return;
    }
    setUploadError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target || typeof event.target.result !== "string") return;
      const img = new window.Image();
      img.onload = () => {
        setUploadedImage(img);
        resetToDefault();
        setShowSettings(true);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const startDrag = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!uploadedImage) return;
    if (!showSettings) {
      setShowSettings(true);
      return;
    }

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const duringDrag = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !showSettings) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!uploadedImage) return;
    if (!showSettings) {
      setShowSettings(true);
      return;
    }

    if (e.touches.length === 2) {
      setIsPinching(true);
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = getDistance(
        touch1 as unknown as Touch,
        touch2 as unknown as Touch
      );
      setInitialDistance(dist);
      setInitialScale(scale);

      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;

      setIsDragging(true);
      setDragStart({
        x: centerX - position.x,
        y: centerY - position.y,
      });
    } else if (e.touches.length === 1) {
      setIsPinching(false);
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    if (!showSettings || !uploadedImage) return;

    if (e.touches.length === 2 && isPinching) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = getDistance(
        touch1 as unknown as Touch,
        touch2 as unknown as Touch
      );
      const newScale = initialScale * (currentDistance / initialDistance);

      const boundedScale = Math.min(Math.max(newScale, 0.1), 10);
      setScale(boundedScale);
      setScaleInputValue(boundedScale.toFixed(1));

      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;

      if (isDragging) {
        setPosition({
          x: centerX - dragStart.x,
          y: centerY - dragStart.y,
        });
      }
    } else if (e.touches.length === 1 && isDragging) {
      requestAnimationFrame(() => {
        setPosition({
          x: e.touches[0].clientX - dragStart.x,
          y: e.touches[0].clientY - dragStart.y,
        });
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isPinching && e.touches.length === 1) {
      setIsPinching(false);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    } else if (e.touches.length === 0) {
      setIsDragging(false);
      setIsPinching(false);
    }
  };

  const copyCaption = () => {
    navigator.clipboard.writeText(caption).then(() => {
      setCaptionCopied(true);
      setTimeout(() => setCaptionCopied(false), 2000);
    });
  };

  const handleScaleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setScaleInputValue(inputValue);

    if (inputValue === "") {
      setScaleError("Value cannot be empty");
    } else {
      const value = parseFloat(inputValue);
      if (isNaN(value)) {
        setScaleError("Please enter a valid number");
      } else if (value < 0.1 || value > 10) {
        setScaleError("Value must be between 0.1 and 10");
      } else {
        setScaleError("");
        setScale(value);
      }
    }
  };

  const handleScaleInputBlur = () => {
    if (scaleInputValue === "") {
      setScaleInputValue(scale.toString());
      setScaleError("");
    } else {
      const value = parseFloat(scaleInputValue);
      if (!isNaN(value) && value >= 0.1 && value <= 10) {
        const roundedValue = Math.round(value * 10) / 10;
        setScale(roundedValue);
        setScaleInputValue(roundedValue.toString());
        setScaleError("");
      }
    }
  };

  const handleRotationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = e.target.value;
    setRotationInputValue(inputValue);

    if (inputValue === "") {
      setRotationError("Value cannot be empty");
    } else {
      const value = parseFloat(inputValue);
      if (isNaN(value)) {
        setRotationError("Please enter a valid number");
      } else if (value < 0 || value > 360) {
        setRotationError("Value must be between 0 and 360");
      } else {
        setRotationError("");
        setRotation(value);
      }
    }
  };

  const handleRotationInputBlur = () => {
    if (rotationInputValue === "") {
      setRotationInputValue(rotation.toString());
      setRotationError("");
    } else {
      const value = parseFloat(rotationInputValue);
      if (!isNaN(value) && value >= 0 && value <= 360) {
        setRotation(value);
        setRotationInputValue(value.toString());
        setRotationError("");
      }
    }
  };

  const handleDraw = (canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  };

  const downloadImage = async () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    try {
      const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
      const isAndroidWebView = /;\s*wv\)/i.test(ua);
      const isFacebookFamily = /FBAN|FBAV|FB_IAB|FBMD|FBSN|FBDV|FBID/i.test(ua);
      const isInstaOrMessenger = /Instagram|Messenger/i.test(ua);
      const isTiktokTwitterEtc =
        /TikTok|Twitter|Snapchat|Pinterest|Discord|Telegram|WhatsApp|MicroMessenger|WeChat|GSA|Gmail|Outlook|KAKAOTALK/i.test(
          ua
        );
      const isInApp =
        isAndroidWebView ||
        isFacebookFamily ||
        isInstaOrMessenger ||
        isTiktokTwitterEtc;

      if (isInApp) {
        // Use token-based API URL to avoid exceeding URL limits and improve compatibility
        try {
          const res = await fetch("/api/download-store", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dataUrl, filename: "image.png" }),
          });
          const json = await res.json();
          if (res.ok && json?.token) {
            const target = `${
              window.location.origin
            }/api/download?token=${encodeURIComponent(json.token)}`;
            try {
              window.open(target, "_blank");
            } catch {}
            setTimeout(() => {
              try {
                const url = new URL(target);
                const scheme = url.protocol.replace(":", "");
                const hostAndPath =
                  url.host +
                  url.pathname +
                  (url.search || "") +
                  (url.hash || "");
                const intent = `intent://${hostAndPath}#Intent;scheme=${scheme};action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;end`;
                window.location.href = intent;
              } catch {}
            }, 120);
            setTimeout(() => {
              try {
                window.location.href = target;
              } catch {}
            }, 240);
            return;
          }
        } catch {}

        const fallbackTarget = `${
          window.location.origin
        }/download#${encodeURIComponent(dataUrl)}`;
        try {
          window.open(fallbackTarget, "_blank");
        } catch {}
        setTimeout(() => {
          try {
            window.location.href = fallbackTarget;
          } catch {}
        }, 150);
        return;
      }

      const link = document.createElement("a");
      link.download = "image.png";
      link.href = dataUrl;
      link.click();
    } catch {
      const link = document.createElement("a");
      link.download = "image.png";
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col font-sans relative overflow-hidden`}
    >
      <Header></Header>

      <div
        className="fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `
          linear-gradient(to right, #4B00A3 1px, transparent 1px),
          linear-gradient(to bottom, #4B00A3 1px, transparent 1px)
        `,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Main container */}
      <div className="flex flex-col flex-1 h-full w-full max-w-6xl mx-auto px-4 py-4 md:py-6 pt-10 items-center justify-start md:justify-center relative z-10">
        {/* Main content area */}
        <main className="flex flex-col md:flex-row gap-4 w-full pb-10 md:pt-0">
          {/* Canvas Container */}
          <div
            className={`relative flex items-center justify-center rounded-lg p-2 md:p-4 border bg-card text-card-foreground shadow-sm w-auto h-auto mx-auto transition-all duration-300 ${
              uploadedImage ? "bg-white/95" : "bg-white/80"
            }`}
          >
            <div className="relative max-h-180 max-w-180 aspect-square touch-none">
              <Canvas
                uploadedImage={uploadedImage}
                scale={scale}
                position={position}
                rotation={rotation}
                frameSrc={frameSrc}
                onDraw={handleDraw}
                onDragStart={startDrag}
                onDrag={duringDrag}
                onDragEnd={endDrag}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
              {!uploadedImage && (
                <div className="absolute inset-0">
                  <Dropzone
                    onImageUpload={loadImageFromFile}
                    uploadError={uploadError}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          {uploadedImage && (
            <div className="md:w-72 lg:w-80 flex-shrink-0 md:h-auto">
              <Editor
                scale={scale}
                setScale={setScale}
                rotation={rotation}
                setRotation={setRotation}
                resetToDefault={resetToDefault}
                scaleInputValue={scaleInputValue}
                rotationInputValue={rotationInputValue}
                scaleError={scaleError}
                rotationError={rotationError}
                handleScaleInputChange={handleScaleInputChange}
                handleRotationInputChange={handleRotationInputChange}
                handleScaleInputBlur={handleScaleInputBlur}
                handleRotationInputBlur={handleRotationInputBlur}
              />
              <Card className="mt-4 border-[#4B00A3]/20 bg-white/95 backdrop-blur-sm shadow-xl">
                <CardHeader className="border-b border-[#4B00A3]/10">
                  <CardTitle className="text-sm font-medium text-[#4B00A3]">
                    Social Media Caption
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="relative">
                    <div className="p-3 border border-[#4B00A3]/20 rounded-md text-sm h-60 max-h-60 overflow-y-auto whitespace-pre-wrap break-words bg-white text-gray-800">
                      {caption}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-1 right-1 h-8 w-8 p-0 text-[#4B00A3] hover:bg-[#4B00A3]/10 hover:text-[#4B00A3]"
                      onClick={copyCaption}
                    >
                      {captionCopied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>

                    {captionCopied && (
                      <div className="absolute -top-8 right-0 bg-[#4B00A3] text-white text-xs py-1 px-2 rounded shadow-sm">
                        Copied!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Button
                className="w-full h-10 mt-4 bg-[#4B00A3] hover:bg-[#6100D1] text-white"
                onClick={downloadImage}
              >
                <Download className="mr-2 h-4 w-4" /> Download Image
              </Button>
            </div>
          )}
        </main>

        <div className="flex justify-center items-center pb-4 px-4">
          <span className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium text-center">
            Effortlessly frame your photos with just one click.
          </span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-sm border-t border-gray-200">
        <Footer />
      </div>
    </div>
  );
}
