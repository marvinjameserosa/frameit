"use client";
import { useState, useRef, useEffect } from "react";
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
  Image as ImageIcon,
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
  const caption = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in magna at quam faucibus pharetra at id dui.";
  const [captionCopied, setCaptionCopied] = useState<boolean>(false);
  const [scaleInputValue, setScaleInputValue] = useState<string>("1");
  const [rotationInputValue, setRotationInputValue] = useState<string>("0");
  const [scaleError, setScaleError] = useState<string>("");
  const [rotationError, setRotationError] = useState<string>("");
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<HTMLImageElement | null>(null);
  const frameSrc = "/frame.png";
  
  const createFallbackFrame = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#000000'; 
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
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
      <div className="flex flex-col h-full w-full max-w-6xl mx-auto px-4 py-4 md:py-6">
        {/* Header */}
        <div className="text-center mb-4 flex-shrink-0">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">FrameIt</h1>
          <p className="text-gray-500 text-sm">Effortlessly frame your photos with just one click – made by </p>
        </div>
        
        {/* Main content area */}
        <div className="flex-grow flex flex-col md:flex-row gap-4 h-full overflow-hidden">
          {/* Canvas Container */}
          <div className="relative flex-grow overflow-hidden flex items-center justify-center">
            <div className="relative max-h-full max-w-full aspect-square">
              <canvas 
                ref={canvasRef}
                width={800}
                height={800}
                className={`w-full h-full object-contain ${uploadedImage ? 'cursor-pointer' : ''}`}
                onMouseDown={startDrag}
                onMouseMove={duringDrag}
                onMouseUp={endDrag}
                onMouseLeave={endDrag}
              />
              
              {!uploadedImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-transparent">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6" 
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
                  <p className="text-gray-500 mt-4 text-sm">Click to upload your image</p>
                </div>
              )}
              
              {uploadedImage && !showSettings && (
                <button
                  className="absolute bottom-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all"
                  onClick={() => setShowSettings(true)}
                >
                  <Settings className="h-5 w-5 text-gray-700" />
                </button>
              )}
            </div>
          </div>
          
          {/* Settings Panel */}
          {uploadedImage && showSettings && (
            <div className="md:w-72 flex-shrink-0 md:h-full overflow-auto">
              <Card className="border shadow-md h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium text-gray-800">Image Settings</CardTitle>
                    <button 
                      className="text-gray-500 hover:text-gray-700 md:hidden"
                      onClick={() => setShowSettings(false)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-medium text-gray-700">Scale</h4>
                      <div className="w-16">
                        <Input
                          type="number"
                          min="0.1"
                          max="10"
                          step="0.1"
                          value={scaleInputValue}
                          onChange={handleScaleInputChange}
                          onBlur={handleScaleInputBlur}
                          className={`h-7 text-sm ${scaleError ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                      </div>
                    </div>
                    
                    {scaleError && (
                      <div className="flex items-center gap-1 text-red-500 text-xs mb-1 justify-end">
                        <AlertCircle className="h-3 w-3" />
                        <span>{scaleError}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-1">
                      <ZoomOut className="h-4 w-4 text-gray-400" />
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
                      <ZoomIn className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-medium text-gray-700">Rotation</h4>
                      <div className="w-16">
                        <Input
                          type="number"
                          min="0"
                          max="360"
                          step="1"
                          value={rotationInputValue}
                          onChange={handleRotationInputChange}
                          onBlur={handleRotationInputBlur}
                          className={`h-7 text-sm ${rotationError ? 'border-red-500 focus:ring-red-500' : ''}`}
                        />
                      </div>
                    </div>
                    
                    {rotationError && (
                      <div className="flex items-center gap-1 text-red-500 text-xs mb-1 justify-end">
                        <AlertCircle className="h-3 w-3" />
                        <span>{rotationError}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-1">
                      <RotateCcw className="h-4 w-4 text-gray-400" />
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
                      <RotateCw className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-gray-700">Position</h4>
                    <p className="text-xs text-gray-500 mb-2">
                      Drag the image when settings are visible
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full text-sm"
                        onClick={() => setPosition({ x: 0, y: 0 })}
                      >
                        Center Image
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-gray-700">
                      Social Media Caption
                    </h4>
                    <div className="relative">
                      <div className="p-2 border rounded-md bg-gray-50 text-sm text-gray-800 break-words">
                        {caption}
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={copyCaption}
                      >
                        {captionCopied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {captionCopied && (
                        <div className="absolute -top-8 right-0 bg-green-600 text-white text-xs py-1 px-2 rounded shadow-sm animate-fade-in">
                          Copied!
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline"
                        className="text-xs h-9 w-full px-1"
                        onClick={resetToDefault}
                      >
                        <RefreshCw className="mr-1 h-3 w-3" /> Default
                      </Button>
                      <Button 
                        variant="outline"
                        className="text-xs h-9 w-full px-1"
                        onClick={changeImage}
                      >
                        <Upload className="mr-1 h-3 w-3" /> Change
                      </Button>
                    </div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                      onClick={downloadImage}
                    >
                      <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
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