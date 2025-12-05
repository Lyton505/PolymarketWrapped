import { prepareBadgeMetadata } from "./nft-client";
import type { WrappedData } from "@/types/trading";

/**
 * Upload badge metadata and image to IPFS using Pinata
 * You'll need to sign up for Pinata and add your API keys to .env.local:
 * - NEXT_PUBLIC_PINATA_JWT
 */

const PINATA_API_URL = "https://api.pinata.cloud";
const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs";

interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

/**
 * Upload an image to IPFS via Pinata
 */
export async function uploadImageToPinata(
  imageDataUrl: string,
  filename: string
): Promise<string> {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;

  if (!jwt) {
    console.warn("Pinata JWT not configured, using placeholder URI");
    return "ipfs://QmPlaceholder123456789";
  }

  try {
    // Convert data URL to blob
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();

    // Create form data
    const formData = new FormData();
    formData.append("file", blob, filename);

    const pinataMetadata = JSON.stringify({
      name: filename,
    });
    formData.append("pinataMetadata", pinataMetadata);

    // Upload to Pinata
    const uploadResponse = await fetch(
      `${PINATA_API_URL}/pinning/pinFileToIPFS`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error(`Pinata upload failed: ${uploadResponse.statusText}`);
    }

    const data: PinataResponse = await uploadResponse.json();
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading image to Pinata:", error);
    throw error;
  }
}

/**
 * Upload JSON metadata to IPFS via Pinata
 */
export async function uploadMetadataToPinata(
  metadata: any,
  filename: string
): Promise<string> {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;

  if (!jwt) {
    console.warn("Pinata JWT not configured, using placeholder URI");
    return "ipfs://QmPlaceholderMetadata123456789";
  }

  try {
    const response = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: filename,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Pinata metadata upload failed: ${response.statusText}`);
    }

    const data: PinataResponse = await response.json();
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading metadata to Pinata:", error);
    throw error;
  }
}

/**
 * Complete flow: Generate badge image and upload to IPFS with metadata
 */
export async function prepareNFTMetadata(
  wrappedData: WrappedData,
  imageDataUrl: string
): Promise<string> {
  try {
    // 1. Upload image to IPFS
    const imageFilename = `polymarket-wrapped-${wrappedData.address.slice(
      0,
      8
    )}-${wrappedData.year}.png`;
    const imageIpfsUri = await uploadImageToPinata(imageDataUrl, imageFilename);

    console.log("Image uploaded to IPFS:", imageIpfsUri);

    // 2. Prepare metadata with IPFS image URI
    const metadata = prepareBadgeMetadata(wrappedData);
    metadata.image = imageIpfsUri;

    // 3. Upload metadata to IPFS
    const metadataFilename = `polymarket-wrapped-${wrappedData.address.slice(
      0,
      8
    )}-metadata.json`;
    const metadataIpfsUri = await uploadMetadataToPinata(
      metadata,
      metadataFilename
    );

    console.log("Metadata uploaded to IPFS:", metadataIpfsUri);

    return metadataIpfsUri;
  } catch (error) {
    console.error("Error preparing NFT metadata:", error);
    throw error;
  }
}

/**
 * Alternative: Use NFT.Storage (free, no API key required)
 * Install: npm install nft.storage
 */
export async function uploadToNFTStorage(
  wrappedData: WrappedData,
  imageDataUrl: string
): Promise<string> {
  // This is a placeholder - you'd need to install nft.storage
  // and implement the actual upload logic

  console.log("NFT.Storage integration coming soon");
  return "ipfs://QmPlaceholderNFTStorage";
}

/**
 * Get IPFS gateway URL for displaying content
 */
export function getIpfsGatewayUrl(ipfsUri: string): string {
  if (!ipfsUri.startsWith("ipfs://")) {
    return ipfsUri;
  }

  const hash = ipfsUri.replace("ipfs://", "");
  return `${PINATA_GATEWAY}/${hash}`;
}
