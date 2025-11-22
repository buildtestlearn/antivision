import type { Metadata } from "next";
import { Outfit, Caveat, Inter } from "next/font/google";
import "./globals.css";
import { RemixProvider } from "@/context/RemixContext";
import RemixDrawer from "@/components/RemixDrawer";
import { AuthProvider } from "@/context/AuthContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Remix",
  description: "Remix your photos with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${caveat.variable} ${inter.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <RemixProvider>
            {children}
            <RemixDrawer />
          </RemixProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
