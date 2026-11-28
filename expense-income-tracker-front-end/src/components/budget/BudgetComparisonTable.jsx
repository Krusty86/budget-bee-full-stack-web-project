import { useEffect, useMemo, useState } from "react";

const BUDGET_PAGE_SIZE = 5;

const CAT_META = {
  FOOD: { label: "Food", color: "#fbbf24" },
  GROCERIES: { label: "Groceries", color: "#34d399" },
  TRANSPORTATION: { label: "Transportation", color: "#38bdf8" },
  HEALTHCARE: { label: "Healthcare", color: "#f87171" },
  HOUSING: { label: "Housing", color: "#f59e0b" },
  BILLPAYMENT: { label: "Bill Payment", color: "#fde68a" },
  ENTERTAINMENT: { label: "Entertainment", color: "#fb923c" },
  OVERALL: { label: "Other", color: "#fbbf24" },
};

const formatNum = (val) => {
  const num = Number(val ?? 0);
  if (Number.isNaN(num)) return "0.00";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const BudgetComparisonTable = ({ budgets = [], summaries = {} }) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(budgets.length / BUDGET_PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [budgets.length]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedBudgets = useMemo(() => {
    const start = (page - 1) * BUDGET_PAGE_SIZE;
    return budgets.slice(start, start + BUDGET_PAGE_SIZE);
  }, [budgets, page]);

  if (!budgets.length) return null;

  const startIdx = (page - 1) * BUDGET_PAGE_SIZE;

  return (
    <div className="col-12">
      <div className="bb-panel bb-ledger-panel">
        <div className="bb-panel-heading">
          <div>
            <span className="bb-panel-eyebrow">BUDGET VS. ACTUAL</span>
            <h5 className="bb-panel-title mb-1">Budget Comparison Matrix</h5>
            <p className="bb-panel-subtitle mb-0">
              Side-by-side comparison of targets, actual spending, remaining
              balance, and dates
            </p>
          </div>
          <span className="bb-total-records">
            {budgets.length} {budgets.length === 1 ? "budget" : "budgets"}
          </span>
        </div>

        <div className="bb-table-scroll mt-3">
          <table className="bb-ledger-table">
            <thead>
              <tr>
                <th>BUDGET</th>
                <th>CATEGORY</th>
                <th>PERIOD</th>
                <th>WINDOW</th>
                <th className="text-end">TARGET</th>
                <th className="text-end">SPENT</th>
                <th className="text-end">REMAINING</th>
                <th className="text-end">% USED</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBudgets.map((b) => {
                const sum = summaries[b.id];
                const target = Number(sum?.target ?? b.target ?? 0);
                const spent = Number(sum?.spent ?? 0);
                const remaining = Number(sum?.remaining ?? target - spent);
                const pct = Number(
                  sum?.percentageUsed ??
                    (target > 0 ? (spent / target) * 100 : 0),
                );
                const isOver = Boolean(
                  sum?.isOverBudget ?? b.isOverBudget ?? spent > target,
                );
                const isExpired = Boolean(sum?.isExpired);
                const catMeta = CAT_META[b.category] || {
                  label: String(b.category || "Overall").replace(/_/g, " "),
                  color: "#fbbf24",
                };

                return (
                  <tr key={b.id}>
                    <td>
                      <div className="bb-transaction-cell">
                        <span
                          className="bb-transaction-category-icon"
                          style={{ "--category-color": catMeta.color }}
                        >
                          {catMeta.label.charAt(0)}
                        </span>
                        <div className="bb-transaction-copy">
                          <strong>{b.name || "Untitled"}</strong>
                          <span>{b.currency || "MMK"}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="fr-pill-tag fr-tag-budget">
                        {catMeta.label}
                      </span>
                    </td>
                    <td>
                      <span className="bb-acct-text">{b.period || "—"}</span>
                    </td>
                    <td>
                      <div className="bb-date-cell">
                        <strong>{b.startDate || "—"}</strong>
                        <span>to {b.endDate || "—"}</span>
                      </div>
                    </td>
                    <td className="text-end">
                      <span className="bb-amt-tr">{formatNum(target)}</span>
                    </td>
                    <td className="text-end">
                      <span className="bb-amt-out">{formatNum(spent)}</span>
                    </td>
                    <td className="text-end">
                      <span
                        className={
                          remaining < 0 ? "bb-amt-out" : "bb-amt-in"
                        }
                      >
                        {formatNum(remaining)}
                      </span>
                    </td>
                    <td className="text-end">
                      <strong>{pct.toFixed(1)}%</strong>
                    </td>
                    <td>
                      {isOver ? (
                        <span className="fr-pill-tag fr-tag-expense">
                          OVER BUDGET
                        </span>
                      ) : isExpired ? (
                        <span className="fr-pill-tag fr-tag-budget">
                          EXPIRED
                        </span>
                      ) : b.active ? (
                        <span className="fr-pill-tag fr-tag-income">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="fr-pill-tag fr-tag-budget">
                          INACTIVE
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-3 mt-2 border-top border-secondary border-opacity-25">
          <span className="fr-caption">
            Showing {startIdx + 1}–
            {Math.min(startIdx + BUDGET_PAGE_SIZE, budgets.length)} of{" "}
            {budgets.length}
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
      </div>
    </div>
  );
};

export default BudgetComparisonTable;