import React, { useState } from "react";

interface PaymentFormProps {
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

export function PaymentForm({ onSuccess, onError }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Process payment
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Input validation before sending to API
    if (!cardNumber || amount <= 0) {
      onError("Invalid card number or amount");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        body: JSON.stringify({ cardNumber, amount }),
      });

      if (!res.ok) {
        if (res.status === 422) {
          const data = await res.json();
          onError(data.error);
        } else {
          onError("Failed to process payment");
        }
      } else {
        const data = await res.json();
        onSuccess(data.transactionId);
      }
    } catch (error) {
      onError("Failed to process payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="Card number" />
      <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} placeholder="Amount" />
      <button type="submit" disabled={loading}>Pay</button>
    </form>
  );
}