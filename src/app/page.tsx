"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
  X,
  Settings,
  Copy,
  RefreshCw,
  Check,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
export default function ImageFrameOverlay() {
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [frameLoaded, setFrameLoaded] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const caption = `⏰⚡𝗧𝗢𝗢𝗧𝗜𝗠𝗘𝗧𝗢𝗢𝗧𝗜𝗠𝗘, 𝗜𝗧'𝗦 𝗔𝗥𝗗𝗨𝗜𝗡𝗢 𝗢'𝗖𝗟𝗢𝗖𝗞! ⏰⚡ 
  
𝘽𝙍𝙍𝙏 𝘽𝙍𝙍𝙏! 𝙎𝙔𝙎𝙏𝙀𝙈 𝘽𝙊𝙊𝙏𝙄𝙉𝙂 𝙄𝙉… 3...2...1...⏳✅ Oh hey, innovators! I'm [Name], and I'm ready to gear up for 𝗔𝗿𝗱𝘂𝗶𝗻𝗼 𝗗𝗮𝘆 𝗣𝗵𝗶𝗹𝗶𝗽𝗽𝗶𝗻𝗲𝘀 2025—𝘵𝘩𝘦 𝘉𝘐𝘎𝘎𝘌𝘚𝘛 𝘈𝘳𝘥𝘶𝘪𝘯𝘰 𝘨𝘢𝘵𝘩𝘦𝘳𝘪𝘯𝘨 𝘧𝘰𝘳 𝘣𝘶𝘪𝘭𝘥𝘦𝘳𝘴, 𝘵𝘪𝘯𝘬𝘦𝘳𝘦𝘳𝘴, 𝘢𝘯𝘥 𝘵𝘦𝘤𝘩 𝘦𝘯𝘵𝘩𝘶𝘴𝘪𝘢𝘴𝘵𝘴!

Whether you're a coding pro or just getting started, this global event is the perfect place to explore 𝗰𝘂𝘁𝘁𝗶𝗻𝗴-𝗲𝗱𝗴𝗲 𝗽𝗿𝗼𝗷𝗲𝗰𝘁𝘀, 𝗲𝘅𝗰𝗵𝗮𝗻𝗴𝗲 𝗶𝗱𝗲𝗮𝘀, 𝗮𝗻𝗱 𝘀𝗲𝗲 𝗔𝗿𝗱𝘂𝗶𝗻𝗼 𝗺𝗮𝗴𝗶𝗰 𝗶𝗻 𝗮𝗰𝘁𝗶𝗼𝗻!✨

So, what are you waiting for? 📅 Join us on 𝗠𝗮𝗿𝗰𝗵 22, 2025, at 𝗦𝗧𝗜 𝗖𝗼𝗹𝗹𝗲𝗴𝗲 𝗖𝘂𝗯𝗮𝗼 for a day of innovation, creativity, and hands-on tech magic. Let's build, learn, and bring ideas to life—𝙨𝙚𝙚 𝙮𝙤𝙪 𝙩𝙝𝙚𝙧𝙚! 🚀💡
  
𝗥𝗲𝗴𝗶𝘀𝘁𝗲𝗿 𝗛𝗲𝗿𝗲:    
➤  https://arduinodayph.pwapilipinas.org/
➤  https://arduinodayph.pwapilipinas.org/
➤  https://arduinodayph.pwapilipinas.org/

𝗝𝗼𝗶𝗻 𝗼𝘂𝗿 𝗗𝗣 𝗕𝗹𝗮𝘀𝘁 𝘂𝘀𝗶𝗻𝗴 𝘁𝗵𝗶𝘀 𝗹𝗶𝗻𝗸:
➤  https://frame.arduinodayphilippines.cc/
➤  https://frame.arduinodayphilippines.cc/
➤  https://frame.arduinodayphilippines.cc/

#ArduinoDayPH2025 #ArduinoDayPhilippines #InnovateWithArduino`;

  const [captionCopied, setCaptionCopied] = useState<boolean>(false);
  const [scaleInputValue, setScaleInputValue] = useState<string>("1");
  const [rotationInputValue, setRotationInputValue] = useState<string>("0");
  const [scaleError, setScaleError] = useState<string>("");
  const [rotationError, setRotationError] = useState<string>("");
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<HTMLImageElement | null>(null);
  const frameSrc = "/frame.svg";
  const colors = {
    bg: "bg-[#131118]",
    headerBg: "bg-[#00717A]", 
    panelBg: "bg-[#1F2430]", 
    accent: "bg-[#E47128]",
    accentHover: "hover:bg-[#C05A20]", 
    text: "text-white",
    textMuted: "text-gray-300",
    textDark: "text-[#00979D]", 
    textAccent: "text-[#E47128]",
    border: "border-[#00979D]", 
    buttonBg: "bg-[#00979D]", 
    buttonHover: "hover:bg-[#00717A]", 
    buttonText: "text-white",
    secondaryButton: "bg-[#2D3748]", 
    secondaryButtonHover: "hover:bg-[#374151]",
    secondaryButtonText: "text-gray-200",
    inputBg: "bg-[#1F2430]", 
    inputBorder: "border-[#00979D]", 
    sliderTrack: "bg-[#2D3748]",
    sliderRange: "bg-[#00979D]" 
  };
  
  const createFallbackFrame = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = "#131118"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#00979D"; 
      ctx.lineWidth = 20;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    }
    return canvas.toDataURL('image/png');
  };
  
  const defaultSettings = {
    scale: 1,
    rotation: 0,
    position: { x: 0, y: 0 }
  };
  
  const resetToDefault = () => {
    setScale(defaultSettings.scale);
    setRotation(defaultSettings.rotation);
    setPosition(defaultSettings.position);
    setScaleInputValue(defaultSettings.scale.toString());
    setRotationInputValue(defaultSettings.rotation.toString());
    setScaleError("");
    setRotationError("");
  };
  
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
    
    if (typeof window !== 'undefined') {
      const img = new window.Image();
      
      img.onload = () => {
        console.log("Frame image loaded successfully");
        frameRef.current = img;
        setFrameLoaded(true);
      };
      
      img.onerror = () => {
        console.error("Error loading frame image, using fallback");
        const fallbackDataUrl = createFallbackFrame();
        img.onload = () => {
          console.log("Fallback frame loaded");
          frameRef.current = img;
          setFrameLoaded(true);
        };
        img.src = fallbackDataUrl;
      };
      img.src = frameSrc;
    }
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target || typeof event.target.result !== 'string') return;
        
        const img = new window.Image();
        img.onload = () => {
          setUploadedImage(img);
          resetToDefault();
          setShowSettings(true);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  
  const changeImage = () => {
    document.getElementById('image-upload')?.click();
  };
  
  // Mouse event handlers
  const startDrag = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!uploadedImage) return;
    if (!showSettings) {
      setShowSettings(true);
      return;
    }
    
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    });
  };
  
  const duringDrag = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !showSettings) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };
  
  const endDrag = () => {
    setIsDragging(false);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!uploadedImage) return;
    if (!showSettings) {
      setShowSettings(true);
      return;
    }
    
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || !showSettings) return;
    
    if (e.touches.length === 1) {
      e.preventDefault(); // Prevents scrolling while dragging
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
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
  
  const handleRotationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    try {
      if (uploadedImage) {
        ctx.save();
        ctx.translate(canvas.width / 2 + position.x, canvas.height / 2 + position.y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(
          uploadedImage,
          -uploadedImage.width * scale / 2,
          -uploadedImage.height * scale / 2,
          uploadedImage.width * scale,
          uploadedImage.height * scale
        );
        
        ctx.restore();
      }
      if (frameRef.current && frameLoaded) {
        ctx.drawImage(frameRef.current, 0, 0, canvas.width, canvas.height);
      }
    } catch (error) {
      console.error("Error drawing on canvas:", error);
    }
    
  }, [uploadedImage, scale, position, rotation, frameLoaded]);
  
  const downloadImage = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };
  
  return (
    <div className={`min-h-screen w-full flex flex-col ${colors.bg} font-sans`}>
      {/* Main container */}
      <div className="flex flex-col h-full w-full max-w-6xl mx-auto px-4 py-4 md:py-6 space-y-4">
        {/* Header */}
        <header className="text-center mb-2">
          <div className="flex justify-center mb-2">
            <div className="relative w-[180px] h-[80px]">
              <Image
                src="/logo.png" 
                alt="FrameIt Logo"
                layout="fill"
                objectFit="contain"
                priority 
              />
            </div>
          </div>
          <h1 className={`md:text-base ${colors.textMuted} max-w-2xl mx-auto`}>
            Effortlessly frame your photos with just one click – made by ICPEP SE PUP
          </h1>
        </header>
        
        {/* Main content area */}
        <main className="flex-grow flex flex-col md:flex-row gap-4 h-full">
          {/* Canvas Container */}
          <div className="relative flex-grow flex items-center justify-center rounded-lg p-2 md:p-4 shadow-md">
            <div className="relative max-h-180 max-w-180 aspect-square">
              <canvas 
                ref={canvasRef}
                width={800}
                height={800}
                className={`w-full h-full object-contain rounded shadow-sm ${uploadedImage ? 'cursor-pointer' : ''}`}
                onMouseDown={startDrag}
                onMouseMove={duringDrag}
                onMouseUp={endDrag}
                onMouseLeave={endDrag}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
              />
              
              {!uploadedImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Upload className={`h-8 w-8 mb-4 ${colors.textDark}`} />
                  <Button 
                    className={`${colors.buttonBg} ${colors.buttonHover} ${colors.buttonText} font-medium px-6 py-2 text-sm rounded-md shadow-lg transition-all duration-200`}
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    Upload Image
                  </Button>
                  <input 
                    id="image-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                  <p className={`mt-4 text-xs ${colors.textMuted}`}>Click to upload your image</p>
                </div>
              )}
              
              {uploadedImage && !showSettings && (
                <button
                  className={`absolute bottom-4 right-4 ${colors.buttonBg} ${colors.buttonHover} p-2 rounded-full shadow-lg transition-all duration-200`}
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="h-4 w-4 text-white" />
                </button>
              )}
            </div>
          </div>
          
          {/* Settings Panel */}
          {uploadedImage && showSettings && (
            <div className="md:w-72 lg:w-80 flex-shrink-0 md:h-auto">
              <Card className={`shadow-lg border ${colors.border} ${colors.panelBg} overflow-hidden h-full max-h-180`}>
                <CardHeader className="px-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium text-white">Image Settings</CardTitle>
                    <button 
                      className="text-white hover:text-gray-200 md:hidden"
                      onClick={() => setShowSettings(false)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className={` ${colors.panelBg}`}>
                  <div className="space-y-4">
                    {/* Scale Control */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-200">Scale</h4>
                        <div className="w-20">
                          <Input
                            type="number"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={scaleInputValue}
                            onChange={handleScaleInputChange}
                            onBlur={handleScaleInputBlur}
                            className={`h-8 text-sm border ${colors.inputBorder} ${colors.secondaryButton} text-white ${scaleError ? 'border-red-500 focus:ring-red-500' : `focus:ring-[#00979D]`}`}
                          />
                        </div>
                      </div>
                      
                      {scaleError && (
                        <div className="flex items-center gap-1 text-red-400 text-xs justify-end">
                          <AlertCircle className="h-3 w-3" />
                          <span>{scaleError}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 px-1">
                        <button className="text-[#00979D] hover:text-[#00C8D1] transition-colors">
                          <ZoomOut className="h-4 w-4" />
                        </button>
                        <Slider
                          value={[scale]}
                          min={0.1}
                          max={10}
                          step={0.1}
                          onValueChange={(value) => {
                            setScale(value[0]);
                            setScaleInputValue(value[0].toString());
                            setScaleError("");
                          }}
                          className="flex-grow"
                        />
                        <button className="text-[#00979D] hover:text-[#00C8D1] transition-colors">
                          <ZoomIn className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Rotation Control */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-200">Rotation</h4>
                        <div className="w-20">
                          <Input
                            type="number"
                            min="0"
                            max="360"
                            step="1"
                            value={rotationInputValue}
                            onChange={handleRotationInputChange}
                            onBlur={handleRotationInputBlur}
                            className={`h-8 text-sm border ${colors.inputBorder} ${colors.secondaryButton} text-white ${rotationError ? 'border-red-500 focus:ring-red-500' : `focus:ring-[#00979D]`}`}
                          />
                        </div>
                      </div>
                      
                      {rotationError && (
                        <div className="flex items-center gap-1 text-red-400 text-xs justify-end">
                          <AlertCircle className="h-3 w-3" />
                          <span>{rotationError}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 px-1">
                        <button className="text-[#00979D] hover:text-[#00C8D1] transition-colors">
                          <RotateCcw className="h-4 w-4" />
                        </button>
                        <Slider
                          value={[rotation]}
                          min={0}
                          max={360}
                          step={1}
                          onValueChange={(value) => {
                            setRotation(value[0]);
                            setRotationInputValue(value[0].toString());
                            setRotationError("");
                          }}
                          className="flex-grow"
                        />
                        <button className="text-[#00979D] hover:text-[#00C8D1] transition-colors">
                          <RotateCw className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Position Control */}
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-200">Position</h4>
                      <p className="text-xs text-gray-400">
                        Drag the image directly to adjust its position
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={`w-full text-sm border ${colors.border} ${colors.secondaryButtonText} ${colors.secondaryButton} ${colors.secondaryButtonHover} h-8`}
                        onClick={() => setPosition({ x: 0, y: 0 })}
                      >
                        Center Image
                      </Button>
                    </div>
                    
                   {/* Caption Section */}
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-200">
                        Social Media Caption
                      </h4>
                      <div className="relative">
                        <div 
                          className={`p-2 border rounded-md text-sm h-60 max-h-60 overflow-y-auto whitespace-pre-wrap break-words ${colors.secondaryButton} border-[#00979D] text-gray-200`}
                        >
                          {caption}
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className={`absolute top-1 right-1 h-6 w-6 p-0 text-[#00979D] hover:text-[#00C8D1]`}
                          onClick={copyCaption}
                        >
                          {captionCopied ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        
                        {captionCopied && (
                          <div className="absolute -top-6 right-0 bg-[#00979D] text-white text-xs py-1 px-2 rounded shadow-sm">
                            Copied!
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="pt-1 grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline"
                        className={`h-8 w-full px-2 border ${colors.border} ${colors.secondaryButtonText} ${colors.secondaryButton} ${colors.secondaryButtonHover} text-sm font-medium`}
                        onClick={resetToDefault}
                      >
                        <RefreshCw className="mr-1 h-4 w-4" /> Reset
                      </Button>
                      <Button 
                        variant="outline"
                        className={`h-8 w-full px-2 border ${colors.border} ${colors.secondaryButtonText} ${colors.secondaryButton} ${colors.secondaryButtonHover} text-sm font-medium`}
                        onClick={changeImage}
                      >
                        <Upload className="mr-1 h-4 w-4" /> Change
                      </Button>
                    </div>
                    <Button 
                      className={`w-full h-9 ${colors.accent} ${colors.accentHover} text-white font-medium text-sm shadow-md`} 
                      onClick={downloadImage}
                    >
                      <Download className="mr-2 h-4 w-4" /> Download Image
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
      <input 
        id="image-upload" 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleImageUpload}
      />
    </div>
  );
}