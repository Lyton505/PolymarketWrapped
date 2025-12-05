import { APP_CONFIG } from "@/config/app";
import type { Trade, Market, Position } from "@/types/trading";

export class PolymarketClient {
  private baseUrl: string;
  private gammaUrl: string;

  constructor() {
    this.baseUrl = APP_CONFIG.polymarketApiUrl;
    this.gammaUrl = APP_CONFIG.gammaApiUrl;
  }

  /**
   * Fetch all trades for a given address
   */
  async fetchTrades(address: string, limit = 1000): Promise<Trade[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/trades?maker=${address}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch trades: ${response.statusText}`);
      }

      const data = await response.json();

      return this.transformTrades(data);
    } catch (error) {
      console.error("Error fetching trades:", error);
      return [];
    }
  }

  /**
   * Fetch market details
   */
  async fetchMarket(marketId: string): Promise<Market | null> {
    try {
      const response = await fetch(`${this.gammaUrl}/markets/${marketId}`);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();

      return {
        id: data.id || marketId,
        question: data.question || "Unknown Market",
        category: data.category || "Other",
        outcomes: data.outcomes || ["Yes", "No"],
        volume: parseFloat(data.volume || "0"),
        liquidity: parseFloat(data.liquidity || "0"),
        image: data.image,
      };
    } catch (error) {
      console.error("Error fetching market:", error);
      return null;
    }
  }

  /**
   * Fetch all positions for an address
   */
  async fetchPositions(address: string): Promise<Position[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/positions?user=${address}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return this.transformPositions(data);
    } catch (error) {
      console.error("Error fetching positions:", error);
      return [];
    }
  }

  /**
   * Transform raw trade data from API
   */
  private transformTrades(rawTrades: any[]): Trade[] {
    return rawTrades.map((trade) => ({
      id: trade.id || `${trade.market}-${trade.timestamp}`,
      market: trade.market || trade.asset_id,
      marketTitle: trade.market_title || "Unknown Market",
      side: trade.side?.toLowerCase() as "buy" | "sell",
      outcome: trade.outcome || "Yes",
      price: parseFloat(trade.price || "0"),
      size: parseFloat(trade.size || "0"),
      timestamp: trade.timestamp
        ? new Date(trade.timestamp).getTime()
        : Date.now(),
      pnl: trade.pnl ? parseFloat(trade.pnl) : undefined,
      category: trade.category,
      marketImage: trade.market_image,
    }));
  }

  /**
   * Transform raw position data from API
   */
  private transformPositions(rawPositions: any[]): Position[] {
    return rawPositions.map((position) => ({
      marketId: position.market || position.asset_id,
      marketTitle: position.market_title || "Unknown Market",
      outcome: position.outcome || "Yes",
      size: parseFloat(position.size || "0"),
      averagePrice: parseFloat(position.average_price || "0"),
      currentPrice: parseFloat(position.current_price || "0"),
      pnl: parseFloat(position.pnl || "0"),
      category: position.category,
    }));
  }

  /**
   * Fetch user's trading summary
   */
  async fetchUserSummary(address: string) {
    const [trades, positions] = await Promise.all([
      this.fetchTrades(address),
      this.fetchPositions(address),
    ]);

    return {
      trades,
      positions,
      totalTrades: trades.length,
      totalPositions: positions.length,
    };
  }
}

export const polymarketClient = new PolymarketClient();
