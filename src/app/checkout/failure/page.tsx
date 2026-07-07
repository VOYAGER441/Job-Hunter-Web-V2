"use client";

import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

export default function CheckoutFailurePage() {
  const router = useRouter();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-base flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <XCircle className="w-20 h-20 text-error mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Payment Failed
          </h1>
          <p className="text-text-secondary mb-8">
            Something went wrong with your payment. Please try again or contact support.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/checkout")}
              className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-xl transition-all duration-300"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-surface hover:bg-elevated text-text-primary font-semibold rounded-xl border border-border transition-all duration-300"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}