"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { HeroSection } from "@/components/HeroSection";
import { StatsOverviewCard } from "@/components/StatsOverviewCard";
import { PersonaCard } from "@/components/PersonaCard";
import type { WrappedData } from "@/types/trading";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [wrappedData, setWrappedData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      loadWrappedData(address);
    }
  }, [isConnected, address]);

  const loadWrappedData = async (userAddress: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/wrapped/${userAddress}`);

      if (!response.ok) {
        throw new Error("Failed to load wrapped data");
      }

      const data = await response.json();
      setWrappedData(data);
    } catch (err) {
      console.error("Error loading wrapped data:", err);
      setError("Failed to load your trading data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePinCodeSubmit = async (pinCode: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pincode/${pinCode}`);

      if (!response.ok) {
        throw new Error("Invalid pin code");
      }

      const data = await response.json();
      setWrappedData(data);
    } catch (err) {
      console.error("Error with pin code:", err);
      setError("Invalid pin code. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative">
      <BackgroundEffects />

      <div className="relative z-10">
        <HeroSection onPinCodeSubmit={handlePinCodeSubmit} />

        {error && (
          <div className="max-w-2xl mx-auto px-4 mb-8">
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 text-red-300 text-center">
              {error}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-zinc-400">Loading your wrapped data...</p>
          </div>
        )}

        {!loading && wrappedData && (
          <div className="flex flex-col items-center gap-8 py-8 px-4 pb-20">
            <StatsOverviewCard stats={wrappedData.stats} />
            <PersonaCard persona={wrappedData.stats.tradingPersona} />

            {/* Best/Worst Trades */}
            {(wrappedData.stats.bestTrade || wrappedData.stats.worstTrade) && (
              <div className="w-full max-w-2xl grid md:grid-cols-2 gap-4">
                {wrappedData.stats.bestTrade && (
                  <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-500/20">
                    <div className="text-3xl mb-2">🏆</div>
                    <h3 className="text-xl font-bold mb-2 text-green-400">
                      Best Trade
                    </h3>
                    <p className="text-sm text-zinc-400 mb-1">
                      {wrappedData.stats.bestTrade.marketTitle}
                    </p>
                    <p className="text-2xl font-bold text-green-400">
                      +${wrappedData.stats.bestTrade.pnl?.toFixed(2)}
                    </p>
                  </div>
                )}

                {wrappedData.stats.worstTrade && (
                  <div className="bg-gradient-to-br from-red-900/30 to-rose-900/30 rounded-2xl p-6 border border-red-500/20">
                    <div className="text-3xl mb-2">💔</div>
                    <h3 className="text-xl font-bold mb-2 text-red-400">
                      Worst Trade
                    </h3>
                    <p className="text-sm text-zinc-400 mb-1">
                      {wrappedData.stats.worstTrade.marketTitle}
                    </p>
                    <p className="text-2xl font-bold text-red-400">
                      ${wrappedData.stats.worstTrade.pnl?.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Favorite Categories */}
            {wrappedData.stats.favoriteCategories.length > 0 && (
              <div className="w-full max-w-2xl bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-3xl p-8 border border-blue-500/20">
                <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Favorite Categories
                </h3>
                <div className="space-y-4">
                  {wrappedData.stats.favoriteCategories.map((cat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold">{cat.category}</div>
                        <div className="text-sm text-zinc-400">
                          {cat.count} trades
                        </div>
                      </div>
                      <div className="text-xl font-bold text-cyan-400">
                        ${cat.volume.toFixed(0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium transition-all">
                Share on Twitter
              </button>
              <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all">
                Mint Badge NFT
              </button>
              <button className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-all">
                Export Image
              </button>
            </div>
          </div>
        )}

        {!loading && !wrappedData && isConnected && (
          <div className="text-center py-20 px-4">
            <p className="text-zinc-400 text-lg">
              Womp Womp, no trades found 🥺
              <br />
              <span className="text-sm text-zinc-500">
                Make sure you've traded on Polymarket in 2025.
              </span>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
