import Link from 'next/link';
import { Sprint } from '@/types/course';
import { ArrowRight, BookOpen, Code } from 'lucide-react';

interface SprintCardProps {
    sprint: Sprint;
}

export default function SprintCard({ sprint }: SprintCardProps) {
    const practicalCount = sprint.webinars.filter(w => w.type === 'Practical').length;
    const theoreticalCount = sprint.webinars.filter(w => w.type === 'Theoretical').length;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6 flex flex-col h-full">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{sprint.title}</h3>
                <p className="text-sm text-gray-500">{sprint.webinars.length} Webinars</p>
            </div>

            <div className="flex gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span>{theoreticalCount} Theory</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-green-500" />
                    <span>{practicalCount} Practice</span>
                </div>
            </div>

            <div className="mt-auto">
                <Link
                    href={`/sprints/${sprint.id}`}
                    className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors gap-2"
                >
                    View Content
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
