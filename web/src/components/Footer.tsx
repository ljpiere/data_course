export default function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-base text-slate-500">
                    &copy; {new Date().getFullYear()} Data Analytics Course. Built for students.
                </p>
            </div>
        </footer>
    );
}
