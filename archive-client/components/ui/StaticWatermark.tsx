export function StaticWatermark() {
    return (
        <div className="absolute top-2 right-2 pointer-events-none z-10">
            <div className="relative">
                <div
                    className="px-2 py-1 text-[8px] font-bold uppercase tracking-wider border-2 border-dashed border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 backdrop-blur-sm rounded"
                    style={{ transform: 'rotate(5deg)' }}
                >
                    Static: In Progress
                </div>
            </div>
        </div>
    );
}
