import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import courseData from "@/data/course-structure.json";
import { Sprint } from "@/types/course";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';

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
    const filePath = path.join(process.cwd(), 'public', 'notebooks', decodingFilename);

    if (!fs.existsSync(filePath)) {
        return notFound();
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
                <div className="space-y-8">
                    {notebook.cells?.map((cell: any, index: number) => (
                        <div key={index} className="notebook-cell group">
                            {cell.cell_type === 'markdown' ? (
                                <div className="prose prose-slate max-w-none p-4 rounded-lg hover:bg-gray-50 transition-colors">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            // Handle images with base path if they are relative
                                            img: ({ node, src, ...props }) => {
                                                // If it's a relative path, we might have issues unless we handled it.
                                                // For now, let's just render using standard img. 
                                                // Ideally, we'd prefix with base path if it's local.
                                                return <img src={src} {...props} className="max-w-full h-auto rounded-lg shadow-sm" />;
                                            },
                                            table: ({ children }) => <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-300">{children}</table></div>
                                        }}
                                    >
                                        {Array.isArray(cell.source) ? cell.source.join('') : cell.source}
                                    </ReactMarkdown>
                                </div>
                            ) : cell.cell_type === 'code' ? (
                                <div className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
                                    {/* Input Area */}
                                    <div className="border-b border-gray-200 bg-gray-50 flex">
                                        <div className="w-16 flex-shrink-0 text-xs font-mono text-gray-400 p-2 text-right border-r border-gray-200 select-none bg-gray-100">
                                            In [{cell.execution_count || ' '}]:
                                        </div>
                                        <div className="flex-grow overflow-x-auto">
                                            <SyntaxHighlighter
                                                language="python"
                                                style={oneLight}
                                                customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                                                showLineNumbers={false}
                                            >
                                                {Array.isArray(cell.source) ? cell.source.join('') : cell.source}
                                            </SyntaxHighlighter>
                                        </div>
                                    </div>

                                    {/* Output Area */}
                                    {cell.outputs && cell.outputs.length > 0 && (
                                        <div className="bg-white border-t border-gray-100">
                                            {cell.outputs.map((output: any, outIndex: number) => (
                                                <div key={outIndex} className="flex border-b border-gray-100 last:border-0">
                                                    <div className="w-16 flex-shrink-0 text-xs font-mono text-red-400 p-2 text-right border-r border-gray-100 select-none">
                                                        {output.output_type === 'execute_result' ? `Out[${cell.execution_count}]:` : ''}
                                                    </div>
                                                    <div className="p-4 flex-grow overflow-x-auto font-mono text-sm">
                                                        {/* Text Output */}
                                                        {output.text && (
                                                            <pre className="whitespace-pre-wrap text-gray-700">
                                                                {Array.isArray(output.text) ? output.text.join('') : output.text}
                                                            </pre>
                                                        )}

                                                        {/* Error Output */}
                                                        {output.traceback && (
                                                            <div className="bg-red-50 text-red-900 p-2 rounded whitespace-pre-wrap">
                                                                {output.traceback.join('\n')}
                                                            </div>
                                                        )}

                                                        {/* Image Output (display_data or execute_result) */}
                                                        {output.data && (
                                                            <div>
                                                                {output.data['image/png'] && (
                                                                    <img
                                                                        src={`data:image/png;base64,${output.data['image/png'].replace(/\n/g, '')}`}
                                                                        alt="Output"
                                                                        className="max-w-full h-auto"
                                                                    />
                                                                )}
                                                                {output.data['image/jpeg'] && (
                                                                    <img
                                                                        src={`data:image/jpeg;base64,${output.data['image/jpeg'].replace(/\n/g, '')}`}
                                                                        alt="Output"
                                                                        className="max-w-full h-auto"
                                                                    />
                                                                )}
                                                                {output.data['text/html'] && (
                                                                    <div dangerouslySetInnerHTML={{ __html: Array.isArray(output.data['text/html']) ? output.data['text/html'].join('') : output.data['text/html'] }} />
                                                                )}
                                                                {output.data['text/plain'] && !output.data['image/png'] && !output.data['image/jpeg'] && !output.data['text/html'] && (
                                                                    <pre className="whitespace-pre-wrap text-gray-700">
                                                                        {Array.isArray(output.data['text/plain']) ? output.data['text/plain'].join('') : output.data['text/plain']}
                                                                    </pre>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
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
