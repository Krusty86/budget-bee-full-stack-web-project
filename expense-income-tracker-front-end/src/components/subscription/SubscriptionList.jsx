import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchSubscriptions,
  filterSubscriptionsByStatus,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
} from "../../reducers/SubscriptionSlice";
import {
  selectSubscriptions,
  selectSubscriptionLoading,
  selectSubscriptionError,
} from "../../selectors/subscriptionSelector";

const formatAmount = (amount) => {
  const num = Number(amount ?? 0);
  if (Number.isNaN(num)) return String(amount ?? "0.00");
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatEnumLabel = (val) => {
  if (!val) return "—";
  return String(val).replace(/_/g, " ");
};

const STATUS_FILTERS = ["ALL", "ACTIVE", "PAUSED", "CANCELLED", "INACTIVE"];

const SubscriptionList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subscriptions = useSelector(selectSubscriptions);
  const loading = useSelector(selectSubscriptionLoading);
  const error = useSelector(selectSubscriptionError);

  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    if (statusFilter === "ALL") {
      dispatch(fetchSubscriptions());
    } else {
      dispatch(filterSubscriptionsByStatus(statusFilter));
    }
  }, [dispatch, statusFilter]);

  const handlePause = (id) => {
    dispatch(pauseSubscription(id));
  };

  const handleResume = (id) => {
    dispatch(resumeSubscription(id));
  };

  const handleCancel = (id, name) => {
    if (window.confirm(`Cancel subscription "${name}"?`)) {
      dispatch(cancelSubscription(id));
    }
  };

  return (
    <>
    
      
      <div className="container-fluid px-0">
      {/* Header Row */}
<div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
  <div>
    <h1 className="dashboard-title mb-1">Subscriptions</h1>
    <div className="fr-caption">
      Manage recurring bills, memberships, and payment schedules
    </div>
  </div>

  <button
    type="button"
    className="btn-gold flex-shrink-0"
    onClick={() => navigate("/add-subscription")}
  >
    <span>+ Add Subscription</span>
  </button>
</div>
      

      {/* Status Filter Pills */}
      <div className="d-flex flex-wrap align-items-center gap-2 mb-4">
        {STATUS_FILTERS.map((st) => (
          <button
            key={st}
            type="button"
            className={`bb-pill ${statusFilter === st ? "active" : ""}`}
            onClick={() => setStatusFilter(st)}
            disabled={loading}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bb-pf-feedback bb-pf-feedback-error mb-4" role="alert">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && subscriptions.length === 0 && (
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
      {!loading && subscriptions.length === 0 && (
        <div className="fr-box fr-box-budget text-center py-5 px-4">
          <div className="fr-top-glow fr-glow-budget" />
          <span className="gold-badge mb-3">No Subscriptions Found</span>
          <h5 className="fw-bold mb-2">
            {statusFilter === "ALL"
              ? "Start by adding a recurring subscription"
              : `No ${statusFilter.toLowerCase()} subscriptions`}
          </h5>
          <p className="fr-caption mb-4">
            Track monthly or annual renewals and stay ahead of upcoming
            payments.
          </p>
          <button
            type="button"
            className="btn-gold"
            onClick={() => navigate("/add-subscription")}
          >
            + Add Your First Subscription
          </button>
        </div>
      )}

      {/* Subscription Cards Grid */}
      {subscriptions.length > 0 && (
        <div className="row g-3">
          {subscriptions.map((sub, idx) => {
            const isPrimary = idx === 0;
            const statusKey = String(sub.status || "ACTIVE").toUpperCase();

            const statusConfig = {
              ACTIVE: {
                icon: "fa-rotate",
                badgeClass: "fr-bi-income",
                pillClass: "fr-tag-income",
                glowClass: "fr-glow-income",
              },
              PAUSED: {
                icon: "fa-pause",
                badgeClass: "fr-bi-budget",
                pillClass: "fr-tag-budget",
                glowClass: "fr-glow-budget",
              },
              CANCELLED: {
                icon: "fa-ban",
                badgeClass: "fr-bi-expense",
                pillClass: "fr-tag-expense",
                glowClass: "fr-glow-expense",
              },
            }[statusKey] || {
              icon: "fa-calendar-check",
              badgeClass: "fr-bi-budget",
              pillClass: "fr-tag-budget",
              glowClass: "fr-glow-budget",
            };

            return (
              <div key={sub.id} className="col-12 col-md-6 col-xl-4">
                <div
                  className={`fr-box bb-acc-card d-flex flex-column justify-content-between ${
                    isPrimary ? "fr-box-budget" : ""
                  }`}
                >
                  <div
                    className={`fr-top-glow ${
                      isPrimary ? "fr-glow-budget" : statusConfig.glowClass
                    }`}
                  />
                  <div className="bb-acc-orb" aria-hidden="true" />

                  <div>
                    {/* Header */}
                    <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
                      <div className="d-flex align-items-center gap-3 min-w-0">
                        <div
                          className={`fr-badge-icon ${
                            isPrimary ? "fr-bi-budget" : statusConfig.badgeClass
                          }`}
                        >
                          <i
                            className={`fa-solid ${statusConfig.icon}`}
                            aria-hidden="true"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="d-flex align-items-center gap-2">
                            <span className="fr-label text-truncate">
                              {sub.name}
                            </span>
                            {isPrimary && (
                              <span
                                className="bb-primary-dot"
                                title="Featured Subscription"
                              />
                            )}
                          </div>
                          <div className="fr-subtag">
                            Cycle:{" "}
                            <strong>{formatEnumLabel(sub.billingCycle)}</strong>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`fr-pill-tag flex-shrink-0 ${statusConfig.pillClass}`}
                      >
                        {formatEnumLabel(sub.status)}
                      </span>
                    </div>

                    {/* Amount & Next Payment Well */}
                    <div className="bb-balance-well mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fr-caption">Recurring Amount</span>
                        <span className="fr-subtag">
                          Next: {sub.nextPaymentDate || "—"}
                        </span>
                      </div>
                      <div
                        className={`fr-value text-truncate ${
                          isPrimary ? "fr-value-gold" : ""
                        }`}
                      >
                        {formatAmount(sub.amount)}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons from SubscriptionSlice */}
                  <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 pt-2 border-top border-secondary border-opacity-25">
                    {statusKey === "ACTIVE" && (
                      <button
                        type="button"
                        className="btn-ghost py-1 px-3 small"
                        onClick={() => handlePause(sub.id)}
                        disabled={loading}
                      >
                        <i className="fa-solid fa-pause" aria-hidden="true" />
                        <span>Pause</span>
                      </button>
                    )}

                    {(statusKey === "PAUSED" || statusKey === "CANCELLED") && (
                      <button
                        type="button"
                        className="btn-ghost py-1 px-3 small"
                        onClick={() => handleResume(sub.id)}
                        disabled={loading}
                      >
                        <i className="fa-solid fa-play" aria-hidden="true" />
                        <span>Resume</span>
                      </button>
                    )}

                    {statusKey !== "CANCELLED" && (
                      <button
                        type="button"
                        className="btn-ghost bb-delete-btn py-1 px-3 small"
                        onClick={() => handleCancel(sub.id, sub.name)}
                        disabled={loading}
                      >
                        <i className="fa-solid fa-ban" aria-hidden="true" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
   
    </>
  );
};

export default SubscriptionList;
