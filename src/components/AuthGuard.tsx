"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");
            
            if (!accessToken || !refreshToken) {
                toast.error("Please log in to access the dashboard.");
                router.replace("/login");
            } else {
                setIsAuthenticated(true);
            }
        };

        checkAuth();
    }, [router]);

    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base text-text-primary">
                Loading...
            </div>
        );
    }

    return <>{children}</>;
}
