import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../assets/css/profile.css";

import {
  clearUserMessages,
  requestPasswordOtp,
  updateUserPassword,
} from "../../reducers/UserSlice";

import {
  selectUserProfile,
  selectUserOtpRequesting,
  selectUserPasswordUpdating,
  selectUserOtpRequested,
  selectUserError,
  selectUserSuccessMessage,
} from "../../selectors/userSelector";

const PasswordSetting = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearUserMessages());

    return () => {
      dispatch(clearUserMessages());
    };
  }, [dispatch]);
  const profile = useSelector(selectUserProfile);
  const requestingOtp = useSelector(selectUserOtpRequesting);
  const updatingPassword = useSelector(selectUserPasswordUpdating);
  const otpRequested = useSelector(selectUserOtpRequested);
  const error = useSelector(selectUserError);
  const success = useSelector(selectUserSuccessMessage);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [validationError, setValidationError] = useState("");

  // Password validation rules
  const passwordRules = {
    minLength: newPassword.length >= 8,
    hasLetter: /[A-Za-z]/.test(newPassword),
    hasNumber: /\d/.test(newPassword),
    hasSpecial: /[^A-Za-z0-9\s]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const isPasswordMatched =
    newPassword === confirmPassword && confirmPassword.length > 0;

  const handleRequestOtp = async () => {
    dispatch(clearUserMessages());
    setValidationError("");

    await dispatch(requestPasswordOtp());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setValidationError("");
    dispatch(clearUserMessages());

    if (!/^\d{6}$/.test(otp)) {
      setValidationError("OTP must contain exactly 6 digits.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setValidationError("Please complete all password fields.");
      return;
    }

    if (!isPasswordValid) {
      setValidationError(
        "Your new password does not meet all the security requirements.",
      );
      return;
    }

    if (!isPasswordMatched) {
      setValidationError("New password and confirmation do not match.");
      return;
    }

    if (!profile?.email) {
      setValidationError(
        "Your profile email could not be loaded. Please refresh the page.",
      );
      return;
    }

    const result = await dispatch(
      updateUserPassword({
        email: profile.email,
        code: otp,
        oldPwd: currentPassword,
        newPwd: newPassword,
      }),
    );

    if (updateUserPassword.fulfilled.match(result)) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
    }
  };

  const handleReset = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOtp("");
    setValidationError("");

    dispatch(clearUserMessages());
  };

  const feedbackMessage =
    typeof error === "string"
      ? error
      : error?.msg || error?.message || error?.error || "";

  const showError = validationError || feedbackMessage;

  const passwordRequirements = [
    {
      key: "minLength",
      label: "At least 8 characters",
    },
    {
      key: "hasLetter",
      label: "At least one letter (A-Z)",
    },
    {
      key: "hasNumber",
      label: "At least one number (0-9)",
    },
    {
      key: "hasSpecial",
      label: "At least one special character (!@#$%)",
    },
  ];

  return (
    <div className="bb-pf-wrap">
      <div className="container-fluid px-0">
        <div className="row g-3">
          <div className="col-12">
            <div className="bb-pf-card">
              <span className="bb-pf-card-topline" />

              <div className="bb-pf-card-head">
                <div>
                  <h2 className="bb-pf-card-title">Password Setting</h2>
                  <p className="bb-pf-card-desc">Update account security</p>
                </div>

                <span className="bb-pf-pill bb-pf-pill-green">Security</span>
              </div>

              {/* Custom Error Feedback */}
              {showError && (
                <div
                  className="bb-pf-feedback bb-pf-feedback-error"
                  role="alert"
                >
                  <i className="fa-solid fa-circle-exclamation" />
                  <span>{showError}</span>
                </div>
              )}

              {/* Custom Success Feedback */}
              {success && (
                <div
                  className="bb-pf-feedback bb-pf-feedback-success"
                  role="status"
                >
                  <i className="fa-solid fa-circle-check" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Current Password */}
                  <div className="col-12">
                    <label
                      htmlFor="bb-pf-current-password"
                      className="bb-pf-label"
                    >
                      <span>Current Password</span>
                      <span className="bb-pf-tag-req">Required</span>
                    </label>

                    <input
                      id="bb-pf-current-password"
                      name="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      placeholder="Current Password"
                      className="bb-pf-input"
                    />
                  </div>

                  {/* New Password */}
                  <div className="col-12 col-md-6">
                    <label htmlFor="bb-pf-new-password" className="bb-pf-label">
                      <span>New Password</span>
                      <span className="bb-pf-tag-req">Required</span>
                    </label>

                    <input
                      id="bb-pf-new-password"
                      name="newPassword"
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="At least 8 characters"
                      className="bb-pf-input"
                    />

                    {/* Live Password Requirements */}
                    <div className="bb-pf-password-rules">
                      <p className="bb-pf-rules-title">Password Requirements</p>

                      {passwordRequirements.map((rule) => {
                        const valid = passwordRules[rule.key];

                        return (
                          <div
                            key={rule.key}
                            className={`bb-pf-rule ${
                              valid ? "is-valid" : "is-invalid"
                            }`}
                          >
                            <i
                              className={`fa-solid ${
                                valid ? "fa-circle-check" : "fa-circle-xmark"
                              }`}
                            />
                            <span>{rule.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="col-12 col-md-6">
                    <label
                      htmlFor="bb-pf-confirm-password"
                      className="bb-pf-label"
                    >
                      <span>Confirm New Password</span>
                      <span className="bb-pf-tag-req">Required</span>
                    </label>

                    <input
                      id="bb-pf-confirm-password"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Confirm New Password"
                      className="bb-pf-input"
                    />

                    {/* Live Password Match */}
                    {confirmPassword.length > 0 && (
                      <div
                        className={`bb-pf-rule bb-pf-match ${
                          isPasswordMatched ? "is-valid" : "is-invalid"
                        }`}
                      >
                        <i
                          className={`fa-solid ${
                            isPasswordMatched
                              ? "fa-circle-check"
                              : "fa-circle-xmark"
                          }`}
                        />
                        <span>
                          {isPasswordMatched
                            ? "Passwords match"
                            : "Passwords do not match"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* OTP */}
                  <div className="col-12">
                    <label htmlFor="bb-pf-otp" className="bb-pf-label">
                      <span>6-Digit OTP</span>
                      <span className="bb-pf-tag-req">Required</span>
                    </label>

                    <div className="d-flex flex-column flex-sm-row gap-2">
                      <input
                        id="bb-pf-otp"
                        name="otp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        minLength={6}
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        required
                        placeholder="Enter 6-digit OTP"
                        className="bb-pf-input"
                        aria-describedby="bb-pf-otp-help"
                      />

                      <button
                        type="button"
                        onClick={handleRequestOtp}
                        disabled={requestingOtp || !profile?.email}
                        className="bb-pf-btn-ghost text-nowrap"
                      >
                        {requestingOtp ? "Requesting..." : "Request OTP"}
                      </button>
                    </div>

                    <small id="bb-pf-otp-help" className="text-muted">
                      {otpRequested
                        ? "OTP requested. Check your registered email."
                        : "Request a one-time code before changing your password."}
                    </small>
                  </div>
                </div>

                {/* Actions */}
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
                    disabled={updatingPassword}
                    className="bb-pf-btn-gold"
                  >
                    {updatingPassword ? "Updating..." : "Update Password"}
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

export default PasswordSetting;
