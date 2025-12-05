import { APP_CONFIG } from "@/config/app";
import type { Trade, Market, Position } from "@/types/trading";
import { deriveSafe } from "@polymarket/builder-relayer-client/dist/builder/derive";
import { getContractConfig } from "@polymarket/builder-relayer-client/dist/config";

const POLYGON_CHAIN_ID = 137;

export class PolymarketClient {
  private baseUrl: string;
  private dataApiUrl: string;
  private gammaUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = APP_CONFIG.polymarketApiUrl;
    this.dataApiUrl = APP_CONFIG.polymarketDataApiUrl;
    this.gammaUrl = APP_CONFIG.gammaApiUrl;
    this.apiKey = APP_CONFIG.polymarketApiKey;
  }

  /**
   * Derive Polymarket Safe address from EOA address
   * Uses the same method as Polymarket's builder-relayer-client
   */
  private deriveSafeAddress(eoaAddress: string): string {
    try {
      const config = getContractConfig(POLYGON_CHAIN_ID);
      const safeAddress = deriveSafe(
        eoaAddress,
        config.SafeContracts.SafeFactory
      );
      console.log(`Derived Safe address for EOA ${eoaAddress}: ${safeAddress}`);
      return safeAddress;
    } catch (error) {
      console.error("Error deriving Safe address:", error);
      // If derivation fails, return the original address
      return eoaAddress;
    }
  }

  /**
   * Get headers for API requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  /**
   * Fetch all trades for a given address
   */
  async fetchTrades(address: string, limit = 1000): Promise<Trade[]> {
    try {
      // Check if address looks like an EOA (could be derived to Safe)
      // If it already has activity, use it as-is. Otherwise try deriving Safe address.
      let queryAddress = address;

      // First check if the address has activity
      const testResponse = await fetch(
        `${this.dataApiUrl}/activity?limit=1&user=${address.toLowerCase()}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (testResponse.ok) {
        const testData = await testResponse.json();
        // If no activity found, try deriving Safe address from EOA
        if (!Array.isArray(testData) || testData.length === 0) {
          console.log(
            `No activity found for ${address}, deriving Safe address...`
          );
          queryAddress = this.deriveSafeAddress(address);
        } else {
          console.log(`Address ${address} has activity, using as-is`);
        }
      }

      console.log(`Fetching trades for address: ${queryAddress}`);

      // Use the data-api endpoint which doesn't require authentication
      const response = await fetch(
        `${
          this.dataApiUrl
        }/activity?limit=${limit}&sortBy=TIMESTAMP&sortDirection=DESC&user=${queryAddress.toLowerCase()}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.warn(
          `Polymarket Data API returned ${response.status}: ${response.statusText} for address: ${queryAddress}`
        );
        return [];
      }

      const data = await response.json();

      // Filter to only include TRADE type activities
      const trades = Array.isArray(data)
        ? data.filter((activity: any) => activity.type === "TRADE")
        : [];

      console.log(
        `Successfully fetched ${trades.length} trades for address: ${queryAddress}`
      );

      return this.transformTrades(trades);
    } catch (error) {
      console.error(`Error fetching trades for address ${address}:`, error);
      console.warn(
        "Falling back to empty trades array. Check API configuration."
      );
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
      // Try to derive Safe address if the provided address is an EOA
      let queryAddress = address;

      // Check if address has activity first
      const testResponse = await fetch(
        `${this.dataApiUrl}/activity?limit=1&user=${address.toLowerCase()}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (testResponse.ok) {
        const testData = await testResponse.json();
        // If no activity found, try deriving Safe address from EOA
        if (!Array.isArray(testData) || testData.length === 0) {
          queryAddress = this.deriveSafeAddress(address);
        }
      }

      console.log(`Fetching positions for address: ${queryAddress}`);

      const response = await fetch(
        `${this.baseUrl}/positions?user=${queryAddress.toLowerCase()}`,
        {
          headers: this.getHeaders(),
        }
      );

      if (!response.ok) {
        console.warn(
          `Polymarket API returned ${response.status}: ${response.statusText} for positions of address: ${queryAddress}`
        );
        return [];
      }

      const data = await response.json();
      console.log(
        `Successfully fetched ${
          data.length || 0
        } positions for address: ${queryAddress}`
      );
      return this.transformPositions(data);
    } catch (error) {
      console.error(`Error fetching positions for address ${address}:`, error);
      return [];
    }
  }

  /**
   * Transform raw trade data from API
   */
  private transformTrades(rawTrades: any[]): Trade[] {
    return rawTrades.map((trade) => {
      // Handle both old CLOB API format and new data-api format
      const timestamp = trade.timestamp
        ? typeof trade.timestamp === "number"
          ? trade.timestamp * 1000
          : new Date(trade.timestamp).getTime()
        : Date.now();

      return {
        id:
          trade.transactionHash ||
          trade.id ||
          `${trade.asset || trade.conditionId}-${trade.timestamp}`,
        market:
          trade.conditionId ||
          trade.market ||
          trade.asset_id ||
          trade.asset ||
          "",
        marketTitle: trade.title || trade.market_title || "Unknown Market",
        side: trade.side?.toLowerCase() as "buy" | "sell",
        outcome: trade.outcome || "Yes",
        price: parseFloat(trade.price || "0"),
        size: parseFloat(trade.size || "0"),
        timestamp,
        pnl: trade.pnl ? parseFloat(trade.pnl) : undefined,
        category: trade.category,
        marketImage: trade.icon || trade.market_image,
      };
    });
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
