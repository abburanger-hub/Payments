import crypto from "crypto";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ?? "";

export interface WebhookEvent {
  type: "payment.success" | "payment.failed" | "refund.created";
  data: Record<string, unknown>;
  timestamp: number;
}

export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  // BUG: uses == instead of timingSafeEqual — vulnerable to timing attacks
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");
  return signature === expected;
}

export async function handleWebhookEvent(event: WebhookEvent): Promise<void> {
  // BUG: no replay protection — same event can be processed multiple times
  // should check event.timestamp against current time and store seen event IDs
  switch (event.type) {
    case "payment.success":
      await markPaymentSuccess(event.data.transactionId as string);
      break;
    case "payment.failed":
      await markPaymentFailed(event.data.transactionId as string);
      break;
    case "refund.created":
      await recordRefund(event.data.refundId as string, event.data.amount as number);
      break;
  }
}

async function markPaymentSuccess(id: string) { console.log("paid", id); }
async function markPaymentFailed(id: string) { console.log("failed", id); }
async function recordRefund(id: string, amount: number) { console.log("refund", id, amount); }
