import React, { useEffect, useState } from "react";

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface Props {
  customerId: string;
  pageSize?: number;
}

export function PaymentHistory({ customerId, pageSize = 10 }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch(`/api/customers/${customerId}/transactions?page=${page}&limit=${pageSize}`)
      .then((r) => r.json())
      .then((data) => {
        setTransactions(data.transactions);
        setTotal(data.total);
      });
  }, [customerId, page, pageSize]);

  // BUG: totalPages rounds down — last page is never reachable when total
  // is not a multiple of pageSize (e.g. 21 items, pageSize 10 → shows 2 not 3)
  const totalPages = Math.floor(total / pageSize);

  return (
    <div>
      {transactions.map((tx) => (
        <div key={tx.id}>
          <span>{tx.id}</span>
          <span>{tx.amount} {tx.currency}</span>
          <span>{tx.status}</span>
          <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
        </div>
      ))}
      <div>
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
