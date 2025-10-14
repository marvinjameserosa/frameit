"use client";

import { useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DropzoneProps {
  onImageUpload: (file: File) => void;
  uploadError: string;
}

export default function Dropzone({
  onImageUpload,
  uploadError,
}: DropzoneProps) {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseClick = () => {
    document.getElementById("image-upload-input")?.click();
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full h-full cursor-pointer transition-colors ${
        isDragOver ? "bg-gray-100" : ""
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleBrowseClick}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <Upload className="w-10 h-10 text-[#4B00A3]" />
        <p className="text-sm font-medium text-gray-600">
          Drag & drop an image here or
        </p>
        <Button
          variant="outline"
          className="bg-white/70 border-gray-300 text-gray-700 hover:bg-[#4B00A3] hover:text-white hover:bg-[#4B00A3] transition-colors font-medium"
          onClick={(e) => {
            e.stopPropagation();
            handleBrowseClick();
          }}
        >
          Upload Image
        </Button>
      </div>
      <input
        id="image-upload-input"
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onImageUpload(e.target.files[0]);
          }
        }}
        accept="image/*"
      />
      {uploadError && (
        <div className="absolute bottom-4 flex items-center text-red-500">
          <AlertCircle className="w-4 h-4 mr-2" />
          <p className="text-sm font-medium">{uploadError}</p>
        </div>
      )}
    </div>
  );
}
