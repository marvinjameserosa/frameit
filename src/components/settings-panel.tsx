"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";
import Editor from "@/components/editor";

interface SettingsPanelProps {
  scale: number;
  setScale: (value: number) => void;
  rotation: number;
  setRotation: (value: number) => void;
  resetToDefault: () => void;
  scaleInputValue: string;
  rotationInputValue: string;
  scaleError: string;
  rotationError: string;
  handleScaleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRotationInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleScaleInputBlur: () => void;
  handleRotationInputBlur: () => void;
  caption: string;
  copyCaption: () => void;
  captionCopied: boolean;
  downloadImage: () => void;
}

export default function SettingsPanel({
  scale,
  setScale,
  rotation,
  setRotation,
  resetToDefault,
  scaleInputValue,
  rotationInputValue,
  scaleError,
  rotationError,
  handleScaleInputChange,
  handleRotationInputChange,
  handleScaleInputBlur,
  handleRotationInputBlur,
  caption,
  copyCaption,
  captionCopied,
  downloadImage,
}: SettingsPanelProps) {
  return (
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
            Caption
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
        className="w-full h-12 mt-4 text-base font-semibold text-white transition-all duration-300 ease-in-out bg-[#4B00A3] rounded-lg shadow-lg hover:bg-[#6100D1] hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#6100D1]"
        onClick={downloadImage}
      >
        <Download className="w-5 h-5 mr-2" /> Download Image
      </Button>
    </div>
  );
}
