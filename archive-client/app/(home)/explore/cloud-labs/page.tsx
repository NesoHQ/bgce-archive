import { ComingSoon } from "@/components/shared/ComingSoon";
import { Cloud } from "lucide-react";

export default function CloudLabsPage() {
    return (
        <div className="min-h-screen">
            <ComingSoon
                title="Cloud Labs"
                description="Interactive cloud environments for hands-on practice with AWS, Azure, GCP, and Kubernetes. Learn by doing in real cloud infrastructure."
                icon={Cloud}
                estimatedDate="Q3 2024"
            />
        </div>
    );
}
