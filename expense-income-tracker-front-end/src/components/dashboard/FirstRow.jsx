
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchTransactions } from "../../reducers/TransactionSlice";
import { fetchBudgets } from "../../reducers/BudgetSlice";

const formatMMK = (amount) =>
  `MMK ${Number(amount || 0).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;

// Parse LocalDate (yyyy-MM-dd) without UTC timezone shifting.
const parseLocalDate = (value) => {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
};

const getTransactionDate = (transaction) =>
  parseLocalDate(transaction.transactionDate);

const getTrend = (current, previous) => {
  if (previous === 0) return null;

  return ((current - previous) / previous) * 100;
};

const FirstRow = () => {
  const dispatch = useDispatch();

  const transactions = useSelector(
    (state) => state.transactions.items || []
  );

  const budgets = useSelector(
    (state) => state.budgets.items || []
  );

  const transactionLoading = useSelector(
    (state) => state.transactions.loading
  );

  const budgetLoading = useSelector(
    (state) => state.budgets.loading
  );

  const transactionError = useSelector(
    (state) => state.transactions.error
  );

  const budgetError = useSelector(
    (state) => state.budgets.error
  );

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBudgets());
  }, [dispatch]);

  const dashboard = useMemo(() => {
    const today = new Date();

    const monthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const monthEnd = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    const previousMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );

    const previousMonthEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    );

    // Current month transactions
    const currentTransactions = transactions.filter((transaction) => {
      const date = getTransactionDate(transaction);

      return (
        date &&
        date >= monthStart &&
        date <= monthEnd
      );
    });

    // Previous month transactions
    const previousTransactions = transactions.filter((transaction) => {
      const date = getTransactionDate(transaction);

      return (
        date &&
        date >= previousMonthStart &&
        date <= previousMonthEnd
      );
    });

    const calculateTotals = (items) =>
      items.reduce(
        (result, transaction) => {
          const amount = Number(transaction.amount || 0);

          if (transaction.transaction_type === "INCOME") {
            result.income += amount;
          }

          if (
            transaction.transaction_type === "EXPENSE" ||
            transaction.transaction_type === "SUBSCRIPTION"
          ) {
            result.expense += amount;
          }

          // Transfers are excluded from income and expenses.
          return result;
        },
        { income: 0, expense: 0 }
      );

    const currentTotals = calculateTotals(currentTransactions);
    const previousTotals = calculateTotals(previousTransactions);

    // Active monthly budgets overlapping the current month.
    const currentMonthlyBudgets = budgets.filter((budget) => {
      if (budget.active !== true) return false;
      if (budget.period !== "MONTHLY") return false;

      const startDate = parseLocalDate(budget.startDate);
      const endDate = parseLocalDate(budget.endDate);

      if (!startDate || !endDate) return false;

      return startDate <= monthEnd && endDate >= monthStart;
    });

    const monthlyBudget = currentMonthlyBudgets.reduce(
      (total, budget) => total + Number(budget.target || 0),
      0
    );

    return {
      income: currentTotals.income,
      expense: currentTotals.expense,
      budget: monthlyBudget,

      incomeTrend: getTrend(
        currentTotals.income,
        previousTotals.income
      ),

      expenseTrend: getTrend(
        currentTotals.expense,
        previousTotals.expense
      ),

      budgetCount: currentMonthlyBudgets.length,
    };
  }, [transactions, budgets]);

  const loading = transactionLoading || budgetLoading;
  const error = transactionError || budgetError;

  const formatTrend = (trend) =>
    trend === null ? "—" : `${Math.abs(trend).toFixed(1)}%`;

  if (loading && transactions.length === 0 && budgets.length === 0) {
    return <div className="py-4 text-center">Loading dashboard...</div>;
  }

  if (error && transactions.length === 0 && budgets.length === 0) {
    return (
      <div className="alert alert-danger">
        Failed to load dashboard data.
        <button
          className="btn btn-sm btn-outline-danger ms-3"
          onClick={() => {
            dispatch(fetchTransactions());
            dispatch(fetchBudgets());
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0 fr-wrap">
      <div className="row g-3 g-xl-4">

        {/* 1. Total Income */}
        <div className="col-12 col-md-4">
          <div className="fr-box fr-box-income">
            <div className="fr-top-glow fr-glow-income" />

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="fr-badge-icon fr-bi-income">
                  <svg width="17" height="17" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.3">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                </span>
                <div>
                  <div className="fr-label">Total Income</div>
                  <div className="fr-subtag">Cash Inflow This Month</div>
                </div>
              </div>
              <span className="fr-pill-tag fr-tag-income">INCOME</span>
            </div>

            <div className="d-flex justify-content-between align-items-end gap-2 mt-3">
              <div className="min-w-0">
                <div className="fr-value">
                  {formatMMK(dashboard.income)}
                </div>

                <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                  <span className={`fr-trend ${
                    dashboard.incomeTrend === null
                      ? ""
                      : dashboard.incomeTrend >= 0
                        ? "fr-trend-up"
                        : "fr-trend-down"
                  }`}>
                    {dashboard.incomeTrend === null
                      ? "—"
                      : dashboard.incomeTrend >= 0 ? "↑" : "↓"}{" "}
                    {formatTrend(dashboard.incomeTrend)}
                  </span>
                  <span className="fr-caption">from last month</span>
                </div>
              </div>

              <svg viewBox="0 0 96 42"
                className="fr-chart fr-chart-income" aria-hidden="true">
                <defs>
                  <linearGradient id="frGradIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 2,33 C 18,31 24,14 40,18 C 56,22 64,8 94,5 L 94,40 L 2,40 Z"
                  fill="url(#frGradIncome)"
                />
                <path
                  d="M 2,33 C 18,31 24,14 40,18 C 56,22 64,8 94,5"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="94" cy="5" r="3.2" fill="#34d399" />
              </svg>
            </div>
          </div>
        </div>

        {/* 2. Total Expenses */}
        <div className="col-12 col-md-4">
          <div className="fr-box fr-box-expense">
            <div className="fr-top-glow fr-glow-expense" />

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="fr-badge-icon fr-bi-expense">
                  <svg width="17" height="17" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.3">
                    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                    <polyline points="16 17 22 17 22 11" />
                  </svg>
                </span>
                <div>
                  <div className="fr-label">Total Expenses</div>
                  <div className="fr-subtag">Cash Outflow This Month</div>
                </div>
              </div>
              <span className="fr-pill-tag fr-tag-expense">EXPENSE</span>
            </div>

            <div className="d-flex justify-content-between align-items-end gap-2 mt-3">
              <div className="min-w-0">
                <div className="fr-value">
                  {formatMMK(dashboard.expense)}
                </div>

                <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                  <span className={`fr-trend ${
                    dashboard.expenseTrend === null
                      ? ""
                      : dashboard.expenseTrend <= 0
                        ? "fr-trend-up"
                        : "fr-trend-down"
                  }`}>
                    {dashboard.expenseTrend === null
                      ? "—"
                      : dashboard.expenseTrend >= 0 ? "↑" : "↓"}{" "}
                    {formatTrend(dashboard.expenseTrend)}
                  </span>
                  <span className="fr-caption">from last month</span>
                </div>
              </div>

              <svg viewBox="0 0 96 42"
                className="fr-chart fr-chart-expense" aria-hidden="true">
                <defs>
                  <linearGradient id="frGradExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 2,9 C 20,11 28,29 46,21 C 62,14 74,31 94,28 L 94,40 L 2,40 Z"
                  fill="url(#frGradExpense)"
                />
                <path
                  d="M 2,9 C 20,11 28,29 46,21 C 62,14 74,31 94,28"
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="94" cy="28" r="3.2" fill="#f87171" />
              </svg>
            </div>
          </div>
        </div>

        {/* 3. Monthly Budget */}
        <div className="col-12 col-md-4">
          <div className="fr-box fr-box-budget">
            <div className="fr-top-glow fr-glow-budget" />

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="fr-badge-icon fr-bi-budget">
                  <svg width="17" height="17" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.3">
                    <rect x="2" y="5" width="20" height="14" rx="3" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </span>
                <div>
                  <div className="fr-label">Budget</div>
                  <div className="fr-subtag">Monthly Limit</div>
                </div>
              </div>
              <span className="fr-pill-tag fr-tag-budget">BUDGET</span>
            </div>

            <div className="d-flex justify-content-between align-items-end gap-2 mt-3">
              <div className="min-w-0">
                <div className="fr-value fr-value-gold">
                  {formatMMK(dashboard.budget)}
                </div>

                <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                  <span className="fr-trend fr-trend-up">
                    {dashboard.budgetCount} active
                  </span>
                  <span className="fr-caption">monthly budget(s)</span>
                </div>
              </div>

              <svg viewBox="0 0 96 42"
                className="fr-chart fr-chart-budget" aria-hidden="true">
                <defs>
                  <linearGradient id="frGradBudget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 2,27 C 18,25 30,9 48,19 C 64,28 76,11 94,8 L 94,40 L 2,40 Z"
                  fill="url(#frGradBudget)"
                />
                <path
                  d="M 2,27 C 18,25 30,9 48,19 C 64,28 76,11 94,8"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="94" cy="8" r="3.2" fill="#fbbf24" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FirstRow;
