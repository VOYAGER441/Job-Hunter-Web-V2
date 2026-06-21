export interface PricingPlan {
  name: string;
  credits: number;
  price: string;
  pricePerCredit: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}