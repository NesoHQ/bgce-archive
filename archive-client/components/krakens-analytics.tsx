'use client';

import Script from 'next/script';

export function KrakensAnalytics() {
    return (
        <Script
            src="https://krakens.nesohq.org/krakens.js"
            strategy="afterInteractive"
            onLoad={() => {
                const projectId = process.env.NEXT_PUBLIC_KRAKENS_PROJECT_ID;
                if (typeof window !== 'undefined' && (window as any).Krakens && projectId) {
                    (window as any).Krakens.init(projectId);
                }
            }}
        />
    );
}
