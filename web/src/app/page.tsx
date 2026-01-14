import Link from "next/link";
import { ArrowRight } from "lucide-react";
import courseData from "@/data/course-structure.json";
import SprintCard from "@/components/SprintCard";
import { Sprint } from "@/types/course";

export default function Home() {
  const sprints = courseData as Sprint[];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl mb-6">
              Data Analytics <span className="text-blue-500">Course Matrix</span>
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl">
              Access all sprints, webinars, and practical notebooks in one place.
              Master Python, Data Analysis, and Visualization.
            </p>
            <div className="flex gap-4">
              <Link href="/sprints" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500">
                Start Learning
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/articles" className="inline-flex items-center justify-center px-6 py-3 border border-slate-700 shadow-sm text-base font-medium rounded-md text-slate-300 bg-slate-800 hover:bg-slate-700">
                Read Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sprints Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Recent Sprints</h2>
          <Link href="/sprints" className="text-blue-400 font-medium hover:text-blue-300 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sprints.slice(0, 3).map((sprint) => (
            <SprintCard key={sprint.id} sprint={sprint} />
          ))}
        </div>
      </section>
    </div>
  );
}
