import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTransactions,
  addTransaction,
} from "../reducers/TransactionSlice";
import { fetchAccounts } from "../reducers/AccountSlice";
import AddTransaction from "../components/transaction/AddTransaction";
import TransactionList from "../components/transaction/TransactionList";

const formatMMK = (value) => `${Number(value || 0).toLocaleString()} MMK`;

const TransactionPage = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.items || []);
  const transactionLoading = useSelector((state) => state.transactions.loading);
  const transactionError = useSelector((state) => state.transactions.error);
  const accounts = useSelector((state) => state.accounts.items || []);
  const accountLoading = useSelector((state) => state.accounts.loading);
  const accountError = useSelector((state) => state.accounts.error);
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchAccounts());
  }, [dispatch]);

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
      recordCount: transactions.length,
    };
  }, [transactions]);

  const handleAdd = async (item) => {
    try {
      await dispatch(addTransaction(item)).unwrap();
      setIsAddOpen(false);
      dispatch(fetchTransactions());
    } catch (error) {
      
    }
  };

  return (
    <div className="container-fluid bb-tx-wrap">
      
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
        accounts={accounts}
        accountLoading={accountLoading}
        accountError={accountError}
        transactionLoading={transactionLoading}
      />

      <section
        className="row g-3 bb-tx-kpi-row mb-4"
        aria-label="Transaction summary"
      >
        <div className="col-12 col-md-6 col-xl-4">
          <article className="bb-kpi-box bb-kpi-gold-card">
            <div className="bb-kpi-topline bb-kpi-topline-gold" />
            <div className="bb-kpi-heading">
              <span className="bb-kpi-icon bb-kpi-icon-gold">↗</span>
              <span className="bb-meta-tag">Total Transaction</span>
              <span className="bb-kpi-chip">MMK</span>
            </div>
            <div className="bb-kpi-num bb-kpi-num-gold">
              {formatMMK(totals.totalMovement)}
            </div>
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
            <div className="bb-kpi-num bb-amt-in">
              +{formatMMK(totals.income)}
            </div>
            <p className="bb-kpi-foot mb-0">
              Money received into your accounts
            </p>
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
            <div className="bb-kpi-num bb-amt-out">
              -{formatMMK(totals.totalOutflow)}
            </div>
            <p className="bb-kpi-foot mb-0">Expenses and subscriptions</p>
          </article>
        </div>
      </section>

      {transactionError && (
        <div className="bb-pf-feedback bb-pf-feedback-error" role="alert">
          {typeof transactionError === "string"
            ? transactionError
            : "Unable to load transactions."}
        </div>
      )}
      {transactionLoading && transactions.length === 0 ? (
        <div className="bb-panel p-4 text-center">Loading transactions...</div>
      ) : (
        <TransactionList transactions={transactions} />
      )}
    </div>
  );
};

export default TransactionPage;
