import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { KrakensAnalytics } from "@/components/krakens-analytics";
import { ToastProvider } from "@/components/ui/toast";
import { SkipToContent } from "@/components/shared/SkipToContent";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { GradientBackground } from "@/components/shared/GradientBackground";
import { MobileOptimizer } from "@/components/shared/MobileOptimizer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "BGCE Archive",
  description: "Best Golang Community Ever",
  other: {
    // Optimize for mobile performance
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Critical mobile performance CSS - loaded immediately */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
                        @media (max-width: 768px) {
                            * {
                                backdrop-filter: none !important;
                                -webkit-backdrop-filter: none !important;
                            }
                            [class*="blur-"]:not(button):not(a):not([role="button"]) {
                                filter: none !important;
                            }
                            div:not(button):not(a):not([role="button"]) {
                                box-shadow: none !important;
                            }
                            * {
                                text-shadow: none !important;
                            }
                            [class*="animate-pulse"],
                            [class*="animate-spin"]:not(svg) {
                                animation: none !important;
                            }
                            .fixed[class*="bg-gradient"],
                            .absolute[class*="bg-gradient"]:not(button):not(a) {
                                background-image: none !important;
                            }
                            html {
                                scroll-behavior: auto !important;
                            }
                            * {
                                -webkit-overflow-scrolling: touch;
                            }
                        }
                    `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SkipToContent />
        <KrakensAnalytics />
        <MobileOptimizer />
        <GradientBackground />

        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          <ToastProvider>
            <ErrorBoundary>
              <AuthProvider>{children}</AuthProvider>
            </ErrorBoundary>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
