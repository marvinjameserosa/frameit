"use client";

import { Slider } from "@/components/ui/slider";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, RefreshCw } from "lucide-react";

interface EditorProps {
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
}

export default function Editor({
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
}: EditorProps) {
  return (
    <Card className="w-full border-[#4B00A3]/20 bg-white/95 backdrop-blur-sm shadow-xl">
      <CardHeader className="border-b border-[#4B00A3]/10">
        <CardTitle className="text-[#4B00A3]">Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <label htmlFor="scale" className="text-sm font-medium text-[#4B00A3]">
            Scale
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setScale(Math.max(0.1, scale - 0.1))}
              className="border-[#4B00A3] text-[#4B00A3] hover:bg-[#4B00A3] hover:text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Slider
              id="scale"
              min={0.1}
              max={10}
              step={0.1}
              value={[scale]}
              onValueChange={(value) => setScale(value[0])}
              className="[&_[role=slider]]:bg-[#4B00A3] [&_[role=slider]]:border-[#4B00A3]"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setScale(Math.min(10, scale + 0.1))}
              className="border-[#4B00A3] text-[#4B00A3] hover:bg-[#4B00A3] hover:text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              className="w-20 border-[#4B00A3]/30 focus:border-[#4B00A3] focus:ring-[#4B00A3]"
              value={scaleInputValue}
              onChange={handleScaleInputChange}
              onBlur={handleScaleInputBlur}
            />
          </div>
          {scaleError && <p className="text-sm text-red-500">{scaleError}</p>}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="rotation"
            className="text-sm font-medium text-[#4B00A3]"
          >
            Rotation
          </label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setRotation(rotation - 90)}
              className="border-[#4B00A3] text-[#4B00A3] hover:bg-[#4B00A3] hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Slider
              id="rotation"
              min={0}
              max={360}
              step={1}
              value={[rotation]}
              onValueChange={(value) => setRotation(value[0])}
              className="[&_[role=slider]]:bg-[#4B00A3] [&_[role=slider]]:border-[#4B00A3]"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setRotation(rotation + 90)}
              className="border-[#4B00A3] text-[#4B00A3] hover:bg-[#4B00A3] hover:text-white"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              className="w-20 border-[#4B00A3]/30 focus:border-[#4B00A3] focus:ring-[#4B00A3]"
              value={rotationInputValue}
              onChange={handleRotationInputChange}
              onBlur={handleRotationInputBlur}
            />
          </div>
          {rotationError && (
            <p className="text-sm text-red-500">{rotationError}</p>
          )}
        </div>
        <Button
          onClick={resetToDefault}
          variant="outline"
          className="w-full border-[#4B00A3] text-[#4B00A3] hover:bg-[#4B00A3] hover:text-white"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to Default
        </Button>
      </CardContent>
    </Card>
  );
}
