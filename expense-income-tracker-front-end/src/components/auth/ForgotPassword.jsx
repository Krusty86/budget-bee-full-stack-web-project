import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "../../assets/css/registerform.css";
import "../../assets/Vendor/fontawesome-free-6.7.2-web/css/all.min.css";

import {
  requestPasswordReset,
  resetPassword,
  clearPasswordResetState,
} from "../../reducers/AuthSlice";

import {
  selectPasswordResetRequestLoading,
  selectPasswordResetRequestSuccess,
  selectPasswordResetLoading,
  selectPasswordResetSuccess,
  selectPasswordResetError,
} from "../../selectors/authSelector";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const requestLoading = useSelector(selectPasswordResetRequestLoading);
  const requestSuccess = useSelector(selectPasswordResetRequestSuccess);
  const resetLoading = useSelector(selectPasswordResetLoading);
  const resetSuccess = useSelector(selectPasswordResetSuccess);
  const apiError = useSelector(selectPasswordResetError);

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // OTP must contain exactly 6 digits
  const isOtpUnlocked = /^\d{6}$/.test(formData.otp);

  // Password validation:
  // Minimum 8 characters
  // At least one letter
  // At least one number
  // At least one special character

  const passwordRules = {
    minLength: formData.newPassword.length >= 8,
    hasLetter: /[A-Za-z]/.test(formData.newPassword),
    hasNumber: /\d/.test(formData.newPassword),
    hasSpecial: /[^A-Za-z0-9\s]/.test(formData.newPassword),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const isPasswordMatched =
    formData.newPassword === formData.confirmPassword &&
    formData.confirmPassword.length > 0;

  // Convert backend errors into readable messages
  const getErrorMessage = (error) => {
    if (!error) return "Something went wrong.";

    if (typeof error === "string") return error;

    return (
      error.msg ||
      error.message ||
      error.error ||
      "Something went wrong. Please try again."
    );
  };

  // Display API errors
  useEffect(() => {
    if (apiError) {
      setErrorMessage(getErrorMessage(apiError));
      setSuccessMessage("");
    }
  }, [apiError]);

  // Redirect after successful password reset
  useEffect(() => {
    if (resetSuccess) {
      setSuccessMessage("Your password has been reset successfully!");

      const timer = setTimeout(() => {
        dispatch(clearPasswordResetState());
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [resetSuccess, dispatch, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "otp" ? value.replace(/\D/g, "").slice(0, 6) : value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  // Request OTP
  const handleRequestOtp = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      await dispatch(requestPasswordReset(formData.email.trim())).unwrap();

      setSuccessMessage(
        "OTP has been sent successfully. Please check your email.",
      );

      setFormData((prev) => ({
        ...prev,
        otp: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!/^\d{6}$/.test(formData.otp)) {
      setErrorMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage(
        "Password must contain at least 8 characters, including a letter, a number, and a special character.",
      );
      return;
    }

    if (!isPasswordMatched) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      await dispatch(
        resetPassword({
          email: formData.email.trim(),
          code: formData.otp,
          newPwd: formData.newPassword,
        }),
      ).unwrap();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <>
      <div className="container-fluid">
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <clipPath id="waveClipRight" clipPathUnits="objectBoundingBox">
              <path d="M 0.15,0 L 1,0 L 1,1 L 0.15,1 C 0,0.7 0,0.3 0.15,0 Z" />
            </clipPath>
          </defs>
        </svg>

        <div className="auth-container auth-reveal-register">
          {/* Forgot Password Form */}
          <div
            className="auth-form-wrapper"
            style={{ padding: "24px 32px 24px 40px" }}
          >
            <div
              className="form-header stagger-item"
              style={{
                "--delay": "0.1s",
                marginBottom: "10px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.6rem",
                  marginBottom: "2px",
                }}
              >
                Forgot Password
              </h2>

              <p style={{ fontSize: "0.8rem" }}>
                Enter your email to receive a one-time password, then set your
                new password.
              </p>
            </div>

            <form id="forgotPasswordForm" onSubmit={handleResetPassword}>
              {/* Error Message */}
              {errorMessage && (
                <div
                  className="bb-pf-feedback bb-pf-feedback-error"
                  role="alert"
                  style={{ fontSize: "0.78rem" }}
                >
                  <i className="fa-solid fa-circle-exclamation me-2" />
                  {errorMessage}
                </div>
              )}

              {/* Success Message */}
              {successMessage && (
                <div
                  className="bb-pf-feedback bb-pf-feedback-success"
                  role="alert"
                  style={{ fontSize: "0.78rem" }}
                >
                  <i className="fa-solid fa-circle-check me-2" />
                  {successMessage}
                </div>
              )}

              {/* Email Address + Request OTP */}
              <div
                className="form-group stagger-item"
                style={{
                  "--delay": "0.18s",
                  marginBottom: "8px",
                }}
              >
                <label
                  htmlFor="email"
                  style={{
                    fontSize: "0.75rem",
                    marginBottom: "3px",
                  }}
                >
                  Email Address
                </label>

                <div className="d-flex align-items-center gap-2">
                  <div className="input-box flex-grow-1">
                    <i
                      className="fa-solid fa-envelope"
                      style={{
                        fontSize: "0.82rem",
                        left: "14px",
                      }}
                    />

                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="budgetBee@gmail.com"
                      style={{
                        padding: "7px 12px 7px 38px",
                        fontSize: "0.84rem",
                        borderRadius: "11px",
                      }}
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-warning fw-semibold text-dark flex-shrink-0"
                    style={{
                      padding: "7px 14px",
                      fontSize: "0.8rem",
                      borderRadius: "11px",
                    }}
                    onClick={handleRequestOtp}
                    disabled={requestLoading || resetLoading}
                  >
                    {requestLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" />
                        Sending
                      </>
                    ) : (
                      "Request OTP"
                    )}
                  </button>
                </div>
              </div>

              {/* Verification OTP */}
              <div
                className="form-group stagger-item"
                style={{
                  "--delay": "0.26s",
                  marginBottom: "8px",
                }}
              >
                <div
                  className="d-flex justify-content-between align-items-center"
                  style={{ marginBottom: "3px" }}
                >
                  <label
                    htmlFor="otp"
                    style={{
                      fontSize: "0.75rem",
                      marginBottom: 0,
                    }}
                  >
                    Verification OTP
                  </label>

                  <span
                    className="text-secondary"
                    style={{ fontSize: "0.72rem" }}
                  >
                    {formData.otp.length}/6 digits
                  </span>
                </div>

                <div className="input-box">
                  <i
                    className="fa-solid fa-shield-halved"
                    style={{
                      fontSize: "0.82rem",
                      left: "14px",
                    }}
                  />

                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    style={{
                      padding: "7px 12px 7px 38px",
                      fontSize: "0.84rem",
                      borderRadius: "11px",
                    }}
                    value={formData.otp}
                    onChange={handleChange}
                    required
                  />
                </div>

                <small
                  className="d-block text-secondary"
                  style={{
                    fontSize: "0.72rem",
                    marginTop: "3px",
                  }}
                >
                  Click <strong className="text-warning">Request OTP</strong> to
                  receive a verification code. This code expires in 5 minutes.
                </small>
              </div>

              {/* Set New Password Header */}
              <div
                className="d-flex justify-content-between align-items-center stagger-item"
                style={{
                  "--delay": "0.32s",
                  marginTop: "8px",
                  marginBottom: "6px",
                }}
              >
                <span className="fw-semibold" style={{ fontSize: "0.8rem" }}>
                  Set New Password
                </span>

                <span
                  className="badge rounded-pill bg-dark border border-secondary text-secondary px-2 py-1"
                  style={{ fontSize: "0.68rem" }}
                >
                  <i
                    className={`fa-solid ${
                      isOtpUnlocked ? "fa-lock-open text-warning" : "fa-lock"
                    } me-1`}
                  />

                  {isOtpUnlocked ? "Unlocked" : "Locked until OTP entered"}
                </span>
              </div>

              {/* New Password */}
              <div
                className="form-group stagger-item"
                style={{
                  "--delay": "0.38s",
                  marginBottom: "8px",
                }}
              >
                <label
                  htmlFor="newPassword"
                  style={{
                    fontSize: "0.75rem",
                    marginBottom: "3px",
                  }}
                >
                  New Password
                </label>

                <div className="input-box">
                  <i
                    className="fa-solid fa-lock"
                    style={{
                      fontSize: "0.82rem",
                      left: "14px",
                    }}
                  />

                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    placeholder={
                      isOtpUnlocked
                        ? "Enter new password"
                        : "Enter OTP above to unlock"
                    }
                    style={{
                      padding: "7px 36px 7px 38px",
                      fontSize: "0.84rem",
                      borderRadius: "11px",
                    }}
                    disabled={!isOtpUnlocked}
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-link text-secondary p-0"
                    style={{
                      position: "absolute",
                      right: "12px",
                      fontSize: "0.8rem",
                    }}
                    disabled={!isOtpUnlocked}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    aria-label="Toggle new password visibility"
                  >
                    <i
                      className={`fa-solid ${
                        showNewPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-2" style={{ fontSize: "0.7rem" }}>
                  <div
                    className={
                      passwordRules.minLength ? "text-success" : "text-danger"
                    }
                  >
                    <i
                      className={`fa-solid ${
                        passwordRules.minLength
                          ? "fa-check-circle"
                          : "fa-circle-xmark"
                      } me-2`}
                    />
                    Minimum 8 characters
                  </div>

                  <div
                    className={
                      passwordRules.hasLetter ? "text-success" : "text-danger"
                    }
                  >
                    <i
                      className={`fa-solid ${
                        passwordRules.hasLetter
                          ? "fa-check-circle"
                          : "fa-circle-xmark"
                      } me-2`}
                    />
                    At least one letter
                  </div>

                  <div
                    className={
                      passwordRules.hasNumber ? "text-success" : "text-danger"
                    }
                  >
                    <i
                      className={`fa-solid ${
                        passwordRules.hasNumber
                          ? "fa-check-circle"
                          : "fa-circle-xmark"
                      } me-2`}
                    />
                    At least one number
                  </div>

                  <div
                    className={
                      passwordRules.hasSpecial ? "text-success" : "text-danger"
                    }
                  >
                    <i
                      className={`fa-solid ${
                        passwordRules.hasSpecial
                          ? "fa-check-circle"
                          : "fa-circle-xmark"
                      } me-2`}
                    />
                    At least one special character
                  </div>
                </div>
              </div>

              {/* Confirm New Password */}
              <div
                className="form-group stagger-item"
                style={{
                  "--delay": "0.44s",
                  marginBottom: "10px",
                }}
              >
                <label
                  htmlFor="confirmPassword"
                  style={{
                    fontSize: "0.75rem",
                    marginBottom: "3px",
                  }}
                >
                  Confirm New Password
                </label>

                <div className="input-box">
                  <i
                    className="fa-solid fa-lock"
                    style={{
                      fontSize: "0.82rem",
                      left: "14px",
                    }}
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder={
                      isOtpUnlocked
                        ? "Confirm new password"
                        : "Enter OTP above to unlock"
                    }
                    style={{
                      padding: "7px 36px 7px 38px",
                      fontSize: "0.84rem",
                      borderRadius: "11px",
                    }}
                    disabled={!isOtpUnlocked}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-link text-secondary p-0"
                    style={{
                      position: "absolute",
                      right: "12px",
                      fontSize: "0.8rem",
                    }}
                    disabled={!isOtpUnlocked}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle confirm password visibility"
                  >
                    <i
                      className={`fa-solid ${
                        showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    />
                  </button>
                </div>

                {formData.confirmPassword.length > 0 && (
                  <small
                    className={`d-block mt-1 ${
                      isPasswordMatched ? "text-success" : "text-danger"
                    }`}
                    style={{ fontSize: "0.7rem" }}
                  >
                    <i
                      className={`fa-solid ${
                        isPasswordMatched
                          ? "fa-circle-check"
                          : "fa-circle-xmark"
                      } me-1`}
                    />
                    {isPasswordMatched
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </small>
                )}
              </div>

              {/* Reset Password Button */}
              <button
                type="submit"
                className="btn-submit stagger-item"
                style={{
                  "--delay": "0.5s",
                  padding: "9px",
                  fontSize: "0.88rem",
                  borderRadius: "11px",
                }}
                disabled={!isOtpUnlocked || resetLoading || resetSuccess}
              >
                {resetLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>

          {/* Right Banner */}
          <div className="auth-banner-right">
            <div className="banner-circle-1-r" />
            <div className="banner-circle-2-r" />

            <div
              className="logo-wrapper stagger-item"
              style={{ "--delay": "0.12s" }}
            >
              <img
                src="/img/BudgetBee_Logo.png"
                alt="BudgetBee Logo"
                className="app-logo"
              />
            </div>

            <h3 className="stagger-item" style={{ "--delay": "0.22s" }}>
              Welcome to BudgetBee!
            </h3>

            <p className="stagger-item" style={{ "--delay": "0.3s" }}>
              Remembered your password?
            </p>

            <Link
              className="btn-switch stagger-item"
              style={{ "--delay": "0.38s" }}
              to="/login"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
