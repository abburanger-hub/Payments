import { useState, useEffect } from "react";

export type PaymentStatus = "pending" | "success" | "failed" | "unknown";

export function usePaymentStatus(transactionId: string, pollIntervalMs = 2000) {
  const [status, setStatus] = useState<PaymentStatus>("pending");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<PaymentStatus[]>([]);

  useEffect(() => {
    if (!transactionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status/${transactionId}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch payment status: ${res.status}`);
        }
        const data = await res.json();
        setStatus(data.status);
        setHistory((prevHistory) => [...prevHistory, data.status]);

        if (data.status === "success" || data.status === "failed") {
          clearInterval(interval);
        }
      } catch (err) {
        setError(`Failed to fetch payment status: ${err.message}`);
      }
    }, pollIntervalMs);

    return () => clearInterval(interval);
  }, [transactionId, pollIntervalMs]);

  return { status, error, history };
}