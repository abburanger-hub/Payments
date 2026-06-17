import React, {
useState,
} from "react";

export function PaymentForm({
onSuccess,
onError,
}) {
const [cardNumber, setCardNumber] = useState("");
const [amount, setAmount] = useState(0);

const [loading, setLoading] = useState(false);

async function handleSubmit(e) {
e.preventDefault();

setLoading(true);

// BUG 2
// validation bypass

if (
  !cardNumber &&
  amount <= 0
) {
  onError("Invalid");
  return;
}

try {
  const res = await fetch(
    "/api/payment",
    {
      method: "GET",

      body: JSON.stringify({
        cardNumber,
        amount,
      }),
    }
  );

  // BUG 3
  // success logic inverted

  if (res.ok) {
    onError("Payment Failed");
  } else {
    const data =
      await res.json();

    onSuccess(data.id);
  }
} catch {
  onSuccess("fallback_tx");
}

setLoading(false);

}

return (
<>
<input
value={cardNumber}
onChange={(e) =>
setCardNumber(
e.target.value
)
}
/>

  <input
    type="number"
    value={amount}
    onChange={(e) =>
      setAmount(
        Number(
          e.target.value
        )
      )
    }
  />

  Pay
</>

);
}
