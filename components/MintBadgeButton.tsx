"use client";

import { useState, useEffect } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { canMintBadge, WRAPPED_BADGE_ABI } from "@/lib/nft-client";
import { APP_CONFIG } from "@/config/app";
import { generateBadgeImage } from "@/lib/badge-generator";
import { prepareNFTMetadata } from "@/lib/ipfs-uploader";

export function MintBadgeButton({ wrappedData }: { wrappedData: any }) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [minting, setMinting] = useState(false);
  const [canMint, setCanMint] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if user can mint on mount
  useEffect(() => {
    if (address && APP_CONFIG.wrappedBadgeContract) {
      checkMintEligibility();
    }
  }, [address]);

  const checkMintEligibility = async () => {
    if (!address || !APP_CONFIG.wrappedBadgeContract) {
      setCanMint(false);
      return;
    }

    try {
      const eligible = await canMintBadge(address);
      setCanMint(eligible);
    } catch (err) {
      console.error("Error checking mint eligibility:", err);
      setError("Failed to check eligibility. Please try again.");
      setCanMint(false);
    }
  };

  const handleMint = async () => {
    if (!address || !walletClient) {
      setError("Please connect your wallet");
      return;
    }

    if (!APP_CONFIG.wrappedBadgeContract) {
      setError("Badge contract not configured");
      return;
    }

    setMinting(true);
    setError(null);

    try {
      // Step 1: Generate the badge image
      console.log("Generating badge image...");
      const imageDataUrl = await generateBadgeImage(wrappedData);

      // Step 2: Upload image and metadata to IPFS
      console.log("Uploading to IPFS...");
      let metadataUri: string;

      try {
        metadataUri = await prepareNFTMetadata(wrappedData, imageDataUrl);
      } catch (ipfsError) {
        console.warn("IPFS upload failed, using fallback:", ipfsError);
        // Fallback: Use a data URI (not ideal for production but works for testing)
        const metadata = {
          name: `Polymarket Wrapped ${wrappedData.year}`,
          description: `${wrappedData.address}'s trading summary for ${wrappedData.year}`,
          image: imageDataUrl, // Use the generated image directly
          attributes: [
            {
              trait_type: "Total Trades",
              value: wrappedData.stats.totalTrades,
            },
            {
              trait_type: "Total Volume",
              value: wrappedData.stats.totalVolume,
            },
            { trait_type: "Net P&L", value: wrappedData.stats.totalPnL },
            {
              trait_type: "Win Rate",
              value: `${(wrappedData.stats.winRate * 100).toFixed(1)}%`,
            },
            {
              trait_type: "Trading Persona",
              value: wrappedData.stats.tradingPersona.type,
            },
            { trait_type: "Year", value: wrappedData.year },
          ],
        };
        metadataUri = `data:application/json;base64,${btoa(
          JSON.stringify(metadata)
        )}`;
      }

      console.log("Metadata URI:", metadataUri);

      // Step 3: Mint the NFT
      console.log("Minting NFT...");
      const hash = await walletClient.writeContract({
        address: APP_CONFIG.wrappedBadgeContract as `0x${string}`,
        abi: WRAPPED_BADGE_ABI,
        functionName: "mintWrappedBadge",
        args: [address as `0x${string}`, metadataUri],
      });

      console.log("Transaction hash:", hash);

      // Wait for transaction confirmation
      // In production, you'd use wagmi's waitForTransaction or similar

      setSuccess(true);
      setCanMint(false);
    } catch (err: any) {
      console.error("Error minting badge:", err);
      setError(err.message || "Failed to mint badge");
    } finally {
      setMinting(false);
    }
  };

  if (!address) {
    return null;
  }

  if (!APP_CONFIG.wrappedBadgeContract) {
    return (
      <div className="text-center p-4 bg-yellow-900/30 border border-yellow-500/50 rounded-lg">
        <div className="text-yellow-400">
          ⚠️ Badge contract not deployed yet
        </div>
        <div className="text-sm text-zinc-400 mt-1">Coming soon!</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-2 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
        <div className="text-4xl">🎉</div>
        <div className="text-green-400 font-semibold">
          Badge Minted Successfully!
        </div>
        <div className="text-sm text-zinc-400">
          Check your wallet to view your NFT
        </div>
      </div>
    );
  }

  if (canMint === false) {
    return (
      <div className="text-center p-4 bg-zinc-900/50 border border-zinc-700 rounded-lg">
        <div className="text-zinc-400">
          You've already minted your 2025 badge
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleMint}
        disabled={minting || canMint !== true}
        className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
      >
        {minting ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Minting...
          </span>
        ) : (
          "Mint Badge NFT"
        )}
      </button>

      {error && <div className="text-sm text-red-400">{error}</div>}

      <div className="text-xs text-zinc-500">
        {APP_CONFIG.features.nftMinting && APP_CONFIG.paymasterUrl
          ? "✨ Gasless minting enabled"
          : "⛽ Gas fee required"}
      </div>
    </div>
  );
}
