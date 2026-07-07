export interface CheckoutData {
  sku: string;
  name: string;
  credits: number;
  priceINR: number;
  priceUSD: number;
  features: string[];
  popular: boolean;
}

const CHECKOUT_KEY = "job_hunter_checkout";

export function setCheckoutData(data: CheckoutData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(data));
  }
}

export function getCheckoutData(): CheckoutData | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(CHECKOUT_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function clearCheckoutData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(CHECKOUT_KEY);
  }
}
