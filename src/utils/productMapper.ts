import { IProduct } from "@/interface/response/product.response";

export interface MappedProduct {
  id: string;
  sku: string;
  name: string;
  credits: number;
  priceINR: number;
  priceUSD: number;
  pricePerCreditINR: number;
  pricePerCreditUSD: number;
  popular: boolean;
  isFree: boolean;
  features: string[];
  isActive: boolean;
}

export function mapProduct(product: IProduct): MappedProduct {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    credits: product.credits,
    priceINR: product.price.INR,
    priceUSD: product.price.USD,
    pricePerCreditINR: product.price.INR / product.credits,
    pricePerCreditUSD: product.price.USD / product.credits,
    popular: product.popular,
    isFree: product.isFree,
    features: product.features,
    isActive: product.isActive,
  };
}

export function mapProducts(products: IProduct[]): MappedProduct[] {
  return products.map(mapProduct);
}
