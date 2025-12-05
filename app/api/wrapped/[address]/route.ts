import { NextRequest, NextResponse } from "next/server";
import { polymarketClient } from "@/lib/polymarket-client";
import { analyticsEngine } from "@/lib/analytics-engine";
import type { WrappedData } from "@/types/trading";

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address;

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    // Fetch trading data from Polymarket
    const { trades, positions } = await polymarketClient.fetchUserSummary(
      address
    );

    if (trades.length === 0) {
      return NextResponse.json(
        { error: "No trading data found" },
        { status: 404 }
      );
    }

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
