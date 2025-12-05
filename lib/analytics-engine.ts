import type {
  Trade,
  TradingStats,
  TradingPersona,
  Position,
} from "@/types/trading";

export class AnalyticsEngine {
  /**
   * Calculate comprehensive trading statistics
   */
  calculateStats(trades: Trade[], positions: Position[]): TradingStats {
    if (trades.length === 0) {
      return this.getEmptyStats();
    }

    const sortedTrades = [...trades].sort((a, b) => a.timestamp - b.timestamp);
    const firstTrade = sortedTrades[0];
    const lastTrade = sortedTrades[sortedTrades.length - 1];

    // Calculate PnL for each trade
    const tradesWithPnL = this.calculateTradePnL(sortedTrades);

    // Basic stats
    const totalVolume = trades.reduce((sum, t) => sum + t.price * t.size, 0);
    // Total P&L is realized - calculated from closed trades (sell transactions)
    const totalPnL = tradesWithPnL.reduce((sum, t) => sum + (t.pnl || 0), 0);

    // Win/Loss analysis
    const { wins, losses, winRate } = this.calculateWinRate(tradesWithPnL);

    // Best and worst trades
    const { bestTrade, worstTrade } = this.findBestWorstTrades(tradesWithPnL);

    // Category analysis
    const favoriteCategories = this.analyzeCategorieies(trades);

    // Monthly activity
    const monthlyActivity = this.calculateMonthlyActivity(trades);

    // Trading persona
    const tradingPersona = this.determineTradingPersona({
      totalTrades: trades.length,
      totalVolume,
      winRate,
      averageTradeSize: totalVolume / trades.length,
      totalPnL,
    });

    // Unique markets
    const uniqueMarkets = new Set(trades.map((t) => t.market)).size;

    // Most traded market
    const mostTradedMarket = this.findMostTradedMarket(trades);

    // Streaks
    const { longestWinStreak, longestLossStreak } =
      this.calculateStreaks(tradesWithPnL);

    return {
      totalTrades: trades.length,
      totalVolume,
      totalPnL,
      winRate,
      bestTrade,
      worstTrade,
      favoriteCategories,
      monthlyActivity,
      tradingPersona,
      uniqueMarkets,
      averageTradeSize: totalVolume / trades.length,
      longestWinStreak,
      longestLossStreak,
      totalWins: wins,
      totalLosses: losses,
      firstTradeDate: firstTrade.timestamp,
      lastTradeDate: lastTrade.timestamp,
      mostTradedMarket,
    };
  }

  /**
   * Calculate PnL for each trade based on position changes
   */
  private calculateTradePnL(trades: Trade[]): Trade[] {
    const positions = new Map<string, { size: number; avgPrice: number }>();

    return trades.map((trade) => {
      const key = `${trade.market}-${trade.outcome}`;
      const position = positions.get(key) || { size: 0, avgPrice: 0 };

      let pnl = 0;

      if (trade.side === "buy") {
        // Buying increases position
        const newSize = position.size + trade.size;
        position.avgPrice =
          (position.avgPrice * position.size + trade.price * trade.size) /
          newSize;
        position.size = newSize;
      } else {
        // Selling decreases position and realizes PnL
        const soldSize = Math.min(trade.size, position.size);
        pnl = (trade.price - position.avgPrice) * soldSize;
        position.size = Math.max(0, position.size - trade.size);
      }

      positions.set(key, position);

      return { ...trade, pnl };
    });
  }

  /**
   * Calculate win rate from trades
   */
  private calculateWinRate(trades: Trade[]): {
    wins: number;
    losses: number;
    winRate: number;
  } {
    const tradesWithPnL = trades.filter(
      (t) => t.pnl !== undefined && t.pnl !== 0
    );
    const wins = tradesWithPnL.filter((t) => t.pnl! > 0).length;
    const losses = tradesWithPnL.filter((t) => t.pnl! < 0).length;
    const winRate = tradesWithPnL.length > 0 ? wins / tradesWithPnL.length : 0;

    return { wins, losses, winRate };
  }

  /**
   * Find best and worst trades
   */
  private findBestWorstTrades(trades: Trade[]): {
    bestTrade: Trade | null;
    worstTrade: Trade | null;
  } {
    const tradesWithPnL = trades.filter((t) => t.pnl !== undefined);

    if (tradesWithPnL.length === 0) {
      return { bestTrade: null, worstTrade: null };
    }

    const bestTrade = tradesWithPnL.reduce((best, current) =>
      current.pnl! > best.pnl! ? current : best
    );

    const worstTrade = tradesWithPnL.reduce((worst, current) =>
      current.pnl! < worst.pnl! ? current : worst
    );

    return { bestTrade, worstTrade };
  }

  /**
   * Analyze trading categories
   */
  private analyzeCategorieies(
    trades: Trade[]
  ): { category: string; count: number; volume: number }[] {
    const categoryMap = new Map<string, { count: number; volume: number }>();

    trades.forEach((trade) => {
      const category = trade.category || "Other";
      const existing = categoryMap.get(category) || { count: 0, volume: 0 };
      categoryMap.set(category, {
        count: existing.count + 1,
        volume: existing.volume + trade.price * trade.size,
      });
    });

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);
  }

  /**
   * Calculate monthly activity
   */
  private calculateMonthlyActivity(
    trades: Trade[]
  ): { month: string; trades: number; volume: number; pnl: number }[] {
    const monthlyMap = new Map<
      string,
      { trades: number; volume: number; pnl: number }
    >();

    trades.forEach((trade) => {
      const date = new Date(trade.timestamp);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const existing = monthlyMap.get(monthKey) || {
        trades: 0,
        volume: 0,
        pnl: 0,
      };

      monthlyMap.set(monthKey, {
        trades: existing.trades + 1,
        volume: existing.volume + trade.price * trade.size,
        pnl: existing.pnl + (trade.pnl || 0),
      });
    });

    return Array.from(monthlyMap.entries())
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  /**
   * Determine trading persona based on behavior
   */
  private determineTradingPersona(stats: {
    totalTrades: number;
    totalVolume: number;
    winRate: number;
    averageTradeSize: number;
    totalPnL: number;
  }): TradingPersona {
    const { totalTrades, totalVolume, winRate, averageTradeSize, totalPnL } =
      stats;

    // Whale - high volume, large trades
    if (totalVolume > 100000 && averageTradeSize > 2000) {
      return {
        type: "Whale",
        description: "You move markets with your massive trades",
        traits: ["High Volume", "Large Positions", "Market Mover"],
        emoji: "🐋",
      };
    }

    // Day Trader - lots of trades
    if (totalTrades > 200) {
      return {
        type: "Day Trader",
        description: "You live for the thrill of constant trading",
        traits: ["High Frequency", "Active", "Quick Moves"],
        emoji: "⚡",
      };
    }

    // Strategic Investor - high win rate, moderate activity
    if (winRate > 0.65 && totalTrades > 20) {
      return {
        type: "Strategic Investor",
        description: "You pick your spots carefully and win consistently",
        traits: ["High Win Rate", "Calculated", "Patient"],
        emoji: "🎯",
      };
    }

    // Degen Trader - high risk, high reward
    if (averageTradeSize > 3000 && totalTrades > 50) {
      return {
        type: "Degen Trader",
        description: "You bet big and live on the edge",
        traits: ["High Risk", "Bold", "Aggressive"],
        emoji: "🎲",
      };
    }

    // Risk Taker - negative PnL but still trading
    if (totalPnL < -1000 && totalTrades > 30) {
      return {
        type: "Risk Taker",
        description: "You take chances others wouldn't dare",
        traits: ["Fearless", "Persistent", "Ambitious"],
        emoji: "🔥",
      };
    }

    // HODL King - few trades, holding positions
    if (totalTrades < 20 && totalVolume > 10000) {
      return {
        type: "HODL King",
        description: "You believe in your positions and hold strong",
        traits: ["Patient", "Conviction", "Long-term"],
        emoji: "💎",
      };
    }

    // Market Maven - diverse trading
    return {
      type: "Market Maven",
      description: "You know the markets inside and out",
      traits: ["Knowledgeable", "Diverse", "Experienced"],
      emoji: "🧠",
    };
  }

  /**
   * Find most traded market
   */
  private findMostTradedMarket(
    trades: Trade[]
  ): { marketTitle: string; trades: number } | null {
    if (trades.length === 0) return null;

    const marketCounts = new Map<string, number>();

    trades.forEach((trade) => {
      const count = marketCounts.get(trade.marketTitle) || 0;
      marketCounts.set(trade.marketTitle, count + 1);
    });

    let mostTraded = { marketTitle: "", trades: 0 };
    marketCounts.forEach((count, market) => {
      if (count > mostTraded.trades) {
        mostTraded = { marketTitle: market, trades: count };
      }
    });

    return mostTraded.trades > 0 ? mostTraded : null;
  }

  /**
   * Calculate win/loss streaks
   */
  private calculateStreaks(trades: Trade[]): {
    longestWinStreak: number;
    longestLossStreak: number;
  } {
    const tradesWithPnL = trades.filter(
      (t) => t.pnl !== undefined && t.pnl !== 0
    );

    let longestWinStreak = 0;
    let longestLossStreak = 0;
    let currentWinStreak = 0;
    let currentLossStreak = 0;

    tradesWithPnL.forEach((trade) => {
      if (trade.pnl! > 0) {
        currentWinStreak++;
        currentLossStreak = 0;
        longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
      } else {
        currentLossStreak++;
        currentWinStreak = 0;
        longestLossStreak = Math.max(longestLossStreak, currentLossStreak);
      }
    });

    return { longestWinStreak, longestLossStreak };
  }

  /**
   * Get empty stats object
   */
  private getEmptyStats(): TradingStats {
    return {
      totalTrades: 0,
      totalVolume: 0,
      totalPnL: 0,
      winRate: 0,
      bestTrade: null,
      worstTrade: null,
      favoriteCategories: [],
      monthlyActivity: [],
      tradingPersona: {
        type: "Cautious Bettor",
        description: "Just getting started",
        traits: ["New", "Learning", "Careful"],
        emoji: "🌱",
      },
      uniqueMarkets: 0,
      averageTradeSize: 0,
      longestWinStreak: 0,
      longestLossStreak: 0,
      totalWins: 0,
      totalLosses: 0,
      firstTradeDate: Date.now(),
      lastTradeDate: Date.now(),
      mostTradedMarket: null,
    };
  }
}

export const analyticsEngine = new AnalyticsEngine();
