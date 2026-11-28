const CATEGORY_ICONS = {
  FOOD: "fa-utensils",
  GROCERIES: "fa-basket-shopping",
  TRANSPORTATION: "fa-car",
  HEALTHCARE: "fa-heart-pulse",
  HOUSING: "fa-house",
  BILLPAYMENT: "fa-file-invoice-dollar",
  ENTERTAINMENT: "fa-film",
  OVERALL: "fa-layer-group",
};

const formatAmount = (val, currency = "MMK") => {
  const num = Number(val ?? 0);
  if (Number.isNaN(num)) return `0.00 ${currency}`;
  return `${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
};

const BudgetCard = ({
  budget,
  summary,
  featured = false,
  loading = false,
  onEdit,
  onToggleActive,
  onRefreshSummary,
  onDelete,
}) => {
  const currency = summary?.currency || budget.currency || "MMK";
  const target = Number(summary?.target ?? budget.target ?? 0);
  const spent = Number(summary?.spent ?? 0);
  const remaining = Number(summary?.remaining ?? target - spent);
  const pct = Number(
    summary?.percentageUsed ?? (target > 0 ? (spent / target) * 100 : 0),
  );
  const isOver = Boolean(
    summary?.isOverBudget ?? budget.isOverBudget ?? spent > target,
  );
  const isExpired = Boolean(summary?.isExpired);
  const barPct = Math.max(0, Math.min(100, pct));

  const iconClass = CATEGORY_ICONS[budget.category] || "fa-chart-pie";

  return (
    <div className="col-12 col-md-6 col-xl-4">
      <div
        className={`fr-box d-flex flex-column justify-content-between ${
          featured ? "fr-box-budget" : ""
        }`}
      >
        <div
          className={`fr-top-glow ${
            isOver
              ? "fr-glow-expense"
              : featured
                ? "fr-glow-budget"
                : "fr-glow-income"
          }`}
        />

        <div>
          {/* Card Header */}
          <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
            <div className="d-flex align-items-center gap-3 min-w-0">
              <div className="fr-badge-icon fr-bi-budget">
                <i className={`fa-solid ${iconClass}`} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="fr-label text-truncate">
                  {budget.name || String(budget.category || "").replace(/_/g, " ")}
                </div>
                <div className="fr-subtag">
                  {String(budget.category || "").replace(/_/g, " ")} &bull;{" "}
                  <strong>{budget.period}</strong>
                </div>
              </div>
            </div>

            <span
              className={`fr-pill-tag flex-shrink-0 ${
                isOver
                  ? "fr-tag-expense"
                  : isExpired
                    ? "fr-tag-budget"
                    : budget.active
                      ? "fr-tag-income"
                      : "fr-tag-budget"
              }`}
            >
              {isOver
                ? "OVER BUDGET"
                : isExpired
                  ? "EXPIRED"
                  : budget.active
                    ? "ACTIVE"
                    : "INACTIVE"}
            </span>
          </div>

          {/* Target & Spent Well */}
          <div
            className="p-3 rounded-3 mb-3"
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="fr-caption">Target Limit</span>
              <span className="fr-subtag">
                {budget.startDate} &rarr; {budget.endDate}
              </span>
            </div>
            <div
              className={`fr-value mb-2 ${featured ? "fr-value-gold" : ""}`}
            >
              {formatAmount(target, currency)}
            </div>

            {/* Progress Bar */}
            <div
              className="w-100 rounded-pill overflow-hidden mb-2"
              style={{
                height: "8px",
                background: "rgba(255, 255, 255, 0.08)",
              }}
            >
              <div
                className="h-100 rounded-pill"
                style={{
                  width: `${barPct}%`,
                  background: isOver
                    ? "#f87171"
                    : pct >= 80
                      ? "#f59e0b"
                      : "#34d399",
                }}
              />
            </div>

            <div className="d-flex justify-content-between fr-caption">
              <span>Spent: {formatAmount(spent, currency)}</span>
              <span>{pct.toFixed(1)}%</span>
            </div>
            <div className="d-flex justify-content-between fr-subtag mt-1">
              <span>Remaining</span>
              <strong className={remaining < 0 ? "text-danger" : "text-success"}>
                {formatAmount(remaining, currency)}
              </strong>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 pt-2 border-top border-secondary border-opacity-25">
          <button
            type="button"
            className="btn-ghost py-1 px-2 small"
            onClick={() => onRefreshSummary(budget.id)}
            disabled={loading}
            title="Refresh Summary"
          >
            <i className="fa-solid fa-rotate-right" aria-hidden="true" />
            <span>Sync</span>
          </button>

          <button
            type="button"
            className="btn-ghost py-1 px-2 small"
            onClick={() => onToggleActive(budget)}
            disabled={loading}
          >
            <i
              className={`fa-solid ${budget.active ? "fa-pause" : "fa-play"}`}
              aria-hidden="true"
            />
            <span>{budget.active ? "Pause" : "Activate"}</span>
          </button>

          <button
            type="button"
            className="btn-ghost py-1 px-2 small"
            onClick={() => onEdit(budget)}
            disabled={loading}
          >
            <i className="fa-solid fa-pen" aria-hidden="true" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            className="btn-ghost py-1 px-2 small text-danger"
            onClick={() => onDelete(budget.id, budget.name || budget.category)}
            disabled={loading}
          >
            <i className="fa-solid fa-trash" aria-hidden="true" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;