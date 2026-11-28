const formatMoney = (val, currency = "MMK") => {
  const num = Number(val ?? 0);
  if (Number.isNaN(num)) return `0.00 ${currency}`;
  return `${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
};

const BudgetStatsStrip = ({ budgets, summaries }) => {
  const currency = budgets[0]?.currency || "MMK";

  const stats = budgets.reduce(
    (acc, b) => {
      const sum = summaries[b.id];
      const target = Number(sum?.target ?? b.target ?? 0);
      const spent = Number(sum?.spent ?? 0);
      const remaining = Number(sum?.remaining ?? target - spent);
      const pct = Number(
        sum?.percentageUsed ?? (target > 0 ? (spent / target) * 100 : 0),
      );
      const isOver = Boolean(sum?.isOverBudget ?? b.isOverBudget ?? spent > target);
      const isExpired = Boolean(sum?.isExpired);
      const isNearLimit = !isOver && pct >= 80;

      acc.totalTarget += target;
      acc.totalSpent += spent;
      acc.totalRemaining += remaining;
      if (isOver) acc.overBudgetCount += 1;
      else if (isNearLimit) acc.nearLimitCount += 1;
      if (isExpired) acc.expiredCount += 1;
      return acc;
    },
    {
      totalTarget: 0,
      totalSpent: 0,
      totalRemaining: 0,
      overBudgetCount: 0,
      nearLimitCount: 0,
      expiredCount: 0,
    },
  );

  const burnRate =
    stats.totalTarget > 0
      ? Math.min(999, (stats.totalSpent / stats.totalTarget) * 100)
      : 0;

  return (
    <div className="fr-wrap mb-4">
      <div className="row g-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="fr-box">
            <div className="fr-top-glow fr-glow-budget" />
            <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="fr-badge-icon fr-bi-budget">
                  <i className="fa-solid fa-bullseye" aria-hidden="true" />
                </span>
                <div>
                  <div className="fr-label">Total Target</div>
                  <div className="fr-subtag">{budgets.length} budgets</div>
                </div>
              </div>
              <span className="fr-pill-tag fr-tag-budget">{currency}</span>
            </div>
            <div className="fr-value">{formatMoney(stats.totalTarget, currency)}</div>
            <div className="fr-caption mt-2">Allocated spending ceiling</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="fr-box">
            <div className="fr-top-glow fr-glow-expense" />
            <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="fr-badge-icon fr-bi-expense">
                  <i className="fa-solid fa-fire-flame-curved" aria-hidden="true" />
                </span>
                <div>
                  <div className="fr-label">Total Spent</div>
                  <div className="fr-subtag">Burn: {burnRate.toFixed(1)}%</div>
                </div>
              </div>
              <span className="fr-pill-tag fr-tag-expense">SPENT</span>
            </div>
            <div className="fr-value">{formatMoney(stats.totalSpent, currency)}</div>
            <div className="fr-caption mt-2">
              {stats.overBudgetCount} over budget &bull; {stats.nearLimitCount} at-risk
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="fr-box fr-box-budget">
            <div className="fr-top-glow fr-glow-income" />
            <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="fr-badge-icon fr-bi-income">
                  <i className="fa-solid fa-wallet" aria-hidden="true" />
                </span>
                <div>
                  <div className="fr-label">Remaining Pool</div>
                  <div className="fr-subtag">Available headroom</div>
                </div>
              </div>
              <span className="fr-pill-tag fr-tag-income">BALANCE</span>
            </div>
            <div className="fr-value fr-value-gold">
              {formatMoney(stats.totalRemaining, currency)}
            </div>
            <div className="fr-caption mt-2">Net unspent budget allowance</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="fr-box">
            <div className="fr-top-glow fr-glow-budget" />
            <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
              <div className="d-flex align-items-center gap-2">
                <span className="fr-badge-icon fr-bi-budget">
                  <i className="fa-solid fa-clock-rotate-left" aria-hidden="true" />
                </span>
                <div>
                  <div className="fr-label">Cycle Alerts</div>
                  <div className="fr-subtag">Over / Expired watch</div>
                </div>
              </div>
              <span className="fr-pill-tag fr-tag-budget">
                {stats.overBudgetCount + stats.expiredCount} ALERTS
              </span>
            </div>
            <div className="fr-value">
              {stats.overBudgetCount + stats.expiredCount}
            </div>
            <div className="fr-caption mt-2">
              {stats.expiredCount} expired cycle(s)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetStatsStrip;