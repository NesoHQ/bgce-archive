import { ComingSoon } from "@/components/shared/ComingSoon";
import { Box } from "lucide-react";

export default function ModelsPage() {
    return (
        <div className="min-h-screen">
            <ComingSoon
                title="AI Models & Templates"
                description="Explore pre-trained models, architecture templates, and deployment patterns for modern AI applications."
                icon={Box}
                estimatedDate="Q2 2024"
            />
        </div>
    );
}
