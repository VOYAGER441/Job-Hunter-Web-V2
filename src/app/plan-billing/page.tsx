"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import orderService from "@/service/order.service";
import AuthGuard from "@/components/AuthGuard";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { IUserResponse } from "@/interface/response/user.response";
import userService from "@/service/user.service";
import productService from "@/service/product.service";
import { MappedProduct, mapProducts } from "@/utils/productMapper";
import { formatUSD, formatINR } from "@/utils/currency";
import { Check } from "lucide-react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export default function PlanBillingPage() {
  const router = useRouter();
  const [user, setUser] = useState<IUserResponse | null>(null);
  const [products, setProducts] = useState<MappedProduct[]>([]);
  const [selectedPack, setSelectedPack] = useState<string>("");
  const selectedProduct = products.find((p) => p.sku === selectedPack);
  const isFreeProduct = selectedProduct?.isFree ?? false;
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, productsData] = await Promise.all([
          userService.currentUser(),
          productService.getProducts(),
        ]);
        setUser(userData);
        const mappedProducts = mapProducts(productsData);
        setProducts(mappedProducts);
        if (mappedProducts.length > 0) {
          const popularProduct = mappedProducts.find((p) => p.popular);
          setSelectedPack(popularProduct?.sku || mappedProducts[0].sku);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchData();
  }, []);

  const handlePurchase = async () => {
    if (!selectedPack) return;
    setIsLoading(true);
    try {
      const orderData = await orderService.createOrder(selectedPack);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: "Job Hunter",
        description: `Credit Pack Purchase`,
        order_id: orderData.razorpayOrderId,
        handler: async (response: Record<string, string>) => {
          try {
            const verificationData = await orderService.verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );

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

  const getPrice = (product: MappedProduct) => {
    if (currency === "INR") {
      return formatINR(product.priceINR);
    }
    return formatUSD(product.priceUSD);
  };

  const getPricePerCredit = (product: MappedProduct) => {
    if (currency === "INR") {
      return formatINR(product.pricePerCreditINR);
    }
    return formatUSD(product.pricePerCreditUSD);
  };

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar userData={user} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">Job Hunter</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Plan & Billing</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-text-secondary">
                  Choose Your Credit Pack
                </h1>
                <p className="text-text-secondary mt-1 text-sm sm:text-base">
                  Select a plan that fits your job search needs
                </p>
              </div>
              <div className="flex items-center gap-2 bg-surface p-1 rounded-lg border border-border">
                <button
                  onClick={() => setCurrency("INR")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currency === "INR"
                      ? "bg-[#6366F1] text-white"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  INR (₹)
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    currency === "USD"
                      ? "bg-[#6366F1] text-white"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            {isLoadingProducts ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse p-6 rounded-2xl border-2 border-border bg-surface">
                    <div className="h-6 bg-border rounded w-1/2 mb-4" />
                    <div className="h-8 bg-border rounded w-1/3 mb-4" />
                    <div className="h-4 bg-border rounded w-1/4 mb-4" />
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="h-4 bg-border rounded" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 max-w-6xl mx-auto w-full">
                {products.map((product) => (
                  <div
                    key={product.sku}
                    onClick={() => setSelectedPack(product.sku)}
                    className={`relative p-6 sm:p-8 lg:p-10 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedPack === product.sku
                        ? "border-[#6366F1] bg-[#6366F1]/10"
                        : "border-border bg-surface hover:border-border-hover"
                    } ${product.popular ? "ring-2 ring-[#6366F1]" : ""}`}
                  >
                    {product.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#6366F1] text-white text-xs px-3 py-1 rounded-full">
                        Popular
                      </div>
                    )}
                    <h3 className="text-xl sm:text-2xl font-bold text-text-secondary mb-2 sm:mb-3">
                      {product.name}
                    </h3>
                    <div className="mb-4 sm:mb-5">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#6366F1]">
                        {getPrice(product)}
                      </span>
                      <span className="text-text-secondary text-xs sm:text-sm ml-2">
                        ({getPricePerCredit(product)}/credit)
                      </span>
                    </div>
                    <p className="text-text-secondary mb-4 sm:mb-5 text-sm sm:text-base lg:text-lg">
                      {product.credits} credits
                    </p>
                    <ul className="space-y-2 sm:space-y-3">
                      {product.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm  text-text-secondary"
                        >
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#6366F1] mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handlePurchase}
                disabled={isLoading || !selectedPack || isLoadingProducts || isFreeProduct}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-[#6366F1] hover:bg-[#818CF8] text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : isFreeProduct ? "Not available for purchase" : "Purchase Now"}
              </button>
            </div>

            <p className="text-center text-text-secondary text-sm">
              Secure payment powered by Razorpay
            </p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
