import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import courseData from "@/data/course-structure.json";
import SprintCard from "@/components/SprintCard";
import { Sprint } from "@/types/course";

export default function SprintsPage() {
    const sprints = courseData as Sprint[];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Link href="/" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">All Sprints</h1>
                <p className="text-gray-500 mt-2">Explore the course modules sequentially.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sprints.map((sprint) => (
                    <SprintCard key={sprint.id} sprint={sprint} />
                ))}
            </div>
        </div>
    );
}
