export interface Trade {
  id: string;
  market: string;
  marketTitle: string;
  side: "buy" | "sell";
  outcome: string;
  price: number;
  size: number;
  timestamp: number;
  pnl?: number;
  category?: string;
  marketImage?: string;
}

export interface Market {
  id: string;
  question: string;
  category: string;
  outcomes: string[];
  volume: number;
  liquidity: number;
  image?: string;
}

export interface Position {
  marketId: string;
  marketTitle: string;
  outcome: string;
  size: number;
  averagePrice: number;
  currentPrice: number;
  pnl: number;
  category?: string;
}

export interface TradingStats {
  totalTrades: number;
  totalVolume: number;
  totalPnL: number;
  winRate: number;
  bestTrade: Trade | null;
  worstTrade: Trade | null;
  favoriteCategories: { category: string; count: number; volume: number }[];
  monthlyActivity: {
    month: string;
    trades: number;
    volume: number;
    pnl: number;
  }[];
  tradingPersona: TradingPersona;
  uniqueMarkets: number;
  averageTradeSize: number;
  longestWinStreak: number;
  longestLossStreak: number;
  totalWins: number;
  totalLosses: number;
  firstTradeDate: number;
  lastTradeDate: number;
  mostTradedMarket: { marketTitle: string; trades: number } | null;
}

export interface TradingPersona {
  type:
    | "Degen Trader"
    | "Strategic Investor"
    | "Market Maven"
    | "Cautious Bettor"
    | "Whale"
    | "Day Trader"
    | "HODL King"
    | "Risk Taker";
  description: string;
  traits: string[];
  emoji: string;
}

export interface WrappedData {
  address: string;
  year: number;
  stats: TradingStats;
  trades: Trade[];
  positions: Position[];
  generatedAt: number;
}

export interface PinCodeData {
  pincode: string;
  address: string;
  expiresAt: number;
}
