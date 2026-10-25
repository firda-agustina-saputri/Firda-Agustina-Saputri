"use strict";

const KEY_PRODUK = "griyaTeh_products";
const KEY_ID_TERAKHIR = "griyaTeh_idTerakhir";
const kategoriFilter = "Minuman";
let currentPage = 1;
const itemsPerPage = 10;

// Dataset awal produk teh Anda
const produkAwal = [
    { id: 1, name: "Teh Original", category: "Minuman", price: 3500, stock: 50 },
    { id: 2, name: "Teh susu", category: "Minuman", price: 5000, stock: 30 },
    { id: 3, name: "Teh yakult", category: "Minuman", price: 7000, stock: 25 },
    { id: 4, name: "Teh cappucino", category: "Minuman", price: 7000, stock: 40 },
    { id: 5, name: "Teh susu coklat", category: "Minuman", price: 5000, stock: 30 },
    { id: 6, name: "Teh lemon", category: "Minuman", price: 5000, stock: 40 },
    { id: 7, name: "Teh strowbery", category: "Minuman", price: 5000, stock: 30 },
    { id: 8, name: "Teh madu", category: "Minuman", price: 5000, stock: 35 }
];

function ambilProduk() {
    try {
        const data = localStorage.getItem(KEY_PRODUK);
        if (data === null) {
            localStorage.setItem(KEY_PRODUK, JSON.stringify(produkAwal));
            return produkAwal.map(p => ({ ...p }));
        }
        const hasil = JSON.parse(data);
        return Array.isArray(hasil) ? hasil : produkAwal.map(p => ({ ...p }));
    } catch (error) {
        return produkAwal.map(p => ({ ...p }));
    }
}

let produkDataset = ambilProduk();

function simpanProduk() {
    try {
        localStorage.setItem(KEY_PRODUK, JSON.stringify(produkDataset));
        return true;
    } catch (error) {
        tampilkanFeedback("Data gagal disimpan.", "error");
        return false;
    }
}

function buatIdProduk() {
    const idTerpakai = new Set(produkDataset.map(p => Number(p.id)));
    let idBaru = 9;
    while (idTerpakai.has(idBaru)) {
        idBaru++;
    }
    localStorage.setItem(KEY_ID_TERAKHIR, String(idBaru));
    return idBaru;
}

function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(Number(angka) || 0);
}

function escapeHTML(nilai) {
    return String(nilai ?? "").replace(/[&<>"']/g, karakter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[karakter]);
}

function tampilkanFeedback(pesan, tipe = "success") {
    const feedback = document.getElementById("feedback");
    if (!feedback) return;
    feedback.textContent = pesan;
    feedback.className = `feedback ${tipe}`;
    feedback.style.display = "block";
}

function tampilkanRekapProduk() {
    const hasil = produkDataset.filter(p => p.category.toLowerCase() === kategoriFilter.toLowerCase());
    const rekap = {
        category: kategoriFilter,
        totalProducts: hasil.length,
        totalStockValue: hasil.reduce((total, p) => total + (p.price * p.stock), 0)
    };
    console.log("Hasil Rekapitulasi:", rekap);
    return rekap;
}

function jalankanHalamanIndex() {
    const form = document.getElementById("formProduk");
    if (!form || form.dataset.logicAktif === "true") return;
    form.dataset.logicAktif = "true";

    const nama = document.getElementById("nama");
    const harga = document.getElementById("harga");
    const kategori = document.getElementById("kategori");
    const stok = document.getElementById("stok");

    const previewNama = document.getElementById("previewNama");
    const previewHarga = document.getElementById("previewHarga");
    const previewKategori = document.getElementById("previewKategori");
    const previewStok = document.getElementById("previewStok");

    const cariProduk = document.getElementById("cariProduk");
    const filterKategori = document.getElementById("filterKategori");
    const daftar = document.getElementById("daftarProduk");
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");
    const pageInfo = document.getElementById("pageInfo");

    let idEdit = null;
    let batalBtn = document.createElement("button");
    batalBtn.type = "button";
    batalBtn.className = "btn-aksi-merah";
    batalBtn.textContent = "Batal Edit";
    batalBtn.style.display = "none";
    batalBtn.style.marginTop = "10px";
    form.append(batalBtn);

    function updatePreview() {
        if (previewNama) previewNama.textContent = nama.value.trim() || "-";
        if (previewHarga) previewHarga.textContent = formatRupiah(harga.value);
        if (previewKategori) previewKategori.textContent = kategori.value || "-";
        if (previewStok) previewStok.textContent = stok.value || "0";
    }

    [nama, harga, kategori, stok].forEach(input => {
        if (input) input.addEventListener("input", updatePreview);
    });

    function resetForm() {
        idEdit = null;
        form.reset();
        updatePreview();
        const submit = form.querySelector("[type='submit']");
        if (submit) submit.textContent = "Tambah Produk";
        batalBtn.style.display = "none";
    }

    batalBtn.addEventListener("click", () => {
        resetForm();
        tampilkanFeedback("Edit produk dibatalkan.", "info");
    });

    window.mulaiEdit = function(id) {
        const p = produkDataset.find(item => Number(item.id) === Number(id));
        if (!p) return;
        idEdit = id;
        nama.value = p.name;
        harga.value = p.price;
        kategori.value = p.category;
        stok.value = p.stock;
        updatePreview();
        const submit = form.querySelector("[type='submit']");
        if (submit) submit.textContent = "Simpan Perubahan";
        batalBtn.style.display = "inline-block";
        form.scrollIntoView({ behavior: "smooth", block: "start" });
        nama.focus();
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const n = nama.value.trim();
        const h = Number(harga.value);
        const k = kategori.value;
        const s = Number(stok.value);

        if (!n || !k || isNaN(h) || h <= 0 || isNaN(s) || s < 0) {
            tampilkanFeedback("Gagal! Nama atau harga/stok tidak valid. Periksa kembali input Anda.", "error");
            return;
        }

        if (idEdit !== null) {
            const idx = produkDataset.findIndex(p => Number(p.id) === Number(idEdit));
            if (idx !== -1) {
                produkDataset[idx] = { ...produkDataset[idx], name: n, price: h, category: k, stock: s };
                if (simpanProduk()) {
                    console.log("Produk berhasil diubah:", produkDataset[idx]); // <-- Dicetak ke Console
                    tampilkanFeedback(`Produk "${n}" berhasil diedit.`);
                    resetForm();
                    renderKelola();
                }
            }
        } else {
            const baru = {
                id: buatIdProduk(),
                name: n,
                category: k,
                price: h,
                stock: s
            };
            produkDataset.push(baru);
            if (simpanProduk()) {
                console.log("Produk berhasil ditambahkan:", baru); // <-- Dicetak ke Console
                tampilkanFeedback(`Produk "${n}" berhasil ditambahkan.`);
                resetForm();
                renderKelola();
            }
        }
    });

    function renderKelola() {
        const keyword = cariProduk ? cariProduk.value.toLowerCase() : "";
        const kat = filterKategori ? filterKategori.value : "";

        let hasil = produkDataset.filter(p => {
            const matchName = p.name.toLowerCase().includes(keyword);
            const matchKat = kat === "" || p.category === kat;
            return matchName && matchKat;
        });

        const totalPages = Math.ceil(hasil.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;

        const start = (currentPage - 1) * itemsPerPage;
        const paginated = hasil.slice(start, start + itemsPerPage);

        if (daftar) {
            if (paginated.length === 0) {
                daftar.innerHTML = `<tr><td colspan="6" style="text-align:center;">Tidak ada data produk.</td></tr>`;
            } else {
                daftar.innerHTML = paginated.map((p, index) => `
                    <tr>
                        <td>${start + index + 1}</td>
                        <td>${escapeHTML(p.name)}</td>
                        <td>${formatRupiah(p.price)}</td>
                        <td>${escapeHTML(p.category)}</td>
                        <td>${p.stock}</td>
                        <td class="aksi-col">
                            <button class="btn-aksi-merah" onclick="mulaiEdit(${p.id})">Edit</button>
                            <button class="btn-aksi-merah" onclick="hapusProduk(${p.id})">Hapus</button>
                        </td>
                    </tr>
                `).join("");
            }
        }

        if (pageInfo) pageInfo.textContent = `Halaman ${currentPage} dari ${totalPages}`;
        if (btnPrev) btnPrev.disabled = currentPage === 1;
        if (btnNext) btnNext.disabled = currentPage >= totalPages;
    }

    window.hapusProduk = function(id) {
        const p = produkDataset.find(item => Number(item.id) === Number(id));
        if (!p) return;
        if (confirm(`Yakin ingin menghapus produk "${p.name}"?`)) {
            produkDataset = produkDataset.filter(item => Number(item.id) !== Number(id));
            simpanProduk();
            if (idEdit === Number(id)) resetForm();
            renderKelola();
            console.log("Produk berhasil dihapus:", p); // <-- Dicetak ke Console
            tampilkanFeedback(`Produk "${p.name}" berhasil dihapus.`);
        }
    };

    if (cariProduk) cariProduk.addEventListener("input", () => { currentPage = 1; renderKelola(); });
    if (filterKategori) filterKategori.addEventListener("change", () => { currentPage = 1; renderKelola(); });
    if (btnPrev) btnPrev.addEventListener("click", () => { if (currentPage > 1) { currentPage--; renderKelola(); } });
    if (btnNext) btnNext.addEventListener("click", () => { currentPage++; renderKelola(); });

    renderKelola();
    tampilkanRekapProduk();
}

function jalankanHalamanOutput() {
    const daftar = document.getElementById("daftarProduk");
    if (!daftar || document.getElementById("formProduk")) return;
    if (daftar.dataset.logicAktif === "true") return;
    daftar.dataset.logicAktif = "true";

    const jumlah = document.getElementById("jumlahProduk");

    function renderOutput() {
        if (jumlah) jumlah.textContent = produkDataset.length;

        if (produkDataset.length === 0) {
            daftar.innerHTML = `<p class="kosong">Belum ada produk.</p>`;
            return;
        }

        daftar.innerHTML = produkDataset.map(p => `
            <div class="produk-card">
                <h3>${escapeHTML(p.name)}</h3>
                <p>Harga: ${formatRupiah(p.price)}</p>
                <p>Kategori: ${escapeHTML(p.category)}</p>
                <p>Stok: ${p.stock}</p>
            </div>
        `).join("");
    }

    window.addEventListener("storage", event => {
        if (event.key === KEY_PRODUK || event.key === KEY_ID_TERAKHIR) {
            produkDataset = ambilProduk();
            renderOutput();
        }
    });

    renderOutput();
    tampilkanRekapProduk();
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("formProduk")) {
        jalankanHalamanIndex();
    } else {
        jalankanHalamanOutput();
    }
});