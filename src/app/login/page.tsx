"use client";
import { useEffect } from 'react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import authService, { authProvider } from "@/service/auth.service";

export default function LoginPage() {
  const router = useRouter();
  
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      router.push("/dashboard");
    }
  }, []);
  const handleGoogleLogin = async () => {
    try {
      await authService.login(authProvider.GOOGLE);
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Failed to initiate Google login.");
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-base relative overflow-hidden min-h-screen p-4">
      {/* Subtle ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-surface/80 backdrop-blur-xl border border-border shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-10">
          {/* Logo Container - using white background to ensure dark logo is clearly visible on dark theme */}
          <div className="w-20 h-20 bg-white rounded-2xl p-2 shadow-[0_0_20px_rgba(99,102,241,0.15)] mb-6 flex items-center justify-center transform transition-all duration-300 hover:scale-105 hover:rotate-1">
            <Image
              src="/only_logo.png"
              alt="Job Hunter Logo"
              width={64}
              height={64}
              className="object-contain w-full h-full"
              priority
            />
          </div>

          <h1 className="text-3xl font-bold mb-2 tracking-tight text-text-primary">Welcome Back</h1>
          <p className="text-text-secondary text-sm  max-w-70">
            Log in to continue your job hunting journey
          </p>
        </div>

        <button
          className="w-full flex items-center justify-center gap-3 bg-elevated hover:bg-border transition-all duration-300 border border-border hover:border-accent/30 py-3.5 px-4 rounded-xl text-text-primary font-medium shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.1)]"
          type="button"
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="text-2xl" />
          <span>Continue with Google</span>
        </button>

        <div className="mt-10 text-center text-xs text-text-disabled leading-relaxed">
          <p>
            By continuing, you agree to our <br className="hidden sm:block" />
            <a href="#" className="underline hover:text-text-secondary transition-colors decoration-border hover:decoration-text-secondary">Terms of Service</a> and <a href="#" className="underline hover:text-text-secondary transition-colors decoration-border hover:decoration-text-secondary">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
