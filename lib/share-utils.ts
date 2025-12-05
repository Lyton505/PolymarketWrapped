"use client";

import { toPng } from 'html-to-image';

/**
 * Export a DOM element as a PNG image
 */
export async function exportToPng(element: HTMLElement, filename: string = 'polymarket-wrapped.png') {
  try {
    const dataUrl = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2, // 2x for retina displays
    });
    
    // Create download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    
    return dataUrl;
  } catch (error) {
    console.error('Error exporting image:', error);
    throw error;
  }
}

/**
 * Generate shareable text for social media
 */
export function generateShareText(stats: any): string {
  const { totalTrades, totalPnL, winRate, tradingPersona } = stats;
  
  const pnlText = totalPnL >= 0 ? `+$${totalPnL.toFixed(0)}` : `-$${Math.abs(totalPnL).toFixed(0)}`;
  const winRateText = `${(winRate * 100).toFixed(1)}%`;
  
  return `I'm a ${tradingPersona.emoji} ${tradingPersona.type} on @Polymarket!

📊 ${totalTrades} trades in 2025
💰 ${pnlText} P&L
🎯 ${winRateText} win rate

Check out your Polymarket Wrapped 2025!`;
}

/**
 * Share on Twitter
 */
export function shareOnTwitter(text: string, url: string = window.location.href) {
  const twitterUrl = new URL('https://twitter.com/intent/tweet');
  twitterUrl.searchParams.set('text', text);
  twitterUrl.searchParams.set('url', url);
  
  window.open(twitterUrl.toString(), '_blank', 'width=550,height=420');
}

/**
 * Copy link to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Generate Open Graph image URL for social sharing
 */
export function generateOgImageUrl(address: string, baseUrl: string): string {
  return `${baseUrl}/api/og?address=${address}`;
}
