"use client";

import { useState, useEffect } from "react";
import {
  generateBadgeImage,
  downloadBadgeImage,
  shareOnTwitter,
} from "@/lib/badge-generator";
import type { WrappedData } from "@/types/trading";

interface BadgePreviewProps {
  wrappedData: WrappedData;
}

export function BadgePreview({ wrappedData }: BadgePreviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const dataUrl = await generateBadgeImage(wrappedData);
      setImageUrl(dataUrl);
      setIsOpen(true);
    } catch (error) {
      console.error("Error generating badge:", error);
      alert("Failed to generate badge image. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      downloadBadgeImage(imageUrl, wrappedData.address);
    }
  };

  const handleShare = () => {
    shareOnTwitter(wrappedData);
  };

  if (!isOpen && !imageUrl) {
    return (
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
      >
        {generating ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating...
          </span>
        ) : (
          "🎨 Preview Badge"
        )}
      </button>
    );
  }

  if (!imageUrl) return null;

  return (
    <>
      {/* Preview Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all"
      >
        🎨 Preview Badge
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full bg-zinc-900 rounded-2xl p-6 border border-zinc-700 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
              aria-label="Close"
            >
              <span className="text-xl">×</span>
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Your Polymarket Wrapped Badge
            </h2>

            {/* Image Preview */}
            <div className="mb-6 rounded-xl overflow-hidden border-2 border-purple-500/30 shadow-2xl">
              <img
                src={imageUrl}
                alt="Your Polymarket Wrapped Badge"
                className="w-full h-auto"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleShare}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                Share on Twitter
              </button>

              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Image
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-all"
              >
                Close
              </button>
            </div>

            {/* Info */}
            <p className="text-center text-sm text-zinc-500 mt-4">
              💡 This image is perfect for sharing on social media!
            </p>
          </div>
        </div>
      )}
    </>
  );
}
