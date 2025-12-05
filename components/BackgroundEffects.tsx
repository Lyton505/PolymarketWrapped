"use client";

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Dark base */}
      <div className="absolute inset-0 bg-black" />

      {/* Aurora gradient orbs - Polymarket purple/blue theme */}
      <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-purple-500/5 md:bg-purple-500/12 lg:bg-purple-500/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -top-32 -right-40 w-[800px] h-[800px] bg-blue-500/5 md:bg-blue-500/12 lg:bg-blue-500/25 rounded-full blur-3xl animate-pulse-slow" />
      <div className="hidden lg:block absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-400/20 rounded-full blur-[120px] animate-pulse-slower" />
      <div className="hidden lg:block absolute top-1/2 -right-48 w-[650px] h-[650px] bg-indigo-400/20 rounded-full blur-[100px] animate-pulse-slower" />
      <div className="hidden lg:block absolute top-1/2 -left-48 w-[650px] h-[650px] bg-purple-500/20 rounded-full blur-3xl animate-pulse-slower" />
      <div className="absolute -bottom-40 -left-40 w-[750px] h-[750px] bg-blue-500/5 md:bg-blue-500/12 lg:bg-blue-500/20 rounded-full blur-3xl animate-pulse-slower" />
      <div className="absolute -bottom-40 -right-40 w-[750px] h-[750px] bg-violet-500/5 md:bg-violet-500/12 lg:bg-violet-500/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="hidden lg:block absolute bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[110px] animate-pulse-slower" />
      <div className="hidden lg:block absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="hidden lg:block absolute bottom-1/3 right-1/4 w-[550px] h-[550px] bg-blue-400/15 rounded-full blur-[110px] animate-pulse-slower" />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_60%,black_100%)] opacity-30" />
    </div>
  );
}
