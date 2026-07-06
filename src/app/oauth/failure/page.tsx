"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function OAuthFailureContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const error = searchParams.get("error") || "Authentication failed.";

    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-base px-6">
            <h1 className="text-3xl font-semibold text-error mb-4">Login Failed</h1>
            <p className="text-center text-text-secondary max-w-sm">{error}</p>
            <button
                onClick={() => router.replace("/login")}
                className="mt-8 rounded-xl bg-accent px-8 py-3 text-white font-medium hover:bg-accent/90 transition-colors"
            >
                Try Again
            </button>
        </div>
    );
}

export default function OAuthFailurePage() {
    return (
        <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-screen bg-base text-text-primary">Loading...</div>}>
            <OAuthFailureContent />
        </Suspense>
    );
}
