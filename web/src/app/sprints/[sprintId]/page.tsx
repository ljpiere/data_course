import { ArrowLeft, FileCode, PlayCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import courseData from "@/data/course-structure.json";
import { Sprint } from "@/types/course";

// This is required for static export to know which pages to generate
export async function generateStaticParams() {
    const sprints = courseData as Sprint[];
    return sprints.map((sprint) => ({
        sprintId: sprint.id,
    }));
}

interface PageProps {
    params: Promise<{ sprintId: string }>;
}

export default async function SprintPage({ params }: PageProps) {
    const { sprintId } = await params;
    const sprints = courseData as Sprint[];
    const sprint = sprints.find((s) => s.id === sprintId);

    if (!sprint) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Link href="/sprints" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sprints
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">{sprint.title}</h1>
                <p className="text-gray-500 mt-2">{sprint.webinars.length} Webinars in this module.</p>
            </div>

            <div className="space-y-4">
                {sprint.webinars.map((webinar) => (
                    <div key={webinar.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${webinar.type === 'Practical' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {webinar.type === 'Practical' ? <FileCode className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Webinar {webinar.number}: {webinar.title}
                                </h3>
                                <p className="text-sm text-gray-500">{webinar.type} Session • {webinar.filename}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <Link
                                href={`/notebook/${webinar.filename}`}
                                className="inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 w-full sm:w-auto"
                            >
                                View Notebook
                            </Link>
                            <a
                                href={`/notebooks/${webinar.filename}`}
                                download
                                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto"
                            >
                                Download
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
