import type React from "react";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { CookieConsent } from "@/components/cookie-consent";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Sparkzonn - Premium Tech & Lifestyle Blog",
  description:
    "Discover insightful articles about technology, lifestyle, and innovation",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/android-icon-36x36.png",
        sizes: "36x36",
        type: "image/png",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
        >
          {children}
        </ThemeProvider>
        <CookieConsent />
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
