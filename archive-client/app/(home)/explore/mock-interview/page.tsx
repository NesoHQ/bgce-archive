import { ComingSoon } from "@/components/shared/ComingSoon";
import { Video } from "lucide-react";

export default function MockInterviewPage() {
    return (
        <div className="min-h-screen">
            <ComingSoon
                title="Mock Interviews"
                description="Practice technical interviews with AI-powered feedback, real-time coding challenges, and behavioral question preparation."
                icon={Video}
                estimatedDate="Q2 2024"
            />
        </div>
    );
}
