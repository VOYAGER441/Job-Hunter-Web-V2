const USD_TO_INR_RATE = 83.5;

export function formatUSD(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatINR(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export function usdToInr(usdAmount: number): number {
  return usdAmount * USD_TO_INR_RATE;
}

export function inrToUsd(inrAmount: number): number {
  return inrAmount / USD_TO_INR_RATE;
}
