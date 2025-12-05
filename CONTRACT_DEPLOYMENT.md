# Smart Contract Deployment Guide

**Note:** This guide is for the **app creator/maintainer** to deploy the contract **once**. All users will then mint from the same deployed contract.

## Quick Deploy with Remix IDE (Easiest)

1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file `PolymarketWrappedBadge.sol`
3. Copy the contract from `/contracts/PolymarketWrappedBadge.sol`
4. Compile with Solidity 0.8.20
5. Deploy to Base Mainnet:
   - Install MetaMask and switch to **Base** network
   - Select "Injected Provider - MetaMask"
   - Click "Deploy"
   - Confirm transaction (~0.005-0.01 ETH gas)
6. **Copy the deployed contract address** - you'll need this!

## Deploy with Foundry (Recommended for Production)

```bash
# Install Foundry if you haven't
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Create deployment folder
mkdir polymarket-badge-deploy && cd polymarket-badge-deploy
forge init

# Copy contract
cp ../contracts/PolymarketWrappedBadge.sol src/

# Install OpenZeppelin
forge install OpenZeppelin/openzeppelin-contracts

# Create foundry.toml
cat > foundry.toml << 'EOF'
[profile.default]
solc = "0.8.20"
optimizer = true
optimizer_runs = 200
remappings = [
    "@openzeppelin/=lib/openzeppelin-contracts/"
]
EOF

# Deploy to Base Mainnet
forge create --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  --etherscan-api-key $BASESCAN_API_KEY \
  --verify \
  src/PolymarketWrappedBadge.sol:PolymarketWrappedBadge

# Or deploy to Base Sepolia testnet first
forge create --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --verify \
  src/PolymarketWrappedBadge.sol:PolymarketWrappedBadge
```

## After Deployment

### 1. Update Environment Variables

Add the deployed contract address to your production environment:

```bash
# In your hosting platform (Vercel/Netlify/etc)
NEXT_PUBLIC_BADGE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

For local development, add to `.env.local`:

```
NEXT_PUBLIC_BADGE_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

### 2. Verify on Basescan

Visit <https://basescan.org/address/YOUR_CONTRACT_ADDRESS> to verify the contract is deployed correctly.

### 3. Optional: Verify Contract Source

```bash
# With Foundry (if you used --verify flag, this is automatic)
forge verify-contract \
  --chain-id 8453 \
  --compiler-version v0.8.20 \
  YOUR_CONTRACT_ADDRESS \
  src/PolymarketWrappedBadge.sol:PolymarketWrappedBadge
```

Or manually on Basescan:

1. Go to contract page
2. Click "Contract" → "Verify and Publish"
3. Select compiler version 0.8.20
4. Paste contract source

## Gas Costs

- **One-time deployment**: ~0.005-0.01 ETH (paid by you)
- **Per user mint**: ~0.0001-0.0003 ETH (can be sponsored with Paymaster)

## Production Checklist

- [ ] Contract deployed to Base Mainnet
- [ ] Contract address verified on Basescan
- [ ] Environment variable set in production
- [ ] Test mint from the live app
- [ ] Optional: Set up Paymaster for gasless minting
- [ ] Share the app with users!

## What Users Do

Users **don't** need to deploy anything. They simply:

1. Visit your deployed app
2. Connect their wallet
3. View their Wrapped stats
4. Click "Mint Badge" to mint their NFT (from your deployed contract)

---

**Remember:** Deploy the contract once, and all users mint from the same contract address!
