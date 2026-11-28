import BudgetComparisonTable from "./BudgetComparisonTable";

const formatNum = (val) => {
  const num = Number(val ?? 0);
  if (Number.isNaN(num)) return "0.00";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getTimePace = (startDate, endDate) => {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = Date.now();
  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return null;
  const raw = ((now - start) / (end - start)) * 100;
  return Math.max(0, Math.min(100, raw));
};

const BudgetChartsComparison = ({ budgets, summaries }) => {
  if (!budgets.length) return null;

  const maxAmount = Math.max(
    1,
    ...budgets.map((b) => {
      const sum = summaries[b.id];
      return Math.max(
        Number(sum?.target ?? b.target ?? 0),
        Number(sum?.spent ?? 0),
      );
    }),
  );

  // Group by BudgetCategory for category comparison
  const categoryMap = budgets.reduce((acc, b) => {
    const sum = summaries[b.id];
    const cat = b.category || "OVERALL";
    if (!acc[cat]) {
      acc[cat] = { category: cat, target: 0, spent: 0, count: 0 };
    }
    acc[cat].target += Number(sum?.target ?? b.target ?? 0);
    acc[cat].spent += Number(sum?.spent ?? 0);
    acc[cat].count += 1;
    return acc;
  }, {});

  const categoryRows = Object.values(categoryMap).sort(
    (a, b) => b.target - a.target,
  );
  const maxCategoryTarget = Math.max(1, ...categoryRows.map((c) => c.target));

  return (
    <div className="row g-3 mb-4">
      {/* Left: Target vs Actual Spent per Budget */}
      <div className="col-12 col-xl-7">
        <div className="fr-box p-4">
          <div className="fr-top-glow fr-glow-budget" />
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
            <div>
              <span className="gold-badge mb-2">Comparison Chart</span>
              <h5 className="fw-bold mb-0">Target vs. Actual Spent</h5>
              <div className="fr-caption">
                Gold bar = target limit &bull; Progress bar = actual spending
                &amp; time pace
              </div>
            </div>
          </div>

          <div className="d-flex flex-column gap-3 mt-3">
            {budgets.map((b) => {
              const sum = summaries[b.id];
              const target = Number(sum?.target ?? b.target ?? 0);
              const spent = Number(sum?.spent ?? 0);
              const pct = Number(
                sum?.percentageUsed ??
                  (target > 0 ? (spent / target) * 100 : 0),
              );
              const isOver = Boolean(
                sum?.isOverBudget ?? b.isOverBudget ?? spent > target,
              );
              const targetWidth = Math.min(100, (target / maxAmount) * 100);
              const spentWidth = Math.min(100, (spent / maxAmount) * 100);
              const timePace = getTimePace(b.startDate, b.endDate);

              return (
                <div
                  key={b.id}
                  className="p-3 rounded-3"
                  style={{
                    background: "rgba(255, 255, 255, 0.025)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold">{b.name || b.category}</span>
                      <span className="fr-pill-tag fr-tag-budget">
                        {b.period}
                      </span>
                    </div>
                    <div className="fr-caption">
                      Spent <strong>{formatNum(spent)}</strong> /{" "}
                      {formatNum(target)} {b.currency || "MMK"} (
                      {pct.toFixed(1)}%)
                    </div>
                  </div>

                  {/* Target track */}
                  <div
                    className="w-100 rounded-pill overflow-hidden mb-1"
                    style={{
                      height: "8px",
                      background: "rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <div
                      className="h-100 rounded-pill"
                      style={{
                        width: `${targetWidth}%`,
                        background: "rgba(251, 191, 36, 0.28)",
                      }}
                    />
                  </div>

                  {/* Spent bar */}
                  <div
                    className="w-100 rounded-pill overflow-hidden"
                    style={{
                      height: "10px",
                      background: "rgba(15, 23, 42, 0.8)",
                    }}
                  >
                    <div
                      className="h-100 rounded-pill"
                      style={{
                        width: `${spentWidth}%`,
                        background: isOver
                          ? "#f87171"
                          : pct >= 80
                            ? "#f59e0b"
                            : "#34d399",
                      }}
                    />
                  </div>

                  {timePace !== null && (
                    <div className="d-flex justify-content-between fr-subtag mt-1">
                      <span>Cycle elapsed: {timePace.toFixed(0)}%</span>
                      <span>
                        {pct > timePace + 10
                          ? "Spending faster than schedule"
                          : "On pace with schedule"}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Category Breakdown Chart */}
      <div className="col-12 col-xl-5">
        <div className="fr-box p-4">
          <div className="fr-top-glow fr-glow-income" />
          <span className="gold-badge mb-2">Category Statistics</span>
          <h5 className="fw-bold mb-0">Allocation by Category</h5>
          <div className="fr-caption mb-3">
            Target vs. spent grouped by BudgetCategory
          </div>

          <div className="d-flex flex-column gap-3">
            {categoryRows.map((row) => {
              const barPct = Math.min(
                100,
                (row.target / maxCategoryTarget) * 100,
              );
              const usedPct =
                row.target > 0
                  ? Math.min(999, (row.spent / row.target) * 100)
                  : 0;

              return (
                <div key={row.category}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fr-label">
                      {String(row.category).replace(/_/g, " ")}
                    </span>
                    <span className="fr-caption">
                      {formatNum(row.spent)} / {formatNum(row.target)}
                    </span>
                  </div>
                  <div
                    className="w-100 rounded-pill overflow-hidden"
                    style={{
                      height: "8px",
                      background: "rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <div
                      className="h-100 rounded-pill"
                      style={{
                        width: `${barPct}%`,
                        background:
                          "linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)",
                      }}
                    />
                  </div>
                  <div className="fr-subtag">
                    {row.count} budget(s) &bull; {usedPct.toFixed(0)}% utilized
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BudgetComparisonTable budgets={budgets} summaries={summaries} />
    </div>
  );
};

export default BudgetChartsComparison;
