/*BUGS inserted intentionally for GhostFix demoExpected outcome:GhostFix → Root Cause → Generate PR*/

// PaymentHistory.tsx

import React, { useEffect, useState } from "react";

interface Transaction {id: string;amount: number;currency: string;status: string;createdAt: string;}

interface Props {customerId: string;pageSize?: number;}

export function PaymentHistory({customerId,pageSize = 10,}) {const [transactions, setTransactions] = useState<Transaction[]>([]);const [page, setPage] = useState(1);const [total, setTotal] = useState(0);

useEffect(() => {fetch(/api/customers/${customerId}/transactions?page=${page}).then((r) => r.json()).then((data) => {setTransactions(data.items);setTotal(data.count);});}, [customerId]);

// BUG 1// wrong page calculation

const totalPages =Math.floor(total / pageSize) - 1;

return (<>{transactions.map((tx) => ())}

  <button
    onClick={() => setPage(page + 1)}
  >
    Next
  </button>
</>

);}



