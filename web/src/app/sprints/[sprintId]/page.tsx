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
                <Link href="/sprints" className="text-slate-400 hover:text-slate-100 flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sprints
                </Link>
                <h1 className="text-3xl font-bold text-slate-100">{sprint.title}</h1>
                <p className="text-slate-400 mt-2">{sprint.webinars.length} Webinars in this module.</p>
            </div>

            <div className="space-y-4">
                {sprint.webinars.map((webinar) => (
                    <div key={webinar.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${webinar.type === 'Practical' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                {webinar.type === 'Practical' ? <FileCode className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-100">
                                    Webinar {webinar.number}: {webinar.title}
                                </h3>
                                <p className="text-sm text-slate-400">{webinar.type} Session • {webinar.filename}</p>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <Link
                                href={`/notebook/${webinar.filename}`}
                                className="inline-flex items-center justify-center px-4 py-2 border border-blue-500 text-sm font-medium rounded-md text-blue-400 hover:text-white hover:bg-blue-600 transition-colors w-full sm:w-auto"
                            >
                                View Notebook
                            </Link>
                            <a
                                href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/notebooks/${webinar.filename}`}
                                download
                                className="inline-flex items-center justify-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 w-full sm:w-auto"
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
