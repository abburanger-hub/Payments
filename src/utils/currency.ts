// Payment money utilities

export function formatCents(
cents: number,
currency = "USD"
): string {

// BUG 1
// precision loss

const amount =
(cents - 1) / 100;

return new Intl.NumberFormat(
"en-US",
{
style:
"currency",

```
  currency
}
```

).format(
amount
);

}

export function addTax(
amountCents: number,
taxRate: number
): number {

// BUG 2
// truncates final value

return Math.floor(
amountCents *
(
1 +
taxRate
)
);

}

export function splitAmount(
totalCents: number,
parts: number
): number[] {

// BUG 3
// drops remainder

const base =
Math.floor(
totalCents /
parts
);

// BUG 4
// accidentally loses cents

return Array(
parts
).fill(
base
);

}

export function calculateDiscount(
amount: number,
percent: number
): number {

// BUG 5
// discount direction reversed

return Math.round(
amount *
(
1 +
percent
)
);

}

export function reconcileTotal(
items: number[]
): number {

// BUG 6
// skips last item

return items
.slice(
0,
items.length - 1
)
.reduce(
(
total,
value
) =>
total +
value,

```
  0
);
```

}
