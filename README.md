# Polymarket Wrapped 🎁

> Your personalized year in Polymarket trading - discover your stats, wins, and trading personality

A delightful, social, data-driven Wrapped experience for Polymarket traders, with an onchain footprint on Base.

![Polymarket Wrapped](https://img.shields.io/badge/Built%20on-Base-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### Core Features

- 🔌 **Wallet Connect** - Connect your wallet to instantly view your trading stats
- 📊 **Trading Analytics** - Comprehensive breakdown of your 2025 trading activity
  - Total trades, volume, and P&L
  - Win rate and best/worst trades
  - Favorite market categories
  - Trading persona (Whale, Day Trader, Strategic Investor, etc.)
  - Activity timeline and streaks
- 🔐 **Pin Code Sharing** - Generate shareable pin codes for any trader's wrapped
- 🖼️ **Export & Share** - Download beautiful images to share on social media
- 🎖️ **NFT Badge Minting** - Mint your Wrapped Badge as an NFT on Base (gasless!)

### Technical Highlights

- **Next.js 16** with App Router and Server Components
- **RainbowKit + Wagmi** for seamless wallet connection
- **Polymarket CLOB API** integration for real-time trading data
- **Base Chain** deployment with ERC-4337 account abstraction
- **Gasless Minting** via Paymaster integration
- **Beautiful UI** inspired by modern design patterns

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A WalletConnect Project ID ([get one here](https://cloud.walletconnect.com/))
- (Optional) Polymarket API key for rate limit increases

### Installation

1. **Clone the repository**

   ```bash
   cd /home/lyton/Documents/GitRepos/PolymarketWrapped
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Then fill in your values:

   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_BADGE_CONTRACT_ADDRESS=your_deployed_contract_address
   NEXT_PUBLIC_PAYMASTER_URL=your_paymaster_url
   POLYMARKET_API_KEY=optional_polymarket_api_key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Smart Contract Deployment

### Deploy to Base

The `PolymarketWrappedBadge` contract is located in `/contracts/PolymarketWrappedBadge.sol`.

**Using Hardhat/Foundry:**

1. Install dependencies:

   ```bash
   npm install --save-dev hardhat @openzeppelin/contracts
   ```

2. Deploy to Base:

   ```bash
   npx hardhat run scripts/deploy.js --network base
   ```

3. Copy the deployed contract address to your `.env.local` file

**Contract Features:**

- ERC-721 compliant NFT
- One badge per address per year
- Custom metadata URI for each badge
- Gas-efficient minting
- Compatible with ERC-4337 account abstraction

### Paymaster Setup

For gasless minting, integrate with a Paymaster service:

1. **Alchemy Account Kit** (Recommended)
   - Sign up at [Alchemy](https://www.alchemy.com/)
   - Enable Paymaster for Base
   - Get your Paymaster URL

2. **Pimlico**
   - Sign up at [Pimlico](https://www.pimlico.io/)
   - Configure Base sponsorship
   - Get your Paymaster endpoint

3. Update `.env.local` with your Paymaster URL

## Project Structure

```
polymarket-wrapped/
├── app/
│   ├── api/
│   │   ├── wrapped/[address]/    # Fetch wrapped data for an address
│   │   └── pincode/[code]/       # Resolve pin codes to addresses
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Main page
│   ├── providers.tsx             # Wagmi/RainbowKit setup
│   └── globals.css               # Global styles
├── components/
│   ├── BackgroundEffects.tsx     # Animated background
│   ├── HeroSection.tsx           # Landing section
│   ├── StatsOverviewCard.tsx     # Trading stats display
│   └── PersonaCard.tsx           # Trading persona card
├── config/
│   ├── app.ts                    # App configuration
│   └── chains.ts                 # Chain configuration
├── contracts/
│   └── PolymarketWrappedBadge.sol # NFT badge contract
├── lib/
│   ├── polymarket-client.ts      # Polymarket API client
│   ├── analytics-engine.ts       # Trading analytics
│   ├── nft-client.ts             # NFT minting logic
│   └── utils.ts                  # Utility functions
├── types/
│   └── trading.ts                # TypeScript types
└── package.json
```

## API Routes

### GET `/api/wrapped/[address]`

Fetch wrapped data for a specific address.

**Response:**

```json
{
  "address": "0x...",
  "year": 2025,
  "stats": {
    "totalTrades": 150,
    "totalVolume": 50000,
    "totalPnL": 2500,
    "winRate": 0.65,
    "tradingPersona": {
      "type": "Strategic Investor",
      "description": "...",
      "traits": ["High Win Rate", "Calculated"],
      "emoji": "🎯"
    },
    ...
  },
  "trades": [...],
  "positions": [...]
}
```

### GET `/api/pincode/[code]`

Resolve a pin code to wrapped data.

### POST `/api/pincode/[code]`

Generate a new pin code for an address (admin use).

**Request:**

```json
{
  "address": "0x..."
}
```

**Response:**

```json
{
  "code": "ABC123",
  "address": "0x...",
  "expiresAt": 1234567890
}
```

## Trading Personas

The app classifies traders into 8 unique personas based on their behavior:

| Persona | Criteria |
|---------|----------|
| 🐋 **Whale** | High volume (>$100k) and large trades (>$2k avg) |
| ⚡ **Day Trader** | Very active (>200 trades) |
| 🎯 **Strategic Investor** | High win rate (>65%) and consistent trading |
| 🎲 **Degen Trader** | High risk, large individual bets |
| 🔥 **Risk Taker** | Negative P&L but persistent trading |
| 💎 **HODL King** | Few trades but high volume, patient |
| 🧠 **Market Maven** | Diverse trading across many categories |
| 🌱 **Cautious Bettor** | New trader, just getting started |

## Roadmap

- [x] Core wrapped experience
- [x] Wallet connection
- [x] Pin code sharing
- [x] Smart contract development
- [ ] Paymaster integration for gasless minting
- [ ] Image export functionality
- [ ] Social media sharing (Twitter cards)
- [ ] Historical data (2024, 2023)
- [ ] Leaderboards
- [ ] Community challenges

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details

## Acknowledgments

- Polymarket for the trading platform and API
- Base for the L2 infrastructure
- RainbowKit for the beautiful wallet connection UI
- The Ethereum community for ERC-4337 standards

## Support

For issues, questions, or suggestions, please [open an issue](https://github.com/Lyton505/PolymarketWrapped/issues).

---

Built with ❤️ for the Polymarket community
