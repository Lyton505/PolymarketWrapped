export const APP_CONFIG = {
  name: "Polymarket Wrapped",
  description: "Your personalized year in Polymarket trading",
  year: 2025,
  polymarketApiUrl: "https://clob.polymarket.com",
  gammaApiUrl: "https://gamma-api.polymarket.com",

  // Badge contract on Base
  wrappedBadgeContract: process.env.NEXT_PUBLIC_BADGE_CONTRACT_ADDRESS || "",

  // Paymaster
  paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL || "",

  // WalletConnect
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

  // Trading thresholds for personas
  personas: {
    whale: { minVolume: 100000, minTrades: 50 },
    dayTrader: { minTrades: 200, avgHoldTime: 86400 }, // 1 day
    strategic: { winRate: 0.65, minTrades: 20 },
    degen: { avgTradeSize: 5000, minTrades: 100 },
  },

  // Feature flags
  features: {
    nftMinting: true,
    pinCodeSharing: true,
    imageExport: true,
  },
} as const;

export const POLYMARKET_CATEGORIES = [
  "Politics",
  "Sports",
  "Crypto",
  "Pop Culture",
  "Science",
  "Business",
  "Technology",
  "Climate",
  "Finance",
  "Other",
] as const;
