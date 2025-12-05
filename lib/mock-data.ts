import type { Trade, Position, TradingStats, WrappedData } from '@/types/trading';

/**
 * Mock trading data for testing and development
 */

export const mockTrades: Trade[] = [
  {
    id: '1',
    market: 'market-1',
    marketTitle: 'Will Bitcoin hit $100k in 2025?',
    side: 'buy',
    outcome: 'Yes',
    price: 0.65,
    size: 500,
    timestamp: new Date('2025-01-15').getTime(),
    pnl: 125,
    category: 'Crypto',
  },
  {
    id: '2',
    market: 'market-1',
    marketTitle: 'Will Bitcoin hit $100k in 2025?',
    side: 'sell',
    outcome: 'Yes',
    price: 0.90,
    size: 500,
    timestamp: new Date('2025-02-20').getTime(),
    pnl: 125,
    category: 'Crypto',
  },
  {
    id: '3',
    market: 'market-2',
    marketTitle: 'Will Trump win the 2024 election?',
    side: 'buy',
    outcome: 'Yes',
    price: 0.55,
    size: 1000,
    timestamp: new Date('2025-01-20').getTime(),
    category: 'Politics',
  },
  {
    id: '4',
    market: 'market-3',
    marketTitle: 'Will Ethereum ETF be approved?',
    side: 'buy',
    outcome: 'Yes',
    price: 0.70,
    size: 750,
    timestamp: new Date('2025-02-01').getTime(),
    pnl: -50,
    category: 'Crypto',
  },
  {
    id: '5',
    market: 'market-4',
    marketTitle: 'Lakers to win NBA Championship?',
    side: 'buy',
    outcome: 'No',
    price: 0.45,
    size: 200,
    timestamp: new Date('2025-03-10').getTime(),
    pnl: 75,
    category: 'Sports',
  },
];

export const mockPositions: Position[] = [
  {
    marketId: 'market-2',
    marketTitle: 'Will Trump win the 2024 election?',
    outcome: 'Yes',
    size: 1000,
    averagePrice: 0.55,
    currentPrice: 0.60,
    pnl: 50,
    category: 'Politics',
  },
];

export const mockStats: TradingStats = {
  totalTrades: 5,
  totalVolume: 2950,
  totalPnL: 325,
  winRate: 0.75,
  bestTrade: mockTrades[1],
  worstTrade: mockTrades[3],
  favoriteCategories: [
    { category: 'Crypto', count: 3, volume: 1750 },
    { category: 'Politics', count: 1, volume: 1000 },
    { category: 'Sports', count: 1, volume: 200 },
  ],
  monthlyActivity: [
    { month: '2025-01', trades: 2, volume: 1500, pnl: 125 },
    { month: '2025-02', trades: 2, volume: 1250, pnl: 75 },
    { month: '2025-03', trades: 1, volume: 200, pnl: 75 },
  ],
  tradingPersona: {
    type: 'Strategic Investor',
    description: 'You pick your spots carefully and win consistently',
    traits: ['High Win Rate', 'Calculated', 'Patient'],
    emoji: '🎯',
  },
  uniqueMarkets: 4,
  averageTradeSize: 590,
  longestWinStreak: 3,
  longestLossStreak: 1,
  totalWins: 3,
  totalLosses: 1,
  firstTradeDate: new Date('2025-01-15').getTime(),
  lastTradeDate: new Date('2025-03-10').getTime(),
  mostTradedMarket: {
    marketTitle: 'Will Bitcoin hit $100k in 2025?',
    trades: 2,
  },
};

export const mockWrappedData: WrappedData = {
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  year: 2025,
  stats: mockStats,
  trades: mockTrades,
  positions: mockPositions,
  generatedAt: Date.now(),
};

/**
 * Additional mock data for different trader personas
 */

export const whaleTraderData: Partial<TradingStats> = {
  totalTrades: 75,
  totalVolume: 250000,
  totalPnL: 12500,
  winRate: 0.58,
  averageTradeSize: 3333,
  tradingPersona: {
    type: 'Whale',
    description: 'You move markets with your massive trades',
    traits: ['High Volume', 'Large Positions', 'Market Mover'],
    emoji: '🐋',
  },
};

export const dayTraderData: Partial<TradingStats> = {
  totalTrades: 350,
  totalVolume: 75000,
  totalPnL: 2500,
  winRate: 0.52,
  averageTradeSize: 214,
  longestWinStreak: 8,
  tradingPersona: {
    type: 'Day Trader',
    description: 'You live for the thrill of constant trading',
    traits: ['High Frequency', 'Active', 'Quick Moves'],
    emoji: '⚡',
  },
};

export const degenTraderData: Partial<TradingStats> = {
  totalTrades: 120,
  totalVolume: 180000,
  totalPnL: -5000,
  winRate: 0.42,
  averageTradeSize: 1500,
  tradingPersona: {
    type: 'Degen Trader',
    description: 'You bet big and live on the edge',
    traits: ['High Risk', 'Bold', 'Aggressive'],
    emoji: '🎲',
  },
};
