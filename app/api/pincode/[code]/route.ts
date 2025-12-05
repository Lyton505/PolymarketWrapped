import { NextRequest, NextResponse } from "next/server";

// In-memory storage for pin codes (in production, use a database)
const pinCodes = new Map<string, { address: string; expiresAt: number }>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code: rawCode } = await params;
    const code = rawCode.toUpperCase();

    const pinData = pinCodes.get(code);

    if (!pinData) {
      return NextResponse.json(
        { error: "Invalid or expired pin code" },
        { status: 404 }
      );
    }

    if (pinData.expiresAt < Date.now()) {
      pinCodes.delete(code);
      return NextResponse.json(
        { error: "Pin code has expired" },
        { status: 404 }
      );
    }

    // Redirect to the wrapped data API
    const wrappedResponse = await fetch(
      `${request.nextUrl.origin}/api/wrapped/${pinData.address}`
    );

    if (!wrappedResponse.ok) {
      return NextResponse.json(
        { error: "Failed to load wrapped data" },
        { status: 500 }
      );
    }

    const wrappedData = await wrappedResponse.json();

    return NextResponse.json(wrappedData);
  } catch (error) {
    console.error("Error processing pin code:", error);
    return NextResponse.json(
      { error: "Failed to process pin code" },
      { status: 500 }
    );
  }
}

// Endpoint to generate a pin code (can be called by admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    // Generate a random 6-character pin code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Set expiration to 30 days from now
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    pinCodes.set(code, { address, expiresAt });

    return NextResponse.json({
      code,
      address,
      expiresAt,
    });
  } catch (error) {
    console.error("Error generating pin code:", error);
    return NextResponse.json(
      { error: "Failed to generate pin code" },
      { status: 500 }
    );
  }
}
