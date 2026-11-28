import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../assets/css/profile.css";
import {
  fetchUserProfile,
  updateUserProfile,
  clearUserMessages,
} from "../../reducers/UserSlice";
import {
  selectUserProfile,
  selectUserLoading,
  selectUserProfileUpdating,
  selectUserError,
  selectUserSuccessMessage,
} from "../../selectors/userSelector";

const Detail = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectUserProfile);
  const loading = useSelector(selectUserLoading);
  const saving = useSelector(selectUserProfileUpdating);
  const errorDetail = useSelector(selectUserError);
  const successDetail = useSelector(selectUserSuccessMessage);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    dispatch(fetchUserProfile());

    return () => {
      dispatch(clearUserMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearUserMessages());
    await dispatch(updateUserProfile({ fullName, phone }));
  };

  const handleReset = () => {
    setFullName(profile?.fullName || "");
    setPhone(profile?.phone || "");
  };

  if (loading && !profile) {
    return (
      <div className="bb-pf-wrap">
        <div className="bb-pf-card">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="bb-pf-wrap">
      <div className="container-fluid px-0">
        <div className="row g-3">
          <div className="col-12">
            <div className="bb-pf-card">
              <span className="bb-pf-card-topline" />
              <div className="bb-pf-card-head">
                <div>
                  <h2 className="bb-pf-card-title">Profile</h2>
                  <p className="bb-pf-card-desc">
                    Account identity overview and profile details
                  </p>
                </div>
                <span className="bb-pf-pill">Profile</span>
              </div>
              {errorDetail && (
                <div
                  className="bb-pf-feedback bb-pf-feedback-error"
                  role="alert"
                >
                  <i className="fa-solid fa-circle-exclamation" />
                  <span>
                    {typeof errorDetail === "string"
                      ? errorDetail
                      : errorDetail?.msg ||
                        errorDetail?.message ||
                        "Something went wrong."}
                  </span>
                </div>
              )}
              {successDetail && (
                <div
                  className="bb-pf-feedback bb-pf-feedback-success"
                  role="status"
                >
                  {successDetail}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <div className="bb-pf-identity-bar">
                      <div className="bb-pf-avatar-trigger">
                        <span className="bb-pf-avatar-initials">
                          {(profile?.fullName || profile?.userName || "U")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      </div>
                      <div className="bb-pf-identity-info">
                        <p className="bb-pf-identity-name">
                          {profile?.fullName || "Account Member"}
                        </p>
                        <p className="bb-pf-identity-sub">
                          {profile?.userName
                            ? `@${profile.userName}`
                            : "Member account"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="bb-pf-full-name" className="bb-pf-label">
                      <span>Full Name</span>
                      <span className="bb-pf-tag-edit">Editable</span>
                    </label>
                    <input
                      id="bb-pf-full-name"
                      name="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      maxLength={120}
                      placeholder="Full name"
                      className="bb-pf-input"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="bb-pf-phone" className="bb-pf-label">
                      <span>Phone No.</span>
                      <span className="bb-pf-tag-edit">Editable</span>
                    </label>
                    <input
                      id="bb-pf-phone"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={20}
                      placeholder="Phone number"
                      className="bb-pf-input"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="bb-pf-user-name" className="bb-pf-label">
                      User name
                    </label>
                    <div className="bb-pf-input-group">
                      <span className="bb-pf-input-prefix"></span>
                      <input
                        id="bb-pf-user-name"
                        type="text"
                        value={profile?.userName || "@"}
                        readOnly
                        aria-readonly="true"
                        className="bb-pf-readonly-field bb-pf-input-prefixed"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="bb-pf-email" className="bb-pf-label">
                      Email Address
                    </label>
                    <input
                      id="bb-pf-email"
                      type="email"
                      value={profile?.email || ""}
                      readOnly
                      aria-readonly="true"
                      className="bb-pf-readonly-field"
                    />
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="bb-pf-stat-tile">
                      <span className="bb-pf-stat-label">Account Status</span>
                      <span className="bb-pf-stat-value bb-pf-stat-active">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="bb-pf-stat-tile">
                      <span className="bb-pf-stat-label">Role / Tier</span>
                      <span className="bb-pf-stat-value bb-pf-stat-tier">
                        Standard User
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bb-pf-actions">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bb-pf-btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !profile}
                    className="bb-pf-btn-gold"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
