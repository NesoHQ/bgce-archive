import { ComingSoon } from "@/components/shared/ComingSoon";
import { Users } from "lucide-react";

export default function CommunityActionsPage() {
    return (
        <div className="min-h-screen">
            <ComingSoon
                title="Community Actions"
                description="Engage with the community through events, challenges, hackathons, and collaborative initiatives. Build connections and grow together."
                icon={Users}
                estimatedDate="Q3 2024"
            />
        </div>
    );
}
