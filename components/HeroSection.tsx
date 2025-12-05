"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function HeroSection({
  onConnect,
  onPinCodeSubmit,
}: {
  onConnect?: () => void;
  onPinCodeSubmit?: (code: string) => void;
}) {
  const [pinCode, setPinCode] = useState("");
  const [showPinInput, setShowPinInput] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode && onPinCodeSubmit) {
      onPinCodeSubmit(pinCode.toUpperCase());
    }
  };

  return (
    <div className="w-full">
      {/* Header with ConnectButton */}
      <div className="w-full max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Polymarket Wrapped
        </div>
        <ConnectButton
          showBalance={false}
          chainStatus="none"
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-6 pt-8 pb-8 px-4">
        {/* Logo Icon */}
        <div className="relative group">
          <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full transition-all duration-700 group-hover:scale-150 group-hover:opacity-100 scale-100 opacity-60" />
          <div className="relative p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full backdrop-blur-sm border border-purple-500/30">
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-purple-400"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="currentColor"
                opacity="0.5"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent leading-tight">
            Polymarket Wrapped
          </h1>
          <div className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            2025
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-zinc-400 text-center max-w-2xl leading-relaxed">
          Your personalized year in Polymarket trading
          <br />
          <span className="text-sm text-zinc-500">
            Connect your wallet or enter a pin code to view any trader's wrapped
          </span>
        </p>

        {/* Pin Code Section */}
        <div className="flex flex-col items-center gap-3 w-full max-w-md">
          {!showPinInput ? (
            <button
              onClick={() => setShowPinInput(true)}
              className="px-6 py-2 text-sm text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-4"
            >
              Have a pin code?
            </button>
          ) : (
            <form onSubmit={handlePinSubmit} className="w-full flex gap-2">
              <input
                type="text"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-character code"
                maxLength={6}
                className="flex-1 px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 uppercase font-mono"
              />
              <button
                type="submit"
                disabled={pinCode.length !== 6}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
              >
                View
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
