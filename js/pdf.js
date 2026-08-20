/**
 * pdf.js — Export Hasil Rekomendasi ke PDF
 *
 * Menggunakan jsPDF + jsPDF-AutoTable.
 * Fallback ke window.print() jika library tidak tersedia.
 */

/**
 * Cek apakah jsPDF tersedia
 */
function isJsPDFAvailable() {
  return typeof window.jspdf !== "undefined" && typeof window.jspdf.jsPDF !== "undefined";
}

/**
 * Format tanggal untuk nama file dan header PDF
 */
function getFormattedDate() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function getFormattedDateReadable() {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

/**
 * Buat dan unduh PDF hasil rekomendasi
 *
 * @param {Object} params
 * @param {string} params.profileId
 * @param {Object} params.normalizedWeights
 * @param {Array}  params.alternatives    — Data lengkap alternatif dari ISP_DATA
 * @param {Array}  params.vectorS
 * @param {Array}  params.vectorV
 * @param {Array}  params.ranking
 * @param {Object} params.conclusion      — Dari generateConclusion()
 */
function exportPDF(params) {
  if (!isJsPDFAvailable()) {
    showToast("Library PDF tidak tersedia. Menggunakan mode cetak.", "warning");
    setTimeout(() => window.print(), 300);
    return;
  }

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const profile = getProfileById(params.profileId);
    const profileName = profile ? profile.name : "Umum";

    // ── Helper ──
    function addTitle(text, size) {
      doc.setFontSize(size || 14);
      doc.setFont(undefined, "bold");
      doc.text(text, pageWidth / 2, y, { align: "center" });
      y += (size || 14) * 0.5;
    }

    function addSubtitle(text) {
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text(text, pageWidth / 2, y, { align: "center" });
      y += 6;
    }

    function addSectionTitle(text) {
      checkPageBreak(12);
      doc.setFontSize(11);
      doc.setFont(undefined, "bold");
      doc.text(text, margin, y);
      y += 7;
    }

    function addText(text) {
      doc.setFontSize(9);
      doc.setFont(undefined, "normal");
      const lines = doc.splitTextToSize(text, contentWidth);
      checkPageBreak(lines.length * 4.5);
      doc.text(lines, margin, y);
      y += lines.length * 4.5 + 2;
    }

    function addLine() {
      doc.setDrawColor(200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 4;
    }

    function checkPageBreak(neededHeight) {
      const pageHeight = doc.internal.pageSize.getHeight();
      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    }

    // ── 1. Header Laporan ──
    addTitle("LAPORAN HASIL REKOMENDASI", 14);
    y += 2;
    addTitle("SISTEM PENDUKUNG KEPUTUSAN PEMILIHAN ISP", 12);
    y += 2;
    addTitle("METODE WEIGHTED PRODUCT", 12);
    y += 4;
    addSubtitle("Tanggal: " + getFormattedDateReadable());
    addSubtitle("Studi Kasus: Cilandak Timur, Jakarta Selatan");
    y += 2;
    addLine();

    // ── 2. Profil Kebutuhan ──
    addSectionTitle("1. Profil Kebutuhan");
    addText("Profil yang dipilih: " + profileName);
    if (profile) {
      addText(profile.description);
    }
    addText("Bobot penilaian telah ditetapkan berdasarkan data penelitian pada BAB IV dan digunakan otomatis oleh sistem.");
    y += 2;

    // ── 3. Bobot Kriteria ──
    addSectionTitle("2. Bobot Kriteria");

    checkPageBreak(50);
    doc.autoTable({
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Kode", "Kriteria", "Jenis", "Bobot Awal", "Bobot Normalisasi"]],
      body: criteria.map(c => [
        c.code,
        c.name,
        c.type === "cost" ? "Cost" : "Benefit",
        String(c.weight),
        formatDecimal(c.normalizedWeight, 2)
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      foot: [["", "", "Total", "25", "1.00"]],
      footStyles: { fillColor: [241, 245, 249], fontStyle: "bold" }
    });
    y = doc.lastAutoTable.finalY + 8;

    // ── 4. Matriks Keputusan ──
    addSectionTitle("3. Matriks Keputusan (Alternatif Terpilih)");

    checkPageBreak(50);
    doc.autoTable({
      startY: y,
      margin: { left: margin, right: margin },
      head: [["ID", "Provider", "Paket", "C1 (Rp)", "C2 (Mbps)", "C3 (Rp)", "C4 (ms)", "C5", "C6"]],
      body: params.alternatives.map(a => [
        a.id,
        a.provider,
        a.package,
        formatRupiah(a.c1),
        String(a.c2),
        formatRupiah(a.c3),
        String(a.c4),
        formatRatio(a.c5),
        formatRouter(a.c6)
      ]),
      styles: { fontSize: 7, cellPadding: 1.5 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold", fontSize: 7 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 10 },
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
        7: { halign: "right" },
        8: { halign: "right" }
      }
    });
    y = doc.lastAutoTable.finalY + 8;

    // ── 5. Vektor S ──
    addSectionTitle("4. Vektor S");

    checkPageBreak(50);
    doc.autoTable({
      startY: y,
      margin: { left: margin, right: margin },
      head: [["ID", "Provider", "Paket", "Vektor S"]],
      body: params.vectorS.map(v => [
        v.id,
        v.provider,
        v.package,
        formatDecimal(v.s, 6)
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 3: { halign: "right" } }
    });
    y = doc.lastAutoTable.finalY + 4;

    // Total S
    const totalS = params.vectorS.reduce((sum, v) => sum + v.s, 0);
    addText("Total Vektor S = " + formatDecimal(totalS, 6));
    y += 2;

    // ── 6. Vektor V ──
    addSectionTitle("5. Vektor V");

    checkPageBreak(50);
    doc.autoTable({
      startY: y,
      margin: { left: margin, right: margin },
      head: [["ID", "Provider", "Paket", "Vektor V"]],
      body: params.vectorV.map(v => [
        v.id,
        v.provider,
        v.package,
        formatDecimal(v.v, 6)
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: { 3: { halign: "right" } }
    });
    y = doc.lastAutoTable.finalY + 8;

    // ── 7. Ranking Final ──
    addSectionTitle("6. Ranking Final");

    checkPageBreak(50);
    doc.autoTable({
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Peringkat", "Provider", "Paket", "Vektor S", "Vektor V", "Status"]],
      body: params.ranking.map(r => [
        "#" + r.rank,
        r.provider,
        r.package,
        formatDecimal(r.s, 6),
        formatDecimal(r.v, 6),
        r.rank === 1 ? "Rekomendasi Utama" : "Alternatif"
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { halign: "center", fontStyle: "bold" },
        3: { halign: "right" },
        4: { halign: "right" }
      },
      didParseCell: function (data) {
        if (data.section === "body" && data.row.index === 0) {
          data.cell.styles.fillColor = [219, 234, 254];
          data.cell.styles.fontStyle = "bold";
        }
      }
    });
    y = doc.lastAutoTable.finalY + 8;

    // ── 8. Kesimpulan ──
    addSectionTitle("7. Kesimpulan");

    if (params.conclusion) {
      addText(params.conclusion.mainText);
      if (params.conclusion.profileContext) {
        addText(params.conclusion.profileContext);
      }
    }

    y += 6;
    addLine();
    addText("Dokumen ini dibuat secara otomatis oleh Sistem Pendukung Keputusan Pemilihan ISP menggunakan metode Weighted Product.");

    // ── Simpan PDF ──
    const filename = "hasil-rekomendasi-isp-" + getFormattedDate() + ".pdf";
    doc.save(filename);

    showToast("PDF berhasil dibuat: " + filename, "success");
  } catch (e) {
    console.error("Gagal membuat PDF:", e);
    showToast("Gagal membuat PDF. Menggunakan mode cetak.", "warning");
    setTimeout(() => window.print(), 300);
  }
}
