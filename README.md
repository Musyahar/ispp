# SPK Pemilihan ISP — Metode Weighted Product

Sistem Pendukung Keputusan untuk membandingkan paket Internet Service Provider (ISP) menggunakan metode **Weighted Product (WP)**.

**Studi Kasus:** Cilandak Timur, Jakarta Selatan  
**Sumber Data:** BAB IV Penelitian  
**Pembaruan Terakhir:** 21 Agustus 2026

## Fitur

- Dashboard katalog 10 provider, 30 paket ISP
- Profil kebutuhan (Anak Kost, Perumahan, WFH, UMKM)
- Pemilihan provider dan paket secara interaktif
- Perhitungan otomatis Weighted Product (Vektor S, Vektor V, Ranking)
- Detail perhitungan transparan
- Kesimpulan otomatis berdasarkan data
- Export hasil ke PDF
- Responsif (desktop, tablet, smartphone)
- Bahasa Indonesia

## Teknologi

- HTML5 + CSS3 + JavaScript ES6+ (Vanilla, tanpa framework)
- LocalStorage untuk state management
- jsPDF + jsPDF-AutoTable untuk export PDF

## Cara Menjalankan

1. Buka `index.html` di browser modern
2. Atau jalankan local server:
   ```bash
   npx serve .
   ```

## Struktur

```
spk-isp/
├── index.html
├── README.md
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── print.css
└── js/
    ├── data.js        # Dataset ISP & state
    ├── wp.js          # Algoritma WP
    ├── conclusion.js  # Generator kesimpulan
    ├── pdf.js         # Export PDF
    ├── ui.js          # Rendering UI
    └── app.js         # Router & init
```

## Kriteria (6)

| Kode | Kriteria | Jenis | Bobot |
|------|----------|-------|-------|
| C1 | Harga Paket Internet | Cost | 5 |
| C2 | Kecepatan Internet | Benefit | 4 |
| C3 | Biaya Instalasi | Cost | 5 |
| C4 | Latency | Cost | 3 |
| C5 | Rasio Upload:Download | Benefit | 4 |
| C6 | Kualitas Router | Benefit | 4 |

## Validasi

Unit test berjalan otomatis di browser console. Buka console (F12) untuk melihat hasil:
- Normalisasi bobot
- Vektor S (A1 ≈ 0.010719, A15 ≈ 0.249318)
- Total S 30 alternatif ≈ 2.253812
- Top 5 ranking: A15, A12, A9, A6, A11
