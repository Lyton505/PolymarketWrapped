"use client";

import { type TradingStats } from "@/types/trading";
import { formatCurrency, formatPercentage, formatNumber } from "@/lib/utils";

export function StatsOverviewCard({ stats }: { stats: TradingStats }) {
  return (
    <div className="w-full max-w-2xl bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-3xl p-8 border border-purple-500/20 backdrop-blur-sm">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Your Trading Year
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <StatItem
          label="Total Trades"
          value={formatNumber(stats.totalTrades)}
          icon="📊"
        />
        <StatItem
          label="Total Volume"
          value={formatCurrency(stats.totalVolume)}
          icon="💰"
        />
        <StatItem
          label="Net P&L"
          value={formatCurrency(stats.totalPnL)}
          valueClassName={
            stats.totalPnL >= 0 ? "text-green-400" : "text-red-400"
          }
          icon={stats.totalPnL >= 0 ? "📈" : "📉"}
        />
        <StatItem
          label="Win Rate"
          value={formatPercentage(stats.winRate)}
          icon="🎯"
        />
        <StatItem
          label="Markets Traded"
          value={formatNumber(stats.uniqueMarkets)}
          icon="🌐"
        />
        <StatItem
          label="Avg Trade Size"
          value={formatCurrency(stats.averageTradeSize)}
          icon="💵"
        />
      </div>
    </div>
  );
}

function StatItem({
  label,
  value,
  icon,
  valueClassName = "text-white",
}: {
  label: string;
  value: string;
  icon: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-2xl">{icon}</div>
      <div className="text-sm text-zinc-400">{label}</div>
      <div className={`text-2xl font-bold ${valueClassName}`}>{value}</div>
    </div>
  );
}
