# Deployment Guide

This guide walks you through deploying PolymarketWrapped to production.

## Prerequisites

- Node.js 18+ installed
- A wallet with ETH on Base for contract deployment (~0.01 ETH for gas)
- WalletConnect Project ID
- (Optional) Basescan API key for contract verification

## Step 1: Install Dependencies

```bash
npm install

# Also install hardhat for smart contract deployment
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
```

## Step 2: Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the required values:

```env
# Get from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# These will be filled in later
NEXT_PUBLIC_BADGE_CONTRACT_ADDRESS=
NEXT_PUBLIC_PAYMASTER_URL=

# For contract deployment
PRIVATE_KEY=your_private_key_here
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

## Step 3: Deploy Smart Contract to Base

### Option A: Deploy to Base Mainnet

```bash
npx hardhat run scripts/deploy.js --network base
```

### Option B: Deploy to Base Sepolia (Testnet)

```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

After deployment, you'll see:

```
PolymarketWrappedBadge deployed to: 0x...
```

Copy this address and add it to your `.env.local`:

```env
NEXT_PUBLIC_BADGE_CONTRACT_ADDRESS=0x...
```

### Verify Contract on Basescan

```bash
npx hardhat verify --network base <CONTRACT_ADDRESS>
```

## Step 4: Set Up Paymaster (Optional but Recommended)

For gasless NFT minting, you need a Paymaster service:

### Option A: Alchemy Account Kit

1. Sign up at [alchemy.com](https://www.alchemy.com/)
2. Create a new app on Base
3. Enable Gas Manager
4. Get your Paymaster policy ID
5. Add to `.env.local`:

```env
NEXT_PUBLIC_PAYMASTER_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
```

### Option B: Pimlico

1. Sign up at [pimlico.io](https://www.pimlico.io/)
2. Create API key
3. Configure Base sponsorship policy
4. Add to `.env.local`:

```env
NEXT_PUBLIC_PAYMASTER_URL=https://api.pimlico.io/v2/base/rpc?apikey=YOUR_KEY
```

## Step 5: Deploy Frontend

### Option A: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com/) and import your repository
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_BADGE_CONTRACT_ADDRESS`
   - `NEXT_PUBLIC_PAYMASTER_URL` (optional)
4. Deploy!

### Option B: Self-Hosted

Build for production:

```bash
npm run build
```

Start the server:

```bash
npm start
```

Or use PM2 for process management:

```bash
npm install -g pm2
pm2 start npm --name "polymarket-wrapped" -- start
pm2 save
pm2 startup
```

## Step 6: Test the Application

1. Navigate to your deployed URL
2. Click "Connect Wallet"
3. Connect a wallet that has traded on Polymarket
4. Verify that your wrapped data loads correctly
5. Test NFT minting functionality
6. Test pin code sharing

## Step 7: Generate Admin Pin Codes

To generate pin codes for specific addresses (e.g., for promotional purposes):

```bash
curl -X POST https://your-domain.com/api/pincode/generate \
  -H "Content-Type: application/json" \
  -d '{"address": "0x..."}'
```

Save the returned pin codes securely.

## Monitoring and Maintenance

### Check Contract Status

View your contract on Basescan:

```
https://basescan.org/address/<YOUR_CONTRACT_ADDRESS>
```

### Monitor Polymarket API Usage

The free tier allows:

- 100 requests per minute
- 10,000 requests per day

Consider implementing rate limiting if you expect high traffic.

### Database for Pin Codes

For production, replace the in-memory pin code storage with a database:

1. Set up a PostgreSQL/MongoDB database
2. Update `/app/api/pincode/[code]/route.ts` to use your database
3. Add database credentials to environment variables

### Analytics

Consider adding analytics to track:

- Number of wrapped generated
- NFTs minted
- Popular trading personas
- User engagement metrics

## Troubleshooting

### "Cannot connect to Polymarket API"

- Check if Polymarket's API is operational
- Verify your API key (if using one)
- Check rate limits

### "Contract deployment failed"

- Ensure you have enough ETH for gas
- Verify your RPC URL is correct
- Check that your private key is properly set

### "Paymaster not sponsoring transactions"

- Verify your Paymaster policy is active
- Check spending limits
- Ensure the contract address is whitelisted

### "Next.js build errors"

- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

## Security Considerations

1. **Never commit `.env.local`** to version control
2. **Rotate API keys** regularly
3. **Monitor contract for unusual activity**
4. **Implement rate limiting** on API routes
5. **Validate all user inputs** server-side
6. **Use HTTPS** in production
7. **Set up CSP headers** for additional security

## Cost Estimates

- **Contract deployment**: ~$5-20 (one-time)
- **NFT minting** (without paymaster): ~$1-3 per mint
- **NFT minting** (with paymaster): Free for users, you pay
- **Hosting** (Vercel): Free tier available
- **Paymaster credits**: Varies by provider

## Next Steps

- Set up analytics dashboard
- Implement social sharing with Open Graph images
- Add historical data support (2024, 2023)
- Build leaderboards
- Create community challenges

## Support

For issues or questions:

- GitHub Issues: <https://github.com/Lyton505/PolymarketWrapped/issues>
- Email: [your-email]

---

Happy deploying! 🚀
