import Script from "next/script";
import { JazzProvider } from "@/components/providers/JazzProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppHeader from "@/components/ui/AppHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ÉTER | Red Neural Descentralizada",
  description: "Inteligencia Artificial P2P, local y privada.",
  manifest: "/manifest.json",
  themeColor: "#030305",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ÉTER",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <JazzProvider>
          <AppHeader />
          {children}
        </JazzProvider>

        {/* GUN.JS CDN (Bypass Vercel Bundler) */}
        <Script src="https://cdn.jsdelivr.net/npm/gun/gun.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/gun/sea.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/gun/lib/radix.js" strategy="afterInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/gun/lib/radisk.js" strategy="afterInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/gun/lib/store.js" strategy="afterInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/gun/lib/rindexed.js" strategy="afterInteractive" />
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration);
                  }, function(err) {
                    console.log('SW registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
