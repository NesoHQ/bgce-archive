import { ComingSoon } from "@/components/shared/ComingSoon";
import { Code2, Trophy, Target } from "lucide-react";

export default function PracticePage() {
    return (
        <ComingSoon
            icon={Code2}
            title="Practice Coding Challenges"
            description="Sharpen your programming skills with hands-on coding challenges, algorithm problems, and real-world scenarios. Track your progress and compete with the community."
            estimatedDate="Q2 2026"
            features={[
                {
                    icon: Target,
                    title: "Skill-Based Challenges",
                    description: "Practice problems organized by difficulty and topic"
                },
                {
                    icon: Trophy,
                    title: "Leaderboards",
                    description: "Compete with developers worldwide"
                },
                {
                    icon: Code2,
                    title: "Real-World Problems",
                    description: "Solve challenges based on actual industry scenarios"
                }
            ]}
        />
    );
}
