import { ComingSoon } from "@/components/shared/ComingSoon";
import { Briefcase, Users, FileText } from "lucide-react";

export default function GetHiredPage() {
    return (
        <ComingSoon
            icon={Briefcase}
            title="Get Hired"
            description="Connect with top tech companies, access exclusive job opportunities, and get career guidance from industry experts. Your next career move starts here."
            estimatedDate="Q3 2026"
            features={[
                {
                    icon: Briefcase,
                    title: "Job Board",
                    description: "Exclusive opportunities from leading tech companies"
                },
                {
                    icon: Users,
                    title: "Career Mentorship",
                    description: "Get guidance from experienced professionals"
                },
                {
                    icon: FileText,
                    title: "Resume Review",
                    description: "Professional feedback on your resume and portfolio"
                }
            ]}
        />
    );
}
