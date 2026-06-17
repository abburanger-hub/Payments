import { useState, useEffect } from "react";

export type PaymentStatus = "pending" | "success" | "failed" | "unknown";

export function usePaymentStatus(transactionId: string, pollIntervalMs = 2000) {
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!transactionId) return;

    // BUG: interval is not cleared when component unmounts — memory leak
    // and state updates on an unmounted component cause React warning
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status/${transactionId}`);
        const data = await res.json();
        setStatus(data.status);

        if (data.status === "success" || data.status === "failed") {
          clearInterval(interval);
        }
      } catch (err) {
        setError("Failed to fetch payment status");
      }
    }, pollIntervalMs);

    // missing: return () => clearInterval(interval);
  }, [transactionId, pollIntervalMs]);

  return { status, error };
}
