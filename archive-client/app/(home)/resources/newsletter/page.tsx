import { ComingSoon } from "@/components/shared/ComingSoon";
import { Mail } from "lucide-react";

export default function NewsletterPage() {
    return (
        <div className="min-h-screen">
            <ComingSoon
                title="Developer Newsletter"
                description="Weekly insights, tutorials, and updates on backend development, cloud infrastructure, and system design delivered to your inbox."
                icon={Mail}
                estimatedDate="Q1 2024"
            />
        </div>
    );
}
