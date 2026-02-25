import { ComingSoon } from "@/components/shared/ComingSoon";
import { GraduationCap } from "lucide-react";

export default function InterviewPrepPage() {
    return (
        <div className="min-h-screen">
            <ComingSoon
                title="Interview Preparation"
                description="Comprehensive interview prep resources including coding patterns, system design, behavioral questions, and company-specific guides."
                icon={GraduationCap}
                estimatedDate="Q2 2024"
            />
        </div>
    );
}
