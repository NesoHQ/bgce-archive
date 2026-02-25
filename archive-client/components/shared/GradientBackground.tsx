export function GradientBackground() {
    return (
        <>
            {/* Base Gradient Layer */}
            <div className="fixed inset-0 -z-50 bg-gradient-to-br from-primary/5 via-background to-primary/5 dark:from-primary/10 dark:via-background dark:to-primary/10" />

            {/* Tech Grid Pattern */}
            <div className="fixed inset-0 -z-40 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px]" />

            {/* Animated Gradient Orbs */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] -z-30 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent dark:from-primary/30 dark:via-primary/15 dark:to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />

            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] -z-30 bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-transparent dark:from-blue-500/20 dark:via-purple-500/20 dark:to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '10s', animationDelay: '2s' }} />

            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] -z-30 bg-gradient-to-r from-cyan-500/5 to-primary/5 dark:from-cyan-500/15 dark:to-primary/15 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '12s', animationDelay: '4s' }} />

            <div className="fixed top-1/4 right-1/4 w-[300px] h-[300px] -z-30 bg-gradient-to-bl from-purple-500/5 to-transparent dark:from-purple-500/15 dark:to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDuration: '9s', animationDelay: '1s' }} />
        </>
    );
}
