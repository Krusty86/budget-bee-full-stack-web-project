import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSubscription } from "../../reducers/SubscriptionSlice";
import {
  selectSubscriptionLoading,
  selectSubscriptionError,
} from "../../selectors/subscriptionSelector";

const BILLING_CYCLES = [
  { value: "WEEKLY", label: "Weekly", badge: "WEEKLY", icon: "fa-calendar-week" },
  { value: "MONTHLY", label: "Monthly", badge: "MONTHLY", icon: "fa-calendar-days" },
  { value: "QUARTERLY", label: "Quarterly", badge: "QUARTERLY", icon: "fa-calendar" },
  { value: "YEARLY", label: "Yearly", badge: "YEARLY", icon: "fa-calendar-check" },
];

const STATUS_OPTIONS = ["ACTIVE", "PAUSED", "CANCELLED","INACTIVE"];

const PREVIEW_STYLES = `
@keyframes bbFloatGlow {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.55;
  }
  50% {
    transform: translateY(-4px) scale(1.04);
    opacity: 0.9;
  }
}

@keyframes bbCardPulse {
  0% {
    box-shadow:
      0 24px 48px rgba(0, 0, 0, 0.48),
      0 0 0 0 rgba(251, 191, 36, 0.35);
  }
  100% {
    box-shadow:
      0 24px 48px rgba(0, 0, 0, 0.48),
      0 0 26px rgba(245, 158, 11, 0.16);
  }
}

.bb-preview-card {
  position: relative;
  overflow: hidden;
  animation: bbCardPulse 0.45s ease-out;
}

.bb-preview-orb {
  position: absolute;
  right: -36px;
  bottom: -36px;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, transparent 72%);
  pointer-events: none;
  animation: bbFloatGlow 4s ease-in-out infinite;
}

.bb-tip-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.bb-tip-row:hover {
  transform: translateX(3px);
  border-color: rgba(251, 191, 36, 0.28);
}
`;

const formatPreviewAmount = (rawAmount) => {
  const num = Number(rawAmount);
  if (rawAmount === "" || Number.isNaN(num)) {
    return "0.00";
  }
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const AddSubscription = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectSubscriptionLoading);
  const error = useSelector(selectSubscriptionError);

  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    status: "ACTIVE",
    billingCycle: "MONTHLY",
    nextPaymentDate: "",
    accountId: "",
  });

  const [validationError, setValidationError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    const styleId = "budgetbee-add-subscription-preview-styles";
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.textContent = PREVIEW_STYLES;
      document.head.appendChild(styleEl);
    }
  }, []);

  const triggerPreviewPulse = () => {
    setPulseKey((k) => k + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValidationError("");
    triggerPreviewPulse();
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || loading) return;

    if (!formData.name.trim()) {
      setValidationError("Please enter a subscription name.");
      return;
    }

    const numericAmount = Number(formData.amount);
    if (formData.amount === "" || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setValidationError("Please enter a valid recurring amount.");
      return;
    }

    if (!formData.nextPaymentDate) {
      setValidationError("Please select the next payment date.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      amount: numericAmount,
      status: formData.status,
      billingCycle: formData.billingCycle,
      nextPaymentDate: formData.nextPaymentDate,
      ...(formData.accountId.trim()
        ? { account: { id: Number(formData.accountId.trim()) } }
        : {}),
    };

    setSubmitting(true);
    try {
      const resultAction = await dispatch(addSubscription(payload));
      if (addSubscription.fulfilled.match(resultAction)) {
        navigate("/subscriptions");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = loading || submitting;
  const selectedCycleMeta =
    BILLING_CYCLES.find((c) => c.value === formData.billingCycle) ||
    BILLING_CYCLES[1];

  return (
    <div className="container-fluid px-0">
      {/* Top Heading & Back Button */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <div>
          <h1 className="dashboard-title mb-1">Add Subscription</h1>
          <div className="fr-caption">
            Track recurring charges, billing cycles, and upcoming due dates
          </div>
        </div>

        <button
          type="button"
          className="btn-ghost"
          onClick={() => navigate("/subscriptions")}
        >
          &larr; Back to Subscriptions
        </button>
      </div>

      <div className="row g-4 align-items-start">
        {/* Left Column: Live Card Preview & Helpful Notes */}
        <div className="col-12 col-lg-5">
          <div
            key={pulseKey}
            className="fr-box-acc fr-box-budget bb-preview-card p-4 mb-3"
          >
            <div className="fr-top-glow fr-glow-budget" />
            <div className="bb-preview-orb" />

            <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
              <span className="gold-badge">Live Card Preview</span>
              <span className="fr-pill-tag fr-tag-budget">
                {selectedCycleMeta.badge}
              </span>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="fr-badge-icon fr-bi-budget">
                <i
                  className={`fa-solid ${selectedCycleMeta.icon}`}
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <div className="fr-label text-truncate">
                  {formData.name.trim() || "Untitled Subscription"}
                </div>
                <div className="fr-subtag">
                  Status: {formData.status} &bull; {selectedCycleMeta.label}
                </div>
              </div>
            </div>

            <div className="fr-caption mb-1">Recurring Amount</div>
            <div className="fr-value fr-value-gold mb-2">
              {formatPreviewAmount(formData.amount)}
            </div>
            <div className="fr-subtag">
              Next Payment: <strong>{formData.nextPaymentDate || "Not set"}</strong>
            </div>
          </div>

          {/* Setup Notes */}
          <div className="fr-box-acc p-4">
            <div className="fr-top-glow fr-glow-income" />
            <div className="fr-label mb-2">Quick Setup Notes</div>
            <div className="fr-caption mb-3">
              Saved subscriptions can be paused, resumed, or cancelled anytime
              from the subscriptions list.
            </div>

            <div className="d-flex flex-column gap-2">
              <div className="bb-tip-row">
                <span className="fr-pill-tag fr-tag-income">TIP</span>
                <span className="fr-caption">
                  Use clear service names like <strong>Cloud Storage</strong> or{" "}
                  <strong>Gym Membership</strong>.
                </span>
              </div>
              <div className="bb-tip-row">
                <span className="fr-pill-tag fr-tag-budget">NOTE</span>
                <span className="fr-caption">
                  Set <strong>Next Payment Date</strong> accurately to track
                  upcoming renewals in order.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Add Subscription Form */}
        <div className="col-12 col-lg-7">
          <div className="fr-box-acc fr-box-budget p-4 p-md-4">
            <div className="fr-top-glow fr-glow-budget" />

            <div className="mb-4">
              <span className="gold-badge">New Recurring Subscription</span>
            </div>

            {(validationError || error) && (
              <div className="bb-pf-feedback bb-pf-feedback-error mb-4" role="alert">
                {validationError || error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Subscription Name */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label fr-label mb-2">
                  Subscription Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="e.g., Streaming Plan, Cloud Storage, Gym"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Amount & Billing Cycle */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label htmlFor="amount" className="form-label fr-label mb-2">
                    Amount
                  </label>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    className="form-control bg-dark text-light border-secondary"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label
                    htmlFor="billingCycle"
                    className="form-label fr-label mb-2"
                  >
                    Billing Cycle
                  </label>
                  <select
                    id="billingCycle"
                    name="billingCycle"
                    className="form-select bg-dark text-light border-secondary"
                    value={formData.billingCycle}
                    onChange={handleChange}
                  >
                    {BILLING_CYCLES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status & Next Payment Date */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label htmlFor="status" className="form-label fr-label mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="form-select bg-dark text-light border-secondary"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-sm-6">
                  <label
                    htmlFor="nextPaymentDate"
                    className="form-label fr-label mb-2"
                  >
                    Next Payment Date
                  </label>
                  <input
                    id="nextPaymentDate"
                    name="nextPaymentDate"
                    type="date"
                    className="form-control bg-dark text-light border-secondary"
                    value={formData.nextPaymentDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Optional Account ID */}
              <div className="mb-4">
                <label htmlFor="accountId" className="form-label fr-label mb-2">
                  Account ID (Optional)
                </label>
                <input
                  id="accountId"
                  name="accountId"
                  type="number"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Enter financial account ID if applicable"
                  value={formData.accountId}
                  onChange={handleChange}
                />
                <div className="fr-subtag">
                  Leave blank if your backend assigns a default account or
                  handles account linking separately.
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => navigate("/subscriptions")}
                  disabled={isBusy}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold" disabled={isBusy}>
                  {isBusy ? "Saving..." : "Save Subscription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubscription;