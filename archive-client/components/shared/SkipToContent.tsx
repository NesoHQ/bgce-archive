"use client";

export function SkipToContent() {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-primary focus:text-primary-foreground focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 font-semibold transition-all"
        >
            Skip to main content
        </a>
    );
}
