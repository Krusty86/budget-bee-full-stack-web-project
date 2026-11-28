import React, { useEffect, useMemo, useState } from "react";

const TX_PAGE_SIZE = 8;

const CAT_META = {
  FOOD: { label: "Food", color: "#fbbf24" },
  GROCERIES: { label: "Groceries", color: "#34d399" },
  TRANSPORTATION: { label: "Transportation", color: "#38bdf8" },
  HEALTHCARE: { label: "Healthcare", color: "#f87171" },
  HOUSING: { label: "Housing", color: "#f59e0b" },
  BILLPAYMENT: { label: "Bill Payment", color: "#fde68a" },
  ENTERTAINMENT: { label: "Entertainment", color: "#fb923c" },
  OTHER: { label: "Other", color: "#94a3b8" },
};

const RING_COLORS = [
  "#fbbf24",
  "#f59e0b",
  "#34d399",
  "#38bdf8",
  "#fb923c",
  "#fde68a",
];
const FILTER_TYPES = ["ALL", "INCOME", "EXPENSE", "TRANSFER", "SUBSCRIPTION"];

const formatMMK = (value) => `${Number(value || 0).toLocaleString()} MMK`;

const getAccountSummary = (fromAcc, toAcc) => {
  const from = fromAcc?.accname || fromAcc?.name;
  const to = toAcc?.accname || toAcc?.name;
  if (from && to) return `${from} → ${to}`;
  return from || to || "—";
};

const getTypeLabel = (type) => {
  const labels = {
    INCOME: "Income",
    EXPENSE: "Expense",
    TRANSFER: "Transfer",
    SUBSCRIPTION: "Subscription",
  };
  return labels[type] || "Transaction";
};

const getAmountPresentation = (type) => {
  if (type === "INCOME") return { prefix: "+", className: "bb-amt-in" };
  if (type === "TRANSFER") return { prefix: "", className: "bb-amt-tr" };
  return { prefix: "−", className: "bb-amt-out" };
};

const TransactionList = ({ transactions = [] }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [catFilter, setCatFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [page, setPage] = useState(1);

  const items = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...transactions]
      .filter((tx) => {
        const categoryLabel = CAT_META[tx.category]?.label || tx.category || "";
        const matchesType =
          typeFilter === "ALL" || tx.transaction_type === typeFilter;
        const matchesCategory =
          catFilter === "ALL" || tx.category === catFilter;
        const searchable = [
          categoryLabel,
          tx.note,
          tx.from_account?.accname || tx.from_account?.name,
          tx.to_account?.accname || tx.to_account?.name,
          tx.transaction_type,
          tx.transactionDate || tx.createdDate,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return (
          matchesType &&
          matchesCategory &&
          (!query || searchable.includes(query))
        );
      })
      .sort((a, b) => {
        const dateA = new Date(
          `${a.transactionDate || a.createdDate || ""} ${a.createdTime || ""}`,
        ).getTime();
        const dateB = new Date(
          `${b.transactionDate || b.createdDate || ""} ${b.createdTime || ""}`,
        ).getTime();
        if (Number.isFinite(dateA) && Number.isFinite(dateB) && dateA !== dateB)
          return dateB - dateA;
        return Number(b.id || 0) - Number(a.id || 0);
      });
  }, [transactions, search, typeFilter, catFilter]);

  const totalPages = Math.max(1, Math.ceil(items.length / TX_PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, catFilter, transactions.length]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * TX_PAGE_SIZE;
    return items.slice(start, start + TX_PAGE_SIZE);
  }, [items, page]);

  const breakdown = useMemo(() => {
    const outflows = transactions.filter(
      (tx) =>
        tx.transaction_type === "EXPENSE" ||
        tx.transaction_type === "SUBSCRIPTION",
    );
    const total = outflows.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
    const totalsByCategory = {};

    outflows.forEach((tx) => {
      const key = tx.category || "OTHER";
      totalsByCategory[key] =
        (totalsByCategory[key] || 0) + Number(tx.amount || 0);
    });

    const entries = Object.entries(totalsByCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount], index) => ({
        category,
        label: CAT_META[category]?.label || category,
        color: RING_COLORS[index % RING_COLORS.length],
        amount,
        percent: total > 0 ? Math.round((amount / total) * 100) : 0,
      }));

    let cursor = 0;
    const gradientParts = entries.map((entry) => {
      const start = cursor;
      cursor += entry.percent;
      return `${entry.color} ${start}% ${cursor}%`;
    });

    return {
      total,
      entries,
      conicGradient: entries.length
        ? `conic-gradient(${gradientParts.join(", ")}, rgba(255,255,255,.08) ${cursor}% 100%)`
        : "conic-gradient(rgba(255,255,255,.08) 0% 100%)",
    };
  }, [transactions]);

  const subscriptions = useMemo(
    () => transactions.filter((tx) => tx.transaction_type === "SUBSCRIPTION"),
    [transactions],
  );

  const activeEntry =
    breakdown.entries.find((entry) => entry.category === selectedCategory) ||
    breakdown.entries[0] ||
    null;

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("ALL");
    setCatFilter("ALL");
  };

  const renderAmount = (tx) => {
    const amount = getAmountPresentation(tx.transaction_type);
    return (
      <span className={amount.className}>
        {amount.prefix}
        {formatMMK(tx.amount)}
      </span>
    );
  };

  const startIdx = (page - 1) * TX_PAGE_SIZE;

  return (
    <>
      <section className="row g-3 bb-tx-content-row">
        <div className="col-12 col-xxl-8">
          <div className="bb-panel bb-ledger-panel h-100">
            <div className="bb-panel-heading">
              <div>
                <span className="bb-panel-eyebrow">YOUR MONEY, ORGANIZED</span>
                <h2 className="bb-panel-title mb-1">Transaction Activity</h2>
                <p className="bb-panel-subtitle mb-0">
                  Search, filter and review your latest records.
                </p>
              </div>
              <span className="bb-total-records">{items.length} shown</span>
            </div>

            <div className="bb-ledger-toolbar">
              <div className="bb-search-wrap">
                <span className="bb-search-icon" aria-hidden="true">
                  ⌕
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search note, category or account..."
                  className="form-control bb-input bb-search-input"
                  aria-label="Search transactions"
                />
                {search && (
                  <button
                    type="button"
                    className="bb-search-clear"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((visible) => !visible)}
                className={`bb-pill bb-filter-toggle ${showFilters ? "active" : ""}`}
                aria-expanded={showFilters}
              >
                <span aria-hidden="true">☷</span> Filters
                {(typeFilter !== "ALL" || catFilter !== "ALL") && (
                  <span className="bb-filter-indicator" />
                )}
              </button>
            </div>

            {showFilters && (
              <div className="bb-filter-panel">
                <div className="bb-filter-group">
                  <span className="bb-filter-label">Transaction type</span>
                  <div className="bb-filter-pills">
                    {FILTER_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setTypeFilter(type)}
                        className={`bb-pill ${typeFilter === type ? "active" : ""}`}
                      >
                        {type === "ALL" ? "All types" : getTypeLabel(type)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bb-filter-group bb-category-filter">
                  <label
                    className="bb-filter-label"
                    htmlFor="bb-category-filter"
                  >
                    Category
                  </label>
                  <select
                    id="bb-category-filter"
                    value={catFilter}
                    onChange={(event) => setCatFilter(event.target.value)}
                    className="form-select bb-select"
                  >
                    <option value="ALL">All categories</option>
                    {Object.entries(CAT_META).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="bb-clear-filters"
                  onClick={clearFilters}
                >
                  Reset filters
                </button>
              </div>
            )}

            {/* Desktop / tablet table */}
            <div className="bb-table-scroll d-none d-md-block">
              <table className="bb-ledger-table">
                <thead>
                  <tr>
                    <th>TRANSACTION</th>
                    <th>ACCOUNT</th>
                    <th>DATE</th>
                    <th className="text-end">AMOUNT</th>
                    <th className="text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <div className="bb-empty-state">
                          <span className="bb-empty-icon">⌕</span>
                          <strong>No transactions found</strong>
                          <span>Try changing your search or filters.</span>
                          <button
                            type="button"
                            className="bb-clear-filters"
                            onClick={clearFilters}
                          >
                            Clear all filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((tx) => {
                      const category = CAT_META[tx.category] || CAT_META.OTHER;
                      return (
                        <tr key={tx.id}>
                          <td>
                            <div className="bb-transaction-cell">
                              <span
                                className="bb-transaction-category-icon"
                                style={{ "--category-color": category.color }}
                              >
                                {category.label.charAt(0)}
                              </span>
                              <div className="bb-transaction-copy">
                                <strong>{tx.note || category.label}</strong>
                                <span>
                                  {category.label} <i>·</i>{" "}
                                  {getTypeLabel(tx.transaction_type)}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="bb-acct-text">
                              {getAccountSummary(
                                tx.from_account,
                                tx.to_account,
                              )}
                            </span>
                          </td>
                          <td>
                            <div className="bb-date-cell">
                              <strong>
                                {tx.transactionDate || tx.createdDate || "—"}
                              </strong>
                              <span>{tx.createdTime || ""}</span>
                            </div>
                          </td>
                          <td className="text-end">{renderAmount(tx)}</td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="bb-action-btn"
                              title="View transaction details"
                              aria-label={`View details for ${tx.note || "transaction"}`}
                              onClick={() => setSelectedTransaction(tx)}
                            >
                              <span aria-hidden="true">↗</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Compact transaction cards on phones */}
            <div className="bb-mobile-transactions d-md-none">
              {paginatedItems.length === 0 ? (
                <div className="bb-empty-state">
                  <span className="bb-empty-icon">⌕</span>
                  <strong>No transactions found</strong>
                  <span>Try changing your search or filters.</span>
                  <button
                    type="button"
                    className="bb-clear-filters"
                    onClick={clearFilters}
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                paginatedItems.map((tx) => {
                  const category = CAT_META[tx.category] || CAT_META.OTHER;
                  return (
                    <article className="bb-mobile-tx-card" key={tx.id}>
                      <div className="bb-mobile-tx-main">
                        <span
                          className="bb-transaction-category-icon"
                          style={{ "--category-color": category.color }}
                        >
                          {category.label.charAt(0)}
                        </span>
                        <div className="bb-transaction-copy">
                          <strong>{tx.note || category.label}</strong>
                          <span>
                            {category.label} ·{" "}
                            {getTypeLabel(tx.transaction_type)}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="bb-action-btn"
                          onClick={() => setSelectedTransaction(tx)}
                          aria-label={`View details for ${tx.note || "transaction"}`}
                        >
                          ↗
                        </button>
                      </div>
                      <div className="bb-mobile-tx-bottom">
                        <span>
                          {getAccountSummary(tx.from_account, tx.to_account)}
                        </span>
                        {renderAmount(tx)}
                      </div>
                      <div className="bb-mobile-tx-date">
                        {tx.transactionDate || tx.createdDate || "—"}{" "}
                        {tx.createdTime ? `· ${tx.createdTime}` : ""}
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            {/* Pagination Controls */}
            {items.length > 0 && (
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-3 mt-3 border-top border-secondary border-opacity-25">
                <span className="fr-caption">
                  Showing {startIdx + 1}–
                  {Math.min(startIdx + TX_PAGE_SIZE, items.length)} of{" "}
                  {items.length}
                </span>

                <div className="d-flex flex-wrap align-items-center gap-1">
                  <button
                    type="button"
                    className="bb-pill"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        className={`bb-pill ${page === pageNum ? "active" : ""}`}
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ),
                  )}

                  <button
                    type="button"
                    className="bb-pill"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="col-12 col-xxl-4">
          <div className="bb-side-panels">
            <section className="bb-panel bb-insight-panel bb-expense-panel">
              <div className="bb-panel-heading bb-panel-heading-compact bb-expense-heading">
                <div>
                  <span className="bb-panel-eyebrow">SPENDING INSIGHT</span>
                  <h2 className="bb-panel-title mb-0">Expense Breakdown</h2>
                  <p className="bb-expense-caption mb-0">
                    See where your money goes
                  </p>
                </div>
                <span className="bb-kpi-chip bb-kpi-chip-expense">OUTFLOW</span>
              </div>

              {breakdown.entries.length === 0 ? (
                <div className="bb-empty-compact">
                  No expense data available yet.
                </div>
              ) : (
                <>
                  <div className="bb-expense-summary">
                    <div>
                      <span className="bb-expense-summary-label">
                        TOTAL SPENT
                      </span>
                      <strong>{formatMMK(breakdown.total)}</strong>
                    </div>
                    <span
                      className="bb-expense-summary-icon"
                      aria-hidden="true"
                    >
                      ↘
                    </span>
                  </div>

                  <div className="bb-breakdown-visual">
                    <div
                      className="bb-bd-ring-wrap"
                      style={{ background: breakdown.conicGradient }}
                    >
                      <div className="bb-bd-ring-hole">
                        <strong
                          style={{ color: activeEntry?.color || "#fbbf24" }}
                        >
                          {activeEntry?.percent ?? 0}%
                        </strong>
                        <span>{activeEntry?.label || "Outflow"}</span>
                      </div>
                    </div>
                    <div className="bb-breakdown-focus">
                      <span className="bb-breakdown-focus-label">
                        SELECTED CATEGORY
                      </span>
                      <strong>{activeEntry?.label || "All expenses"}</strong>
                      <span>
                        {formatMMK(activeEntry?.amount ?? breakdown.total)}
                      </span>
                    </div>
                  </div>

                  <div className="bb-breakdown-list">
                    <div className="bb-breakdown-list-heading">
                      <span>Category</span>
                      <span>Amount / Share</span>
                    </div>
                    {breakdown.entries.map((entry) => (
                      <button
                        type="button"
                        key={entry.category}
                        onClick={() => setSelectedCategory(entry.category)}
                        className={`bb-bd-cat-row ${activeEntry?.category === entry.category ? "active" : ""}`}
                        aria-pressed={activeEntry?.category === entry.category}
                      >
                        <span className="bb-breakdown-name">
                          <i
                            style={{
                              backgroundColor: entry.color,
                              boxShadow: `0 0 10px ${entry.color}66`,
                            }}
                          />
                          <span>{entry.label}</span>
                        </span>
                        <span className="bb-breakdown-value">
                          <strong>{formatMMK(entry.amount)}</strong>
                          <em>{entry.percent}%</em>
                        </span>
                        <span className="bb-bd-track">
                          <span
                            className="bb-bd-fill"
                            style={{
                              width: `${entry.percent}%`,
                              backgroundColor: entry.color,
                            }}
                          />
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </section>

            <section className="bb-panel bb-insight-panel">
              <div className="bb-panel-heading bb-panel-heading-compact">
                <div>
                  <span className="bb-panel-eyebrow">RECURRING PAYMENTS</span>
                  <h2 className="bb-panel-title mb-0">Subscriptions</h2>
                </div>
                <span className="bb-total-records">
                  {subscriptions.length} records
                </span>
              </div>

              {subscriptions.length === 0 ? (
                <div className="bb-empty-compact">
                  No subscriptions recorded yet.
                </div>
              ) : (
                <div className="bb-sub-list">
                  {subscriptions.map((sub) => (
                    <div className="bb-sub-card" key={sub.id}>
                      <span className="bb-sub-icon">↻</span>
                      <div className="bb-sub-copy">
                        <strong>
                          {sub.note ||
                            CAT_META[sub.category]?.label ||
                            "Subscription"}
                        </strong>
                        <span>
                          {sub.from_account?.name || "Account not specified"}
                        </span>
                      </div>
                      <strong className="bb-amt-out">
                        −{formatMMK(sub.amount)}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </aside>
      </section>

      {selectedTransaction && (
        <div
          className="bb-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget)
              setSelectedTransaction(null);
          }}
        >
          <section
            className="bb-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bb-detail-title"
          >
            <div className="bb-detail-modal-head">
              <div>
                <span className="bb-panel-eyebrow">TRANSACTION DETAILS</span>
                <h2 id="bb-detail-title" className="bb-panel-title mb-0">
                  Record overview
                </h2>
              </div>
              <button
                type="button"
                className="bb-modal-close"
                onClick={() => setSelectedTransaction(null)}
                aria-label="Close details"
              >
                ×
              </button>
            </div>

            <div className="bb-detail-amount">
              <span>{getTypeLabel(selectedTransaction.transaction_type)}</span>
              {renderAmount(selectedTransaction)}
            </div>

            <dl className="bb-detail-list">
              <div>
                <dt>Description</dt>
                <dd>{selectedTransaction.note || "—"}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>
                  {CAT_META[selectedTransaction.category]?.label ||
                    selectedTransaction.category ||
                    "—"}
                </dd>
              </div>
              <div>
                <dt>Account</dt>
                <dd>
                  {getAccountSummary(
                    selectedTransaction.from_account,
                    selectedTransaction.to_account,
                  )}
                </dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>
                  {selectedTransaction.transactionDate ||
                    selectedTransaction.createdDate ||
                    "—"}
                </dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>{selectedTransaction.createdTime || "—"}</dd>
              </div>
              <div>
                <dt>Record ID</dt>
                <dd>#{selectedTransaction.id}</dd>
              </div>
            </dl>

            <div className="bb-detail-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setSelectedTransaction(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn-gold"
                onClick={() => {
                  setSelectedTransaction(null);
                }}
              >
                Done
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
};

export default TransactionList;