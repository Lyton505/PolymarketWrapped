import type { WrappedData } from "@/types/trading";

/**
 * Generate a badge image as a data URL using HTML Canvas
 * This creates a shareable image with the user's trading stats
 */
export async function generateBadgeImage(
  wrappedData: WrappedData
): Promise<string> {
  // Create canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  // Set canvas size (optimized for social media sharing)
  canvas.width = 1200;
  canvas.height = 1600;

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#1e1b4b"); // Deep purple
  gradient.addColorStop(0.5, "#312e81"); // Purple
  gradient.addColorStop(1, "#1e3a8a"); // Deep blue
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add subtle grid pattern
  ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
  ctx.lineWidth = 1;
  for (let i = 0; i < canvas.width; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, canvas.height);
    ctx.stroke();
  }
  for (let i = 0; i < canvas.height; i += 40) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }

  // Draw border
  ctx.strokeStyle = "rgba(139, 92, 246, 0.5)";
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 72px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Polymarket Wrapped", canvas.width / 2, 140);

  // Year
  const yearGradient = ctx.createLinearGradient(
    canvas.width / 2 - 200,
    0,
    canvas.width / 2 + 200,
    0
  );
  yearGradient.addColorStop(0, "#a855f7");
  yearGradient.addColorStop(0.5, "#3b82f6");
  yearGradient.addColorStop(1, "#06b6d4");
  ctx.fillStyle = yearGradient;
  ctx.font = "bold 96px Inter, system-ui, sans-serif";
  ctx.fillText(wrappedData.year.toString(), canvas.width / 2, 240);

  // Address (shortened)
  const shortAddress = `${wrappedData.address.slice(
    0,
    6
  )}...${wrappedData.address.slice(-4)}`;
  ctx.fillStyle = "#a1a1aa";
  ctx.font = "32px 'Courier New', monospace";
  ctx.fillText(shortAddress, canvas.width / 2, 300);

  // Persona Section
  const persona = wrappedData.stats.tradingPersona;
  const yOffset = 380;

  // Persona emoji/icon
  ctx.font = "120px Arial";
  ctx.fillText(persona.emoji, canvas.width / 2, yOffset + 80);

  // Persona type
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 56px Inter, system-ui, sans-serif";
  ctx.fillText(persona.type, canvas.width / 2, yOffset + 180);

  // Persona description
  ctx.fillStyle = "#d4d4d8";
  ctx.font = "28px Inter, system-ui, sans-serif";
  const descLines = wrapText(ctx, persona.description, canvas.width - 200);
  descLines.forEach((line, i) => {
    ctx.fillText(line, canvas.width / 2, yOffset + 230 + i * 40);
  });

  // Stats Section
  const statsY = yOffset + 350;
  const stats = [
    {
      label: "Total Trades",
      value: wrappedData.stats.totalTrades.toLocaleString(),
      color: "#a855f7",
    },
    {
      label: "Total Volume",
      value: `$${formatNumber(wrappedData.stats.totalVolume)}`,
      color: "#3b82f6",
    },
    {
      label: "Net P&L",
      value: `${wrappedData.stats.totalPnL >= 0 ? "+" : ""}$${formatNumber(
        Math.abs(wrappedData.stats.totalPnL)
      )}`,
      color: wrappedData.stats.totalPnL >= 0 ? "#22c55e" : "#ef4444",
    },
    {
      label: "Win Rate",
      value: `${(wrappedData.stats.winRate * 100).toFixed(1)}%`,
      color: "#06b6d4",
    },
  ];

  // Draw stats in a 2x2 grid
  const statsPerRow = 2;
  const statBoxWidth = 480;
  const statBoxHeight = 180;
  const statSpacing = 40;
  const startX =
    (canvas.width - (statBoxWidth * statsPerRow + statSpacing)) / 2;

  stats.forEach((stat, index) => {
    const row = Math.floor(index / statsPerRow);
    const col = index % statsPerRow;
    const x = startX + col * (statBoxWidth + statSpacing);
    const y = statsY + row * (statBoxHeight + statSpacing);

    // Draw stat box background
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    roundRect(ctx, x, y, statBoxWidth, statBoxHeight, 20);
    ctx.fill();

    // Draw stat box border
    ctx.strokeStyle = stat.color;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw stat label
    ctx.fillStyle = "#a1a1aa";
    ctx.font = "28px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(stat.label, x + statBoxWidth / 2, y + 60);

    // Draw stat value
    ctx.fillStyle = stat.color;
    ctx.font = "bold 48px Inter, system-ui, sans-serif";
    ctx.fillText(stat.value, x + statBoxWidth / 2, y + 120);
  });

  // Best Trade Section (if available)
  if (wrappedData.stats.bestTrade) {
    const bestTradeY = statsY + 420;

    ctx.fillStyle = "rgba(34, 197, 94, 0.1)";
    roundRect(ctx, 100, bestTradeY, canvas.width - 200, 160, 20);
    ctx.fill();

    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 36px Inter, system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("🏆 Best Trade", 140, bestTradeY + 50);

    ctx.fillStyle = "#ffffff";
    ctx.font = "28px Inter, system-ui, sans-serif";
    const bestTradeTitle = truncateText(
      ctx,
      wrappedData.stats.bestTrade.marketTitle,
      canvas.width - 300
    );
    ctx.fillText(bestTradeTitle, 140, bestTradeY + 95);

    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 42px Inter, system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(
      `+$${formatNumber(wrappedData.stats.bestTrade.pnl || 0)}`,
      canvas.width - 140,
      bestTradeY + 95
    );
  }

  // Footer
  const footerY = canvas.height - 100;
  ctx.fillStyle = "#71717a";
  ctx.font = "28px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("polymarketwrapped.com", canvas.width / 2, footerY);

  // Convert canvas to data URL
  return canvas.toDataURL("image/png");
}

/**
 * Helper function to draw rounded rectangles
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Format large numbers with K/M suffixes
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toFixed(0);
}

/**
 * Wrap text to fit within a maximum width
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

/**
 * Truncate text to fit within a maximum width
 */
function truncateText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string {
  let width = ctx.measureText(text).width;
  if (width <= maxWidth) return text;

  while (width > maxWidth && text.length > 0) {
    text = text.slice(0, -1);
    width = ctx.measureText(text + "...").width;
  }
  return text + "...";
}

/**
 * Download the badge image
 */
export function downloadBadgeImage(dataUrl: string, address: string) {
  const link = document.createElement("a");
  link.download = `polymarket-wrapped-${address.slice(0, 8)}.png`;
  link.href = dataUrl;
  link.click();
}

/**
 * Share badge on Twitter
 */
export function shareOnTwitter(wrappedData: WrappedData) {
  const text = `🎯 My Polymarket Wrapped ${wrappedData.year}

📊 ${wrappedData.stats.totalTrades} trades
💰 $${formatNumber(wrappedData.stats.totalVolume)} volume
${wrappedData.stats.totalPnL >= 0 ? "📈" : "📉"} ${
    wrappedData.stats.totalPnL >= 0 ? "+" : ""
  }$${formatNumber(Math.abs(wrappedData.stats.totalPnL))} P&L
🎭 ${wrappedData.stats.tradingPersona.type}

Check out yours at polymarketwrapped.com`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    text
  )}`;
  window.open(twitterUrl, "_blank");
}
