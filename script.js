// ============================================================
// DATA BANGUN RUANG
// Setiap bangun punya: nama, rumus (untuk ditampilkan),
// daftar input, dan fungsi hitung() yang mengembalikan
// volume serta luas permukaan.
// Untuk menambah bangun baru, cukup tambah satu object di sini.
// ============================================================
const bangunRuang = {
  kubus: {
    nama: "Kubus",
    rumus: "V = s³   |   L = 6 × s²",
    input: [{ id: "sisi", label: "Panjang sisi (s)" }],
    hitung: (n) => ({
      volume: Math.pow(n.sisi, 3),
      luas: 6 * n.sisi * n.sisi,
    }),
  },

  balok: {
    nama: "Balok",
    rumus: "V = p × l × t   |   L = 2 × (pl + pt + lt)",
    input: [
      { id: "p", label: "Panjang (p)" },
      { id: "l", label: "Lebar (l)" },
      { id: "t", label: "Tinggi (t)" },
    ],
    hitung: (n) => ({
      volume: n.p * n.l * n.t,
      luas: 2 * (n.p * n.l + n.p * n.t + n.l * n.t),
    }),
  },

  tabung: {
    nama: "Tabung",
    rumus: "V = π × r² × t   |   L = 2πr × (r + t)",
    input: [
      { id: "r", label: "Jari-jari (r)" },
      { id: "t", label: "Tinggi (t)" },
    ],
    hitung: (n) => ({
      volume: Math.PI * n.r * n.r * n.t,
      luas: 2 * Math.PI * n.r * (n.r + n.t),
    }),
  },

  kerucut: {
    nama: "Kerucut",
    rumus: "V = ⅓ × π × r² × t   |   L = πr × (r + s), s = √(r² + t²)",
    input: [
      { id: "r", label: "Jari-jari (r)" },
      { id: "t", label: "Tinggi (t)" },
    ],
    hitung: (n) => {
      const s = Math.sqrt(n.r * n.r + n.t * n.t); // garis pelukis
      return {
        volume: (1 / 3) * Math.PI * n.r * n.r * n.t,
        luas: Math.PI * n.r * (n.r + s),
      };
    },
  },

  bola: {
    nama: "Bola",
    rumus: "V = 4/3 × π × r³   |   L = 4 × π × r²",
    input: [{ id: "r", label: "Jari-jari (r)" }],
    hitung: (n) => ({
      volume: (4 / 3) * Math.PI * Math.pow(n.r, 3),
      luas: 4 * Math.PI * n.r * n.r,
    }),
  },

  prismaSegitiga: {
    nama: "Prisma Segitiga",
    rumus: "Alas segitiga siku-siku.  V = ½ × a × b × t   |   L = (a × b) + (a + b + c) × t, c = √(a² + b²)",
    input: [
      { id: "a", label: "Alas segitiga (a)" },
      { id: "b", label: "Tinggi segitiga (b)" },
      { id: "t", label: "Tinggi prisma (t)" },
    ],
    hitung: (n) => {
      const c = Math.sqrt(n.a * n.a + n.b * n.b); // sisi miring
      return {
        volume: 0.5 * n.a * n.b * n.t,
        luas: n.a * n.b + (n.a + n.b + c) * n.t,
      };
    },
  },

  limasSegiempat: {
    nama: "Limas Segi Empat",
    rumus: "Alas persegi panjang.  V = ⅓ × p × l × t   |   L = luas alas + 4 sisi tegak segitiga",
    input: [
      { id: "p", label: "Panjang alas (p)" },
      { id: "l", label: "Lebar alas (l)" },
      { id: "t", label: "Tinggi limas (t)" },
    ],
    hitung: (n) => {
      // tinggi sisi tegak segitiga (dihitung dengan Pythagoras)
      const tinggiSisiP = Math.sqrt(Math.pow(n.l / 2, 2) + n.t * n.t); // pada sisi p
      const tinggiSisiL = Math.sqrt(Math.pow(n.p / 2, 2) + n.t * n.t); // pada sisi l
      return {
        volume: (1 / 3) * n.p * n.l * n.t,
        luas: n.p * n.l + n.p * tinggiSisiP + n.l * tinggiSisiL,
      };
    },
  },

  belahanBola: {
    nama: "Setengah Bola",
    rumus: "V = ⅔ × π × r³   |   L = 3 × π × r²",
    input: [{ id: "r", label: "Jari-jari (r)" }],
    hitung: (n) => ({
      volume: (2 / 3) * Math.PI * Math.pow(n.r, 3),
      luas: 3 * Math.PI * n.r * n.r,
    }),
  },
};

// ============================================================
// AMBIL ELEMEN HTML
// ============================================================
const daftarBangun = document.getElementById("daftarBangun");
const judulBangun = document.getElementById("judulBangun");
const rumusBangun = document.getElementById("rumusBangun");
const kolomInput = document.getElementById("kolomInput");
const formHitung = document.getElementById("formHitung");
const pesanError = document.getElementById("pesanError");
const teksHasil = document.getElementById("teksHasil");
const tombolReset = document.getElementById("tombolReset");

let kunciAktif = "kubus"; // bangun yang sedang dipilih

// ============================================================
// FUNGSI TAMPILAN
// ============================================================

// Membuat tombol pilihan bangun ruang
function buatTombolBangun() {
  for (const kunci in bangunRuang) {
    const tombol = document.createElement("button");
    tombol.type = "button";
    tombol.textContent = bangunRuang[kunci].nama;
    tombol.dataset.kunci = kunci;
    tombol.addEventListener("click", () => pilihBangun(kunci));
    daftarBangun.appendChild(tombol);
  }
}

// Menampilkan form sesuai bangun yang dipilih
function pilihBangun(kunci) {
  kunciAktif = kunci;
  const bangun = bangunRuang[kunci];

  judulBangun.textContent = bangun.nama;
  rumusBangun.textContent = bangun.rumus;
  pesanError.textContent = "";
  teksHasil.textContent = "Belum ada perhitungan.";

  // Buat kolom input sesuai kebutuhan bangun
  kolomInput.innerHTML = "";
  bangun.input.forEach((item) => {
    const wadah = document.createElement("div");
    wadah.innerHTML = `
      <label for="${item.id}">${item.label}</label>
      <input type="number" id="${item.id}" min="0" step="any" inputmode="decimal" placeholder="contoh: 10">
    `;
    kolomInput.appendChild(wadah);
  });

  // Tandai tombol yang aktif
  daftarBangun.querySelectorAll("button").forEach((tombol) => {
    tombol.classList.toggle("aktif", tombol.dataset.kunci === kunci);
  });

  kolomInput.querySelector("input").focus();
}

// Format angka: 2 desimal, pemisah ribuan gaya Indonesia
function formatAngka(angka) {
  return angka.toLocaleString("id-ID", { maximumFractionDigits: 2 });
}

// ============================================================
// FUNGSI HITUNG
// ============================================================
function hitung(event) {
  event.preventDefault(); // cegah halaman reload
  const bangun = bangunRuang[kunciAktif];
  const nilai = {};

  // 1. Ambil dan validasi setiap input
  for (const item of bangun.input) {
    const kolom = document.getElementById(item.id);
    const angka = parseFloat(kolom.value);

    if (kolom.value.trim() === "" || isNaN(angka)) {
      pesanError.textContent = `${item.label} belum diisi atau bukan angka.`;
      kolom.focus();
      return;
    }
    if (angka <= 0) {
      pesanError.textContent = `${item.label} harus lebih besar dari 0.`;
      kolom.focus();
      return;
    }
    nilai[item.id] = angka;
  }
  pesanError.textContent = "";

  // 2. Hitung
  const hasil = bangun.hitung(nilai);

  // 3. Susun teks hasil
  const ukuran = bangun.input
    .map((item) => `${item.label} = ${formatAngka(nilai[item.id])}`)
    .join("\n");
  const pesan =
    `Bangun ruang: ${bangun.nama}\n` +
    `${ukuran}\n\n` +
    `Volume = ${formatAngka(hasil.volume)} satuan³\n` +
    `Luas permukaan = ${formatAngka(hasil.luas)} satuan²`;

  // 4. Tampilkan sebagai teks di halaman DAN sebagai alert
  teksHasil.textContent = pesan;
  alert(pesan);
}

// Mengosongkan semua input
function resetForm() {
  formHitung.reset();
  pesanError.textContent = "";
  teksHasil.textContent = "Belum ada perhitungan.";
  kolomInput.querySelector("input").focus();
}

// ============================================================
// JALANKAN APLIKASI
// ============================================================
formHitung.addEventListener("submit", hitung);
tombolReset.addEventListener("click", resetForm);
buatTombolBangun();
pilihBangun(kunciAktif);
