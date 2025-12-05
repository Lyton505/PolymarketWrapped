import { NextRequest, NextResponse } from "next/server";
import { polymarketClient } from "@/lib/polymarket-client";
import { analyticsEngine } from "@/lib/analytics-engine";
import type { WrappedData } from "@/types/trading";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    console.log(`API Request: Fetching wrapped data for address: ${address}`);

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      console.warn(`Invalid address format: ${address}`);
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    // Fetch trading data from Polymarket
    const { trades, positions } = await polymarketClient.fetchUserSummary(
      address
    );

    if (trades.length === 0) {
      console.log(`No trading data found for address: ${address}`);
      return NextResponse.json(
        { error: "No trading data found" },
        { status: 404 }
      );
    }

    console.log(
      `Successfully generated wrapped data for address: ${address} (${trades.length} trades, ${positions.length} positions)`
    );

    // Calculate analytics
    const stats = analyticsEngine.calculateStats(trades, positions);

    // Build wrapped data
    const wrappedData: WrappedData = {
      address,
      year: 2025,
      stats,
      trades: trades.slice(0, 100), // Limit to recent 100 trades
      positions: positions.slice(0, 20), // Limit to top 20 positions
      generatedAt: Date.now(),
    };

    return NextResponse.json(wrappedData);
  } catch (error) {
    console.error("Error generating wrapped data:", error);
    return NextResponse.json(
      { error: "Failed to generate wrapped data" },
      { status: 500 }
    );
  }
}
