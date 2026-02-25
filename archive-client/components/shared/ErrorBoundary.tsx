"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/20">
                            <AlertTriangle className="h-10 w-10 text-red-500" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold text-foreground">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-muted-foreground">
                                We encountered an unexpected error. Don't worry, it's not your fault.
                            </p>
                        </div>

                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <div className="p-4 rounded-xl bg-muted border border-border text-left">
                                <p className="text-xs font-mono text-red-500 break-all">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                onClick={() => window.location.reload()}
                                className="gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => (window.location.href = "/")}
                                className="gap-2"
                            >
                                <Home className="h-4 w-4" />
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Functional error component for specific use cases
export function ErrorDisplay({
    title = "Something went wrong",
    message = "We encountered an error while loading this content.",
    onRetry,
}: {
    title?: string;
    message?: string;
    onRetry?: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/20">
                <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground max-w-md">{message}</p>
            </div>

            {onRetry && (
                <Button onClick={onRetry} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </Button>
            )}
        </div>
    );
}
