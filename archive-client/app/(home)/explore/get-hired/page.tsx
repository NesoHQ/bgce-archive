import { ComingSoon } from "@/components/shared/ComingSoon";
import { Briefcase } from "lucide-react";

export default function GetHiredPage() {
    return (
        <ComingSoon
            icon={Briefcase}
            title="Get Hired"
            description="Connect with top tech companies, access exclusive job opportunities, and get career guidance from industry experts. Your next career move starts here."
            estimatedDate="Q3 2026"
        />
    );
}
