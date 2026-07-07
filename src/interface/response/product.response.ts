export interface IProductPrice {
  INR: number;
  USD: number;
}

export interface IProduct {
  id: string;
  sku: string;
  name: string;
  credits: number;
  price: IProductPrice;
  popular: boolean;
  isFree: boolean;
  features: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PricingPlan {
  sku: string;
  name: string;
  credits: number;
  price: string;
  pricePerCredit: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  isFree?: boolean;
}
