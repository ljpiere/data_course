import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { getArticleData, getSortedArticlesData } from "@/lib/articles";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    const articles = getSortedArticlesData();
    return articles.map((article: any) => ({
        slug: article.id,
    }));
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;

    let articleData;
    try {
        articleData = getArticleData(slug);
    } catch (e) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link href="/articles" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Articles
            </Link>

            <article className="prose lg:prose-xl max-w-none bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{articleData.title}</h1>
                <div className="flex items-center gap-2 text-gray-500 mb-8 pb-8 border-b border-gray-100">
                    <Calendar className="w-5 h-5" />
                    {articleData.date}
                </div>

                <div className="whitespace-pre-wrap font-sans text-gray-800">
                    {/* Simple markdown rendering without external lib for simplicity */}
                    {articleData.content}
                </div>
            </article>
        </div>
    );
}
