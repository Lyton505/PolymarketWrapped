# Polymarket API Integration Guide

This guide explains how the Polymarket Wrapped app integrates with the Polymarket CLOB API.

## Polymarket CLOB API Overview

Polymarket uses a Central Limit Order Book (CLOB) API for trading data. The API provides access to:

- User trades and orders
- Market information
- Position data
- Price feeds

**Base URL**: `https://clob.polymarket.com`

**Documentation**: https://docs.polymarket.com/

## Authentication

The Polymarket CLOB API offers both authenticated and unauthenticated endpoints:

- **Unauthenticated**: Read-only access to public data (used in this app)
- **Authenticated**: Required for placing orders and accessing private data

For Polymarket Wrapped, we only need unauthenticated access to read trading history.

## Key Endpoints Used

### 1. Get User Trades

```
GET /trades?maker={address}&limit={limit}
```

Returns all trades for a specific address.

**Parameters**:
- `maker`: Ethereum address (0x...)
- `limit`: Number of trades to return (default: 100, max: 1000)

**Response**:
```json
[
  {
    "id": "...",
    "market": "...",
    "asset_id": "...",
    "side": "BUY",
    "price": "0.55",
    "size": "100",
    "timestamp": "2025-01-15T12:00:00Z",
    "maker": "0x...",
    "taker": "0x..."
  }
]
```

### 2. Get Market Information

```
GET /markets/{marketId}
```

Returns detailed information about a specific market.

**Response**:
```json
{
  "id": "...",
  "question": "Will...",
  "category": "Politics",
  "outcomes": ["Yes", "No"],
  "volume": "1000000",
  "liquidity": "50000"
}
```

### 3. Get User Positions

```
GET /positions?user={address}
```

Returns all open positions for a user.

**Response**:
```json
[
  {
    "market": "...",
    "asset_id": "...",
    "outcome": "Yes",
    "size": "50",
    "average_price": "0.60",
    "current_price": "0.65"
  }
]
```

## Implementation in Polymarket Wrapped

### PolymarketClient Class

The `lib/polymarket-client.ts` file contains the main client for interacting with the API:

```typescript
export class PolymarketClient {
  async fetchTrades(address: string, limit = 1000): Promise<Trade[]>
  async fetchMarket(marketId: string): Promise<Market | null>
  async fetchPositions(address: string): Promise<Position[]>
  async fetchUserSummary(address: string)
}
```

### Data Flow

1. **User connects wallet** → Get Ethereum address
2. **Fetch trades** → `polymarketClient.fetchTrades(address)`
3. **Fetch positions** → `polymarketClient.fetchPositions(address)`
4. **Calculate analytics** → `analyticsEngine.calculateStats(trades, positions)`
5. **Display wrapped** → Render cards with computed stats

### Rate Limiting

The Polymarket CLOB API has rate limits:

- **Free tier**: 100 requests/minute, 10,000 requests/day
- **With API key**: Higher limits available

To handle rate limits:

```typescript
// Implement exponential backoff
async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.status === 429) {
        // Rate limited, wait and retry
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
        continue;
      }
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
    }
  }
}
```

### Caching Strategy

To reduce API calls and improve performance:

1. **Cache wrapped data** after first generation
2. **Store in browser** using localStorage
3. **Refresh periodically** (e.g., once per day)

```typescript
const CACHE_KEY = `wrapped_${address}_${year}`;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function getCachedWrappedData(address: string) {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  return null;
}
```

## Data Processing

### Trade Analysis

The analytics engine processes raw trade data to calculate:

1. **P&L Calculation**:
   ```typescript
   // Track positions and calculate realized P&L
   if (trade.side === 'sell') {
     pnl = (trade.price - position.avgPrice) * trade.size;
   }
   ```

2. **Win Rate**:
   ```typescript
   winRate = profitableTrades / totalClosedTrades;
   ```

3. **Category Analysis**:
   ```typescript
   // Group trades by market category
   const categoryVolume = trades.reduce((acc, trade) => {
     acc[trade.category] = (acc[trade.category] || 0) + trade.volume;
     return acc;
   }, {});
   ```

### Trading Persona Algorithm

The persona is determined by analyzing:

- Total volume and trade count
- Average trade size
- Win rate
- Risk profile (P&L volatility)
- Trading frequency

```typescript
if (totalVolume > 100000 && avgTradeSize > 2000) {
  return { type: 'Whale', ... };
}
if (totalTrades > 200) {
  return { type: 'Day Trader', ... };
}
// ... more conditions
```

## Testing

### Mock Data

For development, use mock data:

```typescript
const mockTrades: Trade[] = [
  {
    id: '1',
    market: 'test-market',
    marketTitle: 'Test Market',
    side: 'buy',
    outcome: 'Yes',
    price: 0.60,
    size: 100,
    timestamp: Date.now(),
  },
];
```

### Testing with Real Data

1. Use your own Polymarket address
2. Or use a public address with trading history:
   - Example: `0x...` (insert a known active trader)

## Error Handling

Common errors and how to handle them:

### 1. Address Not Found
```typescript
if (trades.length === 0) {
  return { error: 'No trading data found for this address' };
}
```

### 2. API Rate Limit
```typescript
if (response.status === 429) {
  return { error: 'Rate limit exceeded. Please try again later.' };
}
```

### 3. Invalid Address
```typescript
if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
  return { error: 'Invalid Ethereum address' };
}
```

## Future Enhancements

1. **GraphQL Integration**: Polymarket may offer GraphQL for more efficient queries
2. **WebSocket Support**: Real-time updates for active positions
3. **Historical Data**: Access trades from previous years
4. **Batch Requests**: Optimize multiple market lookups

## Resources

- [Polymarket CLOB API Docs](https://docs.polymarket.com/)
- [Polymarket Developer Discord](https://discord.gg/polymarket)
- [Example API Calls](https://github.com/Polymarket/clob-client)

## Support

For API-specific questions:
- Polymarket Discord: #dev-support
- Email: dev@polymarket.com

---

Built with ❤️ for the Polymarket community
