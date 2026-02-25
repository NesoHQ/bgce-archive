import { ComingSoon } from "@/components/shared/ComingSoon";
import { FolderGit2 } from "lucide-react";

export default function ProjectsPage() {
    return (
        <div className="min-h-screen">
            <ComingSoon
                title="Project Showcase"
                description="Discover and share real-world projects, explore open-source contributions, and collaborate with the developer community."
                icon={FolderGit2}
                estimatedDate="Q2 2024"
            />
        </div>
    );
}
