import { base } from "viem/chains";
import { createPublicClient, createWalletClient, http } from "viem";
import { APP_CONFIG } from "@/config/app";

// ABI for the Wrapped Badge contract
export const WRAPPED_BADGE_ABI = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "uri", type: "string" },
    ],
    name: "mintWrappedBadge",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "canMint",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

/**
 * Check if an address can mint a badge
 */
export async function canMintBadge(address: string): Promise<boolean> {
  if (!APP_CONFIG.wrappedBadgeContract) {
    console.warn("Badge contract address not configured");
    return false;
  }

  try {
    const canMint = await publicClient.readContract({
      address: APP_CONFIG.wrappedBadgeContract as `0x${string}`,
      abi: WRAPPED_BADGE_ABI,
      functionName: "canMint",
      args: [address as `0x${string}`],
    });

    return canMint;
  } catch (error) {
    console.error("Error checking mint eligibility:", error);
    throw error; // Re-throw to let the component handle the error
  }
}

/**
 * Get total number of minted badges
 */
export async function getTotalSupply(): Promise<number> {
  if (!APP_CONFIG.wrappedBadgeContract) {
    console.warn("Badge contract address not configured");
    return 0;
  }

  try {
    const supply = await publicClient.readContract({
      address: APP_CONFIG.wrappedBadgeContract as `0x${string}`,
      abi: WRAPPED_BADGE_ABI,
      functionName: "totalSupply",
    });

    return Number(supply);
  } catch (error) {
    console.error("Error getting total supply:", error);
    return 0;
  }
}

/**
 * Prepare metadata for the badge
 */
export function prepareBadgeMetadata(wrappedData: any) {
  return {
    name: `Polymarket Wrapped ${wrappedData.year}`,
    description: `${wrappedData.address}'s trading summary for ${wrappedData.year}`,
    image: "", // This would be the generated image URL
    attributes: [
      {
        trait_type: "Total Trades",
        value: wrappedData.stats.totalTrades,
      },
      {
        trait_type: "Total Volume",
        value: wrappedData.stats.totalVolume,
      },
      {
        trait_type: "Net P&L",
        value: wrappedData.stats.totalPnL,
      },
      {
        trait_type: "Win Rate",
        value: `${(wrappedData.stats.winRate * 100).toFixed(1)}%`,
      },
      {
        trait_type: "Trading Persona",
        value: wrappedData.stats.tradingPersona.type,
      },
      {
        trait_type: "Year",
        value: wrappedData.year,
      },
    ],
  };
}
