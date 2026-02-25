import { ComingSoon } from "@/components/shared/ComingSoon";
import { BarChart3 } from "lucide-react";

export default function BenchmarkPage() {
    return (
        <div className="min-h-screen">
            <ComingSoon
                title="Performance Benchmarks"
                description="Compare performance metrics, analyze system benchmarks, and track improvements across different technologies and frameworks."
                icon={BarChart3}
                estimatedDate="Q3 2024"
            />
        </div>
    );
}
