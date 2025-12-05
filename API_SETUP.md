# Polymarket API Setup Guide

## Current Status

As of December 2025, Polymarket's CLOB API requires authentication for accessing user trading data. This means you need an API key to fetch real trading history.

## Getting Started

### Option 1: Get a Polymarket API Key (Recommended for Production)

1. **Contact Polymarket**:
   - Visit [Polymarket Discord](https://discord.gg/polymarket) #dev-support channel
   - Email: <dev@polymarket.com>
   - Request API access for read-only trading data

2. **Add API Key to Environment**:

   ```bash
   # In your .env.local file
   POLYMARKET_API_KEY=your_actual_api_key_here
   ```

3. **Restart Development Server**:

   ```bash
   npm run dev
   ```

### Option 2: Use Mock Data (For Development/Testing)

If you want to test the UI without API access:

1. **Modify the API Route** (`app/api/wrapped/[address]/route.ts`):

   ```typescript
   import { mockWrappedData } from "@/lib/mock-data";
   
   export async function GET(
     request: NextRequest,
     { params }: { params: Promise<{ address: string }> }
   ) {
     try {
       const { address } = await params;
       
       // Return mock data for testing
       return NextResponse.json({
         ...mockWrappedData,
         address, // Use the actual address from the request
       });
     } catch (error) {
       return NextResponse.json(
         { error: "Failed to generate wrapped data" },
         { status: 500 }
       );
     }
   }
   ```

2. **Benefits**:
   - Test UI without API access
   - Fast development iteration
   - No rate limits

### Option 3: Alternative Data Sources

Consider using:

1. **The Graph Protocol**: Query Polymarket subgraph for on-chain data
2. **Polymarket SDK**: Use the official SDK which may have different auth requirements
3. **Direct Blockchain Queries**: Query Polygon chain directly for trade events

## Troubleshooting

### "Unauthorized" Error

**Problem**: API returns 401 Unauthorized

**Solutions**:

1. Verify `POLYMARKET_API_KEY` is set in `.env.local`
2. Restart your development server after adding the key
3. Check that the API key is valid and not expired
4. Ensure you're using the correct API endpoint

### "No trading data found"

**Problem**: API returns 404 or empty trades

**Possible Causes**:

1. The address has no trades in 2025
2. The address is invalid
3. API authentication failed silently

**Solutions**:

1. Try a different address known to have trades
2. Check browser console for detailed error messages
3. Verify the address format (0x followed by 40 hex characters)

### Rate Limiting

**Problem**: Too many requests

**Solutions**:

1. Implement caching (already suggested in code)
2. Use a Polymarket API key for higher rate limits
3. Add delays between requests

## API Endpoints

### Current Implementation

```typescript
// Trades endpoint
GET https://clob.polymarket.com/trades?maker={address}&limit={limit}

// Positions endpoint  
GET https://clob.polymarket.com/positions?user={address}

// Markets endpoint
GET https://gamma-api.polymarket.com/markets/{marketId}
```

### Required Headers

```typescript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_API_KEY" // If API key is available
}
```

## Testing the App

### 1. Test with Mock Data

```bash
# Modify API route to return mock data
# See Option 2 above
npm run dev
```

### 2. Test with Real Address (if you have API key)

```bash
# Make sure POLYMARKET_API_KEY is set
# Connect your wallet or use address search
# Enter: 0x675810Be54190ba959864e27aAa9B754f0893804 (or any valid address)
```

### 3. Test Error Handling

- Try with an invalid address
- Try with an address that has no trades
- Disconnect from wallet and reconnect

## Resources

- [Polymarket Documentation](https://docs.polymarket.com/)
- [Polymarket Discord](https://discord.gg/polymarket)
- [CLOB Client GitHub](https://github.com/Polymarket/clob-client)
- [Polymarket SDK](https://www.npmjs.com/package/@polymarket/sdk)

## Next Steps

1. **Short Term**: Use mock data for UI development
2. **Medium Term**: Get API key from Polymarket
3. **Long Term**: Consider implementing The Graph integration for decentralized data access

---

**Need Help?**

- Check the [main README](./README.md)
- Review [POLYMARKET_API.md](./POLYMARKET_API.md)
- Open an issue in the repository
