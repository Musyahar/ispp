/**
 * app.js — Router, Inisialisasi, dan Event Handling
 * Entry point aplikasi SPK Pemilihan ISP
 */

/* ============================================================
   ROUTER — Hash-based SPA routing
   ============================================================ */
const Router = {
  routes: {
    "#home": renderDashboard,
    "#profile": renderProfile,
    "#providers": renderProviders,
    "#packages": renderPackages,
    "#review": renderReview,
    "#results": renderResults
  },

  /** Navigasi ke hash tertentu */
  navigate: function (hash) {
    window.location.hash = hash;
  },

  /** Render halaman sesuai hash aktif */
  handleRoute: function () {
    var hash = window.location.hash || "#home";
    var renderFn = Router.routes[hash];

    if (renderFn) {
      renderFn();
    } else {
      renderDashboard();
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Focus main content for accessibility
    var app = document.getElementById("app");
    if (app) app.focus({ preventScroll: true });

    // Close mobile nav
    var mobileNav = document.getElementById("mobile-nav");
    if (mobileNav) mobileNav.classList.remove("active");

    // Update active nav link
    Router.updateActiveNav(hash);
  },

  /** Update styling nav link aktif */
  updateActiveNav: function (hash) {
    document.querySelectorAll(".nav-link[data-nav]").forEach(function (link) {
      link.classList.remove("nav-link--active");
    });

    if (hash === "#home") {
      document.querySelectorAll('[data-nav="home"]').forEach(function (link) {
        link.classList.add("nav-link--active");
      });
    } else if (["#profile", "#providers", "#packages", "#review", "#results"].includes(hash)) {
      document.querySelectorAll('[data-nav="search"]').forEach(function (link) {
        link.classList.add("nav-link--active");
      });
    }
  }
};

/* ============================================================
   INITIALIZATION
   ============================================================ */
var _hashListenerAdded = false;

function initApp() {
  // ── Auth gate: show login if not logged in ──
  if (!isLoggedIn()) {
    renderLoginPage();
    return;
  }

  // Remove login page if still present
  var loginPage = document.getElementById("login-page");
  if (loginPage) loginPage.remove();
  document.body.classList.remove("not-logged-in");

  // Muat state dari LocalStorage
  loadState();

  // Render header & footer
  renderHeader();
  renderFooter();

  // Handle route awal
  Router.handleRoute();

  // Listen untuk perubahan hash (only once)
  if (!_hashListenerAdded) {
    window.addEventListener("hashchange", function () {
      if (!isLoggedIn()) {
        renderLoginPage();
        return;
      }
      Router.handleRoute();
    });
    _hashListenerAdded = true;
  }

  // Jalankan unit test di console (developer mode)
  if (typeof runWPTests === "function") {
    try {
      runWPTests();
    } catch (e) {
      console.warn("Unit tests gagal:", e);
    }
  }
}

// Jalankan saat DOM ready
document.addEventListener("DOMContentLoaded", initApp);
