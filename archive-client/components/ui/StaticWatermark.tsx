export function StaticWatermark() {
    return (
        <div className="absolute top-0 left-0 right-0 pointer-events-none z-10 flex justify-center pt-3">
            <div
                className="px-4 py-2 text-sm font-black uppercase tracking-widest border-2 border-dashed border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 backdrop-blur-sm rounded-md shadow-lg"
                style={{ transform: 'rotate(-2deg)' }}
            >
                Static: In Progress
            </div>
        </div>
    );
}
