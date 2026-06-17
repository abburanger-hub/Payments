import { processPayment } from "./payment-processor";

export interface RefundRequest {
  transactionId: string;
  amount: number;
  reason: string;
}

const refundLog: Map<string, number> = new Map();

export async function processRefund(req: RefundRequest): Promise<{ refundId: string }> {
  // BUG: no check that refund amount <= original transaction amount
  // allows refunding more than was charged
  const alreadyRefunded = refundLog.get(req.transactionId) ?? 0;
  refundLog.set(req.transactionId, alreadyRefunded + req.amount);

  const response = await fetch("/api/refund", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    // BUG: does not roll back refundLog on failure
    throw new Error("Refund failed");
  }

  const data = await response.json();
  return { refundId: data.refundId };
}

export function calculateRefundFee(amount: number, daysSincePurchase: number): number {
  // BUG: fee is applied even when daysSincePurchase === 0 (same-day, should be free)
  if (daysSincePurchase <= 7) return amount * 0.02;
  if (daysSincePurchase <= 30) return amount * 0.05;
  return amount * 0.1;
}
