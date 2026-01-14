import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { getSortedArticlesData } from "@/lib/articles";

export default function ArticlesPage() {
    const articles = getSortedArticlesData();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Link href="/" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Articles & Tutorials</h1>
                <p className="text-gray-500 mt-2">Supplementary reading and guides.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article: any) => (
                    <Link key={article.id} href={`/articles/${article.id}`} className="block group">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow h-full">
                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                {article.title}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                <Calendar className="w-4 h-4" />
                                {article.date}
                            </div>
                            <p className="text-gray-600 line-clamp-3">
                                {article.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
