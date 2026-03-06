/**
 * Utility to access environment variables at runtime.
 * On the client, it checks window.__ENV__.
 * On the server, it checks process.env.
 */
export function getEnv(name: string): string | undefined {
    if (typeof window !== 'undefined') {
        // Client-side: use the injected runtime environment
        return (window as any).__ENV__?.[name] || process.env[name];
    }
    // Server-side: use process.env
    return process.env[name];
}

// Common environment variables for easy access
export const ENV = {
    get API_URL() { return getEnv('NEXT_PUBLIC_API_URL') || "http://localhost:8080/api/v1"; },
    get POSTAL_API_URL() { return getEnv('NEXT_PUBLIC_POSTAL_API_URL') || "http://localhost:8081/api/v1"; },
    get KRAKENS_PROJECT_ID() { return getEnv('NEXT_PUBLIC_KRAKENS_PROJECT_ID'); },
};
