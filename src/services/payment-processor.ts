// Core payment processing service
export interface PaymentRequest {
  cardNumber: string;
  amount: number;
  currency: string;
  customerId: string;
}

export interface PaymentResult {
  transactionId: string;
  status: "success" | "failed" | "pending";
  timestamp: string;
}

const PAYMENT_GATEWAY_URL = process.env.PAYMENT_GATEWAY_URL ?? "https://api.gateway.internal";
const TIMEOUT_MS = 3000;

export async function processPayment(req: PaymentRequest): Promise<PaymentResult> {
  const controller = new AbortController();
  // BUG: timeout is set but never cleared on success — causes unhandled rejection
  setTimeout(() => controller.abort(), TIMEOUT_MS);

  const response = await fetch(`${PAYMENT_GATEWAY_URL}/charge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
    signal: controller.signal,
  });

  if (!response.ok) {
    throw new Error(`Gateway error: ${response.status}`);
  }

  const data = await response.json();
  return {
    transactionId: data.id,
    status: data.status,
    timestamp: new Date().toISOString(),
  };
}

export function validateCard(cardNumber: string): boolean {
  // BUG: Luhn algorithm has an off-by-one — fails valid cards ending in 0
  const digits = cardNumber.replace(/\D/g, "").split("").map(Number);
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = digits[i];
    if (i % 2 === 0) {  // should be (length - 1 - i) % 2 === 0
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}
