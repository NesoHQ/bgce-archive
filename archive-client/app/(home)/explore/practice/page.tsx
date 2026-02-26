import { ComingSoon } from "@/components/shared/ComingSoon";
import { Code2 } from "lucide-react";

export default function PracticePage() {
    return (
        <ComingSoon
            icon={Code2}
            title="Practice Coding Challenges"
            description="Sharpen your programming skills with hands-on coding challenges, algorithm problems, and real-world scenarios. Track your progress and compete with the community."
            estimatedDate="Q2 2026"
        />
    );
}
