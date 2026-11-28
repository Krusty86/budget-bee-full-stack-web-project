
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBudget, editBudget } from "../../reducers/budgetSlice";
import {
  selectBudgetLoading,
  selectBudgetError,
} from "../../selectors/budgetSelector";

const CATEGORIES = [
  "FOOD",
  "GROCERIES",
  "TRANSPORTATION",
  "HEALTHCARE",
  "HOUSING",
  "BILLPAYMENT",
  "ENTERTAINMENT",
  "OVERALL",
];

const PERIODS = ["WEEKLY", "MONTHLY", "CUSTOM"];

// Format date as YYYY-MM-DD using local timezone
const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Parse date safely without UTC timezone conversion
const parseDateInput = (value) => {
  if (!value) return new Date();

  if (value instanceof Date) {
    return new Date(value);
  }

  if (typeof value !== "string") {
    return new Date();
  }

  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
};

// Add one month while preserving the day where possible
const addOneMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const targetMonth = month + 1;
  const lastDayOfTargetMonth = new Date(
    year,
    targetMonth + 1,
    0
  ).getDate();

  return new Date(
    year,
    targetMonth,
    Math.min(day, lastDayOfTargetMonth)
  );
};

// Calculate end date based on selected period and start date
const getEndDateByPeriod = (period, startDate) => {
  if (!startDate || period === "CUSTOM") return "";

  const date = parseDateInput(startDate);

  if (Number.isNaN(date.getTime())) return "";

  if (period === "MONTHLY") {
    return formatDateInput(addOneMonth(date));
  }

  if (period === "WEEKLY") {
    date.setDate(date.getDate() + 6);
    return formatDateInput(date);
  }

  return "";
};

// Calculate default date range based on current date
const getPeriodDateRange = (period, anchorDate = "") => {
  const referenceDate = parseDateInput(anchorDate);

  if (Number.isNaN(referenceDate.getTime())) return null;

  if (period === "WEEKLY") {
    const startDate = new Date(referenceDate);

    // Monday is the first day of the week
    const day = startDate.getDay();
    const difference = day === 0 ? 6 : day - 1;

    startDate.setDate(startDate.getDate() - difference);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    return {
      startDate: formatDateInput(startDate),
      endDate: formatDateInput(endDate),
    };
  }

  if (period === "MONTHLY") {
    const startDate = new Date(referenceDate);
    const endDate = addOneMonth(startDate);

    return {
      startDate: formatDateInput(startDate),
      endDate: formatDateInput(endDate),
    };
  }

  return null;
};

const formatPreview = (val, currency) => {
  const num = Number(val);

  if (val === "" || !Number.isFinite(num)) {
    return `0.00 ${currency || "MMK"}`;
  }

  return `${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency || "MMK"}`;
};

const BudgetForm = ({ initialBudget = null, onClose, onSaved }) => {
  const dispatch = useDispatch();

  const loading = useSelector(selectBudgetLoading);
  const apiError = useSelector(selectBudgetError);

  const [formData, setFormData] = useState({
    name: "",
    target: "",
    currency: "MMK",
    category: "FOOD",
    period: "MONTHLY",
    startDate: "",
    endDate: "",
    active: true,
  });

  const [validationError, setValidationError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Initialize form for create/edit
  useEffect(() => {
    if (initialBudget) {
      const nextFormData = {
        name: initialBudget.name || "",
        target: initialBudget.target ?? "",
        currency: initialBudget.currency || "MMK",
        category: initialBudget.category || "FOOD",
        period: initialBudget.period || "MONTHLY",
        startDate: initialBudget.startDate || "",
        endDate: initialBudget.endDate || "",
        active: initialBudget.active ?? true,
      };

      // Fill missing dates for WEEKLY and MONTHLY budgets fail safe
      if (
        nextFormData.period !== "CUSTOM" &&
        (!nextFormData.startDate || !nextFormData.endDate)
      ) {
        if (nextFormData.startDate) {
          nextFormData.endDate = getEndDateByPeriod(
            nextFormData.period,
            nextFormData.startDate
          );
        } else {
          const defaults = getPeriodDateRange(
            nextFormData.period,
            new Date()
          );

          if (defaults) {
            nextFormData.startDate = defaults.startDate;
            nextFormData.endDate = defaults.endDate;
          }
        }
      }

      setFormData(nextFormData);
    } else {
      setFormData({
        name: "",
        target: "",
        currency: "MMK",
        category: "FOOD",
        period: "MONTHLY",
        startDate: "",
        endDate: "",
        active: true,
      });
    }

    setValidationError("");
  }, [initialBudget]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setValidationError("");

    setFormData((prev) => {
      // Period changed
      if (name === "period") {
        if (value === "CUSTOM") {
          return {
            ...prev,
            period: value,
          };
        }

        // if start date exits: calculate end date from it
        if (prev.startDate) {
          return {
            ...prev,
            period: value,
            endDate: getEndDateByPeriod(value, prev.startDate),
          };
        }

        // No start date: generate both dates using today's date
        const defaults = getPeriodDateRange(value, new Date());

        return {
          ...prev,
          period: value,
          startDate: defaults?.startDate || "",
          endDate: defaults?.endDate || "",
        };
      }

      // Start date changed
      if (name === "startDate") {
        if (!value) {
          // If cleared, regenerate dates from current date
          if (prev.period !== "CUSTOM") {
            const defaults = getPeriodDateRange(
              prev.period,
              new Date()
            );

            return {
              ...prev,
              startDate: "",
              endDate: defaults?.endDate || "",
            };
          }

          return {
            ...prev,
            startDate: "",
          };
        }

        return {
          ...prev,
          startDate: value,
          endDate:
            prev.period === "CUSTOM"
              ? prev.endDate
              : getEndDateByPeriod(prev.period, value),
        };
      }

      // Other form fields
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  // Submit budget
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting || loading) return;

    setValidationError("");

    // Validate target amount
    const numericTarget = Number(formData.target);

    if (
      formData.target === "" ||
      !Number.isFinite(numericTarget) ||
      numericTarget <= 0
    ) {
      setValidationError(
        "Please enter a valid positive budget target."
      );
      return;
    }

    // Resolve dates before submission
    let startDate = formData.startDate;
    let endDate = formData.endDate;

    if (formData.period !== "CUSTOM") {
      if (startDate) {
        endDate = getEndDateByPeriod(
          formData.period,
          startDate
        );
      } else {
        const defaults = getPeriodDateRange(
          formData.period,
          new Date()
        );

        if (defaults) {
          startDate = defaults.startDate;
          endDate = defaults.endDate;
        }
      }
    }

    // Validate dates
    if (!startDate || !endDate) {
      setValidationError(
        "Please select both start and end dates."
      );
      return;
    }

    const parsedStart = parseDateInput(startDate);
    const parsedEnd = parseDateInput(endDate);

    if (
      Number.isNaN(parsedStart.getTime()) ||
      Number.isNaN(parsedEnd.getTime())
    ) {
      setValidationError("Please enter valid dates.");
      return;
    }

    if (endDate < startDate) {
      setValidationError(
        "End date cannot be earlier than start date."
      );
      return;
    }

    // Validate currency
    const currency = (formData.currency || "MMK")
      .trim()
      .toUpperCase();

    if (!/^[A-Z]{3}$/.test(currency)) {
      setValidationError(
        "Please enter a valid 3-letter currency code."
      );
      return;
    }

    const payload = {
      name:
        formData.name.trim() ||
        `${formData.category} Budget`,
      target: numericTarget,
      currency,
      category: formData.category,
      period: formData.period,
      startDate,
      endDate,
      active: Boolean(formData.active),
    };

    // Update visible dates before saving
    setFormData((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));

    setSubmitting(true);

    try {
      const action = initialBudget?.id
        ? await dispatch(
            editBudget({
              id: initialBudget.id,
              budget: payload,
            })
          )
        : await dispatch(addBudget(payload));

      const isFulfilled = initialBudget?.id
        ? editBudget.fulfilled.match(action)
        : addBudget.fulfilled.match(action);

      if (isFulfilled) {
        onSaved?.(action.payload);
        onClose?.();
      }
    } catch (error) {
      console.error("Budget submission failed:", error);
      setValidationError(
        "Something went wrong while saving your budget."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = loading || submitting;

  return (
    <div className="row g-4 align-items-start mb-4">

      {/* Left: Live Budget Card Preview */}
      <div className="col-12 col-lg-5">
        <div className="fr-box-acc fr-box-budget p-4">
          <div className="fr-top-glow fr-glow-budget" />

          <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
            <span className="gold-badge">
              Live Budget Preview
            </span>

            <span className="fr-pill-tag fr-tag-budget">
              {formData.period}
            </span>
          </div>

          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="fr-badge-icon fr-bi-budget">
              <i
                className="fa-solid fa-wallet"
                aria-hidden="true"
              />
            </div>

            <div>
              <div className="fr-label">
                {formData.name.trim() ||
                  `${formData.category} Budget`}
              </div>

              <div className="fr-subtag">
                Category: {String(formData.category).replace(/_/g, " ")} &bull;{" "}
                {formData.active ? "ACTIVE" : "INACTIVE"}
              </div>
            </div>
          </div>

          <div className="fr-caption mb-1">
            Target Limit
          </div>

          <div className="fr-value fr-value-gold mb-2">
            {formatPreview(
              formData.target,
              formData.currency
            )}
          </div>

          <div className="fr-subtag">
            Period: <strong>{formData.startDate || "Start"}</strong>{" "}
            &rarr; <strong>{formData.endDate || "End"}</strong>
          </div>
        </div>
      </div>

      {/* Right: Budget Form */}
      <div className="col-12 col-lg-7">
        <div className="fr-box-acc fr-box-budget p-4">
          <div className="fr-top-glow fr-glow-budget" />

          <div className="mb-3">
            <span className="gold-badge">
              {initialBudget?.id
                ? "Update Budget"
                : "Create New Budget"}
            </span>
          </div>

          {(validationError || apiError) && (
            <div
              className="bb-pf-feedback bb-pf-feedback-error py-2 mb-3"
              role="alert"
            >
              {validationError || apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-8">
                <label
                  htmlFor="budgetName"
                  className="form-label fr-label"
                >
                  Budget Name
                </label>

                <input
                  id="budgetName"
                  name="name"
                  type="text"
                  className="form-control bb-input"
                  placeholder="e.g., Monthly Food & Dining"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-sm-4">
                <label
                  htmlFor="currency"
                  className="form-label fr-label"
                >
                  Currency
                </label>

                <input
                  id="currency"
                  name="currency"
                  type="text"
                  maxLength={3}
                  className="form-control bb-input"
                  value={formData.currency}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-4">
                <label
                  htmlFor="target"
                  className="form-label fr-label"
                >
                  Target Amount
                </label>

                <input
                  id="target"
                  name="target"
                  type="number"
                  min="0.01"
                  step="0.01"
                  className="form-control bb-input"
                  placeholder="0.00"
                  value={formData.target}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-sm-4">
                <label
                  htmlFor="category"
                  className="form-label fr-label"
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  className="form-select bb-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-sm-4">
                <label
                  htmlFor="period"
                  className="form-label fr-label"
                >
                  Period
                </label>

                <select
                  id="period"
                  name="period"
                  className="form-select bb-select"
                  value={formData.period}
                  onChange={handleChange}
                >
                  {PERIODS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-12 col-sm-6">
                <label
                  htmlFor="startDate"
                  className="form-label fr-label"
                >
                  Start Date
                </label>

                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  max={formData.endDate || undefined}
                  className="form-control bb-input"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-sm-6">
                <label
                  htmlFor="endDate"
                  className="form-label fr-label"
                >
                  End Date
                </label>

                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  min={formData.startDate || undefined}
                  className="form-control bb-input"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-check form-switch mb-4">
              <input
                id="active"
                name="active"
                type="checkbox"
                className="form-check-input"
                checked={Boolean(formData.active)}
                onChange={handleChange}
              />

              <label
                htmlFor="active"
                className="form-check-label fr-label"
              >
                Active Budget
              </label>
            </div>

            <div className="d-flex justify-content-end gap-2">
              {onClose && (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={onClose}
                  disabled={isBusy}
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className="btn-gold"
                disabled={isBusy}
              >
                {isBusy
                  ? "Saving..."
                  : initialBudget?.id
                    ? "Update Budget"
                    : "Save Budget"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BudgetForm;
