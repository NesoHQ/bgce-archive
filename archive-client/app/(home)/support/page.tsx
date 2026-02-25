import { ComingSoon } from "@/components/shared/ComingSoon";
import { Headphones } from "lucide-react";

export default function SupportPage() {
    return (
        <div className="min-h-screen">
            <ComingSoon
                title="Support Center"
                description="Get help and support from our team. We're building a comprehensive support system with live chat, documentation, and community forums."
                icon={Headphones}
                estimatedDate="Q2 2024"
            />
        </div>
    );
}
