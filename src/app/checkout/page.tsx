"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import orderService from "@/service/order.service";
import userService from "@/service/user.service";
import AuthGuard from "@/components/AuthGuard";
import { getCheckoutData, clearCheckoutData, CheckoutData } from "@/utils/checkoutStorage";
import { IUserResponse } from "@/interface/response/user.response";
import { Check, ArrowLeft, CreditCard, Shield, Zap } from "lucide-react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

function getInitialCheckoutData(): CheckoutData | null {
  if (typeof window === "undefined") return null;
  return getCheckoutData();
}

export default function CheckoutPage() {
  const router = useRouter();
  const [checkoutData] = useState<CheckoutData | null>(getInitialCheckoutData);
  const [user, setUser] = useState<IUserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  useEffect(() => {
    if (!checkoutData) {
      router.push("/plan-billing");
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await userService.currentUser();
        setUser(userData);
      } catch {
        router.push("/login");
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUser();
  }, [checkoutData, router]);

  const handlePurchase = async () => {
    if (!checkoutData) return;
    setIsLoading(true);
    try {
      const orderData = await orderService.createOrder(checkoutData.sku);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: "Job Hunter",
        description: `${checkoutData.name} - ${checkoutData.credits} credits`,
        order_id: orderData.razorpayOrderId,
        handler: async (response: Record<string, string>) => {
          try {
            const verificationData = await orderService.verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );

            clearCheckoutData();
            toast.success(
              `Payment successful! ${verificationData.creditsAdded} credits added.`
            );
            router.push("/checkout/success");
          } catch {
            toast.error("Payment verification failed. Please contact support.");
            router.push("/checkout/failure");
          }
        },
        prefill: {
          name: user?.userName || "",
          email: user?.email || "",
          contact: "",
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch {
      toast.error("Failed to create order. Please try again.");
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    clearCheckoutData();
    router.push("/plan-billing");
  };

  if (isLoadingUser || !checkoutData) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
          <div className="animate-pulse text-text-secondary">Loading...</div>
        </div>
      </AuthGuard>
    );
  }

  const price = currency === "INR" ? checkoutData.priceINR : checkoutData.priceUSD;
  const symbol = currency === "INR" ? "₹" : "$";

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#0A0A0B] py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to plans
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-[#141416] border border-[#27272A] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Order Summary
              </h2>

              <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#27272A]">
                <div>
                  <h3 className="text-xl font-bold text-text-primary">
                    {checkoutData.name}
                  </h3>
                  <p className="text-text-secondary mt-1">
                    {checkoutData.credits} credits
                  </p>
                </div>
                {checkoutData.popular && (
                  <span className="bg-[#6366F1] text-white text-xs px-3 py-1 rounded-full">
                    Popular
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {checkoutData.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#6366F1] mt-0.5 shrink-0" />
                    <span className="text-sm text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#1C1C1F] rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-[#6366F1]" />
                  <span className="text-sm font-medium text-text-primary">
                    What you get
                  </span>
                </div>
                <ul className="text-sm text-text-secondary space-y-2 ml-8">
                  <li>• Instant credit delivery</li>
                  <li>• Credits never expire</li>
                  <li>• Access to all features</li>
                </ul>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-[#141416] border border-[#27272A] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Payment Details
              </h2>

              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setCurrency("INR")}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                    currency === "INR"
                      ? "bg-[#6366F1] text-white"
                      : "bg-[#1C1C1F] text-text-secondary hover:text-text-primary border border-[#27272A]"
                  }`}
                >
                  INR (₹)
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                    currency === "USD"
                      ? "bg-[#6366F1] text-white"
                      : "bg-[#1C1C1F] text-text-secondary hover:text-text-primary border border-[#27272A]"
                  }`}
                >
                  USD ($)
                </button>
              </div>

              <div className="bg-[#1C1C1F] rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="text-text-primary font-medium">
                    {symbol}{price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-text-secondary">Tax</span>
                  <span className="text-text-primary font-medium">
                    {symbol}0.00
                  </span>
                </div>
                <div className="border-t border-[#27272A] pt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-text-primary">Total</span>
                  <span className="text-2xl font-bold text-[#6366F1]">
                    {symbol}{price.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                disabled={isLoading}
                className="w-full py-4 bg-[#6366F1] hover:bg-[#818CF8] text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {isLoading ? "Processing..." : "Pay Now"}
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-text-secondary text-sm">
                <Shield className="w-4 h-4" />
                Secured by Razorpay
              </div>

              <p className="text-center text-text-secondary text-xs mt-4">
                By completing this purchase, you agree to our Terms of Service
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
