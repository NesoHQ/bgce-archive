import { LucideIcon, Search, FileText, Inbox, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    suggestions?: string[];
}

export function EmptyState({
    icon: Icon = Inbox,
    title,
    description,
    action,
    suggestions,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 lg:p-20 text-center space-y-6">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20">
                <Icon className="h-10 w-10 text-primary" />
            </div>

            {/* Content */}
            <div className="space-y-3 max-w-md">
                <h3 className="text-2xl font-bold text-foreground">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>

            {/* Suggestions */}
            {suggestions && suggestions.length > 0 && (
                <div className="space-y-3 max-w-md">
                    <p className="text-sm font-semibold text-foreground">Try:</p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-center gap-2 justify-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Action */}
            {action && (
                <div className="pt-4">
                    {action.href ? (
                        <Button asChild size="lg" className="gap-2">
                            <Link href={action.href}>{action.label}</Link>
                        </Button>
                    ) : (
                        <Button onClick={action.onClick} size="lg" className="gap-2">
                            {action.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

// Preset empty states
export function NoSearchResults({ query }: { query: string }) {
    return (
        <EmptyState
            icon={Search}
            title="No results found"
            description={`We couldn't find anything matching "${query}"`}
            suggestions={[
                "Check your spelling",
                "Try different keywords",
                "Use more general terms",
                "Browse categories instead",
            ]}
            action={{
                label: "Clear Search",
                onClick: () => window.location.reload(),
            }}
        />
    );
}

export function NoArticles() {
    return (
        <EmptyState
            icon={FileText}
            title="No articles yet"
            description="There are no articles available at the moment. Check back soon for new content!"
            action={{
                label: "Explore Other Sections",
                href: "/",
            }}
        />
    );
}

export function NoContent({ type = "content" }: { type?: string }) {
    return (
        <EmptyState
            icon={Inbox}
            title={`No ${type} found`}
            description={`We couldn't find any ${type} matching your criteria.`}
            suggestions={[
                "Try adjusting your filters",
                "Clear all filters to see everything",
                "Browse different categories",
            ]}
        />
    );
}

export function ErrorState({
    title = "Something went wrong",
    description = "We encountered an error while loading this content.",
    onRetry,
}: {
    title?: string;
    description?: string;
    onRetry?: () => void;
}) {
    return (
        <EmptyState
            icon={AlertCircle}
            title={title}
            description={description}
            action={
                onRetry
                    ? {
                        label: "Try Again",
                        onClick: onRetry,
                    }
                    : undefined
            }
        />
    );
}
