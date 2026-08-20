/**
 * wp.js — Algoritma Weighted Product (WP)
 * Sumber: BAB IV Penelitian
 *
 * Bobot awal: C1=5, C2=4, C3=5, C4=3, C5=4, C6=4  (total=25)
 * Cost  → pangkat negatif  (C1, C3, C4)
 * Benefit → pangkat positif (C2, C5, C6)
 */

/* ============================================================
   Bobot Awal dari BAB IV
   ============================================================ */
const RAW_WEIGHTS = {
  c1: 5,
  c2: 4,
  c3: 5,
  c4: 3,
  c5: 4,
  c6: 4
};

/* ============================================================
   Tipe Atribut Kriteria
   ============================================================ */
const CRITERIA_TYPES = {
  c1: "cost",
  c2: "benefit",
  c3: "cost",
  c4: "cost",
  c5: "benefit",
  c6: "benefit"
};

/* Kunci kriteria */
const CRITERIA_KEYS = ["c1", "c2", "c3", "c4", "c5", "c6"];

/* ============================================================
   Normalisasi Bobot
   Wj = wj / Σwj
   ============================================================ */
function normalizeWeights(weights) {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);

  return Object.fromEntries(
    Object.entries(weights).map(([key, value]) => [
      key,
      value / total
    ])
  );
}

/* ============================================================
   Konversi Nilai Aman
   C3 = 0 → 1  (hanya saat perhitungan perpangkatan)
   ============================================================ */
function getSafeValue(value, criterion) {
  if (criterion === "c3" && value === 0) {
    return 1;
  }
  return value;
}

/* ============================================================
   Hitung Vektor S
   Si = ∏ (xij ^ wj)
   - cost:    pangkat = -normalizedWeight
   - benefit: pangkat = +normalizedWeight
   ============================================================ */
function calculateVectorS(alternative, normalizedWeights) {
  return CRITERIA_KEYS.reduce((result, key) => {
    let value = alternative[key];

    // Konversi biaya instalasi Rp0 → 1 untuk perhitungan
    if (key === "c3" && value === 0) {
      value = 1;
    }

    const exponent =
      CRITERIA_TYPES[key] === "cost"
        ? -normalizedWeights[key]
        : normalizedWeights[key];

    return result * Math.pow(value, exponent);
  }, 1);
}

/* ============================================================
   Hitung Vektor V
   Vi = Si / ΣSi
   Hanya dari alternatif yang dipilih pengguna
   ============================================================ */
function calculateVectorV(vectorS) {
  const totalS = vectorS.reduce((sum, item) => sum + item.s, 0);

  return vectorS.map(item => ({
    ...item,
    v: item.s / totalS
  }));
}

/* ============================================================
   Ranking
   Urutkan dari V terbesar ke terkecil
   Tidak ada pembulatan sebelum sorting
   ============================================================ */
function rankAlternatives(vectorV) {
  return [...vectorV]
    .sort((a, b) => b.v - a.v)
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));
}

/* ============================================================
   Validasi Alternatif
   Memastikan semua nilai C1–C6 valid
   ============================================================ */
function validateAlternative(item) {
  return CRITERIA_KEYS.every(
    key => Number.isFinite(Number(item[key]))
  );
}

/* ============================================================
   Fungsi Utama WP
   Menerima array alternatif yang dipilih pengguna
   Mengembalikan: normalizedWeights, vectorS, vectorV, ranking
   ============================================================ */
function runWeightedProduct(selectedAlternatives) {
  // Validasi input
  if (!Array.isArray(selectedAlternatives) || selectedAlternatives.length < 2) {
    return null;
  }

  // Validasi setiap alternatif
  for (const alt of selectedAlternatives) {
    if (!validateAlternative(alt)) {
      console.error("Data alternatif tidak valid:", alt.id);
      return null;
    }
  }

  // Normalisasi bobot
  const normalizedWeights = normalizeWeights(RAW_WEIGHTS);

  // Hitung Vektor S
  const vectorS = selectedAlternatives.map(item => ({
    id: item.id,
    provider: item.provider,
    package: item.package,
    s: calculateVectorS(item, normalizedWeights)
  }));

  // Pastikan total S > 0
  const totalS = vectorS.reduce((sum, item) => sum + item.s, 0);
  if (totalS <= 0) {
    console.error("Total Vektor S tidak valid:", totalS);
    return null;
  }

  // Hitung Vektor V
  const vectorV = calculateVectorV(vectorS);

  // Ranking
  const ranking = rankAlternatives(vectorV);

  return {
    normalizedWeights,
    vectorS,
    vectorV,
    ranking,
    totalS
  };
}

/* ============================================================
   Unit Tests (developer validation)
   Dijalankan di console browser
   ============================================================ */
function runWPTests() {
  console.group("🧪 Unit Tests — Algoritma WP");

  const weights = normalizeWeights(RAW_WEIGHTS);

  // Test 1: Normalisasi bobot
  const t1 = Math.abs(weights.c1 - 0.20) < 1e-10;
  console.assert(t1, "FAIL: C1 normalisasi harus 0.20, dapat:", weights.c1);
  console.log(t1 ? "✅ Test 1 PASS: C1 = 0.20" : "❌ Test 1 FAIL");

  const t1b = Math.abs(weights.c4 - 0.12) < 1e-10;
  console.assert(t1b, "FAIL: C4 normalisasi harus 0.12");
  console.log(t1b ? "✅ Test 1b PASS: C4 = 0.12" : "❌ Test 1b FAIL");

  // Test 2: Vektor S untuk A1
  const a1 = ISP_DATA.find(item => item.id === "A1");
  const sA1 = calculateVectorS(a1, weights);
  const t2 = Math.abs(sA1 - 0.010719) < 0.000001;
  console.assert(t2, "FAIL: S(A1) harus ≈ 0.010719, dapat:", sA1);
  console.log(t2 ? "✅ Test 2 PASS: S(A1) ≈ 0.010719" : "❌ Test 2 FAIL — S(A1) = " + sA1);

  // Test 3: Vektor S untuk A15 (C3=0 → 1)
  const a15 = ISP_DATA.find(item => item.id === "A15");
  const sA15 = calculateVectorS(a15, weights);
  const t3 = Math.abs(sA15 - 0.249318) < 0.000001;
  console.assert(t3, "FAIL: S(A15) harus ≈ 0.249318, dapat:", sA15);
  console.log(t3 ? "✅ Test 3 PASS: S(A15) ≈ 0.249318" : "❌ Test 3 FAIL — S(A15) = " + sA15);

  // Test 4: Total S seluruh 30 alternatif
  const allS = ISP_DATA.map(item => ({
    id: item.id,
    s: calculateVectorS(item, weights)
  }));
  const totalS = allS.reduce((sum, item) => sum + item.s, 0);
  const t4 = Math.abs(totalS - 2.253812) < 0.001;
  console.assert(t4, "FAIL: Total S harus ≈ 2.253812, dapat:", totalS);
  console.log(t4 ? "✅ Test 4 PASS: Total S ≈ 2.253812" : "❌ Test 4 FAIL — Total S = " + totalS);

  // Test 5: Ranking 30 alternatif — top 5
  const result = runWeightedProduct(ISP_DATA);
  const top5Ids = result.ranking.slice(0, 5).map(r => r.id);
  const expectedTop5 = ["A15", "A12", "A9", "A6", "A11"];
  const t5 = JSON.stringify(top5Ids) === JSON.stringify(expectedTop5);
  console.assert(t5, "FAIL: Top 5 ranking tidak sesuai, dapat:", top5Ids);
  console.log(t5 ? "✅ Test 5 PASS: Top 5 = A15, A12, A9, A6, A11" : "❌ Test 5 FAIL — Top 5 = " + top5Ids.join(", "));

  // Test 6: V(A15) ≈ 0.110621 (seluruh 30 alternatif)
  const vA15 = result.ranking.find(r => r.id === "A15").v;
  const t6 = Math.abs(vA15 - 0.110621) < 0.001;
  console.log(t6 ? "✅ Test 6 PASS: V(A15) ≈ 0.110621" : "❌ Test 6 FAIL — V(A15) = " + vA15);

  console.groupEnd();

  return { t1, t1b, t2, t3, t4, t5, t6 };
}
