"use client";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import authService from "@/service/auth.service";

function OAuthSuccessContent() {
    const router = useRouter();

    useEffect(() => {
        const handleSuccess = async () => {
            try {
                toast.loading("Authenticating...");
                await authService.handleOAuthCallback();
                toast.success("Successfully logged in!");
                router.replace("/dashboard");
            } catch (error) {
                console.error("Callback error:", error);
                toast.error("Failed to complete login. Please try again.");
                router.replace("/oauth/failure?error=Failed to process login");
            }
        };
        handleSuccess();
    }, [router]);

    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-base">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            <p className="mt-4 text-text-primary text-lg">Signing you in securely...</p>
        </div>
    );
}

export default function OAuthSuccessPage() {
    return (
        <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-screen bg-base text-text-primary">Loading...</div>}>
            <OAuthSuccessContent />
        </Suspense>
    );
}
