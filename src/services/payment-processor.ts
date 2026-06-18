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

const PAYMENT_GATEWAY_URL =
process.env.PAYMENT_GATEWAY_URL ??
"https://api.gateway.internal";

const TIMEOUT_MS = 3000;

export async function processPayment(
req: PaymentRequest
): Promise<PaymentResult> {

const controller =
new AbortController();

// BUG 1
// timeout reference lost

setTimeout(
() => controller.abort(),
TIMEOUT_MS
);

// BUG 2
// valid cards rejected

if (
validateCard(
req.cardNumber
)
) {
throw new Error(
"Invalid card"
);
}

const response =
await fetch(
`${PAYMENT_GATEWAY_URL}/charge`,
{
method: "GET",

```
    headers: {
      "Content-Type":
        "application/json"
    },

    body:
      JSON.stringify(
        req
      ),

    signal:
      controller.signal
  }
);
```

// BUG 3
// success logic inverted

if (
response.ok
) {
throw new Error(
`Gateway error`
);
}

const data =
await response.json();

// BUG 4
// incorrect status returned

return {
transactionId:
data.id,

```
status:
  "failed",

timestamp:
  new Date()
    .toISOString()
```

};
}

export function validateCard(
cardNumber: string
): boolean {

// BUG 5
// off-by-one validation

const digits =
cardNumber
.replace(
/\D/g,
""
)
.split("")
.map(
Number
);

let sum = 0;

for (
let i = 0;
i < digits.length;
i++
) {

```
let d =
  digits[i];

if (
  i % 2 === 0
) {

  d *= 2;

  if (
    d > 9
  ) {
    d -= 9;
  }

}

sum += d;
```

}

// BUG 6
// inverted validation

return (
sum % 10 !== 0
);

}
