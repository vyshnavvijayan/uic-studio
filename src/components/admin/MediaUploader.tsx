"use client";

import React, { useState, useRef } from "react";
import { uploadMedia, validateMediaUrl } from "@/lib/content-service";
import { UploadCloud, Check, AlertCircle, FileText, Image as ImageIcon } from "lucide-react";

interface MediaUploaderProps {
  label: string;
  currentUrl: string;
  onUrlChange: (newUrl: string) => void;
  mediaType?: "image" | "video";
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label,
  currentUrl,
  onUrlChange,
  mediaType = "image",
}) => {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setErrorMsg(null);
    setUploading(true);

    const res = await uploadMedia(file);
    setUploading(false);

    if (res.error) {
      setErrorMsg(res.error);
    } else if (res.url) {
      onUrlChange(res.url);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-mono uppercase tracking-wider text-[#90909c] flex items-center justify-between">
        <span>{label}</span>
        <span className="text-[#585863] text-[10px]">
          {mediaType === "image" ? "JPG, PNG, WebP, GIF ≤ 8MB" : "MP4, WebM ≤ 24MB"}
        </span>
      </label>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 ${
          isDragging
            ? "border-[#c6f36b] bg-[#c6f36b]/5"
            : "border-white/10 hover:border-white/20 bg-[#161619]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={mediaType === "image" ? "image/jpeg,image/png,image/webp,image/gif" : "video/mp4,video/webm"}
          onChange={handleFileChange}
          className="hidden"
        />

        {uploading ? (
          <div className="py-3 flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-[#c6f36b] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-[#90909c]">Processing file...</span>
          </div>
        ) : (
          <div className="py-2 flex flex-col items-center gap-1.5">
            <UploadCloud className="w-5 h-5 text-[#90909c]" />
            <span className="text-xs font-medium text-white">
              Drag file here or click to browse
            </span>
            <span className="text-[10px] font-mono text-[#585863]">
              Safe validation enforced • SVGs and executables blocked
            </span>
          </div>
        )}
      </div>

      {/* Manual URL Input or Current Preview */}
      <div className="flex items-center gap-2 mt-1">
        <input
          type="text"
          value={currentUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="/images/example.webp or https://..."
          className="flex-1 bg-[#121215] border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-white/20 focus:outline-none focus:border-[#c6f36b]"
        />
        {currentUrl && (
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-[#1e1e24] flex items-center justify-center flex-shrink-0">
            {mediaType === "image" && validateMediaUrl(currentUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-4 h-4 text-[#90909c]" />
            )}
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-2 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-[11px] font-mono flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
