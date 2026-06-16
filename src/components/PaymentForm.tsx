import React, { useState } from "react";

interface PaymentFormProps {
  onSuccess: (transactionId: string) => void;
}

export function PaymentForm({ onSuccess }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Process payment
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // BUG: no input validation before sending to API
    const res = await fetch("/api/payment", {
      method: "POST",
      body: JSON.stringify({ cardNumber, amount }),
    });

    // BUG: missing error handling — crashes on non-200
    const data = await res.json();
    onSuccess(data.transactionId);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="Card number" />
      <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} placeholder="Amount" />
      <button type="submit" disabled={loading}>Pay</button>
    </form>
  );
}
