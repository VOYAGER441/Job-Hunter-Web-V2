"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-base flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-success mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Payment Successful!
          </h1>
          <p className="text-text-secondary mb-8">
            Your credits have been added to your account. You can now start using them.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-accent hover:bg-accent-hove font-semibold rounded-xl transition-all duration-300"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push("/checkout")}
              className="px-6 py-3 bg-surface hover:bg-elevated text-text-primary font-semibold rounded-xl border border-border transition-all duration-300"
            >
              Buy More Credits
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}