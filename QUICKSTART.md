# Quick Start Guide

Get Polymarket Wrapped running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A WalletConnect Project ID (free)

## 1. Install Dependencies

```bash
npm install
```

## 2. Get WalletConnect Project ID

1. Go to https://cloud.walletconnect.com/
2. Sign up for a free account
3. Create a new project
4. Copy your Project ID

## 3. Set Up Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your WalletConnect Project ID:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## 5. Test the App

1. Click "Connect Wallet"
2. Connect a wallet that has traded on Polymarket
3. View your wrapped trading stats!

## What's Next?

### For Development

- The app fetches real data from Polymarket CLOB API
- No API key needed for basic usage
- All processing happens in the browser and API routes

### For Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on:

1. Deploying the smart contract to Base
2. Setting up a Paymaster for gasless minting
3. Deploying to Vercel or your preferred host

### Smart Contract Deployment

To deploy the NFT badge contract to Base testnet:

```bash
# Install hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts

# Add your private key to .env.local
echo "PRIVATE_KEY=your_private_key" >> .env.local

# Deploy to Base Sepolia (testnet)
npm run deploy:test
```

## Project Structure

```
├── app/              # Next.js app directory
│   ├── api/         # API routes for wrapped data
│   ├── layout.tsx   # Root layout with providers
│   └── page.tsx     # Main page
├── components/       # React components
├── contracts/        # Solidity smart contracts
├── lib/             # Utility functions and clients
├── types/           # TypeScript type definitions
└── config/          # App configuration
```

## Key Features Implemented

✅ Wallet connection with RainbowKit
✅ Polymarket API integration
✅ Trading analytics engine
✅ Beautiful wrapped cards
✅ Trading persona classification
✅ Pin code sharing system
✅ NFT badge contract (ready to deploy)
✅ Image export functionality
✅ Social sharing helpers

## Common Issues

### "Cannot connect wallet"

- Make sure you've added a valid WalletConnect Project ID
- Check browser console for errors
- Try refreshing the page

### "No trading data found"

- Ensure the wallet has traded on Polymarket in 2025
- Try a different address
- Check if Polymarket API is accessible

### Build errors

```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

## Resources

- [Full Documentation](README.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Polymarket API Guide](POLYMARKET_API.md)
- [Base Documentation](https://docs.base.org/)

## Need Help?

- Check the [GitHub Issues](https://github.com/Lyton505/PolymarketWrapped/issues)
- Review the comprehensive guides in the repo
- Ensure all environment variables are set correctly

---

Happy building! 🚀
