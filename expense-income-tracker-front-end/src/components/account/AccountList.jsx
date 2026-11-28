import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAccounts, deleteAccount } from "../../reducers/AccountSlice";
import {
  selectAccounts,
  selectAccountLoading,
  selectAccountError,
} from "../../selectors/accountSelector";

const formatBalance = (balance, currency = "") => {
  const num = Number(balance ?? 0);
  if (Number.isNaN(num)) return `${balance ?? 0} ${currency}`.trim();
  const formatted = num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency ? `${formatted} ${currency}` : formatted;
};

const formatAccountType = (type) => {
  if (!type) return "ACCOUNT";
  return String(type).replace(/_/g, " ");
};

const AccountList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accounts = useSelector(selectAccounts);
  const loading = useSelector(selectAccountLoading);
  const error = useSelector(selectAccountError);

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleDelete = (id, accname) => {
    if (window.confirm(`Remove account "${accname}"?`)) {
      dispatch(deleteAccount(id));
    }
  };

  return (
    <div className="container-fluid px-0">
      {/* Header Row */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h1 className="dashboard-title mb-1">Financial Accounts</h1>
          <div className="fr-caption">
            Manage your wallets, bank accounts, and balances
          </div>
        </div>

        <button
          type="button"
          className="btn-gold"
          onClick={() => navigate("/add-account")}
        >
          <span>+ Add Account</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bb-pf-feedback bb-pf-feedback-error mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && accounts.length === 0 && (
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
      {!loading && accounts.length === 0 && (
        <div className="fr-box fr-box-budget text-center py-5 px-4">
          <div className="fr-top-glow fr-glow-budget" />
          <span className="gold-badge mb-3">No Accounts Yet</span>
          <h5 className="fw-bold mb-2">Start by adding a financial account</h5>
          <p className="fr-caption mb-4">
            Track balances across cash, banks, cards, or e-wallets in one place.
          </p>
          <button
            type="button"
            className="btn-gold"
            onClick={() => navigate("/add-account")}
          >
            + Add Your First Account
          </button>
        </div>
      )}

      {/* Account Cards Grid */}
      {accounts.length > 0 && (
        <div className="row g-3">
          {accounts.map((acc, idx) => {
            const isPrimary = idx === 0;
            const typeKey = String(acc.account_type || "CASH").toUpperCase();

            const typeConfig = {
              CASH: {
                icon: "fa-money-bill-wave",
                badgeClass: "fr-bi-budget",
                pillClass: "fr-tag-budget",
                glowClass: "fr-glow-budget",
              },
              BANK: {
                icon: "fa-building-columns",
                badgeClass: "fr-bi-income",
                pillClass: "fr-tag-income",
                glowClass: "fr-glow-income",
              },
              EWALLET: {
                icon: "fa-mobile-screen-button",
                badgeClass: "fr-bi-budget",
                pillClass: "fr-tag-budget",
                glowClass: "fr-glow-budget",
              },
            }[typeKey] || {
              icon: "fa-wallet",
              badgeClass: "fr-bi-income",
              pillClass: "fr-tag-income",
              glowClass: "fr-glow-income",
            };

            return (
              <div key={acc.id} className="col-12 col-md-6 col-xl-4">
                <div
                  className={`fr-box bb-acc-card d-flex flex-column justify-content-between ${
                    isPrimary ? "fr-box-budget" : ""
                  }`}
                >
                  {/* Top Accent Glow & Ambient Orb */}
                  <div
                    className={`fr-top-glow ${
                      isPrimary ? "fr-glow-budget" : typeConfig.glowClass
                    }`}
                  />
                  <div className="bb-acc-orb" aria-hidden="true" />

                  <div>
                    {/* Card Header: Icon + Name + Type Pill */}
                    <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
                      <div className="d-flex align-items-center gap-3 min-w-0">
                        <div
                          className={`fr-badge-icon ${
                            isPrimary ? "fr-bi-budget" : typeConfig.badgeClass
                          }`}
                        >
                          <i
                            className={`fa-solid ${typeConfig.icon}`}
                            aria-hidden="true"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="d-flex align-items-center gap-2">
                            <span className="fr-label text-truncate">
                              {acc.accname}
                            </span>
                            {isPrimary && (
                              <span
                                className="bb-primary-dot"
                                title="Primary Account"
                              />
                            )}
                          </div>
                          <div className="fr-subtag">
                            Currency: <strong>{acc.currency || "—"}</strong>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`fr-pill-tag flex-shrink-0 ${
                          isPrimary ? "fr-tag-budget" : typeConfig.pillClass
                        }`}
                      >
                        {formatAccountType(acc.account_type)}
                      </span>
                    </div>

                    {/* Balance Display Box */}
                    <div className="bb-balance-well mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fr-caption">Available Balance</span>
                        <span className="fr-subtag">{acc.currency || ""}</span>
                      </div>
                      <div
                        className={`fr-value text-truncate ${
                          isPrimary ? "fr-value-gold" : ""
                        }`}
                      >
                        {formatBalance(acc.balance, acc.currency)}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="d-flex align-items-center justify-content-between gap-2 pt-2 border-top border-secondary border-opacity-25">
                    <span className="fr-subtag">
                      <i
                        className="fa-solid fa-circle-check text-success me-1"
                        aria-hidden="true"
                      />
                      Active
                    </span>

                    <button
                      type="button"
                      className="btn-ghost bb-delete-btn py-1 px-3 small"
                      onClick={() => handleDelete(acc.id, acc.accname)}
                      disabled={loading}
                    >
                      <i
                        className="fa-regular fa-trash-can"
                        aria-hidden="true"
                      />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AccountList;
