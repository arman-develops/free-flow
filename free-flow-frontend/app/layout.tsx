import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { AuthWrapper } from "@/components/auth/auth-wrapper";
import { Suspense } from "react";
import { Providers } from "@/components/providers";
import './globals.css'

export const metadata: Metadata = {
  title: "FreeFlow - Project Management Dashboard",
  description: "Comprehensive project management with financial tracking",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            <AuthWrapper>{children}</AuthWrapper>
          </Suspense>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
