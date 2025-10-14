"use client";

import { useRef, useEffect, useCallback } from "react";

interface CanvasProps {
  uploadedImage: HTMLImageElement | null;
  scale: number;
  position: { x: number; y: number };
  rotation: number;
  frameSrc: string;
  onDraw: (canvas: HTMLCanvasElement) => void;
  onDragStart: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onDrag: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onDragEnd: () => void;
  onTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  onTouchEnd: (e: React.TouchEvent<HTMLCanvasElement>) => void;
}

export default function Canvas({
  uploadedImage,
  scale,
  position,
  rotation,
  frameSrc,
  onDraw,
  onDragStart,
  onDrag,
  onDragEnd,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<HTMLImageElement | null>(null);

  const drawCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (uploadedImage) {
        ctx.save();
        ctx.translate(
          canvas.width / 2 + position.x,
          canvas.height / 2 + position.y
        );
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.drawImage(
          uploadedImage,
          -uploadedImage.width / 2,
          -uploadedImage.height / 2
        );
        ctx.restore();
      }

      if (frameRef.current) {
        ctx.drawImage(frameRef.current, 0, 0, canvas.width, canvas.height);
      }
    },
    [uploadedImage, position, rotation, scale]
  );

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      frameRef.current = img;
      if (canvasRef.current) {
        drawCanvas(canvasRef.current);
      }
    };
    img.src = frameSrc;
  }, [frameSrc, drawCanvas]);

  useEffect(() => {
    if (canvasRef.current) {
      drawCanvas(canvasRef.current);
      onDraw(canvasRef.current);
    }
  }, [uploadedImage, scale, position, rotation, drawCanvas, onDraw]);

  return (
    <canvas
      ref={canvasRef}
      width={1200}
      height={1200}
      className="w-full h-auto max-w-full max-h-full rounded-lg shadow-lg"
      onMouseDown={onDragStart}
      onMouseMove={onDrag}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    />
  );
}
