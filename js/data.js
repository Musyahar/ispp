/**
 * data.js — Dataset dan Konfigurasi SPK Pemilihan ISP
 * Sumber: BAB IV Penelitian
 * Studi Kasus: Cilandak Timur, Jakarta Selatan
 */

/* ============================================================
   Dataset 30 Alternatif ISP (A1–A30)
   ============================================================ */
const ISP_DATA = [
  // IndiHome
  {
    id: "A1",
    provider: "IndiHome",
    package: "1P Internet Only 40 Mbps",
    c1: 220000,
    c2: 40,
    c3: 150000,
    c4: 18,
    c5: 0.5,
    c6: 3
  },
  {
    id: "A2",
    provider: "IndiHome",
    package: "2P Internet + TV 100 Mbps",
    c1: 375000,
    c2: 100,
    c3: 150000,
    c4: 14,
    c5: 0.6,
    c6: 4
  },
  {
    id: "A3",
    provider: "IndiHome",
    package: "3P Internet + TV + Telepon 300 Mbps",
    c1: 720000,
    c2: 300,
    c3: 0,
    c4: 9,
    c5: 1.0,
    c6: 5
  },

  // Biznet Home
  {
    id: "A4",
    provider: "Biznet Home",
    package: "Home 1A",
    c1: 220000,
    c2: 50,
    c3: 0,
    c4: 12,
    c5: 0.7,
    c6: 4
  },
  {
    id: "A5",
    provider: "Biznet Home",
    package: "Home 1B",
    c1: 260000,
    c2: 100,
    c3: 0,
    c4: 10,
    c5: 0.8,
    c6: 4
  },
  {
    id: "A6",
    provider: "Biznet Home",
    package: "Home 0D",
    c1: 340000,
    c2: 200,
    c3: 0,
    c4: 7,
    c5: 1.0,
    c6: 5
  },

  // First Media (XL SATU)
  {
    id: "A7",
    provider: "First Media (XL SATU)",
    package: "Combo Fiber 30 Mbps",
    c1: 230000,
    c2: 30,
    c3: 100000,
    c4: 20,
    c5: 0.4,
    c6: 3
  },
  {
    id: "A8",
    provider: "First Media (XL SATU)",
    package: "Combo Fiber 100 Mbps",
    c1: 320000,
    c2: 100,
    c3: 100000,
    c4: 15,
    c5: 0.5,
    c6: 3
  },
  {
    id: "A9",
    provider: "First Media (XL SATU)",
    package: "250 Mbps Internet",
    c1: 229000,
    c2: 250,
    c3: 0,
    c4: 10,
    c5: 0.8,
    c6: 4
  },

  // MyRepublic
  {
    id: "A10",
    provider: "MyRepublic",
    package: "Speed 50",
    c1: 225000,
    c2: 50,
    c3: 0,
    c4: 11,
    c5: 0.8,
    c6: 4
  },
  {
    id: "A11",
    provider: "MyRepublic",
    package: "JET 100",
    c1: 260000,
    c2: 100,
    c3: 0,
    c4: 9,
    c5: 0.9,
    c6: 5
  },
  {
    id: "A12",
    provider: "MyRepublic",
    package: "Velo 300",
    c1: 400000,
    c2: 300,
    c3: 0,
    c4: 6,
    c5: 1.0,
    c6: 5
  },

  // Nethome.id
  {
    id: "A13",
    provider: "Nethome.id",
    package: "Nethome Bronze",
    c1: 199000,
    c2: 30,
    c3: 150000,
    c4: 16,
    c5: 0.5,
    c6: 3
  },
  {
    id: "A14",
    provider: "Nethome.id",
    package: "Nethome Gold",
    c1: 215000,
    c2: 100,
    c3: 100000,
    c4: 12,
    c5: 0.7,
    c6: 4
  },
  {
    id: "A15",
    provider: "Nethome.id",
    package: "Nethome Platinum",
    c1: 227000,
    c2: 1000,
    c3: 0,
    c4: 8,
    c5: 1.0,
    c6: 4
  },

  // Oxygen.id
  {
    id: "A16",
    provider: "Oxygen.id",
    package: "Oxygen Lite 20",
    c1: 175000,
    c2: 20,
    c3: 100000,
    c4: 22,
    c5: 0.3,
    c6: 2
  },
  {
    id: "A17",
    provider: "Oxygen.id",
    package: "Oxygen Plus 75",
    c1: 250000,
    c2: 75,
    c3: 50000,
    c4: 17,
    c5: 0.5,
    c6: 3
  },
  {
    id: "A18",
    provider: "Oxygen.id",
    package: "Oxygen Max 150",
    c1: 350000,
    c2: 150,
    c3: 0,
    c4: 13,
    c5: 0.6,
    c6: 4
  },

  // CBN
  {
    id: "A19",
    provider: "CBN",
    package: "CBN Fiber 20",
    c1: 265000,
    c2: 20,
    c3: 200000,
    c4: 14,
    c5: 0.6,
    c6: 3
  },
  {
    id: "A20",
    provider: "CBN",
    package: "CBN Fiber 50",
    c1: 385000,
    c2: 50,
    c3: 150000,
    c4: 11,
    c5: 0.7,
    c6: 4
  },
  {
    id: "A21",
    provider: "CBN",
    package: "CBN Fiber 100",
    c1: 550000,
    c2: 100,
    c3: 100000,
    c4: 9,
    c5: 0.8,
    c6: 4
  },

  // Megavision
  {
    id: "A22",
    provider: "Megavision",
    package: "Mega Basic 10",
    c1: 200000,
    c2: 10,
    c3: 150000,
    c4: 25,
    c5: 0.3,
    c6: 2
  },
  {
    id: "A23",
    provider: "Megavision",
    package: "Mega Standard 30",
    c1: 300000,
    c2: 30,
    c3: 100000,
    c4: 20,
    c5: 0.4,
    c6: 2
  },
  {
    id: "A24",
    provider: "Megavision",
    package: "Mega Prime 50",
    c1: 450000,
    c2: 50,
    c3: 50000,
    c4: 16,
    c5: 0.5,
    c6: 3
  },

  // Iconnet (PLN)
  {
    id: "A25",
    provider: "Iconnet (PLN)",
    package: "Iconnet Silver 20",
    c1: 150000,
    c2: 20,
    c3: 100000,
    c4: 19,
    c5: 0.4,
    c6: 2
  },
  {
    id: "A26",
    provider: "Iconnet (PLN)",
    package: "Iconnet Gold 50",
    c1: 230000,
    c2: 50,
    c3: 50000,
    c4: 15,
    c5: 0.6,
    c6: 3
  },
  {
    id: "A27",
    provider: "Iconnet (PLN)",
    package: "Iconnet Platinum 100",
    c1: 320000,
    c2: 100,
    c3: 0,
    c4: 11,
    c5: 0.7,
    c6: 4
  },

  // XL Satu
  {
    id: "A28",
    provider: "XL Satu",
    package: "XL Satu Lite 30",
    c1: 230000,
    c2: 30,
    c3: 100000,
    c4: 17,
    c5: 0.5,
    c6: 3
  },
  {
    id: "A29",
    provider: "XL Satu",
    package: "XL Satu Reguler 75",
    c1: 305000,
    c2: 75,
    c3: 50000,
    c4: 13,
    c5: 0.6,
    c6: 4
  },
  {
    id: "A30",
    provider: "XL Satu",
    package: "XL Satu Prime 150",
    c1: 425000,
    c2: 150,
    c3: 0,
    c4: 10,
    c5: 0.8,
    c6: 4
  }
];

/* ============================================================
   6 Kriteria Penelitian (BAB IV)
   ============================================================ */
const criteria = [
  {
    code: "C1",
    name: "Harga Paket Internet",
    type: "cost",
    weight: 5,
    normalizedWeight: 0.20,
    unit: "Rp"
  },
  {
    code: "C2",
    name: "Kecepatan Internet",
    type: "benefit",
    weight: 4,
    normalizedWeight: 0.16,
    unit: "Mbps"
  },
  {
    code: "C3",
    name: "Biaya Instalasi",
    type: "cost",
    weight: 5,
    normalizedWeight: 0.20,
    unit: "Rp"
  },
  {
    code: "C4",
    name: "Latency",
    type: "cost",
    weight: 3,
    normalizedWeight: 0.12,
    unit: "ms"
  },
  {
    code: "C5",
    name: "Rasio Upload : Download",
    type: "benefit",
    weight: 4,
    normalizedWeight: 0.16,
    unit: "ratio"
  },
  {
    code: "C6",
    name: "Kualitas Router",
    type: "benefit",
    weight: 4,
    normalizedWeight: 0.16,
    unit: "skala 1-5"
  }
];

/* ============================================================
   Metadata Kriteria untuk Narasi Kesimpulan
   ============================================================ */
const CRITERIA_META = {
  c1: { label: "harga paket", type: "cost", weight: 0.20 },
  c2: { label: "kecepatan internet", type: "benefit", weight: 0.16 },
  c3: { label: "biaya instalasi", type: "cost", weight: 0.20 },
  c4: { label: "latency", type: "cost", weight: 0.12 },
  c5: { label: "rasio upload terhadap download", type: "benefit", weight: 0.16 },
  c6: { label: "kualitas router", type: "benefit", weight: 0.16 }
};

/* ============================================================
   Profil Kebutuhan Pengguna
   ============================================================ */
const USER_PROFILES = [
  {
    id: "kost",
    name: "Anak Kost",
    icon: "🏠",
    description: "Untuk penggunaan internet harian dengan perhatian pada efisiensi biaya."
  },
  {
    id: "perumahan",
    name: "Perumahan",
    icon: "🏡",
    description: "Untuk penggunaan internet bersama di lingkungan rumah."
  },
  {
    id: "wfh",
    name: "WFH",
    icon: "💼",
    description: "Untuk kebutuhan kerja dari rumah, meeting online, upload, dan aktivitas produktif."
  },
  {
    id: "umkm",
    name: "UMKM",
    icon: "🏪",
    description: "Untuk kebutuhan operasional usaha, transaksi, komunikasi, dan penggunaan beberapa perangkat."
  }
];

/* ============================================================
   Formatter & Helper Functions
   ============================================================ */

/** Format angka ke Rupiah Indonesia */
function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

/** Kelompokkan ISP_DATA berdasarkan provider */
function groupByProvider(data) {
  return data.reduce((groups, item) => {
    if (!groups[item.provider]) {
      groups[item.provider] = [];
    }
    groups[item.provider].push(item);
    return groups;
  }, {});
}

/** Ambil data alternatif berdasarkan ID dari dataset asli */
function getAlternativeById(id) {
  return ISP_DATA.find(item => item.id === id) || null;
}

/** Ambil daftar unik provider dari dataset */
function getProviderList() {
  return [...new Set(ISP_DATA.map(item => item.provider))];
}

/** Ambil paket berdasarkan provider */
function getPackagesByProvider(providerName) {
  return ISP_DATA.filter(item => item.provider === providerName);
}

/** Ambil profil berdasarkan ID */
function getProfileById(id) {
  return USER_PROFILES.find(p => p.id === id) || null;
}

/** Format angka desimal untuk tampilan */
function formatDecimal(value, digits) {
  return Number(value).toFixed(digits !== undefined ? digits : 6);
}

/** Format rasio */
function formatRatio(value) {
  return Number(value).toFixed(1);
}

/** Format kualitas router */
function formatRouter(value) {
  return value + "/5";
}

/** Dapatkan statistik provider: harga minimum, kecepatan maksimum */
function getProviderStats(packages) {
  const minPrice = Math.min(...packages.map(p => p.c1));
  const maxSpeed = Math.max(...packages.map(p => p.c2));
  return { minPrice, maxSpeed };
}

/* ============================================================
   Application State
   ============================================================ */
const appState = {
  profile: null,
  selectedProviders: [],
  selectedPackages: {},
  alternatives: [],
  normalizedWeights: {},
  vectorS: [],
  vectorV: [],
  ranking: []
};

/** Simpan state ke LocalStorage */
function saveState() {
  try {
    const stateToSave = {
      profile: appState.profile,
      selectedProviders: appState.selectedProviders,
      selectedPackages: appState.selectedPackages
    };
    localStorage.setItem("spkIspState", JSON.stringify(stateToSave));
  } catch (e) {
    console.warn("Gagal menyimpan state:", e);
  }
}

/** Muat state dari LocalStorage dengan validasi */
function loadState() {
  try {
    const saved = localStorage.getItem("spkIspState");
    if (!saved) return false;

    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object") return false;

    // Validasi profile
    if (parsed.profile && getProfileById(parsed.profile)) {
      appState.profile = parsed.profile;
    }

    // Validasi selectedProviders
    const validProviders = getProviderList();
    if (Array.isArray(parsed.selectedProviders)) {
      appState.selectedProviders = parsed.selectedProviders.filter(
        p => validProviders.includes(p)
      );
    }

    // Validasi selectedPackages — setiap ID harus ada di ISP_DATA
    if (parsed.selectedPackages && typeof parsed.selectedPackages === "object") {
      const validPackages = {};
      for (const [provider, pkgId] of Object.entries(parsed.selectedPackages)) {
        if (
          appState.selectedProviders.includes(provider) &&
          getAlternativeById(pkgId)
        ) {
          validPackages[provider] = pkgId;
        }
      }
      appState.selectedPackages = validPackages;
    }

    return true;
  } catch (e) {
    console.warn("Gagal memuat state:", e);
    return false;
  }
}

/** Reset seluruh state dan hapus LocalStorage */
function resetState() {
  appState.profile = null;
  appState.selectedProviders = [];
  appState.selectedPackages = {};
  appState.alternatives = [];
  appState.normalizedWeights = {};
  appState.vectorS = [];
  appState.vectorV = [];
  appState.ranking = [];
  localStorage.removeItem("spkIspState");
}

/* ============================================================
   Authentication (Login Sederhana)
   Kredensial hardcoded untuk demo/presentasi
   ============================================================ */
const AUTH_CREDENTIALS = [
  { username: "admin", password: "admin123", displayName: "Administrator" }
];

/** Cek apakah user sudah login */
function isLoggedIn() {
  try {
    var session = localStorage.getItem("spkIspAuth");
    if (!session) return false;
    var parsed = JSON.parse(session);
    return parsed && parsed.loggedIn === true && parsed.username;
  } catch (e) {
    return false;
  }
}

/** Ambil data user yang sedang login */
function getLoggedInUser() {
  try {
    var session = localStorage.getItem("spkIspAuth");
    if (!session) return null;
    var parsed = JSON.parse(session);
    if (parsed && parsed.loggedIn) return parsed;
    return null;
  } catch (e) {
    return null;
  }
}

/** Login — validasi username & password */
function loginUser(username, password) {
  var user = AUTH_CREDENTIALS.find(function (cred) {
    return cred.username === username && cred.password === password;
  });

  if (user) {
    var session = {
      loggedIn: true,
      username: user.username,
      displayName: user.displayName,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem("spkIspAuth", JSON.stringify(session));
    return { success: true, user: session };
  }

  return { success: false, message: "Username atau password salah." };
}

/** Logout — hapus session */
function logoutUser() {
  localStorage.removeItem("spkIspAuth");
}
