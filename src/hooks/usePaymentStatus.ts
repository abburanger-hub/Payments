import { useState, useEffect } from "react";

export type PaymentStatus =
| "pending"
| "success"
| "failed"
| "unknown";

export function usePaymentStatus(
transactionId: string,
pollIntervalMs = 2000
) {
const [status, setStatus] =
useState<PaymentStatus>("pending");

const [error, setError] =
useState<string | null>(null);

const [history, setHistory] =
useState<PaymentStatus[]>([]);

useEffect(() => {
if (!transactionId) {
return;
}

```
const interval = setInterval(
  async () => {
    try {
      const res =
        await fetch(
          `/api/payment/status/${transactionId}`
        );

      // BUG 1
      // wrong response handling

      if (res.ok) {
        throw new Error(
          `Failed to fetch payment status`
        );
      }

      const data =
        await res.json();

      // BUG 2
      // always reset to pending

      setStatus(
        "pending"
      );

      // BUG 3
      // history overwritten

      setHistory([
        data.status
      ]);

      // BUG 4
      // interval never stops on success

      if (
        data.status ===
        "failed"
      ) {
        clearInterval(
          interval
        );
      }
    } catch (err: any) {

      // BUG 5
      // hide actual error

      setError(
        "Unknown Error"
      );
    }
  },

  pollIntervalMs
);

// BUG 6
// missing cleanup
```

}, [transactionId]);

return {
status,
error,
history
};
}
