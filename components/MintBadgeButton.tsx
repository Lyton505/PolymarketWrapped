"use client";

import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { canMintBadge, WRAPPED_BADGE_ABI } from "@/lib/nft-client";
import { APP_CONFIG } from "@/config/app";

export function MintBadgeButton({ wrappedData }: { wrappedData: any }) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [minting, setMinting] = useState(false);
  const [canMint, setCanMint] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Check if user can mint on mount
  useState(() => {
    if (address) {
      checkMintEligibility();
    }
  });

  const checkMintEligibility = async () => {
    if (!address) return;
    
    try {
      const eligible = await canMintBadge(address);
      setCanMint(eligible);
    } catch (err) {
      console.error('Error checking mint eligibility:', err);
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
      // Prepare metadata URI (in production, this would be uploaded to IPFS/Arweave)
      const metadataUri = `ipfs://YOUR_IPFS_HASH/${address}`;
      
      // Call mintWrappedBadge function
      const hash = await walletClient.writeContract({
        address: APP_CONFIG.wrappedBadgeContract as `0x${string}`,
        abi: WRAPPED_BADGE_ABI,
        functionName: 'mintWrappedBadge',
        args: [address as `0x${string}`, metadataUri],
      });

      console.log('Transaction hash:', hash);
      
      // Wait for transaction confirmation
      // In production, you'd use wagmi's waitForTransaction or similar
      
      setSuccess(true);
      setCanMint(false);
    } catch (err: any) {
      console.error('Error minting badge:', err);
      setError(err.message || 'Failed to mint badge');
    } finally {
      setMinting(false);
    }
  };

  if (!address) {
    return null;
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-2 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
        <div className="text-4xl">🎉</div>
        <div className="text-green-400 font-semibold">Badge Minted Successfully!</div>
        <div className="text-sm text-zinc-400">Check your wallet to view your NFT</div>
      </div>
    );
  }

  if (canMint === false) {
    return (
      <div className="text-center p-4 bg-zinc-900/50 border border-zinc-700 rounded-lg">
        <div className="text-zinc-400">You've already minted your 2025 badge</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleMint}
        disabled={minting || canMint === false}
        className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white rounded-lg font-medium transition-all disabled:cursor-not-allowed"
      >
        {minting ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Minting...
          </span>
        ) : (
          'Mint Badge NFT'
        )}
      </button>
      
      {error && (
        <div className="text-sm text-red-400">{error}</div>
      )}
      
      <div className="text-xs text-zinc-500">
        {APP_CONFIG.features.nftMinting && APP_CONFIG.paymasterUrl 
          ? "✨ Gasless minting enabled"
          : "⛽ Gas fee required"
        }
      </div>
    </div>
  );
}
