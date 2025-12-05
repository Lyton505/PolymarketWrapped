import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Polymarket Wrapped 2025",
  description:
    "Your personalized year in Polymarket trading - discover your stats, wins, and trading personality",
  openGraph: {
    title: "Polymarket Wrapped 2025",
    description:
      "Your personalized year in Polymarket trading - discover your stats, wins, and trading personality",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased bg-black text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
