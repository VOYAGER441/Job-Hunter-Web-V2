import React from 'react'
import { FocusCards } from "@/components/ui/focus-cards";
import { PricingPlan } from '@/interface/response/product.response';



export const pricingPlans: PricingPlan[] = [
    {
        name: "Starter",
        credits: 50,
        price: "$9",
        pricePerCredit: "$0.18/credit",
        features: [
            "~10 resume generations",
            "~25 auto-applies",
            "Credits never expire",
            "Basic resume templates",
            "Standard job matching",
            "Email support",
        ],
        cta: "Buy credits",
    },
    {
        name: "Growth",
        credits: 250,
        price: "$29",
        pricePerCredit: "$0.12/credit",
        features: [
            "~50 resume generations",
            "~125 auto-applies",
            "Credits never expire",
            "AI-tailored templates",
            "Smart job matching",
            "Priority support",
            "Cover letter generation",
        ],
        cta: "Buy credits",
        highlighted: true,
    },
    {
        name: "Power",
        credits: 600,
        price: "$59",
        pricePerCredit: "$0.10/credit",
        features: [
            "~120 resume generations",
            "~300 auto-applies",
            "Credits never expire",
            "All premium templates",
            "Advanced job matching",
            "Dedicated support",
            "Cover letter generation",
            "1-on-1 resume review",
            "Interview prep resources",
        ],
        cta: "Buy credits",
    },
];

export default function PricingCard() {
    return (
        <FocusCards plans={pricingPlans} />
    )
}
