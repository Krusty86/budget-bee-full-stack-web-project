import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addAccount } from "../../reducers/AccountSlice";
import {
  selectAccountLoading,
  selectAccountError,
} from "../../selectors/accountSelector";

// Match values to your backend FinancialAccountType enum
const ACCOUNT_TYPES = [
  {
    value: "CASH",
    label: "Cash",
    badge: "PHYSICAL CASH",
    icon: "fa-money-bill-wave",
    hint: "Everyday bills, coins, or petty cash on hand.",
  },
  {
    value: "BANK",
    label: "Bank Account",
    badge: "BANK ACCOUNT",
    icon: "fa-building-columns",
    hint: "Checking, savings, or salary accounts.",
  },
  {
    value: "EWALLET",
    label: "E-Wallet",
    badge: "DIGITAL WALLET",
    icon: "fa-mobile-screen-button",
    hint: "Mobile money and instant payment wallets.",
  },
];

const CURRENCIES = ["MMK", "USD", "THB", "SGD", "EUR"];

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

.bb-chip-btn {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: #94a3b8;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.bb-chip-btn:hover,
.bb-chip-btn.is-selected {
  color: #fbbf24;
  border-color: rgba(251, 191, 36, 0.45);
  background: rgba(245, 158, 11, 0.14);
}
`;

const formatPreviewBalance = (rawBalance, currency) => {
  const num = Number(rawBalance);
  const cleanCurrency = (currency || "").trim().toUpperCase();
  if (rawBalance === "" || Number.isNaN(num)) {
    return cleanCurrency ? `0.00 ${cleanCurrency}` : "0.00";
  }
  const formatted = num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return cleanCurrency ? `${formatted} ${cleanCurrency}` : formatted;
};

const AddAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAccountLoading);
  const error = useSelector(selectAccountError);

  const [formData, setFormData] = useState({
    accname: "",
    account_type: "CASH",
    currency: "MMK",
    balance: "0.00",
  });

  const [validationError, setValidationError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    const styleId = "budgetbee-add-account-preview-styles";
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

  const handleQuickCurrency = (cur) => {
    setValidationError("");
    triggerPreviewPulse();
    setFormData((prev) => ({
      ...prev,
      currency: cur,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || loading) return;

    if (!formData.accname.trim()) {
      setValidationError("Please enter an account name.");
      return;
    }

    const numericBalance = Number(formData.balance);
    if (formData.balance === "" || Number.isNaN(numericBalance)) {
      setValidationError("Please enter a valid opening balance.");
      return;
    }

    const payload = {
      accname: formData.accname.trim(),
      account_type: formData.account_type,
      currency: formData.currency.trim().toUpperCase(),
      balance: numericBalance,
    };

    setSubmitting(true);
    try {
      const resultAction = await dispatch(addAccount(payload));
      if (addAccount.fulfilled.match(resultAction)) {
        navigate("/accounts");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = loading || submitting;
  const selectedTypeMeta =
    ACCOUNT_TYPES.find((t) => t.value === formData.account_type) ||
    ACCOUNT_TYPES[0];
  const activeCurrency = (formData.currency || "MMK").trim().toUpperCase();

  return (
    <div className="container-fluid px-0">
      {/* Top Heading & Back Button */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <div>
          <h1 className="dashboard-title mb-1">Add Account</h1>
          <div className="fr-caption">
            Create a new financial account for tracking income and expenses
          </div>
        </div>

        <button
          type="button"
          className="btn-ghost"
          onClick={() => navigate("/accounts")}
        >
          &larr; Back to Accounts
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
                {selectedTypeMeta.badge}
              </span>
            </div>

            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="fr-badge-icon fr-bi-budget">
                <i
                  className={`fa-solid ${selectedTypeMeta.icon}`}
                  aria-hidden="true"
                />
              </div>
              <div className="min-w-0">
                <div className="fr-label text-truncate">
                  {formData.accname.trim() || "Untitled Account"}
                </div>
                <div className="fr-subtag">
                  Currency: {activeCurrency || "—"} • {selectedTypeMeta.label}
                </div>
              </div>
            </div>

            <div className="fr-caption mb-1">Opening Balance</div>
            <div className="fr-value fr-value-gold mb-2">
              {formatPreviewBalance(formData.balance, activeCurrency)}
            </div>
            <div className="fr-subtag">{selectedTypeMeta.hint}</div>
          </div>

          {/* Tips & Quick Currency */}
          <div className="fr-box-acc p-4">
            <div className="fr-top-glow fr-glow-income" />
            <div className="fr-label mb-2">Quick Setup Notes</div>
            <div className="fr-caption mb-3">
              Your new account will appear immediately in your account list and
              become available for records and budgets.
            </div>

            <div className="d-flex flex-column gap-2 mb-3">
              <div className="bb-tip-row">
                <span className="fr-pill-tag fr-tag-income">TIP</span>
                <span className="fr-caption">
                  Use clear names like <strong>KBZPay Main</strong> or{" "}
                  <strong>Cash Wallet</strong> to spot balances fast.
                </span>
              </div>
              <div className="bb-tip-row">
                <span className="fr-pill-tag fr-tag-budget">NOTE</span>
                <span className="fr-caption">
                  Choose the right currency now—changing currency or type later
                  can be restricted once transactions exist.
                </span>
              </div>
            </div>

            <div className="fr-subtag mb-2">Quick Currency</div>
            <div className="d-flex flex-wrap gap-1">
              {CURRENCIES.map((cur) => (
                <button
                  key={cur}
                  type="button"
                  className={`bb-chip-btn ${
                    activeCurrency === cur ? "is-selected" : ""
                  }`}
                  onClick={() => handleQuickCurrency(cur)}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Add Account Form */}
        <div className="col-12 col-lg-7">
          <div className="fr-box-acc fr-box-budget p-4 p-md-4">
            <div className="fr-top-glow fr-glow-budget" />

            <div className="mb-4">
              <span className="gold-badge">New Financial Account</span>
            </div>

            {(validationError || error) && (
              <div className="alert alert-danger mb-4" role="alert">
                {validationError || error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Account Name */}
              <div className="mb-3">
                <label htmlFor="accname" className="form-label fr-label mb-2">
                  Account Name
                </label>
                <input
                  id="accname"
                  name="accname"
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="e.g., KBZ Pay, Main Wallet, SCB Savings"
                  value={formData.accname}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Account Type & Currency */}
              <div className="row g-3 mb-3">
                <div className="col-12 col-sm-6">
                  <label
                    htmlFor="account_type"
                    className="form-label fr-label mb-2"
                  >
                    Account Type
                  </label>
                  <select
                    id="account_type"
                    name="account_type"
                    className="form-select bg-dark text-light border-secondary"
                    value={formData.account_type}
                    onChange={handleChange}
                  >
                    {ACCOUNT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-sm-6">
                  <label
                    htmlFor="currency"
                    className="form-label fr-label mb-2"
                  >
                    Currency
                  </label>
                  <input
                    id="currency"
                    name="currency"
                    list="currency-options"
                    type="text"
                    className="form-control bg-dark text-light border-secondary text-uppercase"
                    placeholder="MMK / USD"
                    maxLength={6}
                    value={formData.currency}
                    onChange={handleChange}
                    required
                  />
                  <datalist id="currency-options">
                    {CURRENCIES.map((cur) => (
                      <option key={cur} value={cur} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Initial Balance */}
              <div className="mb-4">
                <label htmlFor="balance" className="form-label fr-label mb-2">
                  Opening Balance
                </label>
                <input
                  id="balance"
                  name="balance"
                  type="number"
                  step="0.01"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="0.00"
                  value={formData.balance}
                  onChange={handleChange}
                  required
                />
                <div className="fr-subtag">
                  Enter the starting balance for this account.
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => navigate("/accounts")}
                  disabled={isBusy}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-gold" disabled={isBusy}>
                  {isBusy ? "Saving..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccount;