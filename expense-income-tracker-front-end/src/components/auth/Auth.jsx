import { useState } from "react";
import "../../assets/css/auth-transition.css";
import "../../assets/Vendor/fontawesome-free-6.7.2-web/css/all.min.css";

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Handle login logic
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic
  };

  return (
    <div className="auth-page">
      <div className={`auth-container ${isRegister ? "is-register" : ""}`}>
        {/* Login Form (Left on Login, fades/slides when switching) */}
        <div className="auth-panel login-panel">
          <div className="form-header">
            <h2>Sign In</h2>
            <p>Enter your information to access your portal.</p>
          </div>

          <form id="loginForm" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <div className="input-box">
                <i className="fa-solid fa-user"></i>
                <input
                  type="email"
                  id="login-email"
                  name="email"
                  placeholder="email@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-box">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  id="login-password"
                  name="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <a href="#forgot" className="forgot-pass">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="btn-submit">
              Sign In
            </button>
          </form>
        </div>

        {/* Register Form (Right on Register, slides in smoothly) */}
        <div className="auth-panel register-panel">
          <div className="form-header">
            <h2>Create An Account</h2>
            <p>Please fill in your information to get started.</p>
          </div>

          <form id="registerForm" onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label htmlFor="reg-username">Username</label>
              <div className="input-box">
                <i className="fa-solid fa-user"></i>
                <input
                  type="text"
                  id="reg-username"
                  name="username"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email</label>
              <div className="input-box">
                <i className="fa-solid fa-envelope"></i>
                <input
                  type="email"
                  id="reg-email"
                  name="email"
                  placeholder="email@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-phone">Phone Number</label>
              <div className="input-box">
                <i className="fa-solid fa-phone"></i>
                <input
                  type="tel"
                  id="reg-phone"
                  name="phone"
                  placeholder="+959123456789"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <div className="input-box">
                <i className="fa-solid fa-lock"></i>
                <input
                  type="password"
                  id="reg-password"
                  name="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-submit">
              Register
            </button>
          </form>
        </div>

        {/* Sliding Banner Overlay (Left at 0%, slides to Right at translateX(100%)) */}
        <div className="auth-banner-overlay">
          <div className="banner-circle-1"></div>
          <div className="banner-circle-2"></div>

          <div className="logo-wrapper">
            <img
              src="/img/BudgetBee_Logo.png"
              alt="BudgetBee Logo"
              className="app-logo"
            />
          </div>

          {!isRegister ? (
            <>
              <h3>BudgetBee</h3>
              <p>
                Master your financial flow with BudgetBee smart tracking platform.
              </p>
              <button
                type="button"
                className="btn-switch"
                onClick={() => setIsRegister(true)}
              >
                Create An Account
              </button>
            </>
          ) : (
            <>
              <h3>Welcome to BudgetBee!</h3>
              <p>Already have an account with BudgetBee?</p>
              <button
                type="button"
                className="btn-switch"
                onClick={() => setIsRegister(false)}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;