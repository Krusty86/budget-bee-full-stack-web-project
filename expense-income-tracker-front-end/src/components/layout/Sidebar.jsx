import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../reducers/AuthSlice";
const SIDEBAR_STYLES = `
:root {
  --primary-amber: #f59e0b;
  --primary-gold: #d97706;
  --bright-gold: #fbbf24;
  --deep-bronze: #92400e;
  --amber-glow: rgba(245, 158, 11, 0.38);

  --bg-dark: #0f172a;
  --sidebar-bg: rgba(15, 23, 42, 0.9);
  --card-bg: rgba(30, 41, 59, 0.65);
  --hover-bg: rgba(255, 255, 255, 0.055);
  --active-bg: linear-gradient(
    135deg,
    rgba(251, 191, 36, 0.24) 0%,
    rgba(217, 119, 6, 0.12) 100%
  );
  --gold-gradient: linear-gradient(
    135deg,
    #fde68a 0%,
    #fbbf24 32%,
    #f59e0b 68%,
    #b45309 100%
  );

  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --text-sub: #64748b;

  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-gold: rgba(251, 191, 36, 0.38);

  --sidebar-width: 288px;
  --sidebar-tablet-width: 248px;
  --radius-xl: 26px;
  --radius-lg: 18px;
  --radius-md: 14px;
  --transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.sidebar-container * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Main Sidebar Container */
.sidebar-container {
  position: fixed;
  top: 16px;
  left: 16px;
  bottom: 16px;
  width: var(--sidebar-width);
  background: var(--sidebar-bg);
  backdrop-filter: blur(26px);
  -webkit-backdrop-filter: blur(26px);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  box-shadow:
    0 28px 65px rgba(0, 0, 0, 0.58),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  padding: 22px 15px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
  transition: var(--transition);
}

/* Luxury Ambient Gold Glow */
.sidebar-glow-orb {
  position: absolute;
  top: -65px;
  right: -65px;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.24) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.sidebar-container > *:not(.sidebar-glow-orb) {
  position: relative;
  z-index: 1;
}

/* 1. App Logo Section */
.sidebar-header {
  display: flex;
  align-items: center;
  padding: 0 6px 18px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.brand-wrapper {
  display: flex;
  align-items: center;
  gap: 13px;
}

.logo-box {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: var(--gold-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 26px var(--amber-glow);
  border: 1px solid rgba(255, 255, 255, 0.42);
  flex-shrink: 0;
}

.brand-logo {
  width: 37px;
  height: 37px;
  object-fit: contain;
}

.brand-text-group {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: -0.4px;
  color: var(--text-main);
  line-height: 1.15;
}

.brand-tagline {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 2px;
  color: var(--bright-gold);
  margin-top: 3px;
}

/* 2. User Profile Section */
.user-profile-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 18px;
  border-radius: var(--radius-lg);
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.055) 0%,
    rgba(255, 255, 255, 0.015) 100%
  );
  border: 1px solid rgba(251, 191, 36, 0.22);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.07);
  transition: var(--transition);
}

.user-profile-card:hover {
  border-color: var(--border-gold);
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.28);
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar-img {
  width: 45px;
  height: 45px;
  border-radius: 14px;
  object-fit: cover;
  border: 1.5px solid var(--bright-gold);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
}

.status-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid var(--bg-dark);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.85);
}

.user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-name-group {
  display: flex;
  align-items: center;
  gap: 7px;
}

.name {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-name {
  font-size: 0.74rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
}

/* 3. Navigation Menu Section */
.sidebar-menu-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
}

.sidebar-menu-wrapper::-webkit-scrollbar {
  display: none;
}

.menu-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 1.6px;
  color: var(--text-sub);
  padding: 0 12px 8px;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  margin-bottom: 5px;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid transparent;
  transition: var(--transition);
}

.nav-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: var(--transition);
}

.nav-icon {
  font-size: 0.96rem;
  transition: var(--transition);
}

.nav-text {
  white-space: nowrap;
}

/* Hover & Active Luxury States */
.nav-item:hover {
  color: var(--text-main);
  background: var(--hover-bg);
  border-color: rgba(255, 255, 255, 0.08);
  transform: translateX(3px);
}

.nav-item:hover .nav-icon-wrap {
  border-color: var(--border-gold);
  background: rgba(245, 158, 11, 0.12);
}

.nav-item:hover .nav-icon {
  color: var(--bright-gold);
}

.nav-item.active {
  color: #ffffff;
  background: var(--active-bg);
  border-color: var(--border-gold);
  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.nav-item.active::before {
  content: "";
  position: absolute;
  left: -15px;
  top: 18%;
  height: 64%;
  width: 4px;
  border-radius: 0 6px 6px 0;
  background: var(--gold-gradient);
  box-shadow: 0 0 14px var(--primary-amber);
}

.nav-item.active .nav-icon-wrap {
  background: var(--gold-gradient);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 6px 16px var(--amber-glow);
}

.nav-item.active .nav-icon {
  color: #0f172a;
}

/* Footer Section */
.menu-footer {
  margin-top: 12px;
}

.menu-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.32), transparent);
  margin: 6px 4px 12px;
}

.logout-item {
  color: #fda4af;
}

.logout-item .nav-icon-wrap {
  background: rgba(244, 63, 94, 0.08);
  border-color: rgba(244, 63, 94, 0.16);
}

.logout-item:hover {
  color: #fecdd3;
  background: rgba(244, 63, 94, 0.14);
  border-color: rgba(244, 63, 94, 0.36);
}

.logout-item:hover .nav-icon-wrap {
  background: rgba(244, 63, 94, 0.24);
  border-color: rgba(244, 63, 94, 0.45);
}

.logout-item:hover .nav-icon {
  color: #fda4af;
}

/* Mobile Toggle Button & Backdrop */
.mobile-toggle-btn {
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1100;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  border: 1px solid var(--border-gold);
  background: var(--sidebar-bg);
  backdrop-filter: blur(16px);
  color: var(--bright-gold);
  font-size: 1.15rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
  transition: var(--transition);
}

.mobile-toggle-btn .icon-close {
  display: none;
}

.mobile-toggle-btn.is-open .icon-open {
  display: none;
}

.mobile-toggle-btn.is-open .icon-close {
  display: inline-block;
}

.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.7);
  backdrop-filter: blur(5px);
  z-index: 999;
  cursor: pointer;
}

/* Tablet Responsive (769px - 1024px) */
@media (max-width: 1024px) and (min-width: 869px) {
  :root {
    --sidebar-width: var(--sidebar-tablet-width);
  }
}

/* Mobile & Small Tablet Responsive (<= 868px) */
@media (max-width: 868px) {
  .mobile-toggle-btn {
    display: flex;
  }

  .sidebar-container {
    top: 0;
    left: 0;
    bottom: 0;
    border-radius: 0 var(--radius-xl) var(--radius-xl) 0;
    transform: translateX(-105%);
  }

  .sidebar-container.drawer-open {
    transform: translateX(0);
  }
}

/* Small Phones (<= 480px) */
@media (max-width: 480px) {
  .sidebar-container {
    width: calc(100vw - 36px);
    max-width: 310px;
  }
}
`;

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "fa-house", href: "/home" },
  { id: "accounts", label: "Accounts", icon: "fa-wallet", href: "/accounts" },
  { id: "records", label: "Records", icon: "fa-list-check", href: "/transactions" },
  { id: "statistics", label: "Statistics", icon: "fa-chart-line", href: "/statistics" },
  { id: "budgets", label: "Budgets", icon: "fa-chart-pie", href: "/budgets" },
  { id: "shopping-lists", label: "Shopping Lists", icon: "fa-cart-shopping", href: "/shopping-lists" },
  { id: "subscriptions", label: "Subscriptions", icon: "fa-arrows-rotate", href: "/subscriptions" },
];

const FOOTER_ITEMS = [
  {
    id: "profile-setting",
    label: "Profile Setting",
    icon: "fa-gear",
    href: "/profile-settings",
  },
];

export default function SideBar({
  activeSection,
  onSelectSection,
  onLogout,
  user = {
    name: "Bee",
    handle: "@budget_bee",
    avatarSrc: "/img/BudgetBee_Logo.png",
    logoSrc: "/img/BudgetBee_Logo.png",
  },
}) {
  const { username, fullname } = useSelector((state) => state.auth);
  const displayName = username;
  const displayFullName = fullname;

  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const styleId = "budgetbee-sidebar-styles";
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.textContent = SIDEBAR_STYLES;
      document.head.appendChild(styleEl);
    }
  }, []);

  const matchedItem = [...NAV_ITEMS, ...FOOTER_ITEMS].find(
    (item) =>
      location.pathname === item.href ||
      location.pathname.startsWith(`${item.href}/`)
  );

  const currentActive =
    matchedItem?.id ||
    (location.pathname.startsWith("/add-account")
      ? "accounts"
      : activeSection || "home");

  const handleNavClick = (e, item) => {
    if (onSelectSection) {
      e.preventDefault();
      onSelectSection(item.id);
    }
    setIsDrawerOpen(false);
  };

  const dispatch = useDispatch();
const navigate = useNavigate();

const handleLogoutClick = (e) => {
  e.preventDefault();
  setIsDrawerOpen(false);
  dispatch(logout());
  onLogout?.();
  navigate("/login", { replace: true });
};

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        type="button"
        className={`mobile-toggle-btn ${isDrawerOpen ? "is-open" : ""}`}
        aria-label={isDrawerOpen ? "Close Menu" : "Open Menu"}
        aria-expanded={isDrawerOpen}
        onClick={() => setIsDrawerOpen((prev) => !prev)}
      >
        <i className="fa-solid fa-bars icon-open" aria-hidden="true"></i>
        <i className="fa-solid fa-xmark icon-close" aria-hidden="true"></i>
      </button>

      {/* Mobile Backdrop */}
      {isDrawerOpen && (
        <div
          className="sidebar-backdrop"
          aria-hidden="true"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside className={`sidebar-container ${isDrawerOpen ? "drawer-open" : ""}`}>
        <div className="sidebar-glow-orb"></div>

        {/* 1. App Logo Section */}
        <div className="sidebar-header">
          <div className="brand-wrapper">
            <div className="logo-box">
              <img
                src={user.logoSrc}
                alt="BudgetBee Logo"
                className="brand-logo"
              />
            </div>
            <div className="brand-text-group">
              <span className="brand-title">BudgetBee</span>
              <span className="brand-tagline">Smart Ledger &amp; Budget</span>
            </div>
          </div>
        </div>

        {/* 2. User Profile Section */}
        <div className="user-profile-card">
          <div className="avatar-wrapper">
            <img
              src={user.avatarSrc}
              alt="User Avatar"
              className="avatar-img"
            />
            <span className="status-indicator"></span>
          </div>
          <div className="user-info">
            <div className="user-name-group">
              <span className="name">{displayFullName}</span>
            </div>
            <span className="user-name">@{displayName}</span>
          </div>
        </div>

        {/* 3. Navigation Menu Section */}
        <div className="sidebar-menu-wrapper">
          <div className="menu-group">
            <span className="menu-label">MENU</span>

            {NAV_ITEMS.map((item) => {
              const isActive = currentActive === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(e) => handleNavClick(e, item)}
                >
                  <span className="nav-icon-wrap">
                    <i className={`fa-solid ${item.icon} nav-icon`} aria-hidden="true"></i>
                  </span>
                  <span className="nav-text">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Footer Profile Setting & Logout */}
          <div className="menu-group menu-footer">
            <div className="menu-divider"></div>

            {FOOTER_ITEMS.map((item) => {
              const isActive = currentActive === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(e) => handleNavClick(e, item)}
                >
                  <span className="nav-icon-wrap">
                    <i className={`fa-solid ${item.icon} nav-icon`} aria-hidden="true"></i>
                  </span>
                  <span className="nav-text">{item.label}</span>
                </Link>
              );
            })}

            <Link
              to="/logout"
              className="nav-item logout-item"
              onClick={handleLogoutClick}
            >
              <span className="nav-icon-wrap">
                <i className="fa-solid fa-right-from-bracket nav-icon" aria-hidden="true"></i>
              </span>
              <span className="nav-text">Logout</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}