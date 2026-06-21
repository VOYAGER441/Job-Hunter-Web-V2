// components/ui/focus-cards.tsx
"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { PricingPlan } from "@/interface/response/product.response";


// components/ui/focus-cards.tsx
export const FocusCard = React.memo(
  ({
    plan,
    index,
    hovered,
    setHovered,
  }: {
    plan: PricingPlan;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-2xl relative backdrop-blur-xl border w-full h-full transition-all duration-300 ease-out p-8 flex flex-col justify-between cursor-pointer text-text-primary",
        plan.highlighted
          ? "bg-white/15 border-accent ring-1 ring-accent/40 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]"
          : "bg-white/10 border-white/20",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98] opacity-60"
      )}
    >
      {plan.highlighted && (
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-hover text-xs font-semibold px-3 py-1 rounded-full z-10 whitespace-nowrap">
            Most popular
          </span>
      )}

      <div className={plan.highlighted ? "mt-2" : ""}>
        <h3 className={cn("text-2xl font-bold mb-1", plan.highlighted && "text-accent")}>
          {plan.name}
        </h3>

        <div className="flex items-baseline gap-2 mt-4 mb-1">
          <span className="text-4xl font-extrabold">{plan.credits}</span>
          <span className="text-sm font-medium text-text-primary/60">credits</span>
        </div>

        <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-white/10">
          <span className="text-xl font-bold">{plan.price}</span>
          <span className="text-xs text-text-primary/50">({plan.pricePerCredit})</span>
        </div>

        <ul className="text-left space-y-3 text-text-primary/80">
          {plan.features.map((f) => (
            <li key={f}>✓ {f}</li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className={cn(
          "w-full mt-6 py-3 rounded-full transition border font-medium",
          plan.highlighted
            ? "bg-accent hover:bg-accent-hover text-base border-transparent shadow-lg shadow-accent/30"
            : "bg-white/20 hover:bg-white/30 border-white/10 text-text-primary"
        )}
      >
        {plan.cta}
      </button>
    </div>
  )
);
FocusCard.displayName = "FocusCard";

export function FocusCards({ plans }: { plans: PricingPlan[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex flex-nowrap items-stretch gap-8 ">
      {plans.map((plan, index) => (
        <div key={plan.name} className="flex-1 min-w-[300px] flex">
          <FocusCard plan={plan} index={index} hovered={hovered} setHovered={setHovered} />
        </div>
      ))}
    </div>
  );
}