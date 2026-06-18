import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "TourMate AI - Discover India Like Never Before",
  description: "AI-powered local tourism connecting you with hidden gems, verified student guides, and unforgettable experiences.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-body antialiased flex flex-col bg-surface">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col pt-16">
            {children}
          </main>
          <Footer />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
