import React, { useMemo, useState } from "react";
import AddTransaction from "../components/transaction/AddTransaction";
import TransactionList from "../components/transaction/TransactionList";

/*
 * BACKEND INTEGRATION NOTES
 * GET    /api/transactions
 * POST   /api/transactions
 *
 * Keep the current transaction field names so the backend can replace
 * SEED_DATA without changing the UI components.
 */
const SEED_DATA = [
  {
    id: 1,
    transaction_type: "INCOME",
    category: "OTHER",
    from_account: null,
    to_account: { id: 3, name: "CB Bank" },
    amount: 1500000,
    note: "Monthly salary deposit",
    createdDate: "2026-11-22",
    createdTime: "09:00 AM"
  },
  {
    id: 2,
    transaction_type: "EXPENSE",
    category: "HOUSING",
    from_account: { id: 1, name: "KBZPay" },
    to_account: null,
    amount: 320000,
    note: "Monthly room rent",
    createdDate: "2026-11-21",
    createdTime: "01:45 PM"
  },
  {
    id: 3,
    transaction_type: "EXPENSE",
    category: "GROCERIES",
    from_account: { id: 4, name: "Cash" },
    to_account: null,
    amount: 65000,
    note: "Groceries & fresh market",
    createdDate: "2026-11-20",
    createdTime: "04:20 PM"
  },
  {
    id: 4,
    transaction_type: "TRANSFER",
    category: "OTHER",
    from_account: { id: 3, name: "CB Bank" },
    to_account: { id: 1, name: "KBZPay" },
    amount: 200000,
    note: "Wallet top-up",
    createdDate: "2026-11-19",
    createdTime: "10:15 AM"
  },
  {
    id: 5,
    transaction_type: "EXPENSE",
    category: "TRANSPORATION",
    from_account: { id: 1, name: "KBZPay" },
    to_account: null,
    amount: 34000,
    note: "Daily commute & fuel",
    createdDate: "2026-11-18",
    createdTime: "06:10 PM"
  },
  {
    id: 6,
    transaction_type: "SUBSCRIPTION",
    category: "ENTERTAINMENT",
    from_account: { id: 1, name: "KBZPay" },
    to_account: null,
    amount: 28000,
    note: "Streaming & cloud plan",
    createdDate: "2026-11-17",
    createdTime: "08:30 AM"
  }
];

const formatMMK = (value) => `${Number(value || 0).toLocaleString()} MMK`;

const TransactionPage = () => {
  const [transactions, setTransactions] = useState(SEED_DATA);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const totals = useMemo(() => {
    const sum = (type) =>
      transactions
        .filter((item) => item.transaction_type === type)
        .reduce((total, item) => total + Number(item.amount || 0), 0);

    const income = sum("INCOME");
    const expense = sum("EXPENSE");
    const subscription = sum("SUBSCRIPTION");
    const transfer = sum("TRANSFER");
    const totalOutflow = expense + subscription;

    return {
      income,
      totalOutflow,
      transfer,
      totalMovement: income + totalOutflow + transfer,
      recordCount: transactions.length
    };
  }, [transactions]);

  // Frontend demo handler. Replace with POST API when backend is ready.
  const handleAdd = (item) => {
    setTransactions((current) => [item, ...current]);
    setIsAddOpen(false);
  };

  return (
    <main className="container-fluid bb-tx-wrap">
      <section className="bb-tx-hero mb-4">
        <div className="bb-tx-heading">
          <span className="bb-tx-eyebrow">BUDGETBEE / FINANCE OVERVIEW</span>
          <h1 className="bb-tx-title mb-2">Transactions</h1>
          <p className="bb-tx-description mb-0">
            Keep track of every income, expense, transfer and subscription.
          </p>
        </div>

        <div className="bb-tx-hero-actions">
          <span className="bb-record-count">
            <span className="bb-status-dot" />
            {totals.recordCount} records
          </span>
          <button
            type="button"
            className="btn-gold bb-add-transaction-btn"
            onClick={() => setIsAddOpen((open) => !open)}
            aria-expanded={isAddOpen}
          >
            <span className="bb-btn-plus">{isAddOpen ? " ×" : "+"}</span>
            {isAddOpen ? "Close Transaction" : "Add Transaction"}
          </button>
        </div>
      </section>

      <AddTransaction
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddTransaction={handleAdd}
      />

      <section className="row g-3 bb-tx-kpi-row mb-4" aria-label="Transaction summary">
        <div className="col-12 col-md-6 col-xl-4">
          <article className="bb-kpi-box bb-kpi-gold-card">
            <div className="bb-kpi-topline bb-kpi-topline-gold" />
            <div className="bb-kpi-heading">
              <span className="bb-kpi-icon bb-kpi-icon-gold">↗</span>
              <span className="bb-meta-tag">Total Transaction</span>
              <span className="bb-kpi-chip">MMK</span>
            </div>
            <div className="bb-kpi-num bb-kpi-num-gold">{formatMMK(totals.totalMovement)}</div>
            <p className="bb-kpi-foot mb-0">
              Includes income, outflow and transfers
            </p>
          </article>
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <article className="bb-kpi-box">
            <div className="bb-kpi-topline bb-kpi-topline-income" />
            <div className="bb-kpi-heading">
              <span className="bb-kpi-icon bb-kpi-icon-income">＋</span>
              <span className="bb-meta-tag">Total Income</span>
              <span className="bb-kpi-chip bb-kpi-chip-income">INCOME</span>
            </div>
            <div className="bb-kpi-num bb-amt-in">+{formatMMK(totals.income)}</div>
            <p className="bb-kpi-foot mb-0">Money received into your accounts</p>
          </article>
        </div>

        <div className="col-12 col-md-6 col-xl-4">
          <article className="bb-kpi-box">
            <div className="bb-kpi-topline bb-kpi-topline-expense" />
            <div className="bb-kpi-heading">
              <span className="bb-kpi-icon bb-kpi-icon-expense">−</span>
              <span className="bb-meta-tag">Total Expenses</span>
              <span className="bb-kpi-chip bb-kpi-chip-expense">OUTFLOW</span>
            </div>
            <div className="bb-kpi-num bb-amt-out">-{formatMMK(totals.totalOutflow)}</div>
            <p className="bb-kpi-foot mb-0">Expenses and subscriptions</p>
          </article>
        </div>
      </section>

      <TransactionList transactions={transactions} />
    </main>
  );
};

export default TransactionPage;
