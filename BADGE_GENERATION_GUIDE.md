# Badge Image Generation & Sharing Guide 🎨

## Overview

Your Polymarket Wrapped now has a complete badge generation system that creates beautiful, shareable images with user stats!

## Features

✅ **Generate Badge Image** - Creates a stunning 1200x1600px image with Canvas  
✅ **Preview Modal** - View your badge before minting  
✅ **Download** - Save as PNG to your device  
✅ **Share on Twitter** - One-click sharing with formatted text  
✅ **NFT Minting** - Automatically uses the generated image for NFT metadata  
✅ **IPFS Upload** - Optional integration with Pinata for decentralized hosting

---

## How It Works

### 1. **Badge Generation Flow**

```
User Views Wrapped Data
    ↓
Click "Preview Badge" Button
    ↓
Canvas Generates Image (1200x1600px)
    ↓
Image Includes:
  - Polymarket Wrapped 2025 title
  - User's address (shortened)
  - Trading persona emoji + description
  - 4 key stats (Trades, Volume, P&L, Win Rate)
  - Best trade highlight
  - Beautiful gradient background
```

### 2. **NFT Minting Flow**

```
Click "Mint Badge NFT"
    ↓
1. Generate badge image
    ↓
2. Upload to IPFS (optional)
    ↓
3. Create metadata JSON
    ↓
4. Mint NFT with metadata URI
    ↓
5. NFT appears in wallet!
```

---

## User Actions

### **Preview Badge** 🎨

- Click to generate and view your badge
- Opens in a beautiful modal
- No wallet connection required

### **Share on Twitter** 🐦

- Formats your stats into a tweet
- Opens Twitter in new tab
- Pre-filled with emoji and stats

### **Download Image** 💾

- Saves as PNG: `polymarket-wrapped-[address].png`
- Perfect for sharing anywhere
- High quality (1200x1600px)

### **Mint Badge NFT** 🏆

- Requires wallet connection
- Uses the same generated image
- One badge per address per year
- Shows in OpenSea, wallets, etc.

---

## Viewing Your NFT

### Option 1: OpenSea

Once minted, visit:

```
https://opensea.io/assets/base/0xe71860f790425ECe3db962617ea50d5De19c1834/[YOUR_TOKEN_ID]
```

### Option 2: BaseScan

```
https://basescan.org/token/0xe71860f790425ECe3db962617ea50d5De19c1834?a=[YOUR_ADDRESS]
```

### Option 3: Your Wallet

- MetaMask → NFTs tab
- Rainbow → Collectibles
- Coinbase Wallet → NFTs

---

## Setup (Optional IPFS Integration)

### Without IPFS (Current Default)

- ✅ Works out of the box
- ✅ Uses data URIs for metadata
- ⚠️ Images embedded in metadata (larger)
- ⚠️ Not ideal for production at scale

### With Pinata IPFS (Recommended)

1. **Sign up for Pinata**
   - Go to <https://app.pinata.cloud>
   - Create a free account (1GB free storage)

2. **Get API Key**
   - Navigate to Developers → API Keys
   - Click "New Key"
   - Enable "pinFileToIPFS" and "pinJSONToIPFS"
   - Copy your JWT token

3. **Add to .env.local**

   ```env
   NEXT_PUBLIC_PINATA_JWT=your_jwt_token_here
   ```

4. **Restart Dev Server**

   ```bash
   npm run dev
   ```

Now your NFTs will use proper IPFS hosting! 🎉

---

## Image Specifications

### Dimensions

- **Width:** 1200px
- **Height:** 1600px
- **Format:** PNG
- **File Size:** ~200-400KB

### Design Elements

- Gradient background (purple → blue)
- Subtle grid pattern
- Purple border with glow
- Responsive text sizing
- Emoji for persona
- Color-coded stats
- Professional typography

### Color Scheme

- **Background:** Deep purple to blue gradient
- **Text:** White, gray, color accents
- **Stats:**
  - Trades: Purple (#a855f7)
  - Volume: Blue (#3b82f6)
  - P&L: Green/Red based on value
  - Win Rate: Cyan (#06b6d4)

---

## Code Structure

### New Files Created

1. **`lib/badge-generator.ts`**
   - Canvas-based image generation
   - Helper functions for text wrapping, formatting
   - Twitter sharing function
   - Download function

2. **`components/BadgePreview.tsx`**
   - Preview modal component
   - Action buttons (share, download, close)
   - Loading states

3. **`lib/ipfs-uploader.ts`**
   - Pinata IPFS integration
   - Image upload function
   - Metadata upload function
   - Complete NFT preparation flow

### Modified Files

1. **`components/MintBadgeButton.tsx`**
   - Now generates image before minting
   - Uploads to IPFS (if configured)
   - Falls back to data URI if IPFS fails

2. **`app/page.tsx`**
   - Added BadgePreview component
   - Replaced individual action buttons

---

## Twitter Sharing Format

When users click "Share on Twitter", they get:

```
🎯 My Polymarket Wrapped 2025

📊 [X] trades
💰 $[X] volume
📈/📉 +/-$[X] P&L
🎭 [Persona Type]

Check out yours at polymarketwrapped.com
```

---

## Troubleshooting

### Badge won't generate?

- Check browser console for errors
- Ensure Canvas API is available
- Try in different browser

### IPFS upload fails?

- Verify `NEXT_PUBLIC_PINATA_JWT` is set
- Check Pinata API key permissions
- Falls back to data URI automatically

### Image looks wrong in wallet/OpenSea?

- Wait 5-10 minutes for IPFS propagation
- Check metadata URI in contract
- Verify image uploaded successfully

### NFT shows no image?

- OpenSea may need to refresh metadata
- Click "Refresh metadata" on OpenSea
- Can take up to 24 hours for indexing

---

## Testing

### Test Image Generation

```bash
# 1. Start dev server
npm run dev

# 2. Connect wallet and view wrapped data
# 3. Click "Preview Badge"
# 4. Verify image shows correctly
# 5. Test download and share buttons
```

### Test NFT Minting

```bash
# 1. Ensure you have Base ETH
# 2. Generate and preview badge
# 3. Click "Mint Badge NFT"
# 4. Approve transaction
# 5. Wait for confirmation
# 6. Check BaseScan for NFT
```

---

## Production Checklist

- [ ] Sign up for Pinata account
- [ ] Add `NEXT_PUBLIC_PINATA_JWT` to production env
- [ ] Test image generation on multiple browsers
- [ ] Verify IPFS uploads work
- [ ] Test NFT minting on Base mainnet
- [ ] Check OpenSea metadata display
- [ ] Test Twitter sharing
- [ ] Monitor Pinata usage/limits

---

## Future Enhancements

### Potential Improvements

1. **Multiple Badge Designs** - Let users choose themes
2. **Animation** - Confetti on successful mint
3. **Video Badges** - Animated MP4 NFTs
4. **Leaderboard** - Show top traders
5. **Frames** - Farcaster frame integration
6. **Lens** - Lens Protocol integration

### Alternative IPFS Options

- NFT.Storage (free, no API key)
- Web3.Storage (IPFS + Filecoin)
- Arweave (permanent storage)

---

## Support & Resources

### Pinata

- Dashboard: <https://app.pinata.cloud>
- Docs: <https://docs.pinata.cloud>
- Free tier: 1GB storage, 100 requests/min

### OpenSea

- Testnet: <https://testnets.opensea.io>
- Mainnet: <https://opensea.io>
- Metadata standards: <https://docs.opensea.io/docs/metadata-standards>

### Base

- Block explorer: <https://basescan.org>
- Docs: <https://docs.base.org>

---

**Status:** ✅ Badge generation fully functional!  
**Next Steps:** Test it out and share your wrapped! 🎉
