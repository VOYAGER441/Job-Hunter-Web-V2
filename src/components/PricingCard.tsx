"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FocusCards } from "@/components/ui/focus-cards";

import productService from "@/service/product.service";
import { MappedProduct, mapProducts } from "@/utils/productMapper";
import { setCheckoutData } from "@/utils/checkoutStorage";

interface PricingCardProps {
  onBuy?: (sku: string) => void;
}

export default function PricingCard({ onBuy }: PricingCardProps) {
  const router = useRouter();
  const [products, setProducts] = useState<MappedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currency, setCurrency] = useState<"INR" | "USD">("USD");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await productService.getProducts();
        const mapped = mapProducts(productsData);
        setProducts(mapped);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const pricingPlans = useMemo(() => {
    return products.map((product) => {
      const price = currency === "INR" ? product.priceINR : product.priceUSD;
      const pricePerCredit = currency === "INR" ? product.pricePerCreditINR : product.pricePerCreditUSD;
      const symbol = currency === "INR" ? "₹" : "$";

      return {
        sku: product.sku,
        name: product.name,
        credits: product.credits,
        price: `${symbol}${price}`,
        pricePerCredit: `${symbol}${pricePerCredit.toFixed(2)}/credit`,
        features: product.features,
        cta: product.isFree ? "Get started" : "Buy credits",
        highlighted: product.popular,
        isFree: product.isFree,
      };
    });
  }, [products, currency]);

  const handleBuy = (sku: string) => {
    const product = products.find((p) => p.sku === sku);
    if (product) {
      setCheckoutData({
        sku: product.sku,
        name: product.name,
        credits: product.credits,
        priceINR: product.priceINR,
        priceUSD: product.priceUSD,
        features: product.features,
        popular: product.popular,
      });
    }

    if (onBuy) {
      onBuy(sku);
    } else {
      router.push("/checkout");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-nowrap items-stretch gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 min-w-[300px] flex">
            <div className="rounded-2xl relative backdrop-blur-xl border w-full h-full bg-white/10 border-white/20 p-8 animate-pulse">
              <div className="h-6 bg-white/20 rounded w-1/2 mb-4" />
              <div className="h-8 bg-white/20 rounded w-1/3 mb-4" />
              <div className="h-4 bg-white/20 rounded w-1/4 mb-6" />
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-4 bg-white/20 rounded" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-2 bg-white/10 p-1 rounded-lg border border-white/20">
          <button
            onClick={() => setCurrency("INR")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currency === "INR"
                ? "bg-[#6366F1] text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            INR (₹)
          </button>
          <button
            onClick={() => setCurrency("USD")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currency === "USD"
                ? "bg-[#6366F1] text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            USD ($)
          </button>
        </div>
      </div>
      <FocusCards plans={pricingPlans} onBuy={handleBuy} />
    </div>
  );
}
