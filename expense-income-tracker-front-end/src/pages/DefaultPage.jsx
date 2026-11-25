import '../assets/css/defaultpage.css'
const DefaultPage = () => {
  return (
    <>
      <style>{`
      *,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
}

body {
  display: block;
  min-height: 100vh;
  overflow-x: hidden;
}

#root {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
        :root {
          --bb-lux-amber: #f59e0b;
          --bb-lux-gold: #d97706;
          --bb-lux-bright-gold: #fbbf24;
          --bb-lux-bronze: #92400e;
          --bb-lux-glow: rgba(245, 158, 11, 0.38);

          --bb-lux-bg-dark: #0f172a;
          --bb-lux-bg-deeper: #090e1a;
          --bb-lux-card-bg: rgba(30, 41, 59, 0.65);

          --bb-lux-gold-grad: linear-gradient(
            135deg,
            #fde68a 0%,
            #fbbf24 32%,
            #f59e0b 68%,
            #b45309 100%
          );

          --bb-lux-text: #f8fafc;
          --bb-lux-muted: #94a3b8;
          --bb-lux-sub: #64748b;

          --bb-lux-border: rgba(255, 255, 255, 0.08);
          --bb-lux-border-gold: rgba(251, 191, 36, 0.38);

          --bb-lux-radius-xl: 26px;
          --bb-lux-radius-lg: 18px;
          --bb-lux-radius-md: 14px;

          --bb-lux-ease: cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes bbLuxRiseIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bbLuxStageFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes bbLuxChipDrift {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes bbLuxAuraBreathe {
          0%, 100% {
            opacity: 0.45;
            transform: scale(0.97);
          }
          50% {
            opacity: 0.88;
            transform: scale(1.04);
          }
        }

        @keyframes bbLuxShimmerSweep {
          0% {
            transform: translateX(-135%) skewX(-18deg);
          }
          60%, 100% {
            transform: translateX(220%) skewX(-18deg);
          }
        }

        .bb-lux-body {
        width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    font-family: "Plus Jakarta Sans",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      sans-serif;
          font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          background-color: var(--bb-lux-bg-dark);
          background-image:
            radial-gradient(circle at 8% 15%, rgba(245, 158, 11, 0.2) 0%, transparent 42%),
            radial-gradient(circle at 90% 82%, rgba(217, 119, 6, 0.14) 0%, transparent 45%),
            linear-gradient(180deg, var(--bb-lux-bg-deeper) 0%, var(--bb-lux-bg-dark) 100%);
          color: var(--bb-lux-text);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        .bb-lux-enter {
          animation: bbLuxRiseIn 0.8s var(--bb-lux-ease) both;
        }

        .bb-lux-enter-d1 {
          animation-delay: 0.14s;
        }

        /* Navigation */
        .bb-lux-nav {
          background: rgba(9, 14, 26, 0.82);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--bb-lux-border);
          transition: background-color 0.35s var(--bb-lux-ease), border-color 0.35s var(--bb-lux-ease);
        }

        .bb-lux-logo-box {
          width: 44px;
          height: 44px;
          border-radius: var(--bb-lux-radius-md);
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.24) 0%, rgba(217, 119, 6, 0.12) 100%);
          border: 1px solid var(--bb-lux-border-gold);
          box-shadow: 0 0 24px rgba(245, 158, 11, 0.22);
          overflow: hidden;
          transition: transform 0.35s var(--bb-lux-ease), box-shadow 0.35s var(--bb-lux-ease), border-color 0.35s var(--bb-lux-ease);
        }

        .bb-lux-logo-box:hover {
          transform: rotate(-5deg) scale(1.06);
          border-color: var(--bb-lux-bright-gold);
          box-shadow: 0 0 32px var(--bb-lux-glow);
        }

        .bb-lux-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .bb-lux-gold-text {
          background: var(--bb-lux-gold-grad);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .bb-lux-badge {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          color: var(--bb-lux-bright-gold);
          background: rgba(245, 158, 11, 0.14);
          border: 1px solid var(--bb-lux-border-gold);
          border-radius: 999px;
          transition: transform 0.35s var(--bb-lux-ease), background-color 0.35s var(--bb-lux-ease), border-color 0.35s var(--bb-lux-ease);
        }

        .bb-lux-badge:hover {
          transform: translateY(-1px);
          background: rgba(245, 158, 11, 0.2);
          border-color: var(--bb-lux-bright-gold);
        }

        /* Buttons with Smooth CSS Transitions & Shimmer */
        .bb-lux-btn-gold {
          position: relative;
          overflow: hidden;
          background: var(--bb-lux-gold-grad);
          color: var(--bb-lux-bg-dark);
          border: 1px solid rgba(255, 255, 255, 0.38);
          border-radius: var(--bb-lux-radius-md);
          font-weight: 800;
          box-shadow: 0 10px 26px var(--bb-lux-glow);
          transition: transform 0.35s var(--bb-lux-ease), box-shadow 0.35s var(--bb-lux-ease), filter 0.35s var(--bb-lux-ease);
        }

        .bb-lux-btn-gold::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 55%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.42), transparent);
          transform: translateX(-140%) skewX(-18deg);
          transition: transform 0.65s var(--bb-lux-ease);
          pointer-events: none;
        }

        .bb-lux-btn-gold:hover,
        .bb-lux-btn-gold:focus {
          color: var(--bb-lux-bg-dark);
          transform: translateY(-2px);
          filter: brightness(1.05);
          box-shadow: 0 16px 36px rgba(245, 158, 11, 0.52);
        }

        .bb-lux-btn-gold:hover::after {
          transform: translateX(240%) skewX(-18deg);
        }

        .bb-lux-btn-ghost {
          background: rgba(255, 255, 255, 0.03);
          color: var(--bb-lux-text);
          border: 1px solid var(--bb-lux-border);
          border-radius: var(--bb-lux-radius-md);
          font-weight: 600;
          transition: transform 0.35s var(--bb-lux-ease), border-color 0.35s var(--bb-lux-ease), background-color 0.35s var(--bb-lux-ease), color 0.35s var(--bb-lux-ease);
        }

        .bb-lux-btn-ghost:hover,
        .bb-lux-btn-ghost:focus {
          color: var(--bb-lux-bright-gold);
          background: rgba(255, 255, 255, 0.06);
          border-color: var(--bb-lux-border-gold);
          transform: translateY(-2px);
        }

        /* Hero Typography & Left Column */
        .bb-lux-hero {
          padding-top: 3rem;
          padding-bottom: 3rem;
        }

        .bb-lux-headline {
          font-size: clamp(2.2rem, 4.3vw, 3.55rem);
          font-weight: 800;
          line-height: 1.13;
          letter-spacing: -0.025em;
        }

        .bb-lux-subcopy {
          color: var(--bb-lux-muted);
          font-size: 1.02rem;
          max-width: 520px;
        }

        .bb-lux-gold-banner {
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, #fbbf24 0%, #f59e0b 54%, #d97706 100%);
          color: var(--bb-lux-bg-dark);
          border-radius: var(--bb-lux-radius-lg);
          box-shadow: 0 18px 40px rgba(217, 119, 6, 0.3);
          transition: transform 0.38s var(--bb-lux-ease), box-shadow 0.38s var(--bb-lux-ease);
        }

        .bb-lux-gold-banner::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 45%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.32), transparent);
          animation: bbLuxShimmerSweep 5.5s var(--bb-lux-ease) infinite;
          pointer-events: none;
        }

        .bb-lux-gold-banner:hover {
          transform: translateY(-3px);
          box-shadow: 0 24px 48px rgba(245, 158, 11, 0.42);
        }

        /* Full-View Luxury Showcase (First Image Aspect & Framing) */
        .bb-lux-stage-wrap {
          position: relative;
          padding: 0.5rem 0 1.75rem;
        }

        .bb-lux-stage-aura {
          position: absolute;
          inset: 6%;
          border-radius: var(--bb-lux-radius-xl);
          background:
            radial-gradient(circle at 25% 25%, rgba(251, 191, 36, 0.28) 0%, transparent 58%),
            radial-gradient(circle at 80% 75%, rgba(245, 158, 11, 0.2) 0%, transparent 62%);
          filter: blur(30px);
          z-index: 0;
          animation: bbLuxAuraBreathe 5s var(--bb-lux-ease) infinite;
        }

        .bb-lux-vault-frame {
          position: relative;
          z-index: 1;
          overflow: hidden;
          border-radius: var(--bb-lux-radius-xl);
          background: linear-gradient(160deg, rgba(24, 35, 56, 0.92) 0%, rgba(13, 20, 36, 0.97) 100%);
          border: 1px solid var(--bb-lux-border-gold);
          box-shadow:
            0 30px 72px rgba(0, 0, 0, 0.58),
            0 0 28px rgba(245, 158, 11, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.09);
          animation: bbLuxStageFloat 7s var(--bb-lux-ease) infinite;
          transition: transform 0.45s var(--bb-lux-ease), border-color 0.45s var(--bb-lux-ease), box-shadow 0.45s var(--bb-lux-ease);
        }

        .bb-lux-vault-frame:hover {
          transform: translateY(-5px);
          border-color: rgba(251, 191, 36, 0.72);
          box-shadow:
            0 36px 82px rgba(0, 0, 0, 0.68),
            0 0 42px rgba(245, 158, 11, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
        }

        .bb-lux-top-bar {
          position: relative;
          background: linear-gradient(155deg, rgba(42, 34, 20, 0.72) 0%, rgba(15, 23, 42, 0.92) 70%);
          border-bottom: 1px solid rgba(251, 191, 36, 0.2);
        }

        .bb-lux-top-bar::before {
          content: "";
          position: absolute;
          top: 0;
          left: 20px;
          right: 20px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, var(--bb-lux-bright-gold), transparent);
          opacity: 0.9;
        }

        .bb-lux-shot-canvas {
          padding: 12px;
          background: rgba(9, 14, 26, 0.55);
        }

        .bb-lux-screen-img {
          width: 100%;
          height: auto;
          max-height: 460px;
          object-fit: contain;
          border-radius: var(--bb-lux-radius-md);
          display: block;
          transition: transform 0.55s var(--bb-lux-ease), filter 0.45s var(--bb-lux-ease);
        }

        .bb-lux-vault-frame:hover .bb-lux-screen-img {
          transform: scale(1.012);
          filter: contrast(1.04) saturate(1.05);
        }

        .bb-lux-metric-strip {
          background: rgba(9, 14, 26, 0.82);
          border-top: 1px solid var(--bb-lux-border);
        }

        .bb-lux-metric-pill {
          background: rgba(30, 41, 59, 0.68);
          border: 1px solid var(--bb-lux-border);
          border-radius: 12px;
          transition: transform 0.32s var(--bb-lux-ease), border-color 0.32s var(--bb-lux-ease), background-color 0.32s var(--bb-lux-ease);
        }

        .bb-lux-metric-pill:hover {
          transform: translateY(-2px);
          border-color: rgba(251, 191, 36, 0.35);
          background: rgba(30, 41, 59, 0.9);
        }

        /* Floating Signature Bee Accent Card */
        .bb-lux-floating-card {
          position: relative;
          z-index: 3;
          margin-top: -1.6rem;
          margin-left: 1rem;
          margin-right: 1rem;
          background: linear-gradient(155deg, rgba(42, 34, 20, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%);
          border: 1px solid var(--bb-lux-border-gold);
          border-radius: var(--bb-lux-radius-lg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow:
            0 22px 48px rgba(0, 0, 0, 0.56),
            0 0 28px rgba(245, 158, 11, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          animation: bbLuxChipDrift 5.4s var(--bb-lux-ease) infinite;
          transition: transform 0.35s var(--bb-lux-ease), border-color 0.35s var(--bb-lux-ease), box-shadow 0.35s var(--bb-lux-ease);
        }

        .bb-lux-floating-card:hover {
          transform: translateY(-4px);
          border-color: var(--bb-lux-bright-gold);
          box-shadow:
            0 26px 56px rgba(0, 0, 0, 0.65),
            0 0 36px rgba(245, 158, 11, 0.32);
        }

        .bb-lux-bee-emblem {
          width: 46px;
          height: 46px;
          border-radius: 13px;
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.24) 0%, rgba(217, 119, 6, 0.12) 100%);
          border: 1px solid var(--bb-lux-border-gold);
          overflow: hidden;
          flex-shrink: 0;
          transition: transform 0.35s var(--bb-lux-ease);
        }

        .bb-lux-floating-card:hover .bb-lux-bee-emblem {
          transform: rotate(-6deg) scale(1.06);
        }

        .bb-lux-text-muted {
          color: var(--bb-lux-muted);
        }

        .bb-lux-text-sub {
          color: var(--bb-lux-sub);
        }

        .bb-lux-footer {
          border-top: 1px solid var(--bb-lux-border);
          color: var(--bb-lux-sub);
        }

        @media (min-width: 768px) {
          .bb-lux-floating-card {
            max-width: 430px;
            margin-left: 1.5rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bb-lux-enter,
          .bb-lux-vault-frame,
          .bb-lux-floating-card,
          .bb-lux-stage-aura,
          .bb-lux-gold-banner::before {
            animation: none;
          }
        }
      `}</style>

      <div className="bb-lux-body d-flex flex-column">

        {/* Navbar */}
        <nav
          id="bbLuxNavbar"
          className="navbar navbar-expand-lg sticky-top bb-lux-nav py-3"
        >
          <div className="container-fluid">
            <a
              href="#"
              className="navbar-brand d-flex align-items-center gap-3 text-white fw-bold m-0"
            >
              <span className="bb-lux-logo-box d-inline-flex align-items-center justify-content-center">
                <img
                  src="img/BudgetBee_Logo.png"
                  alt="BudgetBee Logo"
                  className="bb-lux-logo-img"
                />
              </span>

              <span>
                <span className="fs-5 fw-extrabold">
                  Budget<span className="bb-lux-gold-text">Bee</span>
                </span>

                <span
                  className="d-block small bb-lux-text-muted fw-normal"
                  style={{ fontSize: "0.72rem", lineHeight: 1.1 }}
                >
                  Smart Ledger &amp; Budget
                </span>
              </span>
            </a>

            <div className="d-flex align-items-center gap-2 gap-sm-3">
              <a href="/login" className="btn bb-lux-btn-ghost px-3 py-2">
                Sign In
              </a>

              <a href="/register" className="btn bb-lux-btn-gold px-4 py-2">
                Get Started
              </a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow-1 d-flex align-items-center">
          <section className="container-fluid px-4 px-xl-5 bb-lux-hero">
            <div className="row align-items-center g-4 g-lg-5">

              {/* Left Hero Copy */}
              <div className="col-lg-5 bb-lux-enter">
                <span className="bb-lux-badge d-inline-block px-3 py-1 mb-3">
                  ✦ Luxury Personal Finance
                </span>

                <h1 className="bb-lux-headline fw-extrabold mb-3">
                  Master Your Cashflow With
                  <span className="bb-lux-gold-text d-block">
                    BudgetBee
                  </span>
                </h1>

                <p className="bb-lux-subcopy mb-4">
                  Precision budgeting, real-time cashflow analytics, and multi-account clarity crafted in a dark gold ledger experience.
                </p>

                <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                  <a href="/register" className="btn bb-lux-btn-gold px-4 py-3">
                    Create Free Account →
                  </a>

                  <a href="/login" className="btn bb-lux-btn-ghost px-4 py-3">
                    Sign In
                  </a>
                </div>

                {/* Gold Banner */}
                <div className="bb-lux-gold-banner p-3 p-sm-4 d-flex align-items-center justify-content-between gap-3">
                  <div>
                    <div className="fw-extrabold fs-6">
                      Smart Ledger. Gold Standard.
                    </div>

                    <div
                      className="small fw-semibold"
                      style={{ color: "rgba(15, 23, 42, 0.84)" }}
                    >
                      Income, expenses, monthly limits &amp; assets in one view.
                    </div>
                  </div>

                  <span
                    className="badge rounded-pill px-3 py-2 fw-bold"
                    style={{
                      background: "rgba(15, 23, 42, 0.92)",
                      color: "#fbbf24"
                    }}
                  >
                    DARK GOLD UI
                  </span>
                </div>
              </div>

              {/* Right Full-View Dashboard Showcase */}
              <div className="col-lg-7 bb-lux-enter bb-lux-enter-d1">
                <div className="bb-lux-stage-wrap">
                  <div className="bb-lux-stage-aura"></div>

                  <div className="bb-lux-vault-frame">
                    <div className="bb-lux-top-bar px-4 py-3 d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="rounded-circle d-inline-block"
                          style={{
                            width: "9px",
                            height: "9px",
                            background: "#34d399",
                            boxShadow: "0 0 8px rgba(52, 211, 153, 0.7)"
                          }}
                        ></span>

                        <span className="small fw-bold text-white">
                          BudgetBee Full Dashboard
                        </span>
                      </div>

                      <span
                        className="bb-lux-badge px-3 py-1"
                        style={{ fontSize: "0.65rem" }}
                      >
                        SMART LEDGER
                      </span>
                    </div>

                    <div className="bb-lux-shot-canvas">
                      <img
                        src="img/Dashboard.png"
                        alt="BudgetBee Dashboard Overview"
                        className="bb-lux-screen-img"
                      />
                    </div>

                    <div className="bb-lux-metric-strip px-3 px-sm-4 py-3">
                      <div className="row g-2 text-start">

                        <div className="col-4">
                          <div className="bb-lux-metric-pill px-3 py-2">
                            <div
                              className="small bb-lux-text-sub"
                              style={{ fontSize: "0.68rem" }}
                            >
                              Cash Inflow
                            </div>

                            <div
                              className="small fw-extrabold mt-0.5"
                              style={{ color: "#34d399" }}
                            >
                              MMK 30,000
                            </div>
                          </div>
                        </div>

                        <div className="col-4">
                          <div className="bb-lux-metric-pill px-3 py-2">
                            <div
                              className="small bb-lux-text-sub"
                              style={{ fontSize: "0.68rem" }}
                            >
                              Cash Outflow
                            </div>

                            <div
                              className="small fw-extrabold mt-0.5"
                              style={{ color: "#f87171" }}
                            >
                              MMK 10,000
                            </div>
                          </div>
                        </div>

                        <div className="col-4">
                          <div
                            className="bb-lux-metric-pill px-3 py-2"
                            style={{ borderColor: "rgba(251, 191, 36, 0.35)" }}
                          >
                            <div
                              className="small bb-lux-text-sub"
                              style={{ fontSize: "0.68rem" }}
                            >
                              Monthly Limit
                            </div>

                            <div className="small fw-extrabold bb-lux-gold-text mt-0.5">
                              MMK 30,000
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* Floating Signature Bee Accent Card */}
                  <div className="bb-lux-floating-card p-3 d-flex align-items-center justify-content-between gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <span className="bb-lux-bee-emblem d-inline-flex align-items-center justify-content-center">
                        <img
                          src="img/BudgetBee_Logo.png"
                          alt="BudgetBee Logo"
                          className="bb-lux-logo-img"
                        />
                      </span>

                      <div>
                        <div className="fw-extrabold small text-white">
                          Welcome to BudgetBee
                        </div>

                        <div
                          className="small bb-lux-text-muted"
                          style={{ fontSize: "0.74rem" }}
                        >
                          Curated wealth tracking at a glance
                        </div>
                      </div>
                    </div>

                    <a
                      href="/register"
                      className="btn bb-lux-btn-gold btn-sm rounded-3 px-3 py-2 fw-bold text-nowrap"
                    >
                      Start Now
                    </a>
                  </div>

                </div>
              </div>

            </div>
          </section>
        </main>

        {/* Footer */}
        <footer id="bbLuxFooter" className="bb-lux-footer py-3">
          <div className="container d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 small">
            <span>
              © 2026 <strong className="text-white">BudgetBee</strong>. All rights reserved.
            </span>

            <span>Crafted with Dark Gold Precision</span>
          </div>
        </footer>

      </div>
    </>
  );
};

export default DefaultPage;
