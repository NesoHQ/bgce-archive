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
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <SkipToContent />
                <KrakensAnalytics />
                <GradientBackground />

                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <ToastProvider>
                        <ErrorBoundary>
                            <AuthProvider>
                                {children}
                            </AuthProvider>
                        </ErrorBoundary>
                    </ToastProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
