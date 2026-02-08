"use client";

export default function JazzTestLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-2xl font-bold mb-4 text-purple-400">Jazz Integration Sandbox</h1>
            <div className="border border-purple-500/30 rounded-lg p-6 bg-black/20">
                {children}
            </div>
        </div>
    );
}
