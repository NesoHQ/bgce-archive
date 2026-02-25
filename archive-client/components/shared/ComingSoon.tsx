import { Rocket, Clock, Bell, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ComingSoonProps {
    title: string;
    description: string;
    icon?: React.ComponentType<{ className?: string }>;
    estimatedDate?: string;
    notifyLink?: string;
}

export function ComingSoon({
    title,
    description,
    icon: Icon = Rocket,
    estimatedDate,
    notifyLink = "/resources/newsletter"
}: ComingSoonProps) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Icon */}
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                        <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center backdrop-blur-sm">
                            <Icon className="h-10 w-10 text-primary" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                        {title}
                    </h1>

                    {/* Description */}
                    <p className="text-base text-muted-foreground mb-6 max-w-lg mx-auto">
                        {description}
                    </p>

                    {/* Coming Soon Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 border border-border/50 backdrop-blur-sm mb-8">
                        <Clock className="h-4 w-4 text-primary animate-pulse" />
                        <span className="text-sm font-semibold text-foreground">Coming Soon</span>
                        {estimatedDate && (
                            <>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">{estimatedDate}</span>
                            </>
                        )}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button
                            asChild
                            className="h-10 px-5 rounded-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all group"
                        >
                            <Link href={notifyLink}>
                                <Bell className="h-4 w-4 mr-2" />
                                Notify Me
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            asChild
                            className="h-10 px-5 rounded-lg border-2 bg-gradient-to-r from-background to-muted/50 hover:from-muted/50 hover:to-muted transition-all group"
                        >
                            <Link href="/">
                                Back to Home
                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>

                    {/* Features Preview */}
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-gradient-to-br from-card to-card/80 dark:from-card/50 dark:to-card/30 border border-border backdrop-blur-sm">
                            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mb-2 mx-auto">
                                <Rocket className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="text-xs font-semibold text-foreground mb-1">Powerful Features</h3>
                            <p className="text-[10px] text-muted-foreground">Built with the latest technology</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-card to-card/80 dark:from-card/50 dark:to-card/30 border border-border backdrop-blur-sm">
                            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mb-2 mx-auto">
                                <Clock className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="text-xs font-semibold text-foreground mb-1">In Development</h3>
                            <p className="text-[10px] text-muted-foreground">We're working hard on this</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-card to-card/80 dark:from-card/50 dark:to-card/30 border border-border backdrop-blur-sm">
                            <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mb-2 mx-auto">
                                <Bell className="h-4 w-4 text-primary" />
                            </div>
                            <h3 className="text-xs font-semibold text-foreground mb-1">Get Notified</h3>
                            <p className="text-[10px] text-muted-foreground">Be the first to know when it launches</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
