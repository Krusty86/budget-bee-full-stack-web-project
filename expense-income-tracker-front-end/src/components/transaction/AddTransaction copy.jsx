
import React, { useState } from "react";

/**
 * TODO [BACKEND]: Replace with FinancialAccount[] from GET /api/accounts
 * Shape: { id: Long, name: String }
 */
const MOCK_ACCOUNTS = [
  { id: 1, name: "KBZPay" },
  { id: 2, name: "WavePay" },
  { id: 3, name: "CB Bank" },
  { id: 4, name: "Cash" }
];

const TYPES = [
  { value: "EXPENSE", label: "Expense", icon: "↗", color: "expense" },
  { value: "INCOME", label: "Income", icon: "↙", color: "income" },
  { value: "TRANSFER", label: "Transfer", icon: "⇄", color: "transfer" },
  { value: "SUBSCRIPTION", label: "Subscription", icon: "◷", color: "subscription" }
];

// Matches backend enum
const CATEGORIES = [
  { value: "FOOD", label: "Food" },
  { value: "GROCERIES", label: "Groceries" },
  { value: "TRANSPORATION", label: "Transportation" },
  { value: "HEALTHCARE", label: "Healthcare" },
  { value: "HOUSING", label: "Housing" },
  { value: "BILLPAYMENT", label: "Bill Payment" },
  { value: "ENTERTAINMENT", label: "Entertainment" },
  { value: "OTHER", label: "Other" }
];

const INITIAL = {
  transaction_type: "EXPENSE",
  category: "FOOD",
  from_account_id: "1",
  to_account_id: "",
  amount: "",
  note: ""
};

const AddTransaction = ({
  isOpen,
  onClose,
  onAddTransaction,
  accounts = MOCK_ACCOUNTS
}) => {
  const [form, setForm] = useState(INITIAL);

  if (!isOpen) return null;

  const showFrom =
    form.transaction_type === "EXPENSE" ||
    form.transaction_type === "TRANSFER" ||
    form.transaction_type === "SUBSCRIPTION";

  const showTo =
    form.transaction_type === "INCOME" ||
    form.transaction_type === "TRANSFER";

  const selectedType = TYPES.find(
    (type) => type.value === form.transaction_type
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleType = (typeValue) => {
    setForm((previous) => ({
      ...previous,
      transaction_type: typeValue,
      from_account_id:
        typeValue === "INCOME"
          ? ""
          : previous.from_account_id || String(accounts[0]?.id || ""),
      to_account_id:
        typeValue === "INCOME"
          ? previous.to_account_id || String(accounts[0]?.id || "")
          : typeValue === "TRANSFER"
            ? previous.to_account_id || String(accounts[1]?.id || accounts[0]?.id || "")
            : ""
    }));
  };

  const handleReset = () => {
    setForm({
      ...INITIAL,
      from_account_id: String(accounts[0]?.id || "1")
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return;
    }

    const fromAccount =
      accounts.find(
        (account) =>
          String(account.id) === String(form.from_account_id)
      ) || null;

    const toAccount =
      accounts.find(
        (account) =>
          String(account.id) === String(form.to_account_id)
      ) || null;

    const now = new Date();

    // TODO [BACKEND]: POST /api/transactions payload
    const record = {
      id: Date.now(),
      transaction_type: form.transaction_type,
      category: form.category,
      from_account:
        showFrom && fromAccount
          ? {
              id: fromAccount.id,
              name: fromAccount.name
            }
          : null,
      to_account:
        showTo && toAccount
          ? {
              id: toAccount.id,
              name: toAccount.name
            }
          : null,
      amount,
      note: form.note.trim(),
      createdDate: now.toISOString().split("T")[0],
      createdTime: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    onAddTransaction?.(record);
    handleReset();
    onClose?.();
  };

  return (
    <div className="bb-add-card mb-4">
      {/* HEADER */}
      <div className="bb-add-header">
        <div className="bb-add-heading">
          <div className="bb-add-icon" aria-hidden="true">
            ✦
          </div>

          <div className="bb-add-heading-copy">
            <span className="bb-add-eyebrow">
              TRANSACTION MANAGEMENT
            </span>

            <h5 className="bb-add-title">
              Create New Transaction
            </h5>

            <p className="bb-add-subtitle">
              Add and organize your financial activity
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="bb-add-close"
          title="Close"
          aria-label="Close transaction form"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* TRANSACTION TYPE */}
        <section className="bb-add-section">
          <div className="bb-add-section-heading">
            <span className="bb-add-step">01</span>

            <div>
              <h6>Transaction Type</h6>
              <p>Choose the type of transaction</p>
            </div>
          </div>

          <div className="bb-type-grid">
            {TYPES.map((type) => {
              const isActive =
                form.transaction_type === type.value;

              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleType(type.value)}
                  className={`bb-type-option ${
                    isActive ? "active" : ""
                  } bb-type-${type.color}`}
                  aria-pressed={isActive}
                >
                  <span className="bb-type-icon" aria-hidden="true">
                    {type.icon}
                  </span>

                  <span className="bb-type-label">
                    {type.label}
                  </span>

                  <span className="bb-type-check" aria-hidden="true">
                    ✓
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* AMOUNT */}
        <section className="bb-amount-section">
          <div className="bb-add-section-heading">
            <span className="bb-add-step">02</span>

            <div>
              <h6>Transaction Amount</h6>
              <p>Enter the amount in Myanmar Kyat</p>
            </div>
          </div>

          <div className="bb-amount-input-wrap">
            <div className="bb-amount-currency">
              <span>MMK</span>
              <small>MYANMAR KYAT</small>
            </div>

            <input
              id="bb-transaction-amount"
              type="number"
              name="amount"
              min="1"
              step="any"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              className="bb-amount-input"
              aria-label="Transaction amount in Myanmar Kyat"
              required
            />

            <span
              className={`bb-amount-type bb-amount-${selectedType?.color || "expense"}`}
            >
              {selectedType?.label}
            </span>
          </div>
        </section>

        {/* DETAILS */}
        <section className="bb-add-section">
          <div className="bb-add-section-heading">
            <span className="bb-add-step">03</span>

            <div>
              <h6>Transaction Details</h6>
              <p>Provide additional transaction information</p>
            </div>
          </div>

          <div className="row g-3">
            {/* CATEGORY */}
            <div className="col-12 col-sm-6">
              <label
                htmlFor="bb-transaction-category"
                className="bb-add-label"
              >
                <span>Category</span>
                <span className="bb-label-required">
                  REQUIRED
                </span>
              </label>

              <select
                id="bb-transaction-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="form-select bb-select bb-add-field"
                required
              >
                {CATEGORIES.map((category) => (
                  <option
                    key={category.value}
                    value={category.value}
                  >
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* FROM ACCOUNT */}
            {showFrom && (
              <div className="col-12 col-sm-6">
                <label
                  htmlFor="bb-from-account"
                  className="bb-add-label"
                >
                  <span>From Account</span>
                  <span className="bb-label-required">
                    REQUIRED
                  </span>
                </label>

                <select
                  id="bb-from-account"
                  name="from_account_id"
                  value={form.from_account_id}
                  onChange={handleChange}
                  className="form-select bb-select bb-add-field"
                  required
                >
                  <option value="">Select account</option>

                  {accounts.map((account) => (
                    <option
                      key={account.id}
                      value={account.id}
                    >
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* TO ACCOUNT */}
            {showTo && (
              <div className="col-12 col-sm-6">
                <label
                  htmlFor="bb-to-account"
                  className="bb-add-label"
                >
                  <span>To Account</span>
                  <span className="bb-label-required">
                    REQUIRED
                  </span>
                </label>

                <select
                  id="bb-to-account"
                  name="to_account_id"
                  value={form.to_account_id}
                  onChange={handleChange}
                  className="form-select bb-select bb-add-field"
                  required
                >
                  <option value="">Select account</option>

                  {accounts.map((account) => (
                    <option
                      key={account.id}
                      value={account.id}
                    >
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* NOTE */}
            <div className="col-12">
              <label
                htmlFor="bb-transaction-note"
                className="bb-add-label"
              >
                <span>Note</span>
                <span className="bb-label-optional">
                  OPTIONAL
                </span>
              </label>

              <div className="bb-note-wrap">
                <span className="bb-note-icon" aria-hidden="true">
                  ✎
                </span>

                <input
                  id="bb-transaction-note"
                  type="text"
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder="Add a short description about this transaction..."
                  className="form-control bb-input bb-note-input"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER ACTIONS */}
        <div className="bb-add-footer">
          <div className="bb-add-footer-note">
            <span className="bb-secure-icon" aria-hidden="true">
              ◆
            </span>

            <span>
              Your financial record will be saved securely.
            </span>
          </div>

          <div className="bb-add-actions">
            <button
              type="button"
              onClick={handleReset}
              className="bb-reset-btn"
            >
              <span aria-hidden="true">↺</span>
              Reset
            </button>

            <button
              type="submit"
              className="bb-submit-btn"
            >
              <span>Save Transaction</span>
              <span className="bb-submit-arrow" aria-hidden="true">
                →
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTransaction;
