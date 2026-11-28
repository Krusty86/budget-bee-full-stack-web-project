import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../assets/css/chart.css";
import { fetchAccounts } from "../../reducers/AccountSlice";
import { fetchTransactions } from "../../reducers/TransactionSlice";

const CATEGORY_STYLES = {
  FOOD: { label: "Food", color: "#34d399" },
  GROCERIES: { label: "Groceries", color: "#60a5fa" },
  TRANSPORTATION: { label: "Transportation", color: "#fbbf24" },
  HEALTHCARE: { label: "Healthcare", color: "#f87171" },
  HOUSING: { label: "Housing", color: "#c084fc" },
  BILLPAYMENT: { label: "Bill Payment", color: "#fb923c" },
  ENTERTAINMENT: { label: "Entertainment", color: "#2dd4bf" },
  OTHER: { label: "Other", color: "#a1a1aa" },
};

const ACCOUNT_TYPE_LABELS = {
  CASH: "Cash",
  BANK: "Bank",
  EWALLET: "E-Wallet",
  OTHER: "Other",
};

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });

const getErrorText = (error) => {
  if (typeof error === "string") return error;
  if (error?.msg) return error.msg;
  if (error?.message) return error.message;
  return error ? JSON.stringify(error) : "Unknown request error";
};

// date so dates close to midnight are not shifted by a UTC conversion.
const parseLocalDate = (value) => {
  if (!value) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getMonthLabel = (date, includeYear = false) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    ...(includeYear ? { year: "2-digit" } : {}),
  }).format(date);

const getMonthWindow = (count, today) =>
  Array.from({ length: count }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - count + index + 1,
      1,
    );

    return {
      key: getMonthKey(date),
      month: getMonthLabel(date, count > 6),
      inflow: 0,
      outflow: 0,
    };
  });

const buildMonthlyCashflow = (transactions, count, today) => {
  const months = getMonthWindow(count, today);
  const monthByKey = new Map(months.map((month) => [month.key, month]));

  transactions.forEach((transaction) => {
    const date = parseLocalDate(transaction.transactionDate);
    if (!date) return;

    const month = monthByKey.get(getMonthKey(date));
    if (!month) return;

    const amount = Number(transaction.amount || 0);
    if (!Number.isFinite(amount)) return;

    if (transaction.transaction_type === "INCOME") {
      month.inflow += amount;
    } else if (
      transaction.transaction_type === "EXPENSE" ||
      transaction.transaction_type === "SUBSCRIPTION"
    ) {
      month.outflow += amount;
    }
  });

  return months;
};

const buildDonutSegments = (items, total, radius) => {
  const circumference = 2 * Math.PI * radius;
  let offsetSoFar = 0;

  return items.map((item) => {
    const share = total > 0 ? item.value / total : 0;
    const length = share * circumference;
    const segment = {
      ...item,
      percent: Math.round(share * 100),
      dashArray: `${length} ${circumference}`,
      dashOffset: -offsetSoFar,
    };
    offsetSoFar += length;
    return segment;
  });
};

const buildTrendChart = (series, width, height) => {
  const padX = 28;
  const padY = 18;
  const maxAmount = Math.max(
    1,
    ...series.flatMap((item) => [item.inflow, item.outflow]),
  );
  const usableW = width - padX * 2;
  const usableH = height - padY * 2;

  const toCoords = (key) =>
    series.map((item, index) => {
      const x =
        series.length > 1
          ? padX + (index / (series.length - 1)) * usableW
          : width / 2;
      const y = height - padY - (item[key] / maxAmount) * usableH;
      return { x, y, key: item.key };
    });

  const toPath = (points) =>
    points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

  const inflowPts = toCoords("inflow");
  const outflowPts = toCoords("outflow");

  return {
    padX,
    padY,
    inflowPts,
    outflowPts,
    inflowPath: toPath(inflowPts),
    outflowPath: toPath(outflowPts),
  };
};

const SecondRow = () => {
  const dispatch = useDispatch();
  const [period, setPeriod] = useState("6M");

  const transactions = useSelector((state) => state.transactions.items || []);
  const transactionLoading = useSelector((state) => state.transactions.loading);
  const transactionError = useSelector((state) => state.transactions.error);
  const accounts = useSelector((state) => state.accounts.items || []);
  const accountLoading = useSelector((state) => state.accounts.loading);
  const accountError = useSelector((state) => state.accounts.error);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const dashboardData = useMemo(() => {
    const today = new Date();
    const currentMonthKey = getMonthKey(
      new Date(today.getFullYear(), today.getMonth(), 1),
    );

    const cashflow6M = buildMonthlyCashflow(transactions, 6, today);
    const cashflow1Y = buildMonthlyCashflow(transactions, 12, today);
    const currentMonthTransactions = transactions.filter((transaction) => {
      const date = parseLocalDate(transaction.transactionDate);
      return date && getMonthKey(date) === currentMonthKey;
    });

    const spendingByCategory = currentMonthTransactions.reduce(
      (totals, transaction) => {
        if (
          transaction.transaction_type !== "EXPENSE" &&
          transaction.transaction_type !== "SUBSCRIPTION"
        ) {
          return totals;
        }

        const category = transaction.category || "OTHER";
        const amount = Number(transaction.amount || 0);
        if (!Number.isFinite(amount)) return totals;

        totals[category] = (totals[category] || 0) + amount;
        return totals;
      },
      {},
    );

    const spending = Object.entries(spendingByCategory)
      .map(([category, value]) => ({
        label: CATEGORY_STYLES[category]?.label || category,
        value,
        color: CATEGORY_STYLES[category]?.color || CATEGORY_STYLES.OTHER.color,
      }))
      .sort((first, second) => second.value - first.value);

    const accountRows = accounts.map((account) => ({
      id: account.id,
      name: account.accname || "Unnamed account",
      note: [
        ACCOUNT_TYPE_LABELS[account.account_type] || account.account_type,
        account.currency,
      ]
        .filter(Boolean)
        .join(" • "),
      amount: Number(account.balance || 0),
      currency: account.currency || "",
    }));

    const balancesByCurrency = accountRows.reduce((totals, account) => {
      const currency = account.currency || "Unspecified";
      totals[currency] = (totals[currency] || 0) + account.amount;
      return totals;
    }, {});

    const currencies = Object.keys(balancesByCurrency).filter(
      (currency) => currency !== "Unspecified",
    );

    return {
      spending,
      cashflow: { "6M": cashflow6M, "1Y": cashflow1Y },
      monthlyNetHistory: cashflow6M.map((month) => ({
        ...month,
        net: month.inflow - month.outflow,
      })),
      accounts: accountRows,
      balancesByCurrency,
      currencies,
      currentMonthLabel: getMonthLabel(today),
    };
  }, [transactions, accounts]);

  const series = dashboardData.cashflow[period] || [];
  const latest = series[series.length - 1] || {
    month: "",
    inflow: 0,
    outflow: 0,
  };
  const netCashflow = latest.inflow - latest.outflow;
  const totalSpending = dashboardData.spending.reduce(
    (sum, item) => sum + item.value,
    0,
  );
  const donutRadius = 58;
  const spendingSegments = buildDonutSegments(
    dashboardData.spending,
    totalSpending,
    donutRadius,
  );

  const chartW = 560;
  const chartH = 180;
  const trend = buildTrendChart(series, chartW, chartH);
  const hasCashflowData = series.some(
    (month) => month.inflow > 0 || month.outflow > 0,
  );
  const currencyLabel =
    dashboardData.currencies.length === 1
      ? dashboardData.currencies[0]
      : dashboardData.currencies.length > 1
        ? null
        : "";
  const hasMixedCurrencies = dashboardData.currencies.length > 1;
  const latestNet = latest.inflow - latest.outflow;
  const dataLoading = transactionLoading || accountLoading;
  const errors = [transactionError, accountError].filter(Boolean);

  const formatAmount = (amount) => formatNumber(amount);
  const formatAmountWithCurrency = (amount, currency = currencyLabel) =>
    currency ? `${formatAmount(amount)} ${currency}` : formatAmount(amount);

  const handleRefresh = () => {
    dispatch(fetchTransactions());
    dispatch(fetchAccounts());
  };

  return (
    <div className="fr-wrap dashboard-content mt-3">
      <div className="container-fluid px-0">
        {errors.length > 0 && (
          <div className="bb-pf-feedback bb-pf-feedback-error d-flex flex-wrap align-items-center justify-content-between gap-2 py-2 mb-3">
            <span>
              Dashboard data could not be fully refreshed.{" "}
              {getErrorText(errors[0])}
            </span>
            <button
              type="button"
              className="btn btn-sm btn-outline-warning"
              onClick={handleRefresh}
              disabled={dataLoading}
            >
              Retry
            </button>
          </div>
        )}

        {hasMixedCurrencies && (
          <div className="bb-pf-feedback bb-pf-feedback-error py-2 mb-3">
            Multiple account currencies were found. Account balances are shown
            separately by currency; transaction chart totals are shown as
            recorded because the transaction API does not include the linked
            account currency or perform currency conversion.
          </div>
        )}

        <div className="row g-3">
          {/* LEFT COLUMN: Spending Category + Account Balances */}
          <div className="col-lg-4">
            <div className="d-flex flex-column gap-3 h-100">
              {/* SPENDING CARD */}
              <div className="fr-box">
                <span className="fr-top-glow fr-glow-budget" />
                <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
                  <div>
                    <div className="fr-label">Spending</div>
                    <div className="fr-subtag">
                      Expense categories · {dashboardData.currentMonthLabel}
                    </div>
                  </div>
                  <span className="fr-pill-tag fr-tag-budget">CATEGORY</span>
                </div>

                <div className="sr-donut-box mb-3">
                  <svg viewBox="0 0 150 150" className="sr-donut-svg">
                    <circle
                      cx="75"
                      cy="75"
                      r={donutRadius}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="14"
                    />
                    {spendingSegments.map((segment) => (
                      <circle
                        key={segment.label}
                        cx="75"
                        cy="75"
                        r={donutRadius}
                        fill="none"
                        stroke={segment.color}
                        strokeWidth="14"
                        strokeDasharray={segment.dashArray}
                        strokeDashoffset={segment.dashOffset}
                        transform="rotate(-90 75 75)"
                      />
                    ))}
                  </svg>
                  <div className="sr-donut-center">
                    <div className="fr-subtag mt-0">Total Spent</div>
                    <div className="sr-donut-total">
                      {formatAmount(totalSpending)}
                    </div>
                    {currencyLabel && (
                      <div className="fr-subtag mt-0">{currencyLabel}</div>
                    )}
                  </div>
                </div>

                {spendingSegments.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {spendingSegments.map((segment) => (
                      <div
                        key={segment.label}
                        className="d-flex align-items-center justify-content-between gap-2"
                      >
                        <div className="d-flex align-items-center gap-2 text-truncate">
                          <span
                            className="sr-dot"
                            style={{ backgroundColor: segment.color }}
                          />
                          <span className="fr-caption text-truncate">
                            {segment.label}
                          </span>
                        </div>
                        <div className="d-flex align-items-center gap-2 flex-shrink-0">
                          <span className="fr-subtag mt-0">
                            {segment.percent}%
                          </span>
                          <span className="fr-caption fw-semibold text-light">
                            {formatAmount(segment.value)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="fr-subtag text-center py-2">
                    {dataLoading
                      ? "Loading spending data..."
                      : "No expenses recorded this month."}
                  </div>
                )}
              </div>

              {/* ACCOUNT BALANCES CARD */}
              <div className="fr-box flex-grow-1">
                <span className="fr-top-glow fr-glow-income" />
                <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                  <div>
                    <div className="fr-label">Assets</div>
                    <div className="fr-subtag">
                      Current balances from your accounts
                    </div>
                  </div>
                  <span className="fr-pill-tag fr-tag-income">ACCOUNTS</span>
                </div>

                <div className="mb-3">
                  {Object.entries(dashboardData.balancesByCurrency).length >
                  0 ? (
                    Object.entries(dashboardData.balancesByCurrency).map(
                      ([currency, amount]) => (
                        <div key={currency} className="fr-value fr-value-gold">
                          {formatAmount(amount)}{" "}
                          <span className="fs-6 fw-semibold">{currency}</span>
                        </div>
                      ),
                    )
                  ) : (
                    <div className="fr-value fr-value-gold">
                      {dataLoading ? "Loading..." : "0"}
                    </div>
                  )}
                </div>

                <div className="d-flex flex-column gap-2">
                  {dashboardData.accounts.length > 0 ? (
                    dashboardData.accounts.map((account) => (
                      <div
                        key={account.id ?? account.name}
                        className="glass-panel p-2 px-3 d-flex align-items-center justify-content-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="fr-caption fw-semibold text-light text-truncate">
                            {account.name}
                          </div>
                          <div className="fr-subtag mt-0">{account.note}</div>
                        </div>
                        <div className="fr-caption fw-bold text-light text-nowrap">
                          {formatAmount(account.amount)} {account.currency}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="fr-subtag text-center py-2">
                      {dataLoading
                        ? "Loading accounts..."
                        : "No financial accounts found."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Cash Flow + Monthly Net Cash Flow + Reports */}
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-3 h-100">
              {/* CASHFLOW CARD */}
              <div className="fr-box">
                <span className="fr-top-glow fr-glow-income" />
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fr-label">CashFlow</span>
                      <span className="gold-badge">TIMELINE TREND</span>
                    </div>
                    <div className="fr-subtag">
                      Income and expenses grouped by transaction month
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className={
                        period === "6M"
                          ? "btn-gold py-1 px-3"
                          : "btn-ghost py-1 px-3"
                      }
                      onClick={() => setPeriod("6M")}
                    >
                      6M
                    </button>
                    <button
                      type="button"
                      className={
                        period === "1Y"
                          ? "btn-gold py-1 px-3"
                          : "btn-ghost py-1 px-3"
                      }
                      onClick={() => setPeriod("1Y")}
                    >
                      1Y
                    </button>
                    <button
                      type="button"
                      className="btn-ghost py-1 px-3"
                      onClick={handleRefresh}
                      disabled={dataLoading}
                      aria-label="Refresh dashboard data"
                    >
                      {dataLoading ? "Loading..." : "Refresh"}
                    </button>
                  </div>
                </div>

                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                  <div className="d-flex flex-wrap align-items-center gap-4">
                    <div>
                      <div className="fr-subtag mt-0">Cash Inflow</div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="sr-dot sr-dot-inflow" />
                        <span className="fr-value fs-5">
                          {formatAmountWithCurrency(latest.inflow)}
                        </span>
                        <span className="fr-trend fr-trend-up">Inflow</span>
                      </div>
                    </div>
                    <div>
                      <div className="fr-subtag mt-0">Cash Outflow</div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="sr-dot sr-dot-outflow" />
                        <span className="fr-value fs-5">
                          {formatAmountWithCurrency(latest.outflow)}
                        </span>
                        <span className="fr-trend fr-trend-down">Outflow</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-end">
                    <div className="fr-subtag mt-0">Net CashFlow</div>
                    <div
                      className={`fr-caption fw-bold ${
                        netCashflow >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {netCashflow >= 0 ? "+" : ""}
                      {formatAmountWithCurrency(netCashflow)}
                    </div>
                    <div className="fr-subtag mt-0">{latest.month}</div>
                  </div>
                </div>

                {hasCashflowData ? (
                  <div className="sr-trend-wrap">
                    <svg
                      viewBox={`0 0 ${chartW} ${chartH}`}
                      className="sr-trend-svg"
                      preserveAspectRatio="none"
                    >
                      {[0.25, 0.5, 0.75].map((ratio) => {
                        const y =
                          chartH -
                          trend.padY -
                          ratio * (chartH - trend.padY * 2);
                        return (
                          <line
                            key={ratio}
                            x1={trend.padX}
                            y1={y}
                            x2={chartW - trend.padX}
                            y2={y}
                            stroke="rgba(255, 255, 255, 0.06)"
                            strokeWidth="1"
                          />
                        );
                      })}

                      <path
                        d={trend.outflowPath}
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2.5"
                      />
                      <path
                        d={trend.inflowPath}
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="2.5"
                      />

                      {trend.inflowPts.map((point) => (
                        <circle
                          key={`in-${point.key}`}
                          cx={point.x}
                          cy={point.y}
                          r="3.5"
                          fill="#34d399"
                        />
                      ))}

                      {trend.outflowPts.map((point) => (
                        <circle
                          key={`out-${point.key}`}
                          cx={point.x}
                          cy={point.y}
                          r="3.5"
                          fill="#fbbf24"
                        />
                      ))}
                    </svg>

                    <div className="sr-trend-labels">
                      {series.map((month) => (
                        <span key={month.key} className="fr-subtag mt-0">
                          {month.month}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="fr-subtag text-center py-4">
                    No income or expense transactions found for this period.
                  </div>
                )}
              </div>

              {/* BOTTOM SUB-ROW: Monthly Net Cash Flow + Reports */}
              <div className="row g-3 flex-grow-1">
                <div className="col-md-6">
                  <div className="fr-box fr-box-budget">
                    <span className="fr-top-glow fr-glow-budget" />
                    <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                      <div>
                        <div className="fr-label">Monthly Net Cash Flow</div>
                        <div className="fr-subtag">
                          Income minus expenses by month
                        </div>
                      </div>
                      <span className="fr-trend fr-trend-up">6 Months</span>
                    </div>

                    <div
                      className={`fr-value fr-value-gold mb-3 ${
                        latestNet < 0 ? "text-danger" : ""
                      }`}
                    >
                      {latestNet >= 0 ? "+" : ""}
                      {formatAmountWithCurrency(latestNet)}
                    </div>

                    <div className="d-flex flex-column gap-2">
                      {dashboardData.monthlyNetHistory.map((month) => (
                        <div
                          key={month.key}
                          className="d-flex align-items-center justify-content-between border-bottom border-light border-opacity-10 pb-1"
                        >
                          <span className="fr-caption">{month.month}</span>
                          <span
                            className={`fr-caption fw-semibold ${
                              month.net >= 0 ? "text-success" : "text-danger"
                            }`}
                          >
                            {month.net >= 0 ? "+" : ""}
                            {formatAmount(month.net)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* REPORTS CARD: derived from the selected month's API transactions */}
                <div className="col-md-6">
                  <div className="fr-box">
                    <span className="fr-top-glow fr-glow-expense" />
                    <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                      <div>
                        <div className="fr-label">Reports</div>
                        <div className="fr-subtag">
                          Income and expense · {latest.month}
                        </div>
                      </div>
                      <span className="fr-pill-tag fr-tag-expense">REPORT</span>
                    </div>

                    <div className="d-flex flex-column gap-2 mt-3">
                      <div className="glass-panel p-3 d-flex align-items-center justify-content-between">
                        <div>
                          <div className="fr-subtag mt-0">Income Report</div>
                          <div className="fr-value fs-5 text-success">
                            {formatAmountWithCurrency(latest.inflow)}
                          </div>
                        </div>
                        <span className="fr-trend fr-trend-up">
                          {latest.month}
                        </span>
                      </div>

                      <div className="glass-panel p-3 d-flex align-items-center justify-content-between">
                        <div>
                          <div className="fr-subtag mt-0">Expense Report</div>
                          <div className="fr-value fs-5 text-danger">
                            {formatAmountWithCurrency(latest.outflow)}
                          </div>
                        </div>
                        <span className="fr-trend fr-trend-down">
                          {latest.month}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {dataLoading && (
          <div className="fr-subtag text-end mt-2">
            Updating dashboard data...
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondRow;
