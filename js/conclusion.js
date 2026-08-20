/**
 * conclusion.js — Pembuatan Kesimpulan Otomatis
 *
 * Menghasilkan narasi berdasarkan data aktual hasil perhitungan WP.
 * Profil digunakan sebagai konteks, BUKAN pengubah bobot.
 */

/**
 * Analisis keunggulan pemenang dibandingkan alternatif lain.
 * Mengembalikan daftar kriteria di mana pemenang unggul,
 * diurutkan berdasarkan performa relatif dan bobot.
 *
 * @param {Object} winner — Data alternatif pemenang dari ISP_DATA
 * @param {Array} allAlternatives — Semua alternatif yang dibandingkan
 * @returns {Array} — Daftar kriteria unggulan [{key, label, type}]
 */
function analyzeAdvantages(winner, allAlternatives) {
  const keys = ["c1", "c2", "c3", "c4", "c5", "c6"];
  const others = allAlternatives.filter(a => a.id !== winner.id);

  if (others.length === 0) return [];

  const scores = [];

  for (const key of keys) {
    const meta = CRITERIA_META[key];
    let winsCount = 0;

    for (const other of others) {
      if (meta.type === "cost") {
        // Untuk cost, nilai lebih kecil = lebih baik
        if (winner[key] <= other[key]) winsCount++;
      } else {
        // Untuk benefit, nilai lebih besar = lebih baik
        if (winner[key] >= other[key]) winsCount++;
      }
    }

    // Skor = rasio kemenangan × bobot kriteria
    const winRatio = winsCount / others.length;
    scores.push({
      key,
      label: meta.label,
      type: meta.type,
      weight: meta.weight,
      winRatio,
      score: winRatio * meta.weight
    });
  }

  // Urutkan: skor tertinggi dulu; jika seri, prioritas bobot lebih tinggi
  scores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.weight - a.weight;
  });

  // Ambil maksimal 2 kriteria terbaik yang benar-benar unggul (winRatio > 0.5)
  return scores.filter(s => s.winRatio > 0.5).slice(0, 2);
}

/**
 * Buat narasi kesimpulan berdasarkan hasil WP.
 *
 * @param {Object} params
 * @param {Array}  params.ranking      — Hasil ranking dari runWeightedProduct
 * @param {string} params.profileId    — ID profil yang dipilih
 * @param {Array}  params.alternatives — Data lengkap alternatif dari ISP_DATA
 * @returns {Object} — { mainText, profileContext, advantages }
 */
function generateConclusion(params) {
  const { ranking, profileId, alternatives } = params;

  if (!ranking || ranking.length === 0) {
    return {
      mainText: "Belum ada hasil rekomendasi.",
      profileContext: "",
      advantages: []
    };
  }

  const winner = ranking[0];
  const profile = getProfileById(profileId);
  const profileName = profile ? profile.name : "Umum";

  // Cari data lengkap pemenang dari ISP_DATA
  const winnerData = getAlternativeById(winner.id);
  if (!winnerData) {
    return {
      mainText: "Data pemenang tidak ditemukan.",
      profileContext: "",
      advantages: []
    };
  }

  // Analisis keunggulan
  const advantages = analyzeAdvantages(winnerData, alternatives);

  // Bangun narasi keunggulan
  let advantageText = "";
  if (advantages.length > 0) {
    const labels = advantages.map(a => a.label);
    if (labels.length === 1) {
      advantageText = ", terutama karena memiliki keunggulan pada " + labels[0];
    } else {
      advantageText = ", terutama karena memiliki keunggulan pada " +
        labels.slice(0, -1).join(", ") + " dan " + labels[labels.length - 1];
    }
  }

  // Narasi utama
  const mainText =
    winner.provider + " Paket " + winner.package +
    " menempati peringkat 1 dengan nilai preferensi V sebesar " +
    formatDecimal(winner.v, 6) + ". " +
    "Paket ini memperoleh hasil terbaik dari " + ranking.length +
    " alternatif yang dibandingkan" + advantageText +
    ", dengan tetap diperhitungkan bersama harga, biaya instalasi, latency, " +
    "kecepatan internet, rasio upload terhadap download, dan kualitas router " +
    "menggunakan bobot penelitian yang telah ditetapkan.";

  // Konteks profil (tidak mengklaim profil mengubah bobot)
  const profileContext =
    "Hasil ini ditampilkan untuk konteks kebutuhan " + profileName +
    " yang dipilih pengguna.";

  return {
    mainText,
    profileContext,
    advantages,
    winner: {
      id: winner.id,
      provider: winner.provider,
      package: winner.package,
      v: winner.v,
      s: winner.s,
      rank: winner.rank
    }
  };
}

/**
 * Buat ringkasan perbandingan runner-up.
 *
 * @param {Array} ranking — Hasil ranking
 * @returns {string} — Teks ringkasan runner-up
 */
function generateRunnerUpSummary(ranking) {
  if (ranking.length < 2) return "";

  const lines = [];
  for (let i = 1; i < ranking.length; i++) {
    const r = ranking[i];
    lines.push(
      "Peringkat " + r.rank + ": " + r.provider + " — " + r.package +
      " (V = " + formatDecimal(r.v, 6) + ")"
    );
  }

  return "Alternatif lainnya:\n" + lines.join("\n");
}
