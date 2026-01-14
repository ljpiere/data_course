import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import courseData from "@/data/course-structure.json";
import { Sprint } from "@/types/course";

// Generate params for all notebooks
export async function generateStaticParams() {
    const sprints = courseData as Sprint[];
    const params: { filename: string }[] = [];

    sprints.forEach(sprint => {
        sprint.webinars.forEach(webinar => {
            params.push({ filename: webinar.filename });
        });
    });

    return params;
}

interface PageProps {
    params: Promise<{ filename: string }>;
}

export default async function NotebookPage({ params }: PageProps) {
    const { filename } = await params;

    // Find metadata
    const decodingFilename = decodeURIComponent(filename);
    // Security check: simple path traversal prevention
    if (decodingFilename.includes('..') || decodingFilename.includes('/') || decodingFilename.includes('\\')) {
        notFound();
    }

    const filePath = path.join(process.cwd(), 'public', 'notebooks', decodingFilename);

    if (!fs.existsSync(filePath)) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-2xl font-bold text-red-600">Notebook not found</h1>
                <p className="mt-2">The file {decodingFilename} could not be found.</p>
                <Link href="/sprints" className="text-blue-600 mt-4 inline-block">Back to Sprints</Link>
            </div>
        );
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let notebook;
    try {
        notebook = JSON.parse(fileContent);
    } catch (e) {
        return <div className="p-8">Error parsing notebook JSON.</div>;
    }

    return (
        <div className="bg-white min-h-screen pb-12">
            {/* Header */}
            <div className="border-b border-gray-200 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <Link href="/sprints" className="text-gray-500 hover:text-gray-900 flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Course
                        </Link>
                        <a
                            href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/notebooks/${decodingFilename}`}
                            download
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                        >
                            <Download className="w-4 h-4" />
                            Download .ipynb
                        </a>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mt-4 break-all">{decodingFilename}</h1>
                </div>
            </div>

            {/* Notebook Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {notebook.cells?.map((cell: any, index: number) => (
                        <div key={index} className="notebook-cell">
                            {cell.cell_type === 'markdown' ? (
                                <div className="prose max-w-none text-gray-800 p-4 rounded-lg bg-transparent">
                                    {/* Basic markdown rendering - In production a library like react-markdown would be used */}
                                    {Array.isArray(cell.source)
                                        ? cell.source.join('').split('\n').map((line: string, i: number) => (
                                            <p key={i} className="min-h-[1em] whitespace-pre-wrap">{line}</p>
                                        ))
                                        : <p className="whitespace-pre-wrap">{cell.source}</p>}
                                </div>
                            ) : cell.cell_type === 'code' ? (
                                <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 text-xs font-mono text-gray-500 flex justify-between">
                                        <span>Code</span>
                                        {cell.execution_count && <span>[{cell.execution_count}]</span>}
                                    </div>
                                    <div className="p-4 overflow-x-auto">
                                        <pre className="text-sm font-mono text-gray-800">
                                            {Array.isArray(cell.source) ? cell.source.join('') : cell.source}
                                        </pre>
                                    </div>
                                    {/* Outputs could be rendered here but complex to do without a library */}
                                    {cell.outputs && cell.outputs.length > 0 && (
                                        <div className="border-t border-gray-200 p-4 bg-white">
                                            <div className="text-xs font-bold text-gray-500 mb-2 uppercase">Output</div>
                                            {cell.outputs.map((output: any, outIndex: number) => (
                                                <div key={outIndex} className="font-mono text-sm overflow-x-auto">
                                                    {output.text && <pre>{Array.isArray(output.text) ? output.text.join('') : output.text}</pre>}
                                                    {/* Handle other output types if needed */}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
