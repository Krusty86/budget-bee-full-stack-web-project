import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "../../assets/css/registerform.css";
import "../../assets/Vendor/fontawesome-free-6.7.2-web/css/all.min.css";

import { userRegister, resetRegisterStatus } from "../../reducers/AuthSlice";

import {
  selectAuthError,
  selectAuthSuccessMessage,
  selectAuthLoading,
  selectRegisterSuccess,
} from "../../selectors/authSelector";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(selectAuthError);
  const successMessage = useSelector(selectAuthSuccessMessage);
  const loading = useSelector(selectAuthLoading);
  const registerSuccess = useSelector(selectRegisterSuccess);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Password validation rules
  const passwordRules = {
    minLength: userData.password.length >= 8,
    hasLetter: /[A-Za-z]/.test(userData.password),
    hasNumber: /\d/.test(userData.password),
    hasSpecial: /[^A-Za-z0-9\s]/.test(userData.password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  // Clear previous registration messages when opening the page
  useEffect(() => {
    dispatch(resetRegisterStatus());

    return () => {
      dispatch(resetRegisterStatus());
    };
  }, [dispatch]);

  // Redirect after successful registration
  useEffect(() => {
    if (registerSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetRegisterStatus());
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [registerSuccess, dispatch, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      dispatch(resetRegisterStatus());
    }
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      return;
    }

    await dispatch(userRegister(userData));
  };

  return (
    <>
      <div className="container-fluid">
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <clipPath id="waveClipRight" clipPathUnits="objectBoundingBox">
              <path d="M 0.15,0 L 1,0 L 1,1 L 0.15,1 C 0,0.7 0,0.3 0.15,0 Z"></path>
            </clipPath>
          </defs>
        </svg>

        <div className="auth-container auth-reveal-register">
          <div className="auth-form-wrapper">
            <div
              className="form-header stagger-item"
              style={{ "--delay": "0.12s" }}
            >
              <h2>Create An Account</h2>
              <p>Please fill in your information to get started.</p>
            </div>

            <form id="registerForm" onSubmit={handleRegister}>
              {/* Error Message */}
              {error && (
                <div
                  className="bb-pf-feedback bb-pf-feedback-error"
                  role="alert"
                >
                  <i className="fa-solid fa-circle-exclamation"></i>
                  <span>
                    {typeof error === "string"
                      ? error
                      : error?.msg ||
                        error?.message ||
                        error?.error ||
                        "Registration failed."}
                  </span>
                </div>
              )}

              {/* Success Message */}
              {registerSuccess && (
                <div
                  className="bb-pf-feedback bb-pf-feedback-success"
                  role="status"
                >
                  <i className="fa-solid fa-circle-check"></i>
                  <span>
                    {successMessage ||
                      "Account created successfully! Redirecting to login..."}
                  </span>
                </div>
              )}

              {/* Username */}
              <div
                className="form-group stagger-item"
                style={{ "--delay": "0.2s" }}
              >
                <label htmlFor="username">Username</label>

                <div className="input-box">
                  <i className="fa-solid fa-user"></i>

                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    required
                    disabled={loading || registerSuccess}
                    onChange={handleChange}
                    value={userData.username}
                  />
                </div>
              </div>

              {/* Email */}
              <div
                className="form-group stagger-item"
                style={{ "--delay": "0.27s" }}
              >
                <label htmlFor="email">Email</label>

                <div className="input-box">
                  <i className="fa-solid fa-envelope"></i>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="budgetBee@gmail.com"
                    required
                    disabled={loading || registerSuccess}
                    onChange={handleChange}
                    value={userData.email}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div
                className="form-group stagger-item"
                style={{ "--delay": "0.34s" }}
              >
                <label htmlFor="phone">Phone Number</label>

                <div className="input-box">
                  <i className="fa-solid fa-phone"></i>

                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+959123456789"
                    required
                    disabled={loading || registerSuccess}
                    onChange={handleChange}
                    value={userData.phone}
                  />
                </div>
              </div>

              {/* Password */}
              <div
                className="form-group stagger-item"
                style={{ "--delay": "0.41s" }}
              >
                <label htmlFor="password">Password</label>

                <div className="input-box">
                  <i className="fa-solid fa-lock"></i>

                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    disabled={loading || registerSuccess}
                    onChange={handleChange}
                    value={userData.password}
                    style={{ paddingRight: "42px" }}
                  />

                  <button
                    type="button"
                    className="btn btn-link text-secondary p-0"
                    style={{
                      position: "absolute",
                      right: "14px",
                      fontSize: "0.85rem",
                    }}
                    disabled={loading || registerSuccess}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    <i
                      className={`fa-solid ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    />
                  </button>
                </div>

                {/* Password Validation */}
                <div className="bb-pf-password-rules">
                  <div className="bb-pf-rules-title">Password Requirements</div>

                  <div
                    className={`bb-pf-rule ${
                      passwordRules.minLength ? "is-valid" : "is-invalid"
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        passwordRules.minLength
                          ? "fa-circle-check"
                          : "fa-circle-xmark"
                      }`}
                    />
                    Minimum 8 characters
                  </div>

                  <div
                    className={`bb-pf-rule ${
                      passwordRules.hasLetter ? "is-valid" : "is-invalid"
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        passwordRules.hasLetter
                          ? "fa-circle-check"
                          : "fa-circle-xmark"
                      }`}
                    />
                    At least one letter
                  </div>

                  <div
                    className={`bb-pf-rule ${
                      passwordRules.hasNumber ? "is-valid" : "is-invalid"
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        passwordRules.hasNumber
                          ? "fa-circle-check"
                          : "fa-circle-xmark"
                      }`}
                    />
                    At least one number
                  </div>

                  <div
                    className={`bb-pf-rule ${
                      passwordRules.hasSpecial ? "is-valid" : "is-invalid"
                    }`}
                  >
                    <i
                      className={`fa-solid ${
                        passwordRules.hasSpecial
                          ? "fa-circle-check"
                          : "fa-circle-xmark"
                      }`}
                    />
                    At least one special character
                  </div>
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="btn-submit stagger-item"
                style={{ "--delay": "0.48s" }}
                disabled={loading || registerSuccess || !isPasswordValid}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Creating Account...
                  </>
                ) : registerSuccess ? (
                  "Registration Successful"
                ) : (
                  "Register"
                )}
              </button>
            </form>
          </div>

          {/* Right Banner */}
          <div className="auth-banner-right">
            <div className="banner-circle-1-r"></div>
            <div className="banner-circle-2-r"></div>

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
              Already have an account with BudgetBee?
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

export default RegisterForm;
