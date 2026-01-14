import Link from 'next/link';
import { BookOpen, Home, Layers } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="border-b border-gray-200 bg-white/75 backdrop-blur-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
                            <BookOpen className="h-6 w-6" />
                            <span>DataCourse</span>
                        </Link>
                    </div>
                    <div className="hidden sm:flex sm:gap-8">
                        <NavLink href="/" icon={<Home className="w-4 h-4" />}>Home</NavLink>
                        <NavLink href="/sprints" icon={<Layers className="w-4 h-4" />}>Sprints</NavLink>
                        <NavLink href="/articles" icon={<BookOpen className="w-4 h-4" />}>Articles</NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-2 px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900 border-b-2 border-transparent hover:border-blue-500 transition-colors"
        >
            {icon}
            {children}
        </Link>
    );
}
