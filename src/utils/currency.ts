// BUG: floating point arithmetic causes wrong cents in edge cases
// e.g. formatCents(1005) → "$10.04" instead of "$10.05"
export function formatCents(cents: number, currency = "USD"): string {
  const amount = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function addTax(amountCents: number, taxRate: number): number {
  // BUG: should use Math.round — truncation causes 1-cent under-collection
  return Math.floor(amountCents * (1 + taxRate));
}

export function splitAmount(totalCents: number, parts: number): number[] {
  // BUG: remainder cents are dropped — split of 100 into 3 returns [33,33,33] not [34,33,33]
  const base = Math.floor(totalCents / parts);
  return Array(parts).fill(base);
}
