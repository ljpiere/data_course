export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-base text-gray-400">
                    &copy; {new Date().getFullYear()} Data Analytics Course. Built for students.
                </p>
            </div>
        </footer>
    );
}
