/**
 * ui.js — UI Rendering Module
 * Semua fungsi render halaman dan komponen
 */

/* ============================================================
   ANIMATION HELPERS (lightweight, GPU-friendly)
   ============================================================ */

/**
 * Scroll Reveal — animates elements with class "reveal"
 * Uses IntersectionObserver for performance (no scroll listener)
 */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('revealed');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
}

/**
 * Animate stat counter — counts from 0 to target number
 * @param {HTMLElement} el — element containing the number
 * @param {number} target — target number
 * @param {number} duration — animation duration in ms
 */
function animateCounter(el, target, duration) {
  duration = duration || 800;
  var start = 0;
  var startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    // Ease out cubic
    var eased = 1 - Math.pow(1 - progress, 3);
    var current = Math.round(start + (target - start) * eased);
    el.textContent = current;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

/**
 * Initialize stat counters on the dashboard
 */
function initStatCounters() {
  document.querySelectorAll('.stat-number[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    animateCounter(el, target, 700);
  });
}

/* ============================================================
   TOAST SYSTEM
   ============================================================ */
function showToast(message, type) {
  type = type || "success";
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }

  const icons = {
    success: "✅",
    warning: "⚠️",
    error: "❌"
  };

  const toast = document.createElement("div");
  toast.className = "toast toast--" + type;
  toast.innerHTML =
    '<span class="toast-icon">' + (icons[type] || "ℹ️") + '</span>' +
    '<span></span>';
  toast.querySelector("span:last-child").textContent = message;

  container.appendChild(toast);
  setTimeout(function () {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 3200);
}

/* ============================================================
   MODAL SYSTEM
   ============================================================ */
function showModal(title, bodyHTML) {
  // Remove existing
  const existing = document.querySelector(".modal-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay active";
  overlay.innerHTML =
    '<div class="modal" role="dialog" aria-modal="true" aria-label="' + title + '">' +
      '<div class="modal-header">' +
        '<h3>' + title + '</h3>' +
        '<button class="modal-close" aria-label="Tutup modal">&times;</button>' +
      '</div>' +
      '<div class="modal-body">' + bodyHTML + '</div>' +
      '<div class="modal-footer">' +
        '<button class="btn btn-secondary btn-sm modal-close-btn">Tutup</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  // Close handlers
  function closeModal() {
    overlay.remove();
  }

  overlay.querySelector(".modal-close").addEventListener("click", closeModal);
  overlay.querySelector(".modal-close-btn").addEventListener("click", closeModal);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeModal();
  });

  // Escape key
  function handleEsc(e) {
    if (e.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", handleEsc);
    }
  }
  document.addEventListener("keydown", handleEsc);

  // Focus trap
  overlay.querySelector(".modal-close").focus();
}

/* ============================================================
   HEADER RENDERER
   ============================================================ */
function renderHeader() {
  var header = document.getElementById("site-header");
  header.className = "site-header";

  var user = getLoggedInUser();
  var userHTML = '';
  if (user) {
    var initial = user.displayName ? user.displayName.charAt(0).toUpperCase() : "U";
    userHTML =
      '<div class="user-info">' +
        '<div class="user-avatar">' + initial + '</div>' +
        '<span class="user-name">' + user.displayName + '</span>' +
        '<button class="btn-logout" id="btn-logout" aria-label="Keluar">Keluar</button>' +
      '</div>';
  }

  header.innerHTML =
    '<div class="container header-inner">' +
      '<a href="#home" class="logo">' +
        '<span class="logo-icon">S</span>' +
        '<span>SPK ISP</span>' +
      '</a>' +
      '<nav class="nav-desktop" aria-label="Navigasi utama">' +
        '<a href="#home" class="nav-link" data-nav="home">Beranda</a>' +
        '<a href="#profile" class="nav-link" data-nav="search">Cari Paket</a>' +
        '<button class="nav-link" id="nav-about-method">Tentang Metode</button>' +
        userHTML +
      '</nav>' +
      '<button class="hamburger" aria-label="Buka menu navigasi" id="hamburger-btn">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
    '</div>' +
    '<nav class="mobile-nav" id="mobile-nav" aria-label="Navigasi mobile">' +
      '<a href="#home" class="nav-link" data-nav="home">Beranda</a>' +
      '<a href="#profile" class="nav-link" data-nav="search">Cari Paket</a>' +
      '<button class="nav-link" id="nav-about-method-mobile">Tentang Metode</button>' +
      (user ? '<button class="nav-link" id="btn-logout-mobile" style="color:var(--danger)">Keluar</button>' : '') +
    '</nav>';

  // Hamburger toggle
  document.getElementById("hamburger-btn").addEventListener("click", function () {
    document.getElementById("mobile-nav").classList.toggle("active");
  });

  // Close mobile nav on link click
  document.querySelectorAll(".mobile-nav .nav-link").forEach(function (link) {
    link.addEventListener("click", function () {
      document.getElementById("mobile-nav").classList.remove("active");
    });
  });

  // About method modal
  function openMethodModal() {
    showModal("Tentang Metode Weighted Product", getMethodExplanationHTML());
    document.getElementById("mobile-nav").classList.remove("active");
  }

  document.getElementById("nav-about-method").addEventListener("click", openMethodModal);
  document.getElementById("nav-about-method-mobile").addEventListener("click", openMethodModal);

  // Logout handlers
  function handleLogout() {
    logoutUser();
    document.getElementById("mobile-nav").classList.remove("active");
    showToast("Anda telah keluar.", "success");
    // Re-init to show login
    setTimeout(function () { initApp(); }, 300);
  }

  var logoutBtn = document.getElementById("btn-logout");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

  var logoutBtnMobile = document.getElementById("btn-logout-mobile");
  if (logoutBtnMobile) logoutBtnMobile.addEventListener("click", handleLogout);
}

/* ============================================================
   LOGIN PAGE RENDERER
   ============================================================ */
function renderLoginPage() {
  // Hide header/footer/app, show login
  document.body.classList.add("not-logged-in");

  // Remove existing login page
  var existing = document.getElementById("login-page");
  if (existing) existing.remove();

  var loginDiv = document.createElement("div");
  loginDiv.id = "login-page";
  loginDiv.className = "login-page";
  loginDiv.innerHTML =
    '<div class="login-card">' +
      '<div class="login-logo">' +
        '<span class="logo-icon">S</span>' +
        '<span>SPK ISP</span>' +
      '</div>' +
      '<div class="login-header">' +
        '<h1>Masuk</h1>' +
        '<p>Sistem Pendukung Keputusan Pemilihan ISP</p>' +
      '</div>' +

      '<div class="login-alert alert-danger" id="login-error" role="alert">' +
        '<span>⚠️</span>' +
        '<span id="login-error-text">Username atau password salah.</span>' +
      '</div>' +

      '<form id="login-form" autocomplete="on">' +
        '<div class="form-group">' +
          '<label class="form-label" for="login-username">Username</label>' +
          '<input type="text" class="form-input" id="login-username" placeholder="Masukkan username" autocomplete="username" required>' +
        '</div>' +

        '<div class="form-group">' +
          '<label class="form-label" for="login-password">Password</label>' +
          '<div class="form-input-wrapper">' +
            '<input type="password" class="form-input" id="login-password" placeholder="Masukkan password" autocomplete="current-password" required>' +
            '<button type="button" class="password-toggle" id="toggle-password" aria-label="Tampilkan password">👁️</button>' +
          '</div>' +
        '</div>' +

        '<button type="submit" class="btn btn-primary btn-lg login-btn">Masuk</button>' +
      '</form>' +

      '<div class="login-footer">' +
        '<p>Studi Kasus: Cilandak Timur, Jakarta Selatan<br>Metode Weighted Product — BAB IV Penelitian</p>' +
      '</div>' +
    '</div>';

  document.body.appendChild(loginDiv);

  // Focus username field
  setTimeout(function () {
    document.getElementById("login-username").focus();
  }, 100);

  // Password toggle
  document.getElementById("toggle-password").addEventListener("click", function () {
    var pwInput = document.getElementById("login-password");
    if (pwInput.type === "password") {
      pwInput.type = "text";
      this.textContent = "🙈";
      this.setAttribute("aria-label", "Sembunyikan password");
    } else {
      pwInput.type = "password";
      this.textContent = "👁️";
      this.setAttribute("aria-label", "Tampilkan password");
    }
  });

  // Form submit
  document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    var username = document.getElementById("login-username").value.trim();
    var password = document.getElementById("login-password").value;
    var errorEl = document.getElementById("login-error");

    // Clear previous error
    errorEl.classList.remove("visible");
    document.getElementById("login-username").classList.remove("input-error");
    document.getElementById("login-password").classList.remove("input-error");

    // Validate empty fields
    if (!username || !password) {
      document.getElementById("login-error-text").textContent = "Username dan password harus diisi.";
      errorEl.classList.add("visible");
      if (!username) document.getElementById("login-username").classList.add("input-error");
      if (!password) document.getElementById("login-password").classList.add("input-error");
      return;
    }

    // Attempt login
    var result = loginUser(username, password);

    if (result.success) {
      // Remove login page, show app
      loginDiv.remove();
      document.body.classList.remove("not-logged-in");
      showToast("Selamat datang, " + result.user.displayName + "!", "success");
      initApp();
    } else {
      document.getElementById("login-error-text").textContent = result.message;
      errorEl.classList.add("visible");
      document.getElementById("login-username").classList.add("input-error");
      document.getElementById("login-password").classList.add("input-error");
      // Shake animation
      var card = document.querySelector(".login-card");
      card.style.animation = "none";
      card.offsetHeight; // reflow
      card.style.animation = "slideUp 0.3s ease";
    }
  });
}


/* ============================================================
   FOOTER RENDERER
   ============================================================ */
function renderFooter() {
  const footer = document.getElementById("site-footer");
  footer.className = "site-footer";
  footer.innerHTML =
    '<div class="container footer-inner">' +
      '<p class="footer-text">' +
        'SPK Pemilihan ISP &mdash; Metode Weighted Product<br>' +
        'Studi Kasus: Cilandak Timur, Jakarta Selatan' +
      '</p>' +
    '</div>';
}

/* ============================================================
   STEPPER COMPONENT
   ============================================================ */
function renderStepper(activeStep) {
  const steps = [
    { num: 1, label: "Profil" },
    { num: 2, label: "Provider" },
    { num: 3, label: "Paket" },
    { num: 4, label: "Hasil" }
  ];

  var html = '<div class="stepper" role="navigation" aria-label="Langkah proses">';

  steps.forEach(function (step, index) {
    var stateClass = "";
    var circleContent = String(step.num);

    if (step.num < activeStep) {
      stateClass = "step--done";
      circleContent = "✓";
    } else if (step.num === activeStep) {
      stateClass = "step--active";
    }

    html += '<div class="step ' + stateClass + '">';
    html += '<span class="step-circle">' + circleContent + '</span>';
    html += '<span class="step-label">' + step.label + '</span>';
    html += '</div>';

    if (index < steps.length - 1) {
      var lineClass = step.num < activeStep ? "step-line step-line--done" : "step-line";
      html += '<div class="' + lineClass + '"></div>';
    }
  });

  html += '</div>';
  return html;
}

/* ============================================================
   METHOD EXPLANATION HTML (for modal)
   ============================================================ */
function getMethodExplanationHTML() {
  return '' +
    '<p>Metode <strong>Weighted Product (WP)</strong> adalah salah satu metode dalam Sistem Pendukung Keputusan yang menggunakan perkalian untuk menghubungkan rating atribut, di mana rating setiap atribut harus dipangkatkan terlebih dahulu dengan bobot atribut yang bersangkutan.</p>' +
    '<p><strong>Langkah-langkah perhitungan:</strong></p>' +
    '<ul>' +
      '<li><strong>Normalisasi Bobot:</strong> Setiap bobot awal dibagi dengan jumlah total seluruh bobot. Contoh: C1 = 5/25 = 0.20</li>' +
      '<li><strong>Penentuan Pangkat:</strong> Atribut bertipe <em>cost</em> menggunakan pangkat <strong>negatif</strong> (semakin kecil semakin baik). Atribut bertipe <em>benefit</em> menggunakan pangkat <strong>positif</strong> (semakin besar semakin baik).</li>' +
      '<li><strong>Vektor S:</strong> Setiap alternatif dihitung dengan mengalikan seluruh nilai kriteria yang sudah dipangkatkan. Si = ∏(xij ^ wj)</li>' +
      '<li><strong>Vektor V:</strong> Nilai preferensi relatif dihitung dengan membagi Vektor S masing-masing alternatif dengan total seluruh Vektor S. Vi = Si / ΣSi</li>' +
      '<li><strong>Ranking:</strong> Alternatif diurutkan dari nilai V terbesar ke terkecil. Nilai V tertinggi merupakan rekomendasi utama.</li>' +
    '</ul>' +
    '<p><strong>Catatan:</strong> Bobot yang digunakan dalam aplikasi ini telah ditetapkan berdasarkan data penelitian BAB IV dan tidak dapat diubah oleh pengguna.</p>';
}

/* ============================================================
   PAGE 1: DASHBOARD
   ============================================================ */
function renderDashboard() {
  var app = document.getElementById("app");
  var grouped = groupByProvider(ISP_DATA);
  var providers = getProviderList();
  var totalPackages = ISP_DATA.length;

  var html = '';

  // Print header (hidden, only for print)
  html += '<div class="print-header">';
  html += '<h1>LAPORAN HASIL REKOMENDASI</h1>';
  html += '<h2>Sistem Pendukung Keputusan Pemilihan ISP — Metode Weighted Product</h2>';
  html += '</div>';

  // Hero
  html += '<section class="hero">';
  html += '<div class="container">';
  html += '<h1>Temukan Paket Internet yang Sesuai</h1>';
  html += '<p>Bandingkan provider dan paket internet menggunakan enam kriteria penelitian: ' +
           'harga, kecepatan, biaya instalasi, latency, rasio upload-download, dan kualitas router.</p>';
  html += '<a href="#profile" class="btn btn-primary btn-lg">Cari Paket yang Cocok untuk Saya</a>';
  html += '</div>';
  html += '</section>';

  // Stats
  html += '<section class="section--sm">';
  html += '<div class="container">';
  html += '<div class="stats-bar">';
  html += '<div class="stat-item"><div class="stat-number" data-count="' + providers.length + '">0</div><div class="stat-label">Provider</div></div>';
  html += '<div class="stat-item"><div class="stat-number" data-count="' + totalPackages + '">0</div><div class="stat-label">Paket</div></div>';
  html += '<div class="stat-item"><div class="stat-number" data-count="' + criteria.length + '">0</div><div class="stat-label">Kriteria</div></div>';
  html += '</div>';
  html += '</div>';
  html += '</section>';

  // Search & Filter
  html += '<section class="section reveal">';
  html += '<div class="container">';
  html += '<h2 style="margin-bottom: var(--sp-6)">Katalog Provider</h2>';

  html += '<div class="search-filter-bar">';
  html += '<div class="search-input-wrapper">';
  html += '<span class="search-icon">🔍</span>';
  html += '<input type="text" class="search-input" id="catalog-search" placeholder="Cari provider atau paket..." aria-label="Cari provider atau paket">';
  html += '</div>';
  html += '<div class="filter-pills">';
  html += '<button class="filter-pill filter-pill--active" data-filter="all">Semua</button>';
  html += '<button class="filter-pill" data-filter="cheap">≤ Rp250.000</button>';
  html += '<button class="filter-pill" data-filter="mid">50–100 Mbps</button>';
  html += '<button class="filter-pill" data-filter="fast">&gt; 100 Mbps</button>';
  html += '</div>';
  html += '</div>';

  // Provider Grid
  html += '<div class="provider-grid" id="provider-catalog">';

  providers.forEach(function (providerName) {
    var packages = grouped[providerName];
    var stats = getProviderStats(packages);
    var initial = providerName.charAt(0).toUpperCase();

    html += '<div class="card provider-card card-animate" data-provider="' + providerName + '">';
    html += '<div class="provider-icon">' + initial + '</div>';
    html += '<div class="card-title">' + providerName + '</div>';
    html += '<div class="card-subtitle">' + packages.length + ' Paket</div>';
    html += '<div class="provider-meta">';
    html += '<div class="provider-meta-item"><span class="provider-meta-icon">💰</span> Mulai ' + formatRupiah(stats.minPrice) + '/bulan</div>';
    html += '<div class="provider-meta-item"><span class="provider-meta-icon">⚡</span> Kecepatan hingga ' + stats.maxSpeed + ' Mbps</div>';
    html += '</div>';
    html += '<button class="btn btn-secondary btn-sm toggle-packages-btn" data-provider="' + providerName + '">Lihat Paket</button>';

    // Expandable package list
    html += '<div class="package-list-inline" id="pkg-' + providerName.replace(/[^a-zA-Z0-9]/g, '') + '" style="display:none;">';
    packages.forEach(function (pkg) {
      html += '<div class="package-item-inline">';
      html += '<h5>' + pkg.package + '</h5>';
      html += '<div class="package-specs">';
      html += '<div class="package-spec-item"><span class="package-spec-label">Harga</span><span class="package-spec-value">' + formatRupiah(pkg.c1) + '</span></div>';
      html += '<div class="package-spec-item"><span class="package-spec-label">Kecepatan</span><span class="package-spec-value">' + pkg.c2 + ' Mbps</span></div>';
      html += '<div class="package-spec-item"><span class="package-spec-label">Instalasi</span><span class="package-spec-value">' + formatRupiah(pkg.c3) + '</span></div>';
      html += '<div class="package-spec-item"><span class="package-spec-label">Latency</span><span class="package-spec-value">' + pkg.c4 + ' ms</span></div>';
      html += '<div class="package-spec-item"><span class="package-spec-label">Upload:Download</span><span class="package-spec-value">' + formatRatio(pkg.c5) + '</span></div>';
      html += '<div class="package-spec-item"><span class="package-spec-label">Router</span><span class="package-spec-value">' + formatRouter(pkg.c6) + '</span></div>';
      html += '</div>';
      html += '</div>';
    });
    html += '</div>';

    html += '</div>';
  });

  html += '</div>'; // provider-grid
  html += '</div>';
  html += '</section>';

  // Empty state for search
  html += '';

  app.innerHTML = html;
  app.className = "fade-in";

  // Init animations
  initStatCounters();
  initScrollReveal();

  // ── Event: Toggle packages ──
  document.querySelectorAll(".toggle-packages-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var prov = this.getAttribute("data-provider");
      var listId = "pkg-" + prov.replace(/[^a-zA-Z0-9]/g, '');
      var list = document.getElementById(listId);
      if (list) {
        var isHidden = list.style.display === "none";
        list.style.display = isHidden ? "flex" : "none";
        this.textContent = isHidden ? "Tutup Paket" : "Lihat Paket";
      }
    });
  });

  // ── Event: Search ──
  document.getElementById("catalog-search").addEventListener("input", function () {
    filterCatalog();
  });

  // ── Event: Filters ──
  document.querySelectorAll(".filter-pill").forEach(function (pill) {
    pill.addEventListener("click", function () {
      document.querySelectorAll(".filter-pill").forEach(function (p) {
        p.classList.remove("filter-pill--active");
      });
      this.classList.add("filter-pill--active");
      filterCatalog();
    });
  });
}

function filterCatalog() {
  var searchVal = document.getElementById("catalog-search").value.toLowerCase();
  var activeFilter = document.querySelector(".filter-pill--active");
  var filterType = activeFilter ? activeFilter.getAttribute("data-filter") : "all";
  var grouped = groupByProvider(ISP_DATA);
  var cards = document.querySelectorAll("#provider-catalog .provider-card");
  var anyVisible = false;

  cards.forEach(function (card) {
    var providerName = card.getAttribute("data-provider");
    var packages = grouped[providerName];

    // Text search
    var matchesSearch = true;
    if (searchVal) {
      var provLower = providerName.toLowerCase();
      var pkgNames = packages.map(function (p) { return p.package.toLowerCase(); }).join(" ");
      matchesSearch = provLower.includes(searchVal) || pkgNames.includes(searchVal);
    }

    // Filter
    var matchesFilter = true;
    if (filterType !== "all") {
      matchesFilter = packages.some(function (pkg) {
        if (filterType === "cheap") return pkg.c1 <= 250000;
        if (filterType === "mid") return pkg.c2 >= 50 && pkg.c2 <= 100;
        if (filterType === "fast") return pkg.c2 > 100;
        return true;
      });
    }

    if (matchesSearch && matchesFilter) {
      card.style.display = "";
      anyVisible = true;
    } else {
      card.style.display = "none";
    }
  });

  // Show empty state
  var emptyEl = document.getElementById("catalog-empty");
  if (emptyEl) emptyEl.remove();

  if (!anyVisible) {
    var emptyHtml = '<div id="catalog-empty" class="empty-state">' +
      '<div class="empty-icon">🔍</div>' +
      '<h3>Paket tidak ditemukan.</h3>' +
      '<p>Coba gunakan kata kunci atau filter lain.</p>' +
      '</div>';
    document.getElementById("provider-catalog").insertAdjacentHTML("afterend", emptyHtml);
  }
}

/* ============================================================
   PAGE 2: PROFIL KEBUTUHAN
   ============================================================ */
function renderProfile() {
  var app = document.getElementById("app");
  var selectedProfile = appState.profile;

  var html = '<div class="container section">';
  html += renderStepper(1);

  html += '<div class="page-header">';
  html += '<h2>Pilih Profil Kebutuhan Anda</h2>';
  html += '<p>Pilih profil yang paling mendekati penggunaan internet Anda. Bobot penilaian telah ditetapkan otomatis berdasarkan penelitian.</p>';
  html += '</div>';

  // Profile cards
  html += '<div class="profile-grid">';
  USER_PROFILES.forEach(function (profile) {
    var isSelected = selectedProfile === profile.id;
    var cardClass = "card profile-card card--clickable card-animate" + (isSelected ? " card--selected" : "");
    html += '<div class="' + cardClass + '" data-profile="' + profile.id + '" role="button" tabindex="0" aria-pressed="' + isSelected + '" aria-label="Profil ' + profile.name + '">';
    html += '<span class="profile-icon">' + profile.icon + '</span>';
    html += '<div>';
    html += '<div class="profile-name">' + profile.name + '</div>';
    html += '<div class="profile-desc">' + profile.description + '</div>';
    html += '</div>';
    html += '</div>';
  });
  html += '</div>';

  // Weight panel
  html += '<div class="weight-panel reveal">';
  html += '<div class="weight-panel-header">';
  html += '<h3>Bobot Penilaian</h3>';
  html += '<button class="btn btn-ghost btn-sm" id="btn-explain-method">Bagaimana sistem menghitung?</button>';
  html += '</div>';

  html += '<div class="alert alert-info mb-4">';
  html += '<span class="alert-icon">ℹ️</span>';
  html += '<span>Bobot penilaian telah ditetapkan berdasarkan data penelitian pada BAB IV dan digunakan otomatis oleh sistem.</span>';
  html += '</div>';

  html += '<div class="weight-grid">';
  criteria.forEach(function (c) {
    var badgeClass = c.type === "cost" ? "badge-cost" : "badge-benefit";
    var badgeLabel = c.type === "cost" ? "Cost" : "Benefit";
    html += '<div class="weight-row">';
    html += '<span class="weight-name">' + c.name + '</span>';
    html += '<span class="weight-value">' + c.weight + '</span>';
    html += '<span class="badge ' + badgeClass + '">' + badgeLabel + '</span>';
    html += '</div>';
  });
  html += '</div>';
  html += '</div>';

  // Action bar
  html += '<div class="action-bar">';
  html += '<a href="#home" class="btn btn-secondary">← Kembali</a>';
  html += '<button class="btn btn-primary" id="btn-to-providers"' + (!selectedProfile ? ' disabled' : '') + '>Lanjut Pilih Provider →</button>';
  html += '</div>';

  html += '</div>';

  app.innerHTML = html;
  app.className = "fade-in";
  initScrollReveal();

  // ── Events ──
  document.querySelectorAll(".profile-card").forEach(function (card) {
    function selectProfile() {
      var profileId = card.getAttribute("data-profile");
      appState.profile = profileId;
      saveState();

      // Update UI
      document.querySelectorAll(".profile-card").forEach(function (c) {
        c.classList.remove("card--selected");
        c.setAttribute("aria-pressed", "false");
      });
      card.classList.add("card--selected");
      card.setAttribute("aria-pressed", "true");
      document.getElementById("btn-to-providers").disabled = false;
      showToast("Profil " + getProfileById(profileId).name + " dipilih.", "success");
    }

    card.addEventListener("click", selectProfile);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectProfile();
      }
    });
  });

  document.getElementById("btn-to-providers").addEventListener("click", function () {
    if (appState.profile) {
      window.location.hash = "#providers";
    }
  });

  document.getElementById("btn-explain-method").addEventListener("click", function () {
    showModal("Bagaimana Sistem Menghitung?", getMethodExplanationHTML());
  });
}

/* ============================================================
   PAGE 3: PEMILIHAN PROVIDER
   ============================================================ */
function renderProviders() {
  if (!appState.profile) {
    window.location.hash = "#profile";
    return;
  }

  var app = document.getElementById("app");
  var providers = getProviderList();
  var grouped = groupByProvider(ISP_DATA);
  var selected = appState.selectedProviders;

  var html = '<div class="container section">';
  html += renderStepper(2);

  html += '<div class="page-header">';
  html += '<h2>Pilih Provider yang Ingin Dibandingkan</h2>';
  html += '<p>Pilih minimal 2 provider untuk melakukan perbandingan paket internet.</p>';
  html += '</div>';

  html += '<div class="provider-select-grid">';

  providers.forEach(function (providerName) {
    var packages = grouped[providerName];
    var isSelected = selected.includes(providerName);
    var cardClass = "card checkbox-card card-animate" + (isSelected ? " card--selected" : "");

    html += '<label class="' + cardClass + '" data-provider="' + providerName + '">';
    html += '<input type="checkbox" value="' + providerName + '"' + (isSelected ? ' checked' : '') + ' aria-label="Pilih ' + providerName + '">';
    html += '<div class="card-label-content">';
    html += '<h4>' + providerName + '</h4>';
    html += '<p>' + packages.length + ' paket tersedia</p>';
    html += '</div>';
    html += '</label>';
  });

  html += '</div>';

  // Counter & actions
  html += '<div class="action-bar">';
  html += '<a href="#profile" class="btn btn-secondary">← Kembali</a>';
  html += '<div class="action-bar-right">';
  html += '<span class="counter-text" id="provider-counter">' + selected.length + ' provider dipilih</span>';
  html += '<button class="btn btn-primary" id="btn-to-packages"' + (selected.length < 2 ? ' disabled' : '') + '>Lanjut Pilih Paket →</button>';
  html += '</div>';
  html += '</div>';

  if (selected.length < 2) {
    html += '<div class="alert alert-warning" id="provider-alert">';
    html += '<span class="alert-icon">⚠️</span>';
    html += '<span>Pilih minimal 2 provider untuk melakukan perbandingan.</span>';
    html += '</div>';
  }

  html += '</div>';

  app.innerHTML = html;
  app.className = "fade-in";

  // ── Events ──
  document.querySelectorAll('.checkbox-card input[type="checkbox"]').forEach(function (cb) {
    cb.addEventListener("change", function () {
      var providerName = this.value;
      var card = this.closest(".checkbox-card");

      if (this.checked) {
        if (!appState.selectedProviders.includes(providerName)) {
          appState.selectedProviders.push(providerName);
        }
        card.classList.add("card--selected");
      } else {
        appState.selectedProviders = appState.selectedProviders.filter(function (p) {
          return p !== providerName;
        });
        card.classList.remove("card--selected");

        // Remove selected package for this provider
        delete appState.selectedPackages[providerName];
      }

      saveState();

      // Update counter and button
      var count = appState.selectedProviders.length;
      document.getElementById("provider-counter").textContent = count + " provider dipilih";
      document.getElementById("btn-to-packages").disabled = count < 2;

      // Alert
      var alertEl = document.getElementById("provider-alert");
      if (count >= 2 && alertEl) {
        alertEl.style.display = "none";
      } else if (count < 2 && alertEl) {
        alertEl.style.display = "";
      }
    });
  });

  document.getElementById("btn-to-packages").addEventListener("click", function () {
    if (appState.selectedProviders.length >= 2) {
      window.location.hash = "#packages";
    }
  });
}

/* ============================================================
   PAGE 4: PEMILIHAN PAKET
   ============================================================ */
function renderPackages() {
  if (!appState.profile || appState.selectedProviders.length < 2) {
    window.location.hash = "#providers";
    return;
  }

  var app = document.getElementById("app");
  var selected = appState.selectedProviders;
  var selectedPkgs = appState.selectedPackages;

  var html = '<div class="container section">';
  html += renderStepper(3);

  html += '<div class="page-header">';
  html += '<h2>Pilih Paket dari Setiap Provider</h2>';
  html += '<p>Pilih tepat satu paket dari setiap provider yang telah dipilih.</p>';
  html += '</div>';

  var completedCount = 0;

  selected.forEach(function (providerName) {
    var packages = getPackagesByProvider(providerName);
    var selectedPkgId = selectedPkgs[providerName] || null;
    if (selectedPkgId) completedCount++;

    html += '<div class="provider-package-group">';
    html += '<h3>' + providerName + ' <span class="provider-tag">' + packages.length + ' paket</span></h3>';
    html += '<div class="package-radio-list">';

    packages.forEach(function (pkg) {
      var isSelected = selectedPkgId === pkg.id;
      var cardClass = "card radio-card" + (isSelected ? " card--selected" : "");

      html += '<label class="' + cardClass + '" data-pkg-id="' + pkg.id + '" data-provider="' + providerName + '">';
      html += '<input type="radio" name="pkg-' + providerName.replace(/[^a-zA-Z0-9]/g, '') + '" value="' + pkg.id + '"' + (isSelected ? ' checked' : '') + ' aria-label="' + pkg.package + '">';
      html += '<div class="card-label-content">';
      html += '<h4>' + pkg.package + '</h4>';
      html += '<p>' + formatRupiah(pkg.c1) + ' &middot; ' + pkg.c2 + ' Mbps</p>';

      // Expandable detail
      html += '<div class="package-expand">';
      html += '<div class="package-specs">';
      html += '<div class="package-spec-item"><span class="package-spec-label">Harga</span><span class="package-spec-value">' + formatRupiah(pkg.c1) + '</span></div>';
      html += '<div class="package-spec-item"><span class="package-spec-label">Kecepatan</span><span class="package-spec-value">' + pkg.c2 + ' Mbps</span></div>';
      html += '<div class="package-spec-item"><span class="package-spec-label">Biaya Instalasi</span><span class="package-spec-value">' + formatRupiah(pkg.c3) + '</span></div>';
      html += '<div class="package-spec-item"><span class="package-spec-label">Latency</span><span class="package-spec-value">' + pkg.c4 + ' ms</span></div>';
      html += '<div class="package-spec-item"><span class="package-spec-label">Upload:Download</span><span class="package-spec-value">' + formatRatio(pkg.c5) + '</span></div>';
      html += '<div class="package-spec-item"><span class="package-spec-label">Kualitas Router</span><span class="package-spec-value">' + formatRouter(pkg.c6) + '</span></div>';
      html += '</div>';
      html += '</div>';

      html += '</div>';
      html += '</label>';
    });

    html += '</div>';
    html += '</div>';
  });

  // Counter & actions
  var totalNeeded = selected.length;
  html += '<div class="action-bar">';
  html += '<a href="#providers" class="btn btn-secondary">← Kembali</a>';
  html += '<div class="action-bar-right">';
  html += '<span class="counter-text" id="package-counter">' + completedCount + ' dari ' + totalNeeded + ' paket telah dipilih</span>';
  html += '<button class="btn btn-primary" id="btn-to-review"' + (completedCount < totalNeeded ? ' disabled' : '') + '>Bandingkan Sekarang →</button>';
  html += '</div>';
  html += '</div>';

  if (completedCount < totalNeeded) {
    html += '<div class="alert alert-warning" id="package-alert">';
    html += '<span class="alert-icon">⚠️</span>';
    html += '<span>Pilih satu paket dari setiap provider sebelum melanjutkan.</span>';
    html += '</div>';
  }

  html += '</div>';

  app.innerHTML = html;
  app.className = "fade-in";

  // ── Events ──
  document.querySelectorAll('.radio-card input[type="radio"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
      var pkgId = this.value;
      var providerName = this.closest(".radio-card").getAttribute("data-provider");

      appState.selectedPackages[providerName] = pkgId;
      saveState();

      // Update card styles within this provider group
      var group = this.closest(".package-radio-list");
      group.querySelectorAll(".radio-card").forEach(function (card) {
        card.classList.remove("card--selected");
      });
      this.closest(".radio-card").classList.add("card--selected");

      // Update counter
      var count = 0;
      appState.selectedProviders.forEach(function (p) {
        if (appState.selectedPackages[p]) count++;
      });

      var totalNeeded = appState.selectedProviders.length;
      document.getElementById("package-counter").textContent = count + " dari " + totalNeeded + " paket telah dipilih";
      document.getElementById("btn-to-review").disabled = count < totalNeeded;

      var alertEl = document.getElementById("package-alert");
      if (count >= totalNeeded && alertEl) alertEl.style.display = "none";
    });
  });

  document.getElementById("btn-to-review").addEventListener("click", function () {
    if (!this.disabled) {
      window.location.hash = "#review";
    }
  });
}

/* ============================================================
   PAGE 5: REVIEW
   ============================================================ */
function renderReview() {
  // Validate
  var totalNeeded = appState.selectedProviders.length;
  var completed = 0;
  appState.selectedProviders.forEach(function (p) {
    if (appState.selectedPackages[p]) completed++;
  });

  if (!appState.profile || totalNeeded < 2 || completed < totalNeeded) {
    window.location.hash = "#packages";
    return;
  }

  var app = document.getElementById("app");
  var profile = getProfileById(appState.profile);

  var html = '<div class="container section">';
  html += renderStepper(4);

  html += '<div class="page-header">';
  html += '<h2>Review Pilihan Anda</h2>';
  html += '<p>Pastikan pilihan berikut sudah benar sebelum menghitung rekomendasi.</p>';
  html += '</div>';

  // Profile section
  html += '<div class="review-section">';
  html += '<h4>Profil Kebutuhan</h4>';
  html += '<div class="review-item">';
  html += '<span class="review-item-number">' + profile.icon + '</span>';
  html += '<span class="review-item-text"><strong>' + profile.name + '</strong> — ' + profile.description + '</span>';
  html += '</div>';
  html += '</div>';

  // Alternatives section
  html += '<div class="review-section">';
  html += '<h4>Alternatif yang Dibandingkan (' + totalNeeded + ' paket)</h4>';
  html += '<div class="review-list">';

  var altIndex = 1;
  appState.selectedProviders.forEach(function (providerName) {
    var pkgId = appState.selectedPackages[providerName];
    var pkg = getAlternativeById(pkgId);
    if (pkg) {
      html += '<div class="review-item">';
      html += '<span class="review-item-number">' + altIndex + '</span>';
      html += '<span class="review-item-text"><strong>' + pkg.provider + '</strong> <span>— ' + pkg.package + '</span></span>';
      html += '</div>';
      altIndex++;
    }
  });

  html += '</div>';
  html += '</div>';

  // Weights section
  html += '<div class="review-section">';
  html += '<h4>Bobot Kriteria (BAB IV)</h4>';
  html += '<div class="weight-grid">';
  criteria.forEach(function (c) {
    html += '<div class="weight-row">';
    html += '<span class="weight-name">' + c.code + ' — ' + c.name + '</span>';
    html += '<span class="weight-value">' + c.weight + '</span>';
    html += '<span class="badge ' + (c.type === "cost" ? "badge-cost" : "badge-benefit") + '">' + (c.type === "cost" ? "Cost" : "Benefit") + '</span>';
    html += '</div>';
  });
  html += '</div>';
  html += '</div>';

  // Actions
  html += '<div class="action-bar">';
  html += '<a href="#packages" class="btn btn-secondary">← Ubah Pilihan</a>';
  html += '<button class="btn btn-primary btn-lg" id="btn-calculate">Hitung Rekomendasi</button>';
  html += '</div>';

  html += '</div>';

  app.innerHTML = html;
  app.className = "fade-in";

  // ── Event: Calculate ──
  document.getElementById("btn-calculate").addEventListener("click", function () {
    runCalculation();
  });
}

/* ============================================================
   CALCULATION PROCESS
   ============================================================ */
function runCalculation() {
  var app = document.getElementById("app");

  // Loading
  app.innerHTML =
    '<div class="container section">' +
    '<div class="loading-overlay" aria-live="polite">' +
    '<div class="loading-spinner"></div>' +
    '<div class="loading-text">Menghitung rekomendasi...</div>' +
    '</div>' +
    '</div>';

  // Collect alternatives from ISP_DATA (source of truth)
  var alternatives = [];
  appState.selectedProviders.forEach(function (providerName) {
    var pkgId = appState.selectedPackages[providerName];
    var alt = getAlternativeById(pkgId);
    if (alt && validateAlternative(alt)) {
      alternatives.push(alt);
    }
  });

  if (alternatives.length < 2) {
    showToast("Minimal 2 alternatif diperlukan untuk perhitungan.", "error");
    window.location.hash = "#packages";
    return;
  }

  // Run WP after short delay for loading UX
  setTimeout(function () {
    var result = runWeightedProduct(alternatives);

    if (!result) {
      showToast("Perhitungan tidak dapat dilakukan. Periksa data alternatif.", "error");
      window.location.hash = "#review";
      return;
    }

    // Store results in state
    appState.alternatives = alternatives;
    appState.normalizedWeights = result.normalizedWeights;
    appState.vectorS = result.vectorS;
    appState.vectorV = result.vectorV;
    appState.ranking = result.ranking;

    // Navigate to results
    window.location.hash = "#results";
  }, 600);
}

/* ============================================================
   PAGE 6: HASIL & RANKING
   ============================================================ */
function renderResults() {
  if (!appState.ranking || appState.ranking.length === 0) {
    // Try to check if we have all the needed data to recalculate
    if (appState.selectedProviders.length >= 2) {
      var allComplete = true;
      appState.selectedProviders.forEach(function(p) {
        if (!appState.selectedPackages[p]) allComplete = false;
      });
      if (allComplete && appState.profile) {
        // Recalculate
        var alternatives = [];
        appState.selectedProviders.forEach(function(providerName) {
          var pkgId = appState.selectedPackages[providerName];
          var alt = getAlternativeById(pkgId);
          if (alt && validateAlternative(alt)) {
            alternatives.push(alt);
          }
        });
        if (alternatives.length >= 2) {
          var result = runWeightedProduct(alternatives);
          if (result) {
            appState.alternatives = alternatives;
            appState.normalizedWeights = result.normalizedWeights;
            appState.vectorS = result.vectorS;
            appState.vectorV = result.vectorV;
            appState.ranking = result.ranking;
          }
        }
      }
    }

    if (!appState.ranking || appState.ranking.length === 0) {
      var app = document.getElementById("app");
      app.innerHTML =
        '<div class="container section">' +
        '<div class="empty-state">' +
        '<div class="empty-icon">📊</div>' +
        '<h3>Belum ada hasil rekomendasi.</h3>' +
        '<p>Pilih profil, provider, dan paket terlebih dahulu.</p>' +
        '<a href="#profile" class="btn btn-primary mt-6">Mulai Perbandingan</a>' +
        '</div>' +
        '</div>';
      return;
    }
  }

  var app = document.getElementById("app");
  var ranking = appState.ranking;
  var winner = ranking[0];
  var profile = getProfileById(appState.profile);
  var profileName = profile ? profile.name : "Umum";

  // Generate conclusion
  var conclusion = generateConclusion({
    ranking: ranking,
    profileId: appState.profile,
    alternatives: appState.alternatives
  });

  var html = '<div class="container section">';

  // ── Winner Hero ──
  html += '<div class="result-hero">';
  html += '<span class="trophy">🏆</span>';
  html += '<div class="result-label">Rekomendasi Utama</div>';
  html += '<div class="result-provider">' + winner.provider + '</div>';
  html += '<div class="result-package">' + winner.package + '</div>';
  html += '<div class="result-score">Nilai Preferensi: ' + formatDecimal(winner.v, 6) + '</div>';
  html += '<div class="result-meta">';
  html += '<span>Profil: ' + profileName + '</span>';
  html += '<span>Dibandingkan dengan: ' + ranking.length + ' paket</span>';
  html += '</div>';
  html += '</div>';

  // ── Ranking Table ──
  html += '<h3 class="reveal" style="margin-bottom: var(--sp-4)">Peringkat</h3>';
  html += '<div class="table-wrapper mb-8 reveal">';
  html += '<table class="data-table">';
  html += '<thead><tr>';
  html += '<th>Peringkat</th><th>Provider</th><th>Paket</th>';
  html += '<th class="td-number">Vektor S</th><th class="td-number">Vektor V</th><th>Status</th>';
  html += '</tr></thead><tbody>';

  ranking.forEach(function (r) {
    var rowClass = r.rank === 1 ? 'class="row-winner"' : '';
    var statusBadge = r.rank === 1
      ? '<span class="badge badge-rank-1">#1 Rekomendasi Utama</span>'
      : '<span class="badge badge-rank">Alternatif</span>';

    html += '<tr ' + rowClass + '>';
    html += '<td class="td-center"><strong>#' + r.rank + '</strong></td>';
    html += '<td>' + r.provider + '</td>';
    html += '<td>' + r.package + '</td>';
    html += '<td class="td-number">' + formatDecimal(r.s, 6) + '</td>';
    html += '<td class="td-number">' + formatDecimal(r.v, 6) + '</td>';
    html += '<td>' + statusBadge + '</td>';
    html += '</tr>';
  });

  html += '</tbody></table>';
  html += '</div>';

  // ── Conclusion ──
  html += '<div class="conclusion-card reveal">';
  html += '<h3>Kesimpulan</h3>';
  html += '<p class="conclusion-text">' + conclusion.mainText + '</p>';
  html += '<p class="conclusion-context">' + conclusion.profileContext + '</p>';
  html += '</div>';

  // ── Detail Accordion ──
  html += '<div class="accordion mb-8">';
  html += '<button class="accordion-trigger" aria-expanded="false" id="detail-trigger">';
  html += '<span>Lihat Detail Perhitungan</span>';
  html += '<span class="accordion-icon">▼</span>';
  html += '</button>';
  html += '<div class="accordion-panel" id="detail-panel">';

  // A. Bobot Awal
  html += '<div class="accordion-section">';
  html += '<h4>A. Bobot Awal</h4>';
  html += '<div class="formula-block">';
  criteria.forEach(function (c) {
    html += c.code + ' = ' + c.weight + '\n';
  });
  html += 'Total = 25';
  html += '</div>';
  html += '</div>';

  // B. Normalisasi
  html += '<div class="accordion-section">';
  html += '<h4>B. Normalisasi Bobot</h4>';
  html += '<div class="formula-block">';
  criteria.forEach(function (c) {
    html += c.code + ' = ' + c.weight + '/25 = ' + formatDecimal(c.normalizedWeight, 2) + '\n';
  });
  html += '</div>';
  html += '</div>';

  // C. Matriks Alternatif
  html += '<div class="accordion-section">';
  html += '<h4>C. Matriks Keputusan</h4>';
  html += '<div class="table-wrapper">';
  html += '<table class="data-table">';
  html += '<thead><tr><th>ID</th><th>Provider</th><th>Paket</th><th class="td-number">C1 (Rp)</th><th class="td-number">C2 (Mbps)</th><th class="td-number">C3 (Rp)</th><th class="td-number">C4 (ms)</th><th class="td-number">C5</th><th class="td-number">C6</th></tr></thead><tbody>';

  appState.alternatives.forEach(function (a) {
    html += '<tr>';
    html += '<td>' + a.id + '</td>';
    html += '<td>' + a.provider + '</td>';
    html += '<td>' + a.package + '</td>';
    html += '<td class="td-number">' + formatRupiah(a.c1) + '</td>';
    html += '<td class="td-number">' + a.c2 + '</td>';
    html += '<td class="td-number">' + formatRupiah(a.c3) + '</td>';
    html += '<td class="td-number">' + a.c4 + '</td>';
    html += '<td class="td-number">' + formatRatio(a.c5) + '</td>';
    html += '<td class="td-number">' + formatRouter(a.c6) + '</td>';
    html += '</tr>';
  });

  html += '</tbody></table>';
  html += '</div>';
  html += '</div>';

  // D. Vektor S
  html += '<div class="accordion-section">';
  html += '<h4>D. Vektor S</h4>';
  html += '<p class="text-muted mb-4">Si = ∏(xij ^ wj) — cost: pangkat negatif, benefit: pangkat positif, C3=0 → 1</p>';

  appState.vectorS.forEach(function (v) {
    var alt = getAlternativeById(v.id);
    if (!alt) return;
    var c3val = alt.c3 === 0 ? 1 : alt.c3;
    html += '<div class="formula-block">';
    html += 'S(' + v.id + ') = ';
    html += '(' + alt.c1 + '^-0.20) × ';
    html += '(' + alt.c2 + '^0.16) × ';
    html += '(' + c3val + '^-0.20) × ';
    html += '(' + alt.c4 + '^-0.12) × ';
    html += '(' + formatRatio(alt.c5) + '^0.16) × ';
    html += '(' + alt.c6 + '^0.16)\n';
    html += 'S(' + v.id + ') = ' + formatDecimal(v.s, 6);
    html += '</div>';
  });

  var totalS = appState.vectorS.reduce(function (sum, v) { return sum + v.s; }, 0);
  html += '<div class="formula-block">Total S = ' + formatDecimal(totalS, 6) + '</div>';
  html += '</div>';

  // E. Vektor V
  html += '<div class="accordion-section">';
  html += '<h4>E. Vektor V</h4>';
  html += '<p class="text-muted mb-4">Vi = Si / ΣSi</p>';
  html += '<div class="formula-block">';

  appState.ranking.forEach(function (r) {
    html += 'V(' + r.id + ') = ' + formatDecimal(r.s, 6) + ' / ' + formatDecimal(totalS, 6) + ' = ' + formatDecimal(r.v, 6) + '\n';
  });

  html += '</div>';
  html += '</div>';

  // F. Ranking
  html += '<div class="accordion-section">';
  html += '<h4>F. Ranking (V tertinggi → terendah)</h4>';
  html += '<div class="formula-block">';

  ranking.forEach(function (r) {
    html += '#' + r.rank + ' — ' + r.id + ' (' + r.provider + ' - ' + r.package + ') → V = ' + formatDecimal(r.v, 6) + '\n';
  });

  html += '</div>';
  html += '</div>';

  html += '</div>'; // accordion-panel
  html += '</div>'; // accordion

  // ── Action buttons ──
  html += '<div class="action-bar">';
  html += '<button class="btn btn-danger btn-sm" id="btn-reset">Mulai Ulang</button>';
  html += '<div class="action-bar-right">';
  html += '<button class="btn btn-primary" id="btn-download-pdf">📄 Download Hasil (PDF)</button>';
  html += '</div>';
  html += '</div>';

  html += '</div>';

  app.innerHTML = html;
  app.className = "fade-in";
  initScrollReveal();

  // ── Events ──

  // Accordion toggle
  document.getElementById("detail-trigger").addEventListener("click", function () {
    var panel = document.getElementById("detail-panel");
    var isOpen = panel.classList.contains("open");
    panel.classList.toggle("open");
    this.setAttribute("aria-expanded", String(!isOpen));
  });

  // Reset
  document.getElementById("btn-reset").addEventListener("click", function () {
    showModal("Konfirmasi Reset", '<p>Apakah Anda yakin ingin menghapus semua pilihan dan mulai dari awal?</p>' +
      '<div style="display:flex;gap:12px;margin-top:16px;justify-content:flex-end;">' +
      '<button class="btn btn-secondary btn-sm modal-cancel-btn">Batal</button>' +
      '<button class="btn btn-danger btn-sm" id="confirm-reset">Ya, Mulai Ulang</button>' +
      '</div>');

    document.getElementById("confirm-reset").addEventListener("click", function () {
      resetState();
      document.querySelector(".modal-overlay").remove();
      window.location.hash = "#home";
      showToast("Semua pilihan telah direset.", "success");
    });

    document.querySelector(".modal-cancel-btn").addEventListener("click", function () {
      document.querySelector(".modal-overlay").remove();
    });
  });

  // PDF Download
  document.getElementById("btn-download-pdf").addEventListener("click", function () {
    exportPDF({
      profileId: appState.profile,
      normalizedWeights: appState.normalizedWeights,
      alternatives: appState.alternatives,
      vectorS: appState.vectorS,
      vectorV: appState.vectorV,
      ranking: appState.ranking,
      conclusion: conclusion
    });
  });
}
