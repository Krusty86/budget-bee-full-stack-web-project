import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBudgets,
  fetchBudgetSummary,
  editBudget,
  deleteBudget,
  clearBudgetError,
} from "../../reducers/budgetSlice";
import {
  selectBudgets,
  selectBudgetLoading,
  selectBudgetError,
} from "../../selectors/budgetSelector";
import BudgetStatsStrip from "./BudgetStatsStrip";
import BudgetChartsComparison from "./BudgetChartsComparison";
import BudgetCard from "./BudgetCard";
import BudgetForm from "./BudgetForm";

const STATUS_TABS = ["ALL", "ACTIVE", "INACTIVE", "OVER_BUDGET", "EXPIRED"];

const BudgetOverview = () => {
  const dispatch = useDispatch();
  const budgets = useSelector(selectBudgets);
  const loading = useSelector(selectBudgetLoading);
  const error = useSelector(selectBudgetError);
  const summaries = useSelector((state) => state.budgets.summaries || {});

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCharts, setShowCharts] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  useEffect(() => {
    budgets.forEach((b) => {
      if (b?.id && !summaries[b.id]) {
        dispatch(fetchBudgetSummary(b.id));
      }
    });
  }, [budgets, summaries, dispatch]);

  const filteredBudgets = useMemo(() => {
    return budgets.filter((b) => {
      const sum = summaries[b.id];
      const isOver = Boolean(
        sum?.isOverBudget ??
          b.isOverBudget ??
          (Number(sum?.spent ?? 0) > Number(b.target ?? 0)),
      );
      const isExpired = Boolean(sum?.isExpired);

      if (statusFilter === "ACTIVE" && !b.active) return false;
      if (statusFilter === "INACTIVE" && b.active) return false;
      if (statusFilter === "OVER_BUDGET" && !isOver) return false;
      if (statusFilter === "EXPIRED" && !isExpired) return false;

      if (categoryFilter !== "ALL" && b.category !== categoryFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const nameMatch = String(b.name || "").toLowerCase().includes(q);
        const catMatch = String(b.category || "").toLowerCase().includes(q);
        if (!nameMatch && !catMatch) return false;
      }

      return true;
    });
  }, [budgets, summaries, statusFilter, categoryFilter, searchQuery]);

  const handleToggleActive = (budget) => {
    dispatch(
      editBudget({
        id: budget.id,
        budget: { ...budget, active: !budget.active },
      }),
    );
  };

  const handleRefreshSummary = (id) => {
    dispatch(fetchBudgetSummary(id));
  };

  const handleDelete = (id, label) => {
    if (window.confirm(`Remove budget "${label}"?`)) {
      dispatch(deleteBudget(id));
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBudget(null);
    dispatch(clearBudgetError());
  };

  const handleSaved = (savedBudget) => {
    if (savedBudget?.id) {
      dispatch(fetchBudgetSummary(savedBudget.id));
    }
  };

  return (
    <>
      {/* Top Action Toolbar */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <div className="fr-caption">
          Track targets, spending pace, category limits, and budget summaries
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setShowCharts((prev) => !prev)}
          >
            <i className="fa-solid fa-chart-column" aria-hidden="true" />
            <span>{showCharts ? "Hide Charts" : "Show Charts"}</span>
          </button>

          <button
            type="button"
            className="btn-gold"
            onClick={() => {
              setEditingBudget(null);
              setShowForm((prev) => !prev);
            }}
          >
            <span>{showForm ? "Close Form" : "+ Add Budget"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bb-pf-feedback bb-pf-feedback-error py-2 mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Create / Edit Budget Form */}
      {showForm && (
        <BudgetForm
          initialBudget={editingBudget}
          onClose={handleCloseForm}
          onSaved={handleSaved}
        />
      )}

      {/* KPI Summary Cards */}
      <BudgetStatsStrip budgets={filteredBudgets} summaries={summaries} />

      {/* Filter Bar */}
      <div className="fr-box p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-lg-6">
            <div className="d-flex flex-wrap gap-2">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`bb-pill ${statusFilter === tab ? "active" : ""}`}
                  onClick={() => setStatusFilter(tab)}
                >
                  {tab.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <select
              className="form-select bb-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="FOOD">FOOD</option>
              <option value="GROCERIES">GROCERIES</option>
              <option value="TRANSPORTATION">TRANSPORTATION</option>
              <option value="HEALTHCARE">HEALTHCARE</option>
              <option value="HOUSING">HOUSING</option>
              <option value="BILLPAYMENT">BILLPAYMENT</option>
              <option value="ENTERTAINMENT">ENTERTAINMENT</option>
              <option value="OVERALL">OVERALL</option>
            </select>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <input
              type="text"
              className="form-control bb-input"
              placeholder="Search budget name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
              {/* Budget Cards Grid */}
      {filteredBudgets.length > 0 && (
        <div className="row g-3">
          {filteredBudgets.map((budget, index) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              summary={summaries[budget.id]}
              featured={index === 0}
              loading={loading}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
              onRefreshSummary={handleRefreshSummary}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      {/* Charts & Comparison Table */}
      {showCharts && (
        <BudgetChartsComparison
          budgets={filteredBudgets}
          summaries={summaries}
        />
      )}

      {/* Loading State */}
      {loading && budgets.length === 0 && (
        <div className="row g-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="col-12 col-md-6 col-xl-4">
              <div className="fr-box p-4">
                <div className="placeholder-glow">
                  <span className="placeholder col-5 mb-3 d-block" />
                  <span className="placeholder col-8 placeholder-lg mb-3 d-block" />
                  <span className="placeholder col-4 d-block" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredBudgets.length === 0 && (
        <div className="fr-box fr-box-budget text-center py-5 px-4">
          <div className="fr-top-glow fr-glow-budget" />
          <span className="gold-badge mb-3">No Budgets Found</span>
          <h5 className="fw-bold mb-2">
            Create a budget to monitor spending limits
          </h5>
          <p className="fr-caption mb-4">
            Set weekly, monthly, or custom targets and compare actual spend against your plan.
          </p>
          <button
            type="button"
            className="btn-gold"
            onClick={() => {
              setEditingBudget(null);
              setShowForm(true);
            }}
          >
            + Add Your First Budget
          </button>
        </div>
      )}

      
    </>
  );
};

export default BudgetOverview;