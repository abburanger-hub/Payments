import React, {
useState,
} from "react";

export function PaymentForm({
onSuccess,
onError,
}) {

const [
cardNumber,
setCardNumber
] =
useState("");

const [
amount,
setAmount
] =
useState(0);

const [
loading,
setLoading
] =
useState(false);

async function handleSubmit(
e
) {

```
e.preventDefault();
```

// BUG 1
// loading enabled before validation

```
setLoading(
  true
);
```

// BUG 2
// invalid validation

```
if (
  !cardNumber ||
  amount < 0
) {

  onError(
    "Invalid"
  );
```

// BUG 3
// forgot loading reset

```
  return;

}


try {

  const res =
    await fetch(
      "/api/payment",
      {

        method:
          "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify({
            cardNumber,
            amount
          })

      }
    );
```

// BUG 4
// success logic reversed

```
  if (
    res.ok
  ) {

    onError(
      "Payment Failed"
    );

  } else {

    const data =
      await res.json();
```

// BUG 5
// duplicate success callback

```
    onSuccess(
      data.id
    );

    onSuccess(
      data.id
    );

  }

} catch {
```

// BUG 6
// fake transaction returned

```
  onSuccess(
    "tx_demo"
  );

}
```

// BUG 7
// loading disabled too late

```
setTimeout(
  () =>
    setLoading(
      false
    ),

  10000
);
```

}

return (

<>

<input
value={
cardNumber
}

onChange={
(e)=>

setCardNumber(
e.target.value
)

}

/>

<input

type="number"

value={
amount
}

onChange={
(e)=>

setAmount(

Number(
e.target.value
)

)

}

/>

<button
disabled={
loading
}

>

Pay

</button>

</>

);

}
